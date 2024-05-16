import {useState} from 'react';
import {useRouter} from 'next/router';
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Typography} from '@mui/material';
import Layout from "../../../../../layouts";
import useSettings from "../../../../../hooks/useSettings";
import {PATH_APP} from "../../../../../routes/paths";
import Iconify from "../../../../../components/Iconify";
import HeaderBreadcrumbs from "../../../../../components/HeaderBreadcrumbs";
import Page from "../../../../../components/Page";
import AssignmentDetails from "../../../../../sections/@app/assignment/AssignmentDetails";
import SkeletonAssignment from "../../../../../components/skeleton/SkeletonAssignment";
import {useQuery} from "@apollo/client";
import {STUDENTASSIGNMENT_BYID_QUERY} from "../../../../../utils/graphql-query";
import LoadingScreen from "../../../../../components/LoadingScreen";
import StudentAssignmentStatus from "../../../../../sections/@app/assignment/assigned/StudentAssignmentStatus";
import NextLink from "next/link";

AssignmentAssignedAssignmentIdIndex.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AssignmentAssignedAssignmentIdIndex() {
    const {themeStretch} = useSettings();

    const {query, push} = useRouter();

    const {assignmentId} = query;

    const [accordionOpen, setAccordionOpen] = useState(false);

    const {loading, data, error} = useQuery(STUDENTASSIGNMENT_BYID_QUERY, {
        variables: {
            id: parseInt(assignmentId)
        },
        errorPolicy: 'none'
    });

    if (loading) return <LoadingScreen />;

    const currentStudentAssignment = data.getStudentAssignmentById;

    const handleAccordionOpen = (panel) => (event, isExpanded) => {
        setAccordionOpen(isExpanded ? panel : false);
    };

    const handleViewCourse = (id) => {
        push(PATH_APP.course.view(id));
    }

    const handleViewInstructor = (id) => {
        push(PATH_APP.user.view(id));
    }

    const isShowViewQuestion = () => {
        const status = currentStudentAssignment.status.toLowerCase();
        return status !== 'assigned' && status !== 'submitted';
    }

    return (
        <Page title="Assignment Details">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Assignment Details"
                    links={[
                        {name: 'Home', href: PATH_APP.root},
                        {name: 'Assignment', href: PATH_APP.assignment.root},
                        {name: 'Assigned', href: PATH_APP.assignment.assigned.root},
                        {name: currentStudentAssignment?.assignment.name || "Assignment Details"},
                    ]}
                    action={
                        isShowViewQuestion() &&
                        <NextLink href={PATH_APP.assignment.assigned.question(assignmentId)} passHref>
                            <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                                View Question
                            </Button>
                        </NextLink>
                    }
                />

                <Box>
                    <Accordion
                        expanded={accordionOpen === 'assignment'}
                        onChange={handleAccordionOpen('assignment')}
                    >
                        <AccordionSummary
                            expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20} />}
                        >
                            <Typography variant="subtitle1" sx={{ width: '33%', flexShrink: 0 }}>
                                Details
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {currentStudentAssignment && (
                                <AssignmentDetails assignment={currentStudentAssignment.assignment}
                                                   onViewCourse={() => handleViewCourse(
                                                       currentStudentAssignment.assignment.course.id
                                                   )}
                                                   onViewInstructor={() => handleViewInstructor(
                                                       currentStudentAssignment.assignment.course.assignedBy.id
                                                   )}/>
                            )}
                            {!currentStudentAssignment && !error && <SkeletonAssignment/>}
                        </AccordionDetails>
                    </Accordion>

                    <Accordion
                        expanded={accordionOpen === 'assignee'}
                        onChange={handleAccordionOpen('assignee')}
                    >
                        <AccordionSummary
                            expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20} />}
                        >
                            <Typography variant="subtitle1" sx={{ width: '33%', flexShrink: 0 }}>
                                Status
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <StudentAssignmentStatus studentAssignment={currentStudentAssignment} />
                        </AccordionDetails>
                    </Accordion>
                </Box>

                {error && <Typography variant="h6">404 {error}!</Typography>}
            </Container>
        </Page>
    );
}


