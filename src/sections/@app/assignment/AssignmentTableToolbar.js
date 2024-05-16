import PropTypes from 'prop-types';
import {InputAdornment, Stack, TextField} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import Iconify from '../../../components/Iconify';

const INPUT_WIDTH = 160;

AssignmentTableToolbar.propTypes = {
    filterName: PropTypes.string,
    filterDueDate: PropTypes.instanceOf(Date),
    onFilterName: PropTypes.func,
    onFilterDueDate: PropTypes.func
};

export default function AssignmentTableToolbar({
                                                filterDueDate,
                                                filterName,
                                                onFilterName,
                                                onFilterDueDate,
                                            }) {
    return (
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
            <DatePicker
                label="Due date"
                value={filterDueDate}
                onChange={onFilterDueDate}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        sx={{
                            maxWidth: { md: INPUT_WIDTH },
                        }}
                    />
                )}
            />

            <TextField
                fullWidth
                value={filterName}
                onChange={(event) => onFilterName(event.target.value)}
                placeholder="Search name or course name..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                        </InputAdornment>
                    ),
                }}
            />
        </Stack>
    );
}
