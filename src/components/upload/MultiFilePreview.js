import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import {AnimatePresence, m} from 'framer-motion';
import {Button, IconButton, Link, List, ListItem, ListItemText, Stack} from '@mui/material';
import {fData} from '../../utils/formatNumber';
import Iconify from '../Iconify';
import {varFade} from '../animate';

MultiFilePreview.propTypes = {
    files: PropTypes.array,
    editable: PropTypes.bool,
    onRemove: PropTypes.func,
    onRemoveAll: PropTypes.func,
    onUploadAll: PropTypes.func,
};

export default function MultiFilePreview({files, editable = true, onRemove, onRemoveAll, onUploadAll}) {
    const hasFile = files.length > 0;

    return (
        <>
            <List disablePadding sx={{...(hasFile && {my: 3})}}>
                <AnimatePresence>
                    {files.map((file) => {
                        console.log(files);
                        return (
                            <ListItem
                                key={file.name}
                                component={m.div}
                                {...varFade().inRight}
                                sx={{
                                    my: 1,
                                    px: 2,
                                    py: 0.75,
                                    borderRadius: 0.75,
                                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                                }}
                            >
                                <Link href={file.attachmentBase64} download={file.name} sx={{textDecoration: 'none'}}>
                                    <Iconify icon={'eva:download-fill'}
                                             sx={{width: 28, height: 28, color: 'text.secondary', mr: 2}}/>
                                </Link>

                                <ListItemText
                                    primary={isString(file) ? file : file.name}
                                    secondary={isString(file) ? '' : fData(file.size || 0)}
                                    primaryTypographyProps={{variant: 'subtitle2'}}
                                    secondaryTypographyProps={{variant: 'caption'}}
                                />

                                {editable &&
                                    <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                                        <Iconify icon={'eva:close-fill'}/>
                                    </IconButton>
                                }
                            </ListItem>
                        );
                    })}
                </AnimatePresence>
            </List>

            {hasFile && editable && (
                <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                    <Button color="inherit" size="small" onClick={onRemoveAll}>
                        Remove all
                    </Button>
                    <Button size="small" variant="contained" onClick={onUploadAll}>
                        Upload files
                    </Button>
                </Stack>
            )}
        </>
    );
}
