import * as Yup from 'yup';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Alert, IconButton, InputAdornment, Stack} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import Iconify from '../../../components/Iconify';
import {FormProvider, RHFTextField} from '../../../components/hook-form';

export default function LoginForm() {
    const {login} = useAuth();

    const isMountedRef = useIsMountedRef();

    const [showPassword, setShowPassword] = useState(false);

    const LoginSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    const defaultValues = {
        username: '',
        password: '',
        remember: true,
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        reset,
        setError,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = methods;

    const onSubmit = async (data) => {
        try {
            await login(data.username, data.password);
        } catch (error) {
            console.error(error);
            reset();
            if (isMountedRef.current) {
                setError('afterSubmit', {...error, message: error.message});
            }
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

                <RHFTextField name="username" label="Username"/>

                <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}>
                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Login
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}
