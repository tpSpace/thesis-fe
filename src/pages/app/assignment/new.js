import {Container} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import AssignmentNewEditForm from "../../../sections/@app/assignment/AssignmentNewEditForm";

AssignmentNew.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AssignmentNew() {
    const { themeStretch } = useSettings();

    return (
        <Page title="New Assignment">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Create a new assignment"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        { name: 'Assignment', href: PATH_APP.assignment.root },
                        { name: 'New Assignment' },
                    ]}
                />

                <AssignmentNewEditForm />
            </Container>
        </Page>
    );
}
