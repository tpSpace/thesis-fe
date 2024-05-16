import {useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    Tab,
    Table,
    TableBody,
    TableContainer,
    TablePagination,
    Tabs,
} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, {emptyRows, getComparator} from '../../../hooks/useTable';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {TableEmptyRows, TableHeadCustom, TableNoData} from '../../../components/table';
import {useQuery} from "@apollo/client";
import {ALLUSER_QUERY} from "../../../utils/graphql-query";
import LoadingScreen from "../../../components/LoadingScreen";
import UserTableToolbar from "../../../sections/@app/user/UserTableToolbar";
import UserTableRow from "../../../sections/@app/user/UserTableRow";

const TABS_OPTIONS = ['all', 'admin', 'teacher', 'student'];

const TABLE_HEAD = [
    { id: 'fullName', label: 'Full Name', align: 'left' },
    { id: 'email', label: 'Email', align: 'left' },
    { id: 'phone', label: 'Phone No.', align: 'left' },
    { id: 'role', label: 'Role', align: 'left' },
    { id: '' },
];

AllUser.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AllUser() {
    const {
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        onSort,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable();

    const { themeStretch } = useSettings();

    const { push } = useRouter();

    const { loading, data, error } = useQuery(ALLUSER_QUERY);

    const [filterName, setFilterName] = useState('');

    const { currentTab: filterRole, onChangeTab: onChangeFilterRole } = useTabs('all');

    if (loading) return <LoadingScreen />;

    const tableData = data.allUser;

    const dataFiltered = applySortFilter({
        tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
    });

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterRole);

    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };

    const handleViewRow = (id) => {
        push(PATH_APP.user.view(id));
    };

    return (
        <Page title="User: List">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="All Users"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        { name: 'User', href: PATH_APP.user.root },
                        { name: 'All Users' },
                    ]}
                    action={
                        <NextLink href={PATH_APP.user.new} passHref>
                            <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                                New User
                            </Button>
                        </NextLink>
                    }
                />

                <Card>
                    <Tabs
                        allowScrollButtonsMobile
                        variant="scrollable"
                        scrollButtons="auto"
                        value={filterRole}
                        onChange={onChangeFilterRole}
                        sx={{ px: 2, bgcolor: 'background.neutral' }}
                    >
                        {TABS_OPTIONS.map((tab) => (
                            <Tab disableRipple key={tab} label={tab} value={tab} />
                        ))}
                    </Tabs>

                    <Divider />

                    <UserTableToolbar
                        filterName={filterName}
                        onFilterName={handleFilterName}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                            <Table size={'small'}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    onSort={onSort}
                                />

                                <TableBody>
                                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <UserTableRow
                                            key={row.id}
                                            row={row}
                                            onViewRow={() => handleViewRow(row.id)}
                                        />
                                    ))}

                                    <TableEmptyRows height={52} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={dataFiltered.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

function applySortFilter({ tableData, comparator, filterName, filterRole }) {
    const stabilizedThis = tableData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    tableData = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        tableData = tableData.filter((item) => {
            return item.firstName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
                || item.lastName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1;
        });
    }

    if (filterRole !== 'all') {
        tableData = tableData.filter((item) => item.role.name.toLowerCase() === filterRole);
    }

    return tableData;
}
