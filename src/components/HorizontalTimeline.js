import PropTypes from 'prop-types';
// @mui
import {Box, Breadcrumbs as MUIBreadcrumbs, Typography} from '@mui/material';

// ----------------------------------------------------------------------

HorizontalTimeline.propTypes = {
    timestamps: PropTypes.array.isRequired,
};

export default function HorizontalTimeline({ timestamps, ...other }) {
    const listDefault = timestamps.map((timestamp) => (
        <div key={timestamp}>
            <Typography
                variant="body2"
                sx={{
                    maxWidth: 260,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    color: 'text.disabled',
                    textOverflow: 'ellipsis',
                }}
            >
                {timestamp}
            </Typography>
        </div>
    ));

    return (
        <MUIBreadcrumbs
            separator={<Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />}
            {...other}
        >
            {listDefault}
        </MUIBreadcrumbs>
    );
}