import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {useEffect, useMemo} from 'react';
import {useRouter} from 'next/router';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {LoadingButton} from '@mui/lab';
import {Box, Button, Stack} from '@mui/material';
import {PATH_APP} from "../../../../routes/paths";
import {FormProvider} from "../../../../components/hook-form";
import RHFMultiSelect from "../../../../components/hook-form/RHFMultiSelect";
import {useMutation, useQuery} from "@apollo/client";
import {ALLCOURSE_QUERY, ALLUSER_QUERY} from "../../../../utils/graphql-query";
import {REGISTERCOURSE_MUTATION} from "../../../../utils/graphql-mutation";

CourseStudentAddForm.propTypes = {
    course: PropTypes.object,
    onCancel: PropTypes.func,
};

export default function CourseStudentAddForm({course, onCancel}) {
    const {enqueueSnackbar} = useSnackbar();

    const {loading, data, error} = useQuery(ALLUSER_QUERY, {
        variables: {
            filterInput: {
                roleId: 3
            }
        },
        errorPolicy: 'none'
    });

    const {push} = useRouter();

    const AddStudentSchema = Yup.object().shape({
        courseId: Yup.number(),
        students: Yup.array().min(1, 'Student group is required.')
    });

    const defaultValues = useMemo(
        () => ({
            courseId: course.id || '',
            students: []
        }),
        [course]
    )

    const methods = useForm({
        resolver: yupResolver(AddStudentSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    useEffect(() => {
        reset(defaultValues);
    }, [course]);

    const [registerCourse] = useMutation(REGISTERCOURSE_MUTATION, {
        refetchQueries: [
            {
                query: ALLCOURSE_QUERY
            }
        ]
    });

    const onSubmit = async (data) => {
        try {
            const studentId = data.students.map(student => parseInt(student.id));
            await registerCourse({
                variables: {
                    studentId: studentId,
                    courseId: data.courseId,
                }
            });
            reset();
            enqueueSnackbar('Assign success!');
            push(PATH_APP.course.view(data.courseId));
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
            console.error(error);
        }
    };

    const studentOptions = loading ? [] : data.allUser;

    return (
        <Box
            sx={{
                padding: 3,
                marginTop: 3,
                borderRadius: 1,
                bgcolor: 'background.neutral',
            }}
        >
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <RHFMultiSelect label="Student" name="students" options={studentOptions} isLoading={loading}/>
                </Stack>

                <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{mt: 3}}>
                    <Button color="inherit" variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Save Change
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </Box>
    );
}
