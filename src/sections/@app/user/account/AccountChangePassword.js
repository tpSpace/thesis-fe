import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
// form
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
// @mui
import {Card, Stack} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import {FormProvider, RHFTextField} from '../../../../components/hook-form';
import {useMutation} from "@apollo/client";
import {CHANGEPASSWORD_MUTATION} from "../../../../utils/graphql-mutation";

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
    const {enqueueSnackbar} = useSnackbar();

    const ChangePassWordSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Old password is required'),
        newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
        confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    });

    const defaultValues = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    };

    const methods = useForm({
        resolver: yupResolver(ChangePassWordSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const [changePassword] = useMutation(CHANGEPASSWORD_MUTATION);

    const onSubmit = async (data) => {
        console.log(data);
        try {
            await changePassword({
                variables: {
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword
                },
                errorPolicy: 'none'
            });
            reset();
            enqueueSnackbar('Update success!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card sx={{p: 3}}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3} alignItems="flex-end">
                    <RHFTextField name="oldPassword" type="password" label="Old Password"/>

                    <RHFTextField name="newPassword" type="password" label="New Password"/>

                    <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password"/>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Save Changes
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </Card>
    );
}
