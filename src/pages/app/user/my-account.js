import {capitalCase} from 'change-case';
import {Box, Container, Tab, Tabs} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import AccountGeneral from "../../../sections/@app/user/account/AccountGeneral";
import AccountChangePassword from "../../../sections/@app/user/account/AccountChangePassword";


UserAccount.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function UserAccount() {
    const { themeStretch } = useSettings();

    const { currentTab, onChangeTab } = useTabs('general');

    const ACCOUNT_TABS = [
        {
            value: 'general',
            icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
            component: <AccountGeneral />,
        },
        {
            value: 'change_password',
            icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
            component: <AccountChangePassword />,
        },
    ];

    return (
        <Page title="User: Account Settings">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="My Account"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        { name: 'User', href: PATH_APP.user.root },
                        { name: 'My Account' },
                    ]}
                />

                <Tabs
                    allowScrollButtonsMobile
                    variant="scrollable"
                    scrollButtons="auto"
                    value={currentTab}
                    onChange={onChangeTab}
                >
                    {ACCOUNT_TABS.map((tab) => (
                        <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
                    ))}
                </Tabs>

                <Box sx={{ mb: 5 }} />

                {ACCOUNT_TABS.map((tab) => {
                    const isMatched = tab.value === currentTab;
                    return isMatched && <Box key={tab.value}>{tab.component}</Box>;
                })}
            </Container>
        </Page>
    );
}
