import {useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import {useTheme} from '@mui/material/styles';
import {Box, Button, Card, Container, Table, TableBody, TableContainer, TablePagination,} from '@mui/material';
import useTable, {emptyRows, getComparator} from "../../../hooks/useTable";
import {PATH_APP} from "../../../routes/paths";
import Page from "../../../components/Page";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Iconify from "../../../components/Iconify";
import AssignmentTableToolbar from "../../../sections/@app/assignment/AssignmentTableToolbar";
import Scrollbar from "../../../components/Scrollbar";
import {TableEmptyRows, TableHeadCustom, TableNoData} from "../../../components/table";
import Layout from "../../../layouts";
import AssignmentTableRow from "../../../sections/@app/assignment/AssignmentTableRow";
import {ALLASSIGNMENT_QUERY} from "../../../utils/graphql-query";
import {useQuery} from "@apollo/client";
import LoadingScreen from "../../../components/LoadingScreen";

const TABLE_HEAD = [
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'dueDate', label: 'Due Date', align: 'left' },
    { id: '' },
];

AssignmentAll.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AssignmentAll() {
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

    const { loading, data, error } = useQuery(ALLASSIGNMENT_QUERY);

    const [filterName, setFilterName] = useState('');

    const [filterDueDate, setFilterDueDate] = useState(null);

    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };

    const handleEditRow = (id) => {
        push(PATH_APP.assignment.edit(id));
    };

    const handleViewRow = (id) => {
        push(PATH_APP.assignment.view(id));
    };
    
    const handleAssignRow = (id) => {
        push(PATH_APP.assignment.assign(id))
    }

    const handleViewCourse = (id) => {
        push(PATH_APP.course.view(id));
    }

    const handleViewInstructor = (id) => {
        push(PATH_APP.user.view(id));
    }

    if (loading) return <LoadingScreen />;

    const assignments = data.allAssignment;

    const filteredAssignment = applySortFilter({
        assignments,
        comparator: getComparator(order, orderBy),
        filterName,
        filterDueDate,
    });

    const isNotFound =
        (!filteredAssignment.length && !!filterName) ||
        (!filteredAssignment.length && !!filterDueDate);

    return (
        <Page title="All Assignments">
            <Container maxWidth={'lg'}>
                <HeaderBreadcrumbs
                    heading="All Assignments"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        { name: 'Assignment', href: PATH_APP.assignment.root },
                        { name: 'All Assignments' },
                    ]}
                    action={
                        <NextLink href={PATH_APP.assignment.new} passHref>
                            <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                                New Assignment
                            </Button>
                        </NextLink>
                    }
                />

                <Card>
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
                                            <AssignmentTableRow
                                                key={row.id}
                                                row={row}
                                                onViewCourse={() => handleViewCourse(row.course.id)}
                                                onViewInstructor={() => handleViewInstructor(row.course.instructor.id)}
                                                onViewRow={() => handleViewRow(row.id)}
                                                onEditRow={() => handleEditRow(row.id)}
                                                onAssignRow={()=> handleAssignRow(row.id)}
                                                
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
                item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
                item.course.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
    }

    if (filterDueDate) {
        assignments = assignments.filter((item) => item.dueDate <= filterDueDate);
    }

    return assignments;
}
