import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useEffect, useMemo} from 'react';
import {useSnackbar} from 'notistack';
import {useRouter} from 'next/router';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {LoadingButton} from '@mui/lab';
import {Box, Card, Grid, Stack} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import {FormProvider, RHFSelect, RHFTextField} from '../../../components/hook-form';
import {useMutation} from "@apollo/client";
import {UPSERTUSER_MUTATION} from "../../../utils/graphql-mutation";
import useAuth from "../../../hooks/useAuth";
import {isAdmin} from "../../../utils/auth";
import {ALLUSER_QUERY} from "../../../utils/graphql-query";

UserNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentUser: PropTypes.object,
};

export default function UserNewEditForm({isEdit = false, currentUser}) {
    const {push} = useRouter();

    const { user: loggedInUser } = useAuth();

    const {enqueueSnackbar} = useSnackbar();

    const role = [
        {id: 1, name: "ADMIN"},
        {id: 2, name: "TEACHER"},
        {id: 3, name: "STUDENT"},
    ]

    const NewUserSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().required('Email is required').email(),
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        phone: Yup.string().required('Phone number is required'),
        role: Yup.number().required('Role is required'),
        about: Yup.string()
    });

    const defaultValues = useMemo(
        () => ({
            username: currentUser?.username || '',
            email: currentUser?.email || '',
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            phone: currentUser?.phone || '',
            role: currentUser?.role?.name || '',
            about: currentUser?.about
        }),
        [currentUser]
    );
    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    useEffect(() => {
        if (isEdit && currentUser) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentUser]);

    const [upsertUser] = useMutation(UPSERTUSER_MUTATION, {
        refetchQueries: [
            {
                query: ALLUSER_QUERY
            }
        ]
    });
    const onSubmit = async (data) => {
        try {
            await upsertUser({
                variables: {
                    userInput: {
                        id: isEdit ? currentUser.id : 0,
                        username: data.username,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        email: data.email,
                        about: data.about,
                        roleId: data.role,
                    }
                },
                errorPolicy: 'none'
            })
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            push(PATH_APP.user.all);
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
            console.error(error);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Card sx={{p: 3}}>
                        <Box
                            sx={{
                                display: 'grid',
                                columnGap: 2,
                                rowGap: 3,
                                gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'},
                            }}
                        >
                            <RHFTextField disabled={isEdit} name="username" label="User Name"/>
                            <RHFTextField disabled={isEdit} name="email" label="Email Address"/>
                            <RHFTextField name="firstName" label="First Name"/>
                            <RHFTextField name="lastName" label="Last Name"/>
                            <RHFTextField name="phone" label="Phone Number"/>

                            <RHFSelect disabled={isEdit && !isAdmin(loggedInUser)} name="role" label="Role" placeholder="Role">
                                <option value=""/>
                                {role.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </RHFSelect>
                        </Box>

                        <Stack alignItems="flex-end" sx={{mt: 3}}>
                            <RHFTextField name="about" multiline rows={4} label="About"/>

                            <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{mt: 3}}>
                                {!isEdit ? 'Create User' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
