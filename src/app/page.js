"use client";
import Navbar from './pages/navbar/Navbar'
import Landing from './pages/landing/Landing'
import Overview from './pages/overview/Overview'
import Work from './pages/work/Work'
export default function Home({Component, pageProps}) {
  return (
    <>
    <Navbar></Navbar>
    <Landing></Landing>
    <Overview></Overview>
    <Work></Work>
    </>
  )
}
