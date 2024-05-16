import PropTypes from 'prop-types';
import {useTheme} from '@mui/material/styles';
import {Box, Card, Divider, Grid, Typography,} from '@mui/material';
import Label from "../../../components/Label";

UserDetails.propTypes = {
    user: PropTypes.object.isRequired,
};

export default function UserDetails({ user }) {
    const theme = useTheme();

    if (!user) {
        return null;
    }

    const {
        id,
        username,
        firstName,
        lastName,
        phone,
        email,
        role,
        about
    } = user;

    return (
        <>
            <Card sx={{ pt: 5, px: 5 }}>
                <Grid container>
                    <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
                        <Box sx={{ textAlign: { sm: 'left' } }}>
                            <Label
                                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                color={
                                    (role.name.toLowerCase() === 'admin' && 'error') ||
                                    (role.name.toLowerCase() === 'teacher' && 'warning') ||
                                    (role.name.toLowerCase() === 'student' && 'success') ||
                                    'default'
                                }
                                sx={{ textTransform: 'uppercase', mb: 1 }}
                            >
                                {role.name}
                            </Label>
                        </Box>
                        <Typography variant="h5">{`${firstName} ${lastName}`}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
                        <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                            Email
                        </Typography>
                        <Typography variant="body1">{email}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
                        <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                            Phone Number
                        </Typography>
                        <Typography variant="body1">{phone}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
                        <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                            About
                        </Typography>
                        <Typography variant="body2">{about}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ mt: 3 }} />

                <Grid container>
                    <Grid item xs={12} md={12} sx={{ py: 3, textAlign: 'right' }}>
                        <Typography variant="subtitle2">Have a Question?</Typography>
                        <Typography variant="body2">{email}</Typography>
                    </Grid>
                </Grid>
            </Card>
        </>
    );
}
