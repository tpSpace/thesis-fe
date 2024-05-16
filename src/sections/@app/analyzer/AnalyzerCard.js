import PropTypes from 'prop-types';
import NextLink from 'next/link';
import {Card, Link, Stack, Typography} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import {fFullName} from "../../../utils/formatName";

AnalyzerCard.propTypes = {
    analyzer: PropTypes.object,
};

export default function AnalyzerCard({analyzer}) {
    const {id, name, developer} = analyzer;

    const linkTo = PATH_APP.analyzer.view(id);

    return (
        <Card>
            <Stack spacing={2} sx={{p: 3}}>
                <NextLink href={linkTo} passHref>
                    <Link color="inherit">
                        <Typography variant="subtitle2" noWrap>
                            {name}
                        </Typography>
                    </Link>
                </NextLink>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2">by {fFullName(developer.firstName, developer.lastName)}</Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
