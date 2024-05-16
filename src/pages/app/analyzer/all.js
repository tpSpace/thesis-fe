import {Button, Container} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import NextLink from "next/link";
import Iconify from "../../../components/Iconify";
import {useQuery} from "@apollo/client";
import {ALLANALYZER_QUERY} from "../../../utils/graphql-query";
import LoadingScreen from "../../../components/LoadingScreen";
import AnalyzerList from "../../../sections/@app/analyzer/AnalyzerList";

AllAnalyzer.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default function AllAnalyzer() {
    const {loading, data, error} = useQuery(ALLANALYZER_QUERY);

    if (loading) return <LoadingScreen/>;

    const analyzers = data.allAnalyzer;

    return (
        <Page title="User: My Course">
            <Container maxWidth={'lg'}>
                <HeaderBreadcrumbs
                    heading="All Analyzers"
                    links={[
                        {name: 'Home', href: PATH_APP.root},
                        {
                            name: 'Analyzer',
                            href: PATH_APP.analyzer.root,
                        },
                        {name: 'All Analyzers'},
                    ]}
                    action={
                        <NextLink href={PATH_APP.analyzer.new} passHref>
                            <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'}/>}>
                                New Analyzer
                            </Button>
                        </NextLink>
                    }
                />

                <AnalyzerList analyzers={analyzers} loading={loading}/>
            </Container>
        </Page>
    );
}
