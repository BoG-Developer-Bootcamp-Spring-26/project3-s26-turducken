import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserContext } from "../context/UserContext";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [userId, setUserId] = useState<string | null>(null);
  return (
    <UserContext.Provider value={{ userId, setUserId}}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}