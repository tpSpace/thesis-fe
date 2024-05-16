import {useState} from 'react';
import {useRouter} from 'next/router';
import {useTheme} from '@mui/material/styles';
import {
    Box,
    Card,
    Container,
    Divider,
    Stack,
    Tab,
    Table,
    TableBody,
    TableContainer,
    TablePagination,
    Tabs,
} from '@mui/material';
import Layout from "../../../../layouts";
import useTable, {emptyRows, getComparator} from "../../../../hooks/useTable";
import useTabs from "../../../../hooks/useTabs";
import {PATH_APP} from "../../../../routes/paths";
import Page from "../../../../components/Page";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import Scrollbar from "../../../../components/Scrollbar";
import Label from "../../../../components/Label";
import {TableEmptyRows, TableHeadCustom, TableNoData} from "../../../../components/table";
import AssignmentTableToolbar from "../../../../sections/@app/assignment/AssignmentTableToolbar";
import {ALLSTUDENTASSIGNMENT_QUERY} from "../../../../utils/graphql-query";
import {useQuery} from "@apollo/client";
import LoadingScreen from "../../../../components/LoadingScreen";
import StudentAssignmentAnalytic from "../../../../sections/@app/assignment/assigned/StudentAssignmentAnalytic";
import StudentAssignmentTableRow from "../../../../sections/@app/assignment/assigned/StudentAssignmentTableRow";

const TABLE_HEAD = [
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'dueDate', label: 'Due Date', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: '' },
];

AllAssignedAssignment.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AllAssignedAssignment() {
    const theme = useTheme();

    const { push } = useRouter();

    const {
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        onSort,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({ defaultOrderBy: 'dueDate' });

    const {loading, data, error} = useQuery(ALLSTUDENTASSIGNMENT_QUERY);

    const [filterName, setFilterName] = useState('');

    const [filterDueDate, setFilterDueDate] = useState(null);

    const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

    if (loading) return <LoadingScreen />;
    const assignments = data.allStudentAssignment;

    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };

    const handleViewRow = (id) => {
        push(PATH_APP.assignment.assigned.view(id));
    };

    const filteredAssignment = applySortFilter({
        assignments,
        comparator: getComparator(order, orderBy),
        filterName,
        filterStatus,
        filterDueDate,
    });

    const isNotFound =
        (!filteredAssignment.length && !!filterName) ||
        (!filteredAssignment.length && !!filterStatus) ||
        (!filteredAssignment.length && !!filterDueDate);

    const getLengthByStatus = (status) => assignments.filter((item) => item.status.toLowerCase() === status).length;

    const getLengthByDueDateStatus = (dueDateStatus) => {
        if (dueDateStatus === 'ontime') {
            return assignments.filter(item =>
                item.status.toLowerCase() === 'submitted'
                && item.submitAt <= item.assignment.dueDate
            ).length;
        } else if (dueDateStatus === 'late') {
            return assignments.filter(item =>
                item.status.toLowerCase() === 'submitted'
                && item.submitAt > item.assignment.dueDate
            ).length;
        } else if (dueDateStatus === 'overdue') {
            return assignments.filter(item =>
                item.status.toLowerCase() === 'assigned'
                && item.submitAt === null
                && item.assignment.dueDate < Date.now()
            ).length
        }
        return assignments.filter(item =>
            item.status.toLowerCase() === 'assigned'
            && item.submitAt === null
            && item.assignment.dueDate >= Date.now()
        ).length
    }

    const getPercentByDueDateStatus = (dueDateStatus) => (getLengthByDueDateStatus(dueDateStatus) / assignments.length) * 100;

    const TABS = [
        { value: 'all', label: 'All', color: 'default', count: assignments.length },
        { value: 'assigned', label: 'Assigned', color: 'default', count: getLengthByStatus('assigned') },
        { value: 'submitted', label: 'Submitted', color: 'success', count: getLengthByStatus('submitted') },
        { value: 'generated', label: 'Generated', color: 'warning', count: getLengthByStatus('generated') },
        { value: 'questioned', label: 'Questioned', color: 'error', count: getLengthByStatus('questioned') },
        { value: 'answered', label: 'Answered', color: 'info', count: getLengthByStatus('answered') },
        { value: 'closed', label: 'Closed', color: 'default', count: getLengthByStatus('closed') },
    ];

    return (
        <Page title="User: My Assignment">
            <Container maxWidth={'lg'}>
                <HeaderBreadcrumbs
                    heading="My Assignment"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        { name: 'Assignment', href: PATH_APP.assignment.root },
                        { name: 'Assigned', href: PATH_APP.assignment.assigned.root },
                        { name: 'All Assigned' },
                    ]}
                />

                <Card sx={{ mb: 5 }}>
                    <Scrollbar>
                        <Stack
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                            sx={{ py: 2 }}
                        >
                            <StudentAssignmentAnalytic
                                title="Total"
                                total={assignments.length}
                                percent={100}
                                icon="ic:round-receipt"
                                color={theme.palette.info.main}
                            />
                            <StudentAssignmentAnalytic
                                title="On time"
                                total={getLengthByDueDateStatus('ontime')}
                                percent={getPercentByDueDateStatus('ontime')}
                                icon="eva:checkmark-circle-2-fill"
                                color={theme.palette.success.main}
                            />
                            <StudentAssignmentAnalytic
                                title="Late"
                                total={getLengthByDueDateStatus('late')}
                                percent={getPercentByDueDateStatus('late')}
                                icon="eva:clock-fill"
                                color={theme.palette.warning.main}
                            />
                            <StudentAssignmentAnalytic
                                title="Overdue"
                                total={getLengthByDueDateStatus('overdue')}
                                percent={getPercentByDueDateStatus('overdue')}
                                icon="eva:bell-fill"
                                color={theme.palette.error.main}
                            />
                            <StudentAssignmentAnalytic
                                title="Pending"
                                total={getLengthByDueDateStatus('pending')}
                                percent={getPercentByDueDateStatus('pending')}
                                icon="eva:file-fill"
                                color={theme.palette.text.secondary}
                            />
                        </Stack>
                    </Scrollbar>
                </Card>

                <Card>
                    <Tabs
                        allowScrollButtonsMobile
                        variant="scrollable"
                        scrollButtons="auto"
                        value={filterStatus}
                        onChange={onFilterStatus}
                        sx={{ px: 2, bgcolor: 'background.neutral' }}
                    >
                        {TABS.map((tab) => (
                            <Tab
                                disableRipple
                                key={tab.value}
                                value={tab.value}
                                label={
                                    <Stack spacing={1} direction="row" alignItems="center">
                                        <div>{tab.label}</div> <Label color={tab.color}> {tab.count} </Label>
                                    </Stack>
                                }
                            />
                        ))}
                    </Tabs>

                    <Divider />

                    <AssignmentTableToolbar
                        filterName={filterName}
                        filterDueDate={filterDueDate}
                        onFilterName={handleFilterName}
                        onFilterDueDate={(newValue) => {
                            setFilterDueDate(newValue);
                        }}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                            <Table size={'small'}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={assignments.length}
                                    onSort={onSort}
                                />

                                <TableBody>
                                    {filteredAssignment.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                            <StudentAssignmentTableRow
                                                key={row.id}
                                                row={row}
                                                onViewRow={() => handleViewRow(row.id)}
                                            />
                                    ))}

                                    <TableEmptyRows height={56} emptyRows={emptyRows(page, rowsPerPage, assignments.length)} />

                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredAssignment.length}
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

function applySortFilter({
                             assignments,
                             comparator,
                             filterName,
                             filterStatus,
                             filterDueDate,
                         }) {
    const stabilizedThis = assignments.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    assignments = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        assignments = assignments.filter(
            (item) =>
                item.assignment.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
                item.assignment.course.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
    }

    if (filterStatus !== 'all') {
        assignments = assignments.filter((item) => item.status.toLowerCase() === filterStatus);
    }

    if (filterDueDate) {
        assignments = assignments.filter((item) => item.assignment.dueDate <= filterDueDate);
    }

    return assignments;
}
