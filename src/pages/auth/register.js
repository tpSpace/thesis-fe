import NextLink from 'next/link';
import {styled} from '@mui/material/styles';
import {Box, Card, Container, Link, Typography} from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
import {PATH_AUTH} from '../../routes/paths';
import GuestGuard from '../../guards/GuestGuard';
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import {RegisterForm} from '../../sections/auth/register';

const RootStyle = styled('div')(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const HeaderStyle = styled('header')(({theme}) => ({
    top: 0,
    zIndex: 9,
    lineHeight: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
        alignItems: 'flex-start',
        padding: theme.spacing(7, 5, 0, 7),
    },
}));

const SectionStyle = styled(Card)(({theme}) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({theme}) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0),
}));

export default function Register() {
    const smUp = useResponsive('up', 'sm');

    const mdUp = useResponsive('up', 'md');

    return (
        <GuestGuard>
            <Page title="Register">
                <RootStyle>
                    <HeaderStyle>
                        <Logo/>
                        {smUp && (
                            <Typography variant="body2" sx={{mt: {md: -2}}}>
                                Already have an account? {''}
                                <NextLink href={PATH_AUTH.login} passHref>
                                    <Link variant="subtitle2">Login</Link>
                                </NextLink>
                            </Typography>
                        )}
                    </HeaderStyle>

                    {mdUp && (
                        <SectionStyle>
                            <Typography variant="h3" sx={{px: 5, mt: 10, mb: 5}}>
                                Hello there, stranger!
                            </Typography>
                        </SectionStyle>
                    )}

                    <Container>
                        <ContentStyle>
                            <Box sx={{mb: 5, display: 'flex', alignItems: 'center'}}>
                                <Box sx={{flexGrow: 1}}>
                                    <Typography variant="h4" gutterBottom>
                                        Welcome to LCA!
                                    </Typography>
                                    <Typography sx={{color: 'text.secondary'}}>
                                        Let's dive in...
                                    </Typography>
                                </Box>
                            </Box>

                            <RegisterForm />

                            {!smUp && (
                                <Typography variant="body2" sx={{mt: 3, textAlign: 'center'}}>
                                    Already have an account?{' '}
                                    <NextLink href={PATH_AUTH.login} passHref>
                                        <Link variant="subtitle2">Login</Link>
                                    </NextLink>
                                </Typography>
                            )}
                        </ContentStyle>
                    </Container>
                </RootStyle>
            </Page>
        </GuestGuard>
    );
}
