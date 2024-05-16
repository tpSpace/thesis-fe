import {useState} from 'react';
import {useRouter} from 'next/router';
import {Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography} from '@mui/material';
import {PATH_APP} from '../../../../routes/paths';
import useSettings from '../../../../hooks/useSettings';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import SkeletonAssignment from "../../../../components/skeleton/SkeletonAssignment";
import AssignmentDetails from "../../../../sections/@app/assignment/AssignmentDetails";
import Iconify from "../../../../components/Iconify";
//import HeaderBreadcrumbsAction from "../../../components/buttons/HeaderBreadcrumbsAction";
import AssigneeTable from "../../../../sections/@app/assignment/assignee/AssigneeTable";
import {ASSIGNMENT_BYID_QUERY} from "../../../../utils/graphql-query";
import {useQuery} from "@apollo/client";
import LoadingScreen from "../../../../components/LoadingScreen";

AssignmentAssignmentIdIndex.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AssignmentAssignmentIdIndex() {
    const {themeStretch} = useSettings();

    const {query, push} = useRouter();

    const {assignmentId} = query;

    const [accordionOpen, setAccordionOpen] = useState(false);

    const {loading, data, error} = useQuery(ASSIGNMENT_BYID_QUERY, {
        variables: {
            id: parseInt(assignmentId)
        },
        errorPolicy: 'none'
    });

    const handleAccordionOpen = (panel) => (event, isExpanded) => {
        setAccordionOpen(isExpanded ? panel : false);
    };

    const handleViewCourse = (id) => {
        push(PATH_APP.course.view(id));
    }

    const handleViewInstructor = (id) => {
        push(PATH_APP.user.view(id));
    }

    const breadcrumbsActions = [
        {name: 'Assign', path: PATH_APP.assignment.assign(assignmentId), icon: <Iconify icon={'eva:plus-fill'}/>},
        {name: 'Edit', path: PATH_APP.assignment.edit(assignmentId), icon: <Iconify icon={'eva:plus-fill'}/>},
    ]

    if (loading) return <LoadingScreen/>;

    const currentAssignment = data.getAssignmentById;

    return (
        <Page title="Assignment Details">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Assignment Details"
                    links={[
                        {name: 'Home', href: PATH_APP.root},
                        {name: 'Assignment', href: PATH_APP.assignment.root},
                        {name: currentAssignment?.name || "Assignment Details"},
                    ]}
                    // action={
                    //     <HeaderBreadcrumbsAction options={breadcrumbsActions}/>
                    // }
                />
                <Box>
                    <Accordion
                        expanded={accordionOpen === 'assignment'}
                        onChange={handleAccordionOpen('assignment')}
                    >
                        <AccordionSummary
                            expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20}/>}
                        >
                            <Typography variant="subtitle1" sx={{width: '33%', flexShrink: 0}}>
                                Details
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {currentAssignment && (
                                <AssignmentDetails assignment={currentAssignment}
                                                   onViewCourse={() => handleViewCourse(currentAssignment.course.id)}
                                                   onViewInstructor={() => handleViewInstructor(currentAssignment.course.instructor.id)}/>
                            )}
                            {!currentAssignment && !error && <SkeletonAssignment/>}
                        </AccordionDetails>
                    </Accordion>

                    <Accordion
                        expanded={accordionOpen === 'assignee'}
                        onChange={handleAccordionOpen('assignee')}
                    >
                        <AccordionSummary
                            expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20}/>}
                        >
                            <Typography variant="subtitle1" sx={{width: '33%', flexShrink: 0}}>
                                Assignees
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <AssigneeTable studentAssignments={currentAssignment.studentAssignments}/>
                        </AccordionDetails>
                    </Accordion>
                </Box>

                {error && <Typography variant="h6">404 {error}!</Typography>}
            </Container>
        </Page>
    );
}


