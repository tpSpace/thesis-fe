import {useRouter} from 'next/router';
import {Box, Button, Container} from '@mui/material';
import {PATH_APP} from '../../../../routes/paths';
import useSettings from '../../../../hooks/useSettings';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import Iconify from "../../../../components/Iconify";
import {ANALYZER_BYID_QUERY} from "../../../../utils/graphql-query";
import {useQuery} from "@apollo/client";
import LoadingScreen from "../../../../components/LoadingScreen";
import AnalyzerDetails from "../../../../sections/@app/analyzer/AnalyzerDetails";
import SkeletonAnalyzerItem from "../../../../components/skeleton/SkeletonAnalyzerItem";
import NextLink from "next/link";

AnalyzerAnalyzerIdIndex.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AnalyzerAnalyzerIdIndex() {
    const {themeStretch} = useSettings();

    const {query, push} = useRouter();

    const {analyzerId} = query;

    const {loading, data, error} = useQuery(ANALYZER_BYID_QUERY, {
        variables: {
            id: parseInt(analyzerId)
        },
        errorPolicy: 'none'
    });

    const handleViewDeveloper = (id) => {
        push(PATH_APP.user.view(id));
    }

    if (loading) return <LoadingScreen/>;

    const currentAnalyzer = data.getAnalyzerById;

    return (
        <Page title="Analyzer Details">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Analyzer Details"
                    links={[
                        {name: 'Home', href: PATH_APP.root},
                        {name: 'Analyzer', href: PATH_APP.analyzer.root},
                        {name: currentAnalyzer?.name || "Analyzer Details"},
                    ]}
                    action={
                        <NextLink href={PATH_APP.analyzer.edit(analyzerId)} passHref>
                            <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'}/>}>
                                Edit Analyzer
                            </Button>
                        </NextLink>
                    }
                />
                <Box>
                    <AnalyzerDetails analyzer={currentAnalyzer}
                                     onViewDeveloper={() => handleViewDeveloper(currentAnalyzer.developer.id)}/>
                    {!currentAnalyzer && !error && <SkeletonAnalyzerItem/>}
                </Box>
            </Container>
        </Page>
    );
}


