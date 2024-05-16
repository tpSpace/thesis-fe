import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Box, Card, Stack} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import useAuth from '../../../../hooks/useAuth';
import {FormProvider, RHFSelect, RHFTextField} from '../../../../components/hook-form';
import {useMutation} from "@apollo/client";
import {UPSERTUSER_MUTATION} from "../../../../utils/graphql-mutation";
import {USER_BYID_QUERY} from "../../../../utils/graphql-query";

export default function AccountGeneral() {
    const {enqueueSnackbar} = useSnackbar();

    const {user} = useAuth();

    const role = [
        {id: 1, name: "ADMIN"},
        {id: 2, name: "TEACHER"},
        {id: 3, name: "STUDENT"},
    ]

    const UpdateUserSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().required('Email is required').email(),
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        phone: Yup.string().required('Phone number is required'),
        role: Yup.string().required('Role is required'),
        about: Yup.string()
    });

    const defaultValues = {
        username: user?.username || '',
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        role: user?.role.id || '',
        about: user?.about
    };

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const {
        setValue,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const [upsertUser] = useMutation(UPSERTUSER_MUTATION, {
        refetchQueries: [
            {
                query: USER_BYID_QUERY,
                variables: {
                    id: user.id
                }
            }
        ]
    });

    const onSubmit = async (data) => {
        try {
            await upsertUser({
                variables: {
                    userInput: {
                        id: user.id,
                        username: user.username,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        email: user.email,
                        about: data.about,
                        roleId: user.role.id
                    }
                },
                errorPolicy: 'none'
            });
            enqueueSnackbar('Update success!');
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
            console.error(error);
        }
    };

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file) {
                setValue(
                    'photoURL',
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                );
            }
        },
        [setValue]
    );

    return (
        <Card sx={{p: 3}}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Box
                    sx={{
                        display: 'grid',
                        rowGap: 3,
                        columnGap: 2,
                        gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'},
                    }}
                >
                    <RHFTextField disabled name="username" label="User Name"/>
                    <RHFTextField disabled name="email" label="Email Address"/>
                    <RHFTextField name="firstName" label="First Name"/>
                    <RHFTextField name="lastName" label="Last Name"/>
                    <RHFTextField name="phone" label="Phone Number"/>
                    <RHFSelect disabled name="role" label="Role" placeholder="Role">
                        <option value=""/>
                        {role.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </RHFSelect>
                </Box>

                <Stack spacing={3} alignItems="flex-end" sx={{mt: 3}}>
                    <RHFTextField name="about" multiline rows={3} label="About"/>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Save Changes
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </Card>
    );
}
