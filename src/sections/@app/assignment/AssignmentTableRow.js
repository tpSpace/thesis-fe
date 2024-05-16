import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { fDate } from "../../../utils/formatTime";
import { TableMoreMenu } from "../../../components/table";
import Iconify from "../../../components/Iconify";
import Avatar from "../../../components/Avatar";
import createAvatar from "../../../utils/createAvatar";
import { fFullName } from "../../../utils/formatName";
import { isStudent } from 'src/utils/auth';
import useAuth from 'src/hooks/useAuth';

AssignmentTableRow.propTypes = {
    row: PropTypes.object.isRequired,
    onViewRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onAssignRow: PropTypes.func,
    onViewCourse: PropTypes.func,
    onViewInstructor: PropTypes.func
};

export default function AssignmentTableRow({ row, onViewRow, onViewCourse, onViewInstructor, onEditRow, onAssignRow }) {
    const { name, dueDate, course } = row;

    const { user: loggedInUser } = useAuth();

    const [openMenu, setOpenMenuActions] = useState(null);

    const handleOpenMenu = (event) => {
        setOpenMenuActions(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    return (
        <TableRow hover>
            <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt={name} color={createAvatar(name).color} sx={{ mr: 2 }}>
                    {createAvatar(name).name}
                </Avatar>

                <Stack>
                    <Typography variant="subtitle2" noWrap>
                        {name}
                    </Typography>

                    <Typography noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                        <Link noWrap variant="body2" onClick={onViewCourse}
                            sx={{ color: 'text.disabled', cursor: 'pointer' }}>
                            {course.name}
                        </Link>
                        {' '}instructed by{' '}
                        <Link noWrap variant="body2" onClick={onViewInstructor}
                            sx={{ color: 'text.disabled', cursor: 'pointer' }}>
                            {fFullName(course.instructor.firstName, course.instructor.lastName)}
                        </Link>
                    </Typography>

                </Stack>
            </TableCell>

            <TableCell align="left">{fDate(dueDate)}</TableCell>

            <TableCell align="right">
                <TableMoreMenu
                    open={openMenu}
                    onOpen={handleOpenMenu}
                    onClose={handleCloseMenu}
                    actions={
                        <>
                            <MenuItem
                                onClick={() => {
                                    onViewRow();
                                    handleCloseMenu();
                                }}
                            >
                                <Iconify icon={'eva:eye-fill'} />
                                View
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    onEditRow();
                                    handleCloseMenu();
                                }}
                            >
                                <Iconify icon={'eva:edit-fill'} />
                                Edit
                            </MenuItem>

                            {isStudent(loggedInUser) ? null : (
                                <MenuItem
                                    onClick={() => {

                                        onAssignRow();

                                        handleCloseMenu();
                                    }}
                                >
                                    <Iconify icon={'eva:book-fill'} />
                                    Assign
                                </MenuItem>

                            )}

                        </>
                    }
                />
            </TableCell>
        </TableRow>
    );
}
