import PropTypes from 'prop-types';
import {useState} from 'react';
import {useTheme} from '@mui/material/styles';
import {Link, MenuItem, Stack, TableCell, TableRow, Typography} from '@mui/material';
import {fDate} from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import {TableMoreMenu} from '../../../../components/table';
import Label from "../../../../components/Label";

StudentAssignmentTableRow.propTypes = {
    row: PropTypes.object.isRequired,
    onViewRow: PropTypes.func,
};

export default function StudentAssignmentTableRow({ row, onViewRow }) {
    const theme = useTheme();

    const { assignment, status } = row;

    const [openMenu, setOpenMenuActions] = useState(null);

    const handleOpenMenu = (event) => {
        setOpenMenuActions(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    const getStatusColor = (status) => {
        if (status.toLowerCase() === 'submitted') return 'success';
        else if (status.toLowerCase() === 'generated') return 'warning';
        else if (status.toLowerCase() === 'questioned') return 'error';
        else if (status.toLowerCase() === 'answered') return 'info';
        return 'default';
    }

    return (
        <TableRow hover>
            <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt={assignment.name} color={createAvatar(assignment.name).color} sx={{ mr: 2 }}>
                    {createAvatar(assignment.name).name}
                </Avatar>

                <Stack>
                    <Typography variant="subtitle2" noWrap>
                        {assignment.name}
                    </Typography>

                    <Link noWrap variant="body2" onClick={onViewRow} sx={{ color: 'text.disabled', cursor: 'pointer' }}>
                        {assignment.course.name}
                    </Link>
                </Stack>
            </TableCell>

            <TableCell align="left">{fDate(assignment.dueDate)}</TableCell>

            <TableCell align="left">
                <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={getStatusColor(status)}
                    sx={{textTransform: 'capitalize'}}
                >
                    {status}
                </Label>
            </TableCell>

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
                        </>
                    }
                />
            </TableCell>
        </TableRow>
    );
}
