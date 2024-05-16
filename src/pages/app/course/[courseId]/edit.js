import {useRouter} from 'next/router';
import {Container} from '@mui/material';
import {PATH_APP} from '../../../../routes/paths';
import useSettings from '../../../../hooks/useSettings';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import CourseNewEditForm from "../../../../sections/@app/course/CourseNewEditForm";
import {useQuery} from "@apollo/client";
import {COURSE_BYID_QUERY} from "../../../../utils/graphql-query";
import LoadingScreen from "../../../../components/LoadingScreen";

CourseEdit.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function CourseEdit() {
    const { themeStretch } = useSettings();

    const { query } = useRouter();

    const { courseId } = query;

    const { loading, data, error } = useQuery(COURSE_BYID_QUERY, {
        variables: {
            id: parseInt(courseId),
        },
        errorPolicy: 'none'
    });

    if (loading) return <LoadingScreen />

    const course = data.getCourseById;

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
                        { name: course?.name || '' },
                    ]}
                />

                <CourseNewEditForm isEdit currentCourse={course} />
            </Container>
        </Page>
    );
}
