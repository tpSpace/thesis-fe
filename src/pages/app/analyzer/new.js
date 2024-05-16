import {Container} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import AnalyzerNewEditForm from "../../../sections/@app/analyzer/AnalyzerNewEditForm";

AnalyzerNew.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AnalyzerNew() {
    const { themeStretch } = useSettings();

    return (
        <Page title="New Analyzer">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Create a new analyzer"
                    links={[
                        { name: 'Home', href: PATH_APP.root },
                        { name: 'Analyzer', href: PATH_APP.analyzer.root },
                        { name: 'New Analyzer' },
                    ]}
                />

                <AnalyzerNewEditForm />
            </Container>
        </Page>
    );
}
