import {useState} from 'react';
import {useRouter} from 'next/router';
import {Container, Pagination} from '@mui/material';
import Page from "../../../../../components/Page";
import HeaderBreadcrumbs from "../../../../../components/HeaderBreadcrumbs";
import {PATH_APP} from "../../../../../routes/paths";
import {useQuery} from "@apollo/client";
import {ALLASSIGNMENTQUESTION_QUERY} from "../../../../../utils/graphql-query";
import LoadingScreen from "../../../../../components/LoadingScreen";
import Layout from "../../../../../layouts";
import AssignmentQuestionDetails from "../../../../../sections/@app/assignment/question/AssignmentQuestionDetails";

AssignmentAssignedAssignmentIdQuestion.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AssignmentAssignedAssignmentIdQuestion() {
    const {query} = useRouter();

    const {assignmentId} = query;

    const {loading, data, error} = useQuery(ALLASSIGNMENTQUESTION_QUERY, {
        variables: {
            id: parseInt(assignmentId)
        },
        errorPolicy: 'none'
    });

    const [questionIndex, setQuestionIndex] = useState(1);

    const handlePaginationChange = (event, value) => {
        setQuestionIndex(value);
    }

    if (loading) return <LoadingScreen />;

    const questions = data.allAssignmentQuestion;

    return (
        <Page title="Student Assignment: Question">
            <Container maxWidth='lg'>
                <HeaderBreadcrumbs
                    heading="Questions"
                    links={[
                        {name: 'Home', href: PATH_APP.root},
                        {name: 'Assignment', href: PATH_APP.assignment.root},
                        {name: 'Question'},
                    ]}
                />

                <Pagination boundaryCount={questions.length} count={questions.length} page={questionIndex} onChange={handlePaginationChange} hideNextButton hidePrevButton/>

                {
                    questions[questionIndex - 1] && (
                        <AssignmentQuestionDetails question={ questions[questionIndex - 1] } />
                    )
                }
            </Container>
        </Page>
    );
}
