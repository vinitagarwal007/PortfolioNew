"use client";
import Navbar from "./pages/navbar/Navbar";
import Landing from "./pages/landing/Landing";
import Overview from "./pages/overview/Overview";
import Work from "./pages/work/Work";
import Project from "./pages/project/Project";
import useElementOnScreen from "@/app/hooks/useElementOnScreen";
import { useEffect, useState, useRef, useMemo } from "react";
import ContactForm from "./pages/contact/Contact";
import Splash from "./pages/spash/Splash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from 'next/navigation';
export default function Home({ Component, pageProps }) {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
  };
  const [homeRef, homeIsVisible] = useElementOnScreen(options);
  const [aboutRef, aboutIsVisible] = useElementOnScreen(options);
  const [workRef, workIsVisible] = useElementOnScreen(options);
  const [contactRef, contactIsVisible] = useElementOnScreen(options);
  const [selection, setSelection] = useState(1);

  useEffect(() => {
    if (homeIsVisible) setSelection(1);
    if (aboutIsVisible) setSelection(2);
    if (workIsVisible) setSelection(3);
    if (contactIsVisible) setSelection(4);
  }, [homeIsVisible, aboutIsVisible, workIsVisible, contactIsVisible]);

  const [splash, setSplash] = useState(true);
  setTimeout(() => {
    setSplash(false);
  }, [3000]);

  const [done, setDone] = useState(false)
  const params = useSearchParams()
  const result = JSON.parse(params.get('result'))
  if (result?.Success && !done) {
    toast("Mail Sent Successfully", {
      toastId: "one",
    });
    setDone(true)
  }
  return (
    <>
      <Splash />
      {!splash && (
        <>
          <Navbar
            selection={selection}
            homeRef={homeRef}
            aboutRef={aboutRef}
            workRef={workRef}
            contactRef={contactRef}
          ></Navbar>
          <Landing innerRef={homeRef} contactRef={contactRef}></Landing>
          <Overview innerRef={aboutRef}></Overview>
          <Work innerRef={workRef}></Work>
          <Project></Project>
          <ContactForm innerRef={contactRef}></ContactForm>
        </>
      )}
      <ToastContainer />
    </>
  );
}
