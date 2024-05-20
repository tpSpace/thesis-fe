import { Container, Card, Table, TableHead, Typography, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import { LOCALIZATIONREPORT_BYASSIGNMENTID_QUERY } from 'src/utils/graphql-query';
import { useRouter } from 'next/router';
import useSettings from 'src/hooks/useSettings';
import Layout from 'src/layouts';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import { PATH_APP } from 'src/routes/paths';
import LoadingScreen from 'src/components/LoadingScreen';

LocalizationReport.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function LocalizationReport() {
    const { themeStretch } = useSettings();
    const { query } = useRouter();
    const { assignmentId } = query;

    const { loading, data, error } = useQuery(LOCALIZATIONREPORT_BYASSIGNMENTID_QUERY, {
        variables: { studentAssignmentId: parseInt(assignmentId) },
        errorPolicy: 'none'
    });

    if (loading) return <LoadingScreen />;
    if (error) return <Button onClick={() => window.location.reload()}>Retry</Button>;

    const getColorFromScore = (score) => {
        if (score >= 0.8) return '#ff1744'; // red
        if (score < 0.5) return '#4a9836'; // green
        return '#Ecb259'; // yellow
    };

    const scoreFormat = (score) => {
        return Number(score.toFixed(5));
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

    return (
        <Page title="Localization Report">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Bug Localization Report"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        { name: 'Assignment', href: PATH_APP.assignment.root },
                        { name: 'Assigned', href: PATH_APP.assignment.assigned.root },
                        { name: 'Bug Localization Report' },
                    ]}
                />
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
                            {data && data.getAllLocalizationReportsByAssignmentId.length > 0 ? (
                                data.getAllLocalizationReportsByAssignmentId.map(report => (
                                    <TableRow key={report.id}>
                                        <TableCell style={{ color: getColorFromScore(report.score) }}>
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
