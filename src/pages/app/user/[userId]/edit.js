import { capitalCase } from 'change-case';
import { useRouter } from 'next/router';
import { Container } from '@mui/material';
import { PATH_APP } from '../../../../routes/paths';
import useSettings from '../../../../hooks/useSettings';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import UserNewEditForm from '../../../../sections/@app/user/UserNewEditForm';
import { useQuery } from "@apollo/client";
import { USER_BYID_QUERY } from "../../../../utils/graphql-query";
import LoadingScreen from "../../../../components/LoadingScreen";

UserEdit.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function UserEdit() {
    const { themeStretch } = useSettings();

    const { query } = useRouter();

    const { userId } = query;

    const { data, loading, error } = useQuery(USER_BYID_QUERY, {
        variables: {
            id: parseInt(userId),
        },
        errorPolicy: "none"
    });

    if (loading) return (
        <LoadingScreen />
    );
    
    const currentUser = data.getUserById;

    return (
        <Page title="User: Edit User">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Edit User"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        { name: 'User', href: PATH_APP.user.root },
                        { name: capitalCase(currentUser.firstName + " " + currentUser.lastName) },
                    ]}
                />

                <UserNewEditForm isEdit currentUser={currentUser} />
            </Container>
        </Page>
    );
}
