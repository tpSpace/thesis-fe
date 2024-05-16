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
import RHFDatePicker from "../../../components/hook-form/RHFDatePicker";
import {useMutation, useQuery} from "@apollo/client";
import {UPSERTCOURSE_MUTATION} from "../../../utils/graphql-mutation";
import {ALLCOURSE_QUERY, ALLUSER_QUERY} from "../../../utils/graphql-query";
import LoadingScreen from "../../../components/LoadingScreen";

CourseNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentCourse: PropTypes.object,
};

export default function CourseNewEditForm({isEdit = false, currentCourse}) {
    const {push} = useRouter();

    const {enqueueSnackbar} = useSnackbar();

    const NewCourseSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string(),
        startDate: Yup.date().required('Start date is required'),
        endDate: Yup.date().required('End date is required'),
        instructor: Yup.number().required('Instructor is required')
    });

    const defaultValues = useMemo(
        () => ({
            name: currentCourse?.name || '',
            description: currentCourse?.description || '',
            startDate: currentCourse?.startDate || '',
            endDate: currentCourse?.endDate || '',
            instructor: currentCourse?.instructor.id || ''
        }),
        [currentCourse]
    );
        
    const methods = useForm({
        resolver: yupResolver(NewCourseSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    useEffect(() => {
        if (isEdit && currentCourse) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentCourse]);

    const [upsertCourse] = useMutation(UPSERTCOURSE_MUTATION, {
        refetchQueries: [
            {
                query: ALLCOURSE_QUERY,
            }
        ]
    });

    const { loading, data : instructors, error } = useQuery(ALLUSER_QUERY, {
        variables: {
            filterInput: {
                roleId: 2
            }
        },
        errorPolicy: 'none'
    });

    const onSubmit = async (data) => {
        try {
            console.log(data)
            await upsertCourse({
                variables: {
                    courseInput: {
                        id: isEdit ? currentCourse.id : 0,
                        name: data.name,
                        description: data.description,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        instructedBy: data.instructor
                    }
                },
                errorPolicy: 'none'
            })
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            push(PATH_APP.course.root);
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
            console.error(error);
        }
    };

    if (loading) return <LoadingScreen />

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
                                gridTemplateColumns: {xs: 'repeat(1, 1fr)'},
                            }}
                        >
                            <RHFTextField name="name" label="Name"/>
                            <RHFTextField name="description" multiline rows={4} label="Description"/>
                            <RHFSelect name="instructor" label="Instructor" placeholder="Instructor">
                                <option value=""/>
                                {instructors.allUser.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {`${option.firstName} ${option.lastName}`}
                                    </option>
                                ))}
                            </RHFSelect>
                        </Box>
                        <Box
                            sx={{
                                display: 'grid',
                                columnGap: 2,
                                rowGap: 3,
                                gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'},
                                mt: 3
                            }}
                        >
                            <RHFDatePicker name="startDate" label="Start Date" />
                            <RHFDatePicker name="endDate" label="End Date" />
                        </Box>

                        <Stack alignItems="flex-end">
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{mt: 3}}>
                                {!isEdit ? 'Create Course' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
