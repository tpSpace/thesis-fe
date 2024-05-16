import {Container} from '@mui/material';
import {useRouter} from "next/router";
import {useQuery} from "@apollo/client";
import {ANALYZER_BYID_QUERY} from "../../../../utils/graphql-query";
import LoadingScreen from "../../../../components/LoadingScreen";
import Layout from "../../../../layouts";
import useSettings from "../../../../hooks/useSettings";
import HeaderBreadcrumbs from "../../../../components/HeaderBreadcrumbs";
import Page from "../../../../components/Page";
import {PATH_APP} from "../../../../routes/paths";
import AnalyzerNewEditForm from "../../../../sections/@app/analyzer/AnalyzerNewEditForm";

AnalyzerEdit.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AnalyzerEdit() {
    const { themeStretch } = useSettings();

    const {query} = useRouter();

    const {analyzerId} = query;

    const {loading, data, error} = useQuery(ANALYZER_BYID_QUERY, {
        variables: {
            id: parseInt(analyzerId)
        },
        errorPolicy: 'none'
    });

    if (loading) return <LoadingScreen />;
    const currentAnalyzer = {
        id: data.getAnalyzerById.id,
        name: data.getAnalyzerById.name,
        description: data.getAnalyzerById.description,
        attachment: {
            attachmentBase64: data.getAnalyzerById.analyzerBase64,
            name: data.getAnalyzerById.analyzerFileName,
            extension: data.getAnalyzerById.analyzerFileExtension,
            size: data.getAnalyzerById.analyzerFileSize
        }
    };

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

                <AnalyzerNewEditForm isEdit analyzer={currentAnalyzer} />
            </Container>
        </Page>
    );
}
