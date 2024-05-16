import PropTypes from 'prop-types';
import NextLink from 'next/link';
import {Card, Link, Stack, Typography} from '@mui/material';
import {PATH_APP} from "../../../../routes/paths";
import {fFullName} from "../../../../utils/formatName";

CourseStudentCard.propTypes = {
    student: PropTypes.object,
};

export default function CourseStudentCard({student}) {
    const {id, firstName, lastName, phone, email} = student;

    const linkTo = PATH_APP.user.view(id);

    return (
        <Card>
            <Stack spacing={2} sx={{p: 3}}>
                <NextLink href={linkTo} passHref>
                    <Link color="inherit">
                        <Typography variant="subtitle2" noWrap>
                            {fFullName(firstName, lastName)}
                        </Typography>
                    </Link>
                </NextLink>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2">{phone}</Typography>
                    <Typography variant="body2">{email}</Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
