import {useRouter} from 'next/router';
import {Card, Container, Grid, Stack, Typography} from '@mui/material';
import {PATH_APP} from '../../../../routes/paths';
import useSettings from '../../../../hooks/useSettings';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import SkeletonAssignment from "../../../../components/skeleton/SkeletonAssignment";
import AssignmentDetails from "../../../../sections/@app/assignment/AssignmentDetails";
import AssignmentAssignForm from "../../../../sections/@app/assignment/AssignmentAssignForm";
import {useQuery} from "@apollo/client";
import {ASSIGNMENT_BYID_QUERY} from "../../../../utils/graphql-query";
import LoadingScreen from "../../../../components/LoadingScreen";

AssignmentAssignmentIdAssign.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AssignmentAssignmentIdAssign() {
    const {themeStretch} = useSettings();

    const {query, push} = useRouter();

    const {assignmentId} = query;

    const {loading, data, error} = useQuery(ASSIGNMENT_BYID_QUERY, {
        variables: {
            id: parseInt(assignmentId)
        },
        errorPolicy: 'none'
    });

    const handleViewCourse = (id) => {
        push(PATH_APP.course.view(id));
    }

    const handleViewInstructor = (id) => {
        push(PATH_APP.user.view(id));
    }

    if (loading) return <LoadingScreen/>;

    const currentAssignment = data.getAssignmentById;

    return (
        <Page title="Assign Assignment">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Assign Assignment"
                    links={[
                        {name: 'Home', href: PATH_APP.root},
                        {name: 'Assignment', href: PATH_APP.assignment.root},
                        {name: currentAssignment?.name || "Assign Assignment"},
                    ]}
                />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            {currentAssignment && (
                                <AssignmentDetails assignment={currentAssignment}
                                                   onViewCourse={() => handleViewCourse(currentAssignment.course.id)}
                                                   onViewInstructor={() => handleViewInstructor(currentAssignment.course.teacher.id)}/>
                            )}
                        </Card>

                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <Stack spacing={3}>
                                <AssignmentAssignForm/>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                {!currentAssignment && !error && <SkeletonAssignment/>}

                {error && <Typography variant="h6">404 {error}!</Typography>}
            </Container>
        </Page>
    );
}


