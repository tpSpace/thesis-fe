import PropTypes from 'prop-types';
import NextLink from 'next/link';
import {Card, Link, Stack, Typography} from '@mui/material';
import {fFullName} from "../../../../../utils/formatName";
import {PATH_APP} from "../../../../../routes/paths";

CourseStudentGroupCard.propTypes = {
    group: PropTypes.object,
};

export default function CourseStudentGroupCard({group}) {
    const {id, name, students} = group;

    const linkTo = PATH_APP.user.view(id);

    return (
        <Card>
            <Stack spacing={2} sx={{p: 3}}>
                <NextLink href={linkTo} passHref>
                    <Link color="inherit">
                        <Typography variant="subtitle2" noWrap>
                            {name}
                        </Typography>
                    </Link>
                </NextLink>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    { students.map(student =>
                            <Typography key={student.id} variant="body2">
                                {fFullName(student.firstName, student.lastName)}
                            </Typography>

                    )}
                </Stack>
            </Stack>
        </Card>
    );
}
