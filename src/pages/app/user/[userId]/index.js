import {capitalCase} from 'change-case';
import {useRouter} from 'next/router';
import {Button, Container} from '@mui/material';
import {PATH_APP} from '../../../../routes/paths';
import useSettings from '../../../../hooks/useSettings';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import NextLink from "next/link";
import Iconify from "../../../../components/Iconify";
import UserDetails from "../../../../sections/@app/user/UserDetails";
import {useQuery} from "@apollo/client";
import {USER_BYID_QUERY} from "../../../../utils/graphql-query";
import LoadingScreen from "../../../../components/LoadingScreen";

UserUserIdIndex.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function UserUserIdIndex() {
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
                    action={
                        <NextLink href={PATH_APP.user.edit(userId)} passHref>
                            <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                                Edit User
                            </Button>
                        </NextLink>
                    }
                />

                <UserDetails user={currentUser} />
            </Container>
        </Page>
    );
}
