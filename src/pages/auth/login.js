import NextLink from "next/link";
import { styled } from "@mui/material/styles";
import { Box, Card, Container, Link, Stack, Typography } from "@mui/material";
import { PATH_AUTH } from "../../routes/paths";
import useAuth from "../../hooks/useAuth";
import useResponsive from "../../hooks/useResponsive";
import GuestGuard from "../../guards/GuestGuard";
import Page from "../../components/Page";
import Logo from "../../components/Logo";
import { LoginForm } from "../../sections/auth/login";

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));
console.log(" env ", process.env.NEXT_PUBLIC_GRAPHQL_URI);
const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

console.log("Login page loaded");
console.log(process.env.NEXT_PUBLIC_GRAPHQL_URI);

export default function Login() {
  const { method } = useAuth();

  const smUp = useResponsive("up", "sm");

  const mdUp = useResponsive("up", "md");

  return (
    <GuestGuard>
      <Page title="Login">
        <RootStyle>
          <HeaderStyle>
            <Logo />
            {smUp && (
              <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                Don’t have an account? {""}
                <NextLink href={PATH_AUTH.register} passHref>
                  <Link variant="subtitle2">Get started</Link>
                </NextLink>
              </Typography>
            )}
          </HeaderStyle>

          {mdUp && (
            <SectionStyle>
              <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                Hi, Welcome Back
              </Typography>
            </SectionStyle>
          )}

          <Container maxWidth="sm">
            <ContentStyle>
              <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    Sign in to LCA!
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Enter your details below.
                  </Typography>
                </Box>
              </Stack>
              <LoginForm />

              {!smUp && (
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  Don’t have an account?{" "}
                  <NextLink href={PATH_AUTH.register} passHref>
                    <Link variant="subtitle2">Get started</Link>
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
