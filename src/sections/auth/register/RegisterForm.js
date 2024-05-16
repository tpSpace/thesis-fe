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

export default function RegisterForm() {
    const {signup} = useAuth();

    const isMountedRef = useIsMountedRef();

    const [showPassword, setShowPassword] = useState(false);

    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        phone: Yup.string().required('Phone number is required.'),
        password: Yup.string().required('Password is required'),
    });

    const defaultValues = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
    };

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
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
            await signup(data.username, data.password, data.email, data.phone, data.firstName, data.lastName);
        } catch (error) {
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

                <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                    <RHFTextField name="firstName" label="First name"/>
                    <RHFTextField name="lastName" label="Last name"/>
                </Stack>

                <RHFTextField name="username" label="Username"/>
                <RHFTextField name="email" label="Email address"/>
                <RHFTextField name="phone" label="Phone number"/>

                <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Register
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}
