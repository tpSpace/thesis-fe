import PropTypes from 'prop-types';
import {Avatar, Divider, ListItem, ListItemAvatar, ListItemText, Typography,} from '@mui/material';
import {fDate} from "../../../../utils/formatTime";
import {fFullName} from "../../../../utils/formatName";
import createAvatar from "../../../../utils/createAvatar";

AssignmentQuestionCommentItem.propTypes = {
    text: PropTypes.string,
    createdOn: PropTypes.string,
    creator: PropTypes.object,
};

export default function AssignmentQuestionCommentItem({text, createdOn, creator}) {
    return (
        <>
            <ListItem
                disableGutters
                sx={{
                    alignItems: 'flex-start',
                    py: 3,
                }}
            >
                <ListItemAvatar>
                    <Avatar alt={creator.firstName} color={createAvatar(creator.firstName).color} sx={{ mr: 2 }}>
                        {createAvatar(creator.firstName).name}
                    </Avatar>
                </ListItemAvatar>

                <ListItemText
                    primary={fFullName(creator.firstName, creator.lastName)}
                    primaryTypographyProps={{variant: 'subtitle1'}}
                    secondary={
                        <>
                            <Typography
                                gutterBottom
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    color: 'text.disabled',
                                }}
                            >
                                {fDate(createdOn)}
                            </Typography>
                            <Typography component="span" variant="body2">{text}</Typography>
                        </>
                    }
                />
            </ListItem>

            <Divider
                sx={{
                    ml: 'auto',
                    width: (theme) => `calc(100% - ${theme.spacing(7)})`,
                }}
            />
        </>
    );
}
