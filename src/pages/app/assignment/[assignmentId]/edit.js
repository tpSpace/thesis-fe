import {Container} from '@mui/material';
import Page from "../../../../components/Page";
import useSettings from "../../../../hooks/useSettings";
import Layout from "../../../../layouts";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import {PATH_APP} from "../../../../routes/paths";
import {useRouter} from "next/router";
import AssignmentNewEditForm from "../../../../sections/@app/assignment/AssignmentNewEditForm";
import {useQuery} from "@apollo/client";
import {ASSIGNMENT_BYID_QUERY} from "../../../../utils/graphql-query";
import LoadingScreen from "../../../../components/LoadingScreen";

AssignmentEdit.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AssignmentEdit() {
    const { themeStretch } = useSettings();

    const {query} = useRouter();

    const {assignmentId} = query;

    const {loading, data, error} = useQuery(ASSIGNMENT_BYID_QUERY, {
        variables: {
            id: parseInt(assignmentId)
        },
        errorPolicy: 'none'
    });

    if (loading) return <LoadingScreen />;
    const currentAssignment = data.getAssignmentById;

    return (
        <Page title="Edit Assignment">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Edit assignment"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        { name: 'Assignment', href: PATH_APP.assignment.root },
                        { name: currentAssignment?.name || 'Edit Assignment' },
                    ]}
                />

                <AssignmentNewEditForm isEdit assignment={currentAssignment}/>
            </Container>
        </Page>
    );
}
