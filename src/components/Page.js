import { forwardRef } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { Box } from "@mui/material";

const Page = forwardRef(function Page(
  { children, title = "", meta, ...other },
  ref
) {
  return (
    <>
      <Head>
        <title>{title}</title>
        {meta}
      </Head>

      <Box ref={ref} {...other}>
        {children}
      </Box>
    </>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
