import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import CourseCard from './CourseCard';
import SkeletonCourseItem from "../../../components/skeleton/SkeletonCourseItem";

CourseList.propTypes = {
    courses: PropTypes.array.isRequired,
    loading: PropTypes.bool,
};

export default function CourseList({courses, loading}) {
    return (
        <Box
            sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                },
            }}
        >
            {(loading ? [...Array(12)] : courses).map((course, index) =>
                course ? <CourseCard key={course.id} course={course}/> : <SkeletonCourseItem key={index}/>
            )}
        </Box>
    );
}
