import PropTypes from 'prop-types';
import {useTheme} from '@mui/material/styles';
import {Box, Grid, Typography,} from '@mui/material';
import Label from "../../../../components/Label";
import {fFullDate} from "../../../../utils/formatTime";
import AssignmentSubmitForm from "../AssignmentSubmitForm";

StudentAssignmentStatus.propTypes = {
    studentAssignment: PropTypes.object.isRequired,
};

export default function StudentAssignmentStatus({studentAssignment}) {
    const theme = useTheme();

    const {
        id,
        url,
        status,
        submitAt,
        assignment
    } = studentAssignment;

    const getStatusColor = (status) => {
        if (status.toLowerCase() === 'submitted') return 'success';
        else if (status.toLowerCase() === 'generated') return 'warning';
        else if (status.toLowerCase() === 'questioned') return 'error';
        else if (status.toLowerCase() === 'answered') return 'info';
        return 'default';
    }

    return (
        <Grid container sx={{pt: 5, px: 3}}>
            <Grid item xs={12} sx={{mb: 5}}>
                <Box sx={{textAlign: {sm: 'left'}}}>
                    <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={getStatusColor(status)}
                        sx={{textTransform: 'uppercase', mb: 1}}
                    >
                        {status}
                    </Label>
                </Box>
            </Grid>

            <Grid item xs={12} sx={{mb: 5}}>
                <Typography paragraph variant="overline" sx={{color: 'text.disabled'}}>
                    Due Date
                </Typography>
                <Typography variant="body1">{fFullDate(assignment.dueDate)}</Typography>
            </Grid>

            {
                status.toLowerCase() !== 'assigned' && (
                    <>
                        <Grid item xs={12} sm={6} sx={{mb: 5}}>
                            <Typography paragraph variant="overline" sx={{color: 'text.disabled'}}>
                                Submit At
                            </Typography>
                            <Typography variant="body1">{fFullDate(submitAt)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{mb: 5}}>
                            <Typography paragraph variant="overline" sx={{color: 'text.disabled'}}>
                                URL
                            </Typography>
                            <Typography variant="body1">{url}</Typography>
                        </Grid>
                    </>
                )
            }
            {
                status.toLowerCase() === 'assigned' && (
                    <Grid item xs={12} sx={{mb: 3}}>
                        <AssignmentSubmitForm/>
                    </Grid>
                )
            }
        </Grid>
    );
}
