import "simplebar/src/simplebar.css";
import "react-image-lightbox/style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "react-lazy-load-image-component/src/effects/black-and-white.css";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";
import Head from "next/head";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CollapseDrawerProvider } from "../contexts/CollapseDrawerContext";
import ThemeProvider from "../theme";
import { ChartStyle } from "../components/chart";
import RtlLayout from "../components/RtlLayout";
import ProgressBar from "../components/ProgressBar";
import ThemeColorPresets from "../components/ThemeColorPresets";
import NotistackProvider from "../components/NotistackProvider";
import MotionLazyContainer from "../components/animate/MotionLazyContainer";
import { AuthProvider } from "../contexts/JWTContext";
import { ApolloProvider } from "@apollo/client";
import client from "../utils/apollo-client";
import ClientOnly from "../components/ClientOnly";
import de from "date-fns/locale/de";

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
  settings: PropTypes.object,
};

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <ApolloProvider client={client}>
        <ClientOnly>
          <AuthProvider>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={de}
            >
              <CollapseDrawerProvider>
                <ThemeProvider>
                  <NotistackProvider>
                    <MotionLazyContainer>
                      <ThemeColorPresets>
                        <RtlLayout>
                          <ChartStyle />
                          <ProgressBar />
                          {getLayout(<Component {...pageProps} />)}
                        </RtlLayout>
                      </ThemeColorPresets>
                    </MotionLazyContainer>
                  </NotistackProvider>
                </ThemeProvider>
              </CollapseDrawerProvider>
            </LocalizationProvider>
          </AuthProvider>
        </ClientOnly>
      </ApolloProvider>
    </>
  );
}
