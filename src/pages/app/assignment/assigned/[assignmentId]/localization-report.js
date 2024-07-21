import { Container, Card, Table, TableHead, Typography, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import { EXECUTEDTEST_BYASSIGNMENTID_QUERY, LOCALIZATIONREPORT_BYASSIGNMENTID_QUERY } from 'src/utils/graphql-query';
import { useRouter } from 'next/router';
import useSettings from 'src/hooks/useSettings';
import Layout from 'src/layouts';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import { PATH_APP } from 'src/routes/paths';
import LoadingScreen from 'src/components/LoadingScreen';
import Iconify from 'src/components/Iconify';

LocalizationReport.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function LocalizationReport() {
    const { themeStretch } = useSettings();
    const { query } = useRouter();
    const { assignmentId } = query;

    const {
        loading: localizationLoading,
        data: localizationData,
        error: localizationError } = useQuery(LOCALIZATIONREPORT_BYASSIGNMENTID_QUERY, {
            variables: { studentAssignmentId: parseInt(assignmentId) },
            errorPolicy: 'none'
        });

    const {
        loading: executedTestLoading,
        data: executedTestData,
        error: executedTestError } = useQuery(EXECUTEDTEST_BYASSIGNMENTID_QUERY, {
            variables: { studentAssignmentId: parseInt(assignmentId) },
            errorPolicy: 'none'
        });

    if (localizationLoading) return <LoadingScreen />;
    if (localizationError) return <Button onClick={() => window.location.reload()}>Retry</Button>;

    const currentStudentAssignment = localizationData.getStudentAssignmentById;
    const getColorFromScore = (score) => {
        if (score >= 0.8) return '#ff1744'; // red
        if (score < 0.5) return '#4a9836'; // green
        return '#Ecb259'; // yellow
    };

    const scoreFormat = (score) => {
        return Number(score.toFixed(4));
    };

    const renderScoreCell = (score) => {
        const barWidth = `${score * 100}%`;
        return (
            <TableCell>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: barWidth, height: '100%', backgroundColor: getColorFromScore(score), opacity: 0.5 }} />
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
                        {scoreFormat(score)}
                    </div>
                </div>
            </TableCell>
        );
    }

    function formatExecutedTest(executedTest) {
        const [className, methodName] = executedTest.split('#');
        return `${className} - Method: ${methodName}`;
    }

    return (
        <Page title="Localization Report">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Bug Localization Report"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        { name: 'Assignment', href: PATH_APP.assignment.root },
                        { name: 'Assigned', href: PATH_APP.assignment.assigned.root },
                        { name: currentStudentAssignment?.assignment.name || "Assignment Details", href: PATH_APP.assignment.assigned.view(assignmentId) },
                        { name: 'Bug Localization Report' },
                    ]}
                />
                <Typography variant='h5' paddingLeft={'10px'} gutterBottom borderRadius={'10px'}>Executed Test</Typography>
                <Card>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Testing Method</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {executedTestData && executedTestData.getAllExecutedTestsByAssignmentId.length > 0 ? (
                                executedTestData.getAllExecutedTestsByAssignmentId.map(test => (
                                    <TableRow key={test.id}>
                                        <TableCell style={{fontWeight:'bold'}}>{formatExecutedTest(test.executedTest)}</TableCell>
                                        <TableCell>
                                            {test.isFailing ?
                                                <Iconify icon={'eva:alert-circle-outline'} color="red" width="20%" height="20%" /> :
                                                <Iconify icon={'eva:checkmark-fill'} color="green" width="20%" height="20%" />
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center" style={{ backgroundColor: '#f4f4f4' }}>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            No test case uploaded
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                <Typography variant='h5' paddingLeft={'10px'} paddingTop={'25px'} gutterBottom borderRadius={'10px'}>Localization Report</Typography>
                <Card>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Class Name</TableCell>
                                <TableCell>Line Number</TableCell>
                                <TableCell>Suspicious Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {localizationData && localizationData.getAllLocalizationReportsByAssignmentId.length > 0 ? (
                                localizationData.getAllLocalizationReportsByAssignmentId.map(report => (
                                    <TableRow key={report.id}>
                                        <TableCell style={{fontWeight:'bold', color: getColorFromScore(report.score) }}>
                                            {report.location}
                                        </TableCell>
                                        <TableCell>{report.lineNumber}</TableCell>
                                        {renderScoreCell(report.score)}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" style={{ backgroundColor: '#d3d3d3' }}>
                                        <Typography variant="h6" color="textSecondary">
                                            No bug reports found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </Container>
        </Page>
    );
}
