import {Button, Container} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import CourseList from "../../../sections/@app/course/CourseList";
import NextLink from "next/link";
import Iconify from "../../../components/Iconify";
import {useQuery} from "@apollo/client";
import {ALLCOURSE_QUERY} from "../../../utils/graphql-query";
import LoadingScreen from "../../../components/LoadingScreen";

AllCourse.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AllCourse() {
    const { themeStretch } = useSettings();

    const { loading, data, error } = useQuery(ALLCOURSE_QUERY);

    if (loading) return <LoadingScreen />;

    const courses = data.allCourse;

    return (
        <Page title="User: My Course">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="My Course"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        {
                            name: 'Course',
                            href: PATH_APP.course.root,
                        },
                        { name: 'My Course' },
                    ]}
                    action={
                        <NextLink href={PATH_APP.course.new} passHref>
                            <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                                New Course
                            </Button>
                        </NextLink>
                    }
                />

                <CourseList courses={courses} loading={loading} />
            </Container>
        </Page>
    );
}