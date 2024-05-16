import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { MenuItem, TableCell, TableRow } from '@mui/material';
import { TableMoreMenu } from "../../../components/table";
import Label from "../../../components/Label";
import Iconify from "../../../components/Iconify";

UserTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onViewRow: PropTypes.func,
};

export default function UserTableRow({ row, onViewRow }) {
    const theme = useTheme();

    const { firstName, lastName, email, phone, role } = row;

    const [openMenu, setOpenMenuActions] = useState(null);

    const handleOpenMenu = (event) => {
        setOpenMenuActions(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    return (
        <TableRow hover>
            <TableCell align="left">{firstName + " " + lastName}</TableCell>

            <TableCell align="left">{email}</TableCell>

            <TableCell align="left">{phone}</TableCell>

            <TableCell align="left">
                {role && role.name && (
                    <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={
                            (role.name.toLowerCase() === 'admin' && 'error') ||
                            (role.name.toLowerCase() === 'teacher' && 'warning') ||
                            (role.name.toLowerCase() === 'student' && 'success') ||
                            'default'
                        }
                        sx={{ textTransform: 'capitalize' }}
                    >
                        {role.name}
                    </Label>
                )}
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
                                <Iconify icon={'eva:edit-fill'} />
                                View
                            </MenuItem>
                        </>
                    }
                />
            </TableCell>
        </TableRow>
    );
}
