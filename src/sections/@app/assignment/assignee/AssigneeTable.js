import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import Scrollbar from "../../../../components/Scrollbar";
import AssigneeTableRow from "./AssigneeTableRow";
import PropTypes from "prop-types";
import AssignmentDetails from "../AssignmentDetails";

AssignmentDetails.propTypes = {
    studentAssignments: PropTypes.array.isRequired,
};

export default function AssigneeTable({studentAssignments}) {
    return (
        <Scrollbar>
            <TableContainer sx={{ minWidth: 800, mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Members</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentAssignments.map((studentAssignment) => (
                            <AssigneeTableRow key={studentAssignment.id} row={studentAssignment} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Scrollbar>
    );
}
