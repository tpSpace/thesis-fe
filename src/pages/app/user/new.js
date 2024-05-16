import {Container} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import UserNewEditForm from "../../../sections/@app/user/UserNewEditForm";

UserCreate.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function UserCreate() {
    const {themeStretch} = useSettings();

    return (
        <Page title="User: Create a new user">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Create a new user"
                    links={[
                        {name: 'Dashboard', href: PATH_APP.root},
                        {name: 'User', href: PATH_APP.user.root},
                        {name: 'New user'},
                    ]}
                />
                <UserNewEditForm/>
            </Container>
        </Page>
    );
}
