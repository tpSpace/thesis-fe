import PropTypes from 'prop-types';
import {Box, Divider, Grid, Link, Typography} from '@mui/material';
import Markdown from "../../../components/Markdown";
import {fFullName} from "../../../utils/formatName";
import SingleFilePreview from "../../../components/upload/SingleFilePreview";

AnalyzerDetails.propTypes = {
    analyzer: PropTypes.object.isRequired,
    onViewDeveloper: PropTypes.func.isRequired
};

export default function AnalyzerDetails({analyzer, onViewDeveloper}) {
    const {name, description, analyzerBase64, analyzerFileName, analyzerFileExtension, analyzerFileSize, developer} = analyzer;

    const file = {
        name: analyzerFileName,
        attachmentBase64: analyzerBase64
    }

    return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h1">{name}</Typography>
                </Grid>

                <Grid item xs={12} sm={12} sx={{mb: 5}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography noWrap variant="body1" sx={{color: 'text.disabled'}}>
                            by{' '}
                            <Link noWrap variant="body1"
                                  onClick={onViewDeveloper}
                                  sx={{color: 'text.disabled', cursor: 'pointer'}}
                            >
                                {fFullName(developer.firstName, developer.lastName)}
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

                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{mt: 5, mb: 5}}>
                    <Box sx={{display: 'flex', mb: 2}}>
                    <Typography variant="h4">Attachment</Typography>
                    </Box>
                    <SingleFilePreview file={file} editable={false} />
                    </Grid>
            </Grid>
    );
}
