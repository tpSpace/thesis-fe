import PropTypes from 'prop-types';
import {useState} from 'react';
import {Box, Button, Card, Collapse, Grid, Stack} from '@mui/material';
import CourseStudentGroupAddForm from "./CourseStudentGroupAddForm";
import CourseStudentGroupCard from "./CourseStudentGroupCard";
import Iconify from "../../../../../components/Iconify";

CourseStudentGroup.propTypes = {
    course: PropTypes.object,
    groups: PropTypes.array,
};

export default function CourseStudentGroup({course, groups}) {
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
                                Create group
                            </Button>
                        </Box>
                    </Stack>

                    <Stack>
                        <Collapse in={open}>
                            <CourseStudentGroupAddForm course={course} onCancel={() => setOpen(false)}/>
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
                            {groups.map((group) => <CourseStudentGroupCard key={group.id} group={group}/>)}
                        </Box>
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}
