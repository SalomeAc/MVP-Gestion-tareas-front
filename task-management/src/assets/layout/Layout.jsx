/* eslint-disable react/prop-types */
import { useEffect } from "react";
import "./Layout.css";
import Footer from "./footer/Footer";
import Header from "./header/Header";

const Layout = ({ children }) => {
  useEffect(() => {
    document.body.classList.add("app-layout-active");

    return () => {
      document.body.classList.remove("app-layout-active");
    };
  }, []);

  return (
    <div className="layout">
      <Header />
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;