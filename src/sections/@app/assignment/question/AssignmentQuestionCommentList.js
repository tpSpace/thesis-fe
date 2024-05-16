import PropTypes from 'prop-types';
import {Box, List} from '@mui/material';
import AssignmentQuestionCommentItem from "./AssignmentQuestionCommentItem";

AssignmentQuestionCommentList.propTypes = {
    question: PropTypes.object.isRequired,
};

export default function AssignmentQuestionCommentList({question}) {
    const {questionComment} = question;

    return (
        <List disablePadding>
            {questionComment.map((comment) => {
                const {id, text, createdOn, creator} = comment;

                return (
                    <Box key={id}>
                        <AssignmentQuestionCommentItem
                            text={text}
                            createdOn={createdOn}
                            creator={creator}
                        />
                    </Box>
                );
            })}
        </List>
    );
}
