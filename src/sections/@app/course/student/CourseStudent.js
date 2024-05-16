import PropTypes from 'prop-types';
import {useState} from 'react';
import {Box, Button, Card, Collapse, Grid, Stack} from '@mui/material';
import CourseStudentCard from "./CourseStudentCard";
import Iconify from "../../../../components/Iconify";
import CourseStudentAddForm from "./CourseStudentAddForm";

CourseStudent.propTypes = {
    course: PropTypes.object,
    students: PropTypes.array,
};

export default function CourseStudent({course, students}) {
    const [open, setOpen] = useState(false);

    return (
        <Grid container spacing={5}>
            <Grid item xs={12}>
                <Card sx={{p: 3}}>
                    <Stack alignItems='flex-end'>
                        <Box
                            sx={{
                                mt: {xs: 2, sm: 0},
                                top: {sm: 24},
                                right: {sm: 24},
                            }}
                        >
                            <Button size="small" startIcon={<Iconify icon={'eva:plus-fill'} />} onClick={() => setOpen(!open)}>
                                Add student
                            </Button>
                        </Box>
                    </Stack>

                    <Stack>
                        <Collapse in={open}>
                            <CourseStudentAddForm course={course} onCancel={() => setOpen(false)}/>
                        </Collapse>
                    </Stack>

                    <Stack sx={{mt: 3}}>
                        <Box
                            sx={{
                                display: 'grid',
                                gap: 3,
                                position: 'relative',
                                gridTemplateColumns: {
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                            }}
                        >
                            {students.map((student) => <CourseStudentCard key={student.id} student={student}/>)}
                        </Box>
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}
