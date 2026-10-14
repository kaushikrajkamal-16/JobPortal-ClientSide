import { Outlet } from "react-router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

// Layout for public pages (Home, Jobs, Companies, Login...)
// <Outlet /> = the current page shows here, between Navbar and Footer
export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className='min-h-screen'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
