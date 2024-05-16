import PropTypes from 'prop-types';
import {useState} from 'react';
import {
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Iconify from "../../../../components/Iconify";
import {fFullName} from "../../../../utils/formatName";

AssigneeTableRow.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        assignedFor: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                students: PropTypes.arrayOf(
                    PropTypes.shape({
                        id: PropTypes.number.isRequired,
                        firstName: PropTypes.string.isRequired,
                        lastName: PropTypes.string.isRequired,
                        schoolId: PropTypes.string.isRequired,
                    })
                )
            })
        ).isRequired
    }).isRequired
};

export default function AssigneeTableRow(props) {
    const {row} = props;

    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row">
                    {row.assignedFor.name}
                </TableCell>
                <TableCell align="right">{row.assignedFor.students.length}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">
                    <IconButton size="small" color={open ? 'primary' : 'default'} onClick={() => setOpen(!open)}>
                        <Iconify icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}/>
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={{py: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Paper sx={{px: 1, py: 2, borderRadius: 1.5, boxShadow: (theme) => theme.customShadows.z8}}>
                            <Typography variant="h6" sx={{m: 2, mt: 0}}>
                                Group Members
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>ID</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.assignedFor.students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell component="th" scope="row">
                                                {fFullName(student.firstName, student.lastName)}
                                            </TableCell>
                                            <TableCell>{student.schoolId}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
