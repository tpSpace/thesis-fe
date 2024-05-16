import {useRouter} from 'next/router';
import {Box, Container, Tab, Tabs} from '@mui/material';
import {PATH_APP} from '../../../../routes/paths';
import useSettings from '../../../../hooks/useSettings';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import CourseDetails from "../../../../sections/@app/course/CourseDetails";
import Iconify from "../../../../components/Iconify";
import {useQuery} from "@apollo/client";
import {COURSE_BYID_QUERY} from "../../../../utils/graphql-query";
import LoadingScreen from "../../../../components/LoadingScreen";
import {capitalCase} from "change-case";
import useTabs from "../../../../hooks/useTabs";
import {isStudent} from "../../../../utils/auth";
import useAuth from "../../../../hooks/useAuth";
import CourseNewEditForm from "../../../../sections/@app/course/CourseNewEditForm";
import CourseStudent from "../../../../sections/@app/course/student/CourseStudent";
import CourseStudentGroup from "../../../../sections/@app/course/student/group/CourseStudentGroup";

CourseInfo.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function CourseInfo() {
    const { themeStretch } = useSettings();

    const { query } = useRouter();

    const { courseId } = query;

    const { user: loggedInUser } = useAuth();

    const { currentTab, onChangeTab } = useTabs(isStudent(loggedInUser) ? 'details' : 'general');

    const { loading: courseLoading, data: courseData, error: courseError } = useQuery(
        COURSE_BYID_QUERY,
        {
            variables: {
                id: parseInt(courseId),
        },
        errorPolicy: 'none'
    });

    if (courseLoading) return <LoadingScreen />;

    const course = courseData.getCourseById;
    const { students, groups } = courseData.getCourseById;

    const COURSE_TABS = [
        {
            value: 'general',
            condition: !isStudent(loggedInUser),
            icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
            component: <CourseNewEditForm isEdit currentCourse={course} />,
        },
        {
            value: 'details',
            condition: isStudent(loggedInUser),
            icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
            component: <CourseDetails course={course} />,
        },
        {
            value: 'student',
            condition: !isStudent(loggedInUser),
            icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
            component: <CourseStudent course={course} students={students} />,
        },
        {
            value: 'group',
            condition: true,
            icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
            component: <CourseStudentGroup course={course} groups={groups} />,
        }
    ];

    return (
        <Page title="Course Details">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Course Details"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        {
                            name: 'Course',
                            href: PATH_APP.course.root,
                        },
                        { name: course?.name || 'Course Details' },
                    ]}
                />

                <Tabs
                    allowScrollButtonsMobile
                    variant="scrollable"
                    scrollButtons="auto"
                    value={currentTab}
                    onChange={onChangeTab}
                >
                    {COURSE_TABS.filter(tab => tab.condition)
                        .map((tab) => (
                        <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
                    ))}
                </Tabs>

                <Box sx={{ mb: 5 }} />

                {COURSE_TABS.map((tab) => {
                    const isMatched = tab.value === currentTab;
                    return isMatched && <Box key={tab.value}>{tab.component}</Box>;
                })}

            </Container>
        </Page>
    );
}
