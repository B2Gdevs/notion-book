'use client'

import React from 'react';
import "svix-react/style.css";
import { useGetAppPortalUrl } from "..";

export const SvixEmbed = () => {
  const { data: appPortalUrl, error } = useGetAppPortalUrl();
  const [iframeUrl, setIframeUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (error) {
      console.error("Failed to load the App Portal URL:", error);
    } else if (appPortalUrl && !iframeUrl) {
      // Set the iframe URL only once when it's first loaded and iframeUrl is not yet set
      setIframeUrl(appPortalUrl.url);
    }
  }, [appPortalUrl, error, iframeUrl]);

  if (error) {
    return <div>Error loading the App Portal. Please try again later.</div>;
  }

  if (!iframeUrl) {
    return <div>Loading...</div>;
  }

  return (
    <iframe 
      src={iframeUrl}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Svix App Portal"
    />
  );
};