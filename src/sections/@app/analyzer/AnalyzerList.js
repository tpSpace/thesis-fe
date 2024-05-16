import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import AnalyzerCard from "./AnalyzerCard";
import SkeletonAnalyzerItem from "../../../components/skeleton/SkeletonAnalyzerItem";

AnalyzerList.propTypes = {
    analyzers: PropTypes.array.isRequired,
    loading: PropTypes.bool,
};

export default function AnalyzerList({analyzers, loading}) {
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
            {(loading ? [...Array(12)] : analyzers).map((analyzer, index) =>
                analyzer ? <AnalyzerCard key={analyzer.id} analyzer={analyzer}/> : <SkeletonAnalyzerItem key={index}/>
            )}
        </Box>
    );
}
