import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {styled} from '@mui/material/styles';
import {Stack, Typography} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {FormProvider, RHFTextField} from "../../../../components/hook-form";
import {useMutation} from "@apollo/client";
import {POSTCOMMENT_MUTATION} from "../../../../utils/graphql-mutation";
import {useSnackbar} from "notistack";
import {useEffect, useMemo} from "react";
import {useRouter} from "next/router";
import {ALLASSIGNMENTQUESTION_QUERY} from "../../../../utils/graphql-query";

const RootStyles = styled('div')(({theme}) => ({
    padding: theme.spacing(3),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    backgroundColor: theme.palette.background.neutral,
}));

export default function AssignmentQuestionCommentForm({ question }) {
    const {enqueueSnackbar} = useSnackbar();

    const {push, query} = useRouter();

    const {assignmentId} = query;

    const CommentSchema = Yup.object().shape({
        text: Yup.string().required('Comment is required'),
    });

    const defaultValues = useMemo(
        () => ({
            text: '',
        }),
        [question]
    )

    const methods = useForm({
        resolver: yupResolver(CommentSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    useEffect(() => {
        reset(defaultValues);
    }, [question]);

    const [postComment] = useMutation(POSTCOMMENT_MUTATION, {
        refetchQueries: [
            {
                query: ALLASSIGNMENTQUESTION_QUERY,
                variables: {
                    id: parseInt(assignmentId)
                }
            }
        ]
    });

    const onSubmit = async (data) => {
        try {
            console.log(data);
            await postComment({
                variables: {
                    questionId: question.id,
                    text: data.text
                },
                errorPolicy: "none"
            });
            enqueueSnackbar('Post success!');
            reset();
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
            console.error(error);
        }
    };

    return (
        <RootStyles>
            <Typography variant="subtitle1" sx={{mb: 3}}>
                Add Comment
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3} alignItems="flex-end">
                    <RHFTextField name="text" label="Comment" multiline rows={3}/>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Post comment
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </RootStyles>
    );
}
