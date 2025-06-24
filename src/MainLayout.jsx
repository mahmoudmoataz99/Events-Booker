import React from 'react'
import { Outlet } from "react-router";
import Navbar from "./Components/NavBar";
import Footer from './Components/Footer';


function MainLayout() {
  return (
    <>
      <Navbar />
      <section>
        <Outlet />
      </section>
      <Footer />
    </>
  )
}

export default MainLayout
