import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {useEffect, useMemo} from 'react';
import {useRouter} from 'next/router';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {LoadingButton} from '@mui/lab';
import {Stack} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import {FormProvider, RHFTextField,} from '../../../components/hook-form';
import {useMutation} from "@apollo/client";
import {STUDENTASSIGNMENT_BYID_QUERY} from "../../../utils/graphql-query";
import {SUBMITASSIGNMENT_MUTATION} from "../../../utils/graphql-mutation";
import {styled} from "@mui/material/styles";

const RootStyles = styled('div')(({theme}) => ({
    padding: theme.spacing(3),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    backgroundColor: theme.palette.background.neutral,
}));

export default function AssignmentSubmitForm() {
    const {enqueueSnackbar} = useSnackbar();

    const {query, push} = useRouter();

    const {assignmentId} = query;

    const [submitAssignment] = useMutation(SUBMITASSIGNMENT_MUTATION, {
        refetchQueries: [
            {
                query: STUDENTASSIGNMENT_BYID_QUERY,
                variables: {
                    id: parseInt(assignmentId)
                }
            }
        ]
    });

    const SubmitAssignmentSchema = Yup.object().shape({
        url: Yup.string().required('Student group is required.')
    });

    const defaultValues = useMemo(
        () => ({
            url: ''
        }),
        []
    )

    const methods = useForm({
        resolver: yupResolver(SubmitAssignmentSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;


    useEffect(() => {
        reset(defaultValues);
    }, []);

    const onSubmit = async (data) => {
        try {
            await submitAssignment({
                variables: {
                    assignmentId: parseInt(assignmentId),
                    url: data.url
                }
            });
            reset();
            enqueueSnackbar('Submit success!');
            push(PATH_APP.assignment.all);
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
            console.error(error);
        }
    };

    return (
        <RootStyles>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3} alignItems="flex-end">
                    <RHFTextField label="Assignment URL" name="url"/>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Submit Assignment
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </RootStyles>
    );
}
