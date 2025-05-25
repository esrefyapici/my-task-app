import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col mx-40">
      <Navbar />
      <main className="">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
