import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserContext, UserProvider } from "../context/UserContext";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}