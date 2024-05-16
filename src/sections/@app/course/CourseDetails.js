import PropTypes from 'prop-types';
import {Card, Divider, Grid, Typography,} from '@mui/material';
import {fDate} from "../../../utils/formatTime";
import {fFullName} from "../../../utils/formatName";

CourseDetails.propTypes = {
    course: PropTypes.object.isRequired,
};

export default function CourseDetails({ course }) {
    if (!course) {
        return null;
    }

    const {
        name,
        description,
        startDate,
        endDate,
        instructor
    } = course;

    return (
        <>
            <Card sx={{ pt: 5, px: 5 }}>
                <Grid container>
                    <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
                        <Typography variant="h5">{name}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={4} sx={{ mb: 5 }}>
                        <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                            Start Date
                        </Typography>
                        <Typography variant="body1">{fDate(startDate)}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={4} sx={{ mb: 5 }}>
                        <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                            End Date
                        </Typography>
                        <Typography variant="body1">{fDate(endDate)}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={4} sx={{ mb: 5 }}>
                        <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                            Instructed by
                        </Typography>
                        <Typography variant="body2">{fFullName(instructor.firstName, instructor.lastName)}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
                        <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                            Description
                        </Typography>
                        <Typography variant="body2">{description}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ mt: 3 }} />

                <Grid container>
                    <Grid item xs={12} md={12} sx={{ py: 3, textAlign: 'right' }}>
                        <Typography variant="subtitle2">Have a Question?</Typography>
                        <Typography variant="body2">{instructor.email}</Typography>
                    </Grid>
                </Grid>
            </Card>
        </>
    );
}
