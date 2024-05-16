import {Container} from '@mui/material';
import useSettings from "../../../hooks/useSettings";
import Layout from "../../../layouts";
import Page from "../../../components/Page";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import {PATH_APP} from "../../../routes/paths";
import CourseNewEditForm from "../../../sections/@app/course/CourseNewEditForm";

CourseCreate.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function CourseCreate() {
    const { themeStretch } = useSettings();

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
                        { name: 'New course' },
                    ]}
                />

                <CourseNewEditForm />
            </Container>
        </Page>
    );
}
