import PropTypes from 'prop-types';
import NextLink from 'next/link';
import {Card, Link, Stack, Typography} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import HorizontalTimeline from "../../../components/HorizontalTimeline";
import {fDate} from "../../../utils/formatTime";
import {fFullName} from "../../../utils/formatName";

CourseCard.propTypes = {
    course: PropTypes.object,
};

export default function CourseCard({course}) {
    const {id, name, startDate, endDate, instructor} = course;

    const linkTo = PATH_APP.course.view(id);

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
                    <HorizontalTimeline timestamps={[fDate(startDate), fDate(endDate)]}/>
                    <Typography variant="body2">{fFullName(instructor.firstName, instructor.lastName)}</Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
