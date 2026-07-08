import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title = "BizLaunch India", description = "Launch a modern business website, QR code, WhatsApp link, and dashboard in minutes." }) => {
  const siteTitle = title ? `${title} | BizLaunch India` : "BizLaunch India - Business website in a box";

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEO;
