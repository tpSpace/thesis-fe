import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {useEffect, useMemo} from 'react';
import {useRouter} from 'next/router';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {LoadingButton} from '@mui/lab';
import {Grid, Stack} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import {FormProvider,} from '../../../components/hook-form';
import RHFMultiSelect from "../../../components/hook-form/RHFMultiSelect";
import {useMutation, useQuery} from "@apollo/client";
import {ALLASSIGNMENT_QUERY, ASSIGNMENTASSIGN_BYASSIGNMENTID_QUERY} from "../../../utils/graphql-query";
import LoadingScreen from "../../../components/LoadingScreen";
import {ASSIGNASSIGNMENT_MUTATION} from "../../../utils/graphql-mutation";

AssignmentAssignForm.propTypes = {
    assignment: PropTypes.object,
};

export default function AssignmentAssignForm({assignment}) {
    const {enqueueSnackbar} = useSnackbar();

    const {query, push} = useRouter();

    const {assignmentId} = query;

    const {loading, data, error} = useQuery(ASSIGNMENTASSIGN_BYASSIGNMENTID_QUERY, {
        variables: {
            id: parseInt(assignmentId)
        },
        errorPolicy: 'none'
    });

    const [assignAssignment] = useMutation(ASSIGNASSIGNMENT_MUTATION, {
        refetchQueries: [
            {
                query: ALLASSIGNMENT_QUERY
            }
        ]
    });

    const AssignAssignmentSchema = Yup.object().shape({
        assignment: Yup.object().required('Assignment is required.'),
        studentGroups: Yup.array().min(1, 'Student group is required.')
    });

    const defaultValues = useMemo(
        () => ({
            assignment: currentAssignment || {},
            studentGroups: []
        }),
        [assignment]
    )

    const methods = useForm({
        resolver: yupResolver(AssignAssignmentSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const values = watch();

    useEffect(() => {
        reset(defaultValues);
    }, [assignment]);

    const onSubmit = async (data) => {
        try {
            const groupId = data.studentGroups.map(studentGroup => parseInt(studentGroup.id));
            await assignAssignment({
                variables: {
                    assignmentId: parseInt(assignmentId),
                    groupId: groupId
                }
            });
            reset();
            enqueueSnackbar('Assign success!');
            push(PATH_APP.assignment.all);
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
            console.error(error);
        }
    };

    if (loading) return <LoadingScreen/>

    const currentAssignment = data.getAssignmentById;

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3} justifyContent="flex-end">
                    <Grid item xs={12} sm={8}>
                        <Stack spacing={3}>
                            <RHFMultiSelect label="Student Group" name="studentGroups"
                                            options={currentAssignment.groups}/>
                            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                                Assign Assignment
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </FormProvider>
        </>
    );
}
