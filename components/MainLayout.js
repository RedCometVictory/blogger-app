import { useEffect, useState } from 'react';
import Footer from './Footer';
import NavBar from './NavBar';
import AsideNav from './UI/Aside';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MainLayout = ({children}) => {
  const [openAsideMenu, setOpenAsideMenu] = useState(false);
  const openMenuHandler = () => {
    setOpenAsideMenu(openAsideMenu => !openAsideMenu);
  };
  return (
    <section className="root-container">
      <NavBar  openMenu={openAsideMenu} setOpenMenu={openMenuHandler} />
      <div className="main-layout">
        <AsideNav openMenu={openAsideMenu} />
        <main className='main-container'>{children}</main>
        {/* <ToastContainer
          position='top-center'
          autoClose={5000}
          closeOnClick
          pauseOnHover
        /> */}
      </div>
      <Footer />
    </section>
  );
};
export default MainLayout;