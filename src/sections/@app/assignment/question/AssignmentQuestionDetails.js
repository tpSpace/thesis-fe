import PropTypes from "prop-types";
import {Box, Card, Divider, Typography} from "@mui/material";
import {FormProvider, RHFTextField} from "../../../../components/hook-form";
import {useSnackbar} from "notistack";
import {useRouter} from "next/router";
import {useMutation} from "@apollo/client";
import {ASSIGNQUESTION_MUTATION} from "../../../../utils/graphql-mutation";
import * as Yup from "yup";
import {useEffect, useMemo} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {LoadingButton} from "@mui/lab";
import Markdown from "../../../../components/Markdown";
import AssignmentQuestionCommentList from "./AssignmentQuestionCommentList";
import AssignmentQuestionCommentForm from "./AssignmentQuestionCommentForm";
import {ALLASSIGNMENTQUESTION_QUERY} from "../../../../utils/graphql-query";

AssignmentQuestionDetails.propTypes = {
    question: PropTypes.object,
};

export default function AssignmentQuestionDetails({question}) {
    const {enqueueSnackbar} = useSnackbar();

    const {push, query} = useRouter();

    const {assignmentId} = query;

    const [assignQuestion] = useMutation(ASSIGNQUESTION_MUTATION, {
        refetchQueries: [{
            query: ALLASSIGNMENTQUESTION_QUERY,
            variables: {
                id: parseInt(assignmentId)
            }
        }]
    });

    const AssignQuestionSchema = Yup.object().shape({
        overwriteText: Yup.string().required('Question text is required.')
    });

    const defaultValues = useMemo(
        () => ({
            overwriteText: question.generatedText || '',
        }),
        [question]
    )

    const methods = useForm({
        resolver: yupResolver(AssignQuestionSchema),
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

    const onSubmit = async (data) => {
        try {
            await assignQuestion({
                variables: {
                    questionId: question.id,
                    overwriteText: data.overwriteText
                },
                errorPolicy: "none"
            })
            reset();
            enqueueSnackbar('Assign success!');
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
            console.error(error);
        }
    };

    return (
        <Card sx={{mt: 3}}>
            <Box sx={{p: {xs: 3, md: 5}}}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{mb: 3}}>
                        {
                            question.isAssigned
                                ?
                                <Typography variant="p">
                                    {question.overwriteText}
                                </Typography>
                                :
                                <RHFTextField label="Text" name="overwriteText"/>
                        }

                        <Markdown children={question.helperText}/>
                    </Box>

                    {!question.isAssigned &&
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Assign Question
                            </LoadingButton>
                        </Box>
                    }
                </FormProvider>

                {question.isAssigned &&
                    <>
                        <Divider/>
                        <Box sx={{mb: 5}}>
                            <AssignmentQuestionCommentList question={question}/>
                        </Box>
                        <AssignmentQuestionCommentForm question={question}/>
                    </>
                }
            </Box>
        </Card>

    )
}