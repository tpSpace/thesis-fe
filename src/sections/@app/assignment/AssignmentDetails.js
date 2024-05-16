import PropTypes from 'prop-types';
import {Box, Divider, Grid, Link, Typography} from '@mui/material';
import Markdown from "../../../components/Markdown";
import {fFullName} from "../../../utils/formatName";
import MultiFilePreview from "../../../components/upload/MultiFilePreview";

AssignmentDetails.propTypes = {
    assignment: PropTypes.object.isRequired,
    onViewCourse: PropTypes.func.isRequired,
    onViewInstructor: PropTypes.func.isRequired
};

export default function AssignmentDetails({assignment, onViewCourse, onViewInstructor}) {
    const {name, course, description, attachments} = assignment;

    return (
        <>
            <Grid container sx={{pt: 5, px: 3}}>
                <Grid item xs={12}>
                    <Typography variant="h1">{name}</Typography>
                </Grid>

                <Grid item xs={12} sm={12} sx={{mb: 5}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography noWrap variant="body1" sx={{color: 'text.disabled'}}>
                            of{' '}
                            <Link noWrap variant="body1"
                                  onClick={onViewCourse}
                                  sx={{color: 'text.disabled', cursor: 'pointer'}}
                            >
                                {course.name}
                            </Link>
                            {' '}instructed by{' '}
                            <Link noWrap variant="body1"
                                  onClick={onViewInstructor}
                                  sx={{color: 'text.disabled', cursor: 'pointer'}}
                            >
                                {fFullName(course.instructor.firstName, course.instructor.lastName)}
                            </Link>
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Divider/>
                </Grid>

                <Grid item xs={12} sm={12} sx={{mt: 5, mb: 5}}>
                    <Markdown children={description}/>
                </Grid>

                {attachments.length !== 0 &&
                    <>
                        <Grid item xs={12}>
                            <Divider/>
                        </Grid>

                        <Grid item xs={12} sm={12} sx={{mt: 5, mb: 5}}>
                            <Box sx={{display: 'flex', mb: 2}}>
                                <Typography variant="h4">Attachments</Typography>
                                <Typography variant="subtitle2" sx={{color: 'text.disabled'}}>
                                    ({attachments.length})
                                </Typography>
                            </Box>
                            <MultiFilePreview files={attachments} editable={false} />
                        </Grid>
                    </>
                }
            </Grid>
        </>
    );
}
