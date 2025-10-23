import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Live from "./pages/Live";
import CategoriesPage from "./pages/CategoriesPage";
import BlogDetails from "./pages/BlogDetails";
import WriterPage from "./pages/WriterPage";
import { LoginPage, SignupPage } from "./pages";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import useStore from "./store";
import { useEffect } from "react";
import Contact from "./pages/Contact"; // Add this import
import About from "./pages/About"; // Add this import


function Layout () {
  return (
    <div className="w-full flex flex-col
     min-h-screen px-4 md:px-10 2xl:px-29=8">
    { /* <Navbar/> */}
    <Navbar />


     <div className="flex-1">
      <Outlet />
     </div>
     <Footer/>
    </div>
  );
}



function App() {
  // guard against useStore() being null/undefined during startup
  const store = useStore() || {};
  const isLoading = store?.isLoading ?? false;
  const setIsLoading = typeof store?.setIsLoading === "function" ? store.setIsLoading : null;
  const user = store?.user ?? null;

  // helper to run async work and toggle loader only when setter exists
  const withLoader = async (workFn) => {
    try {
      setIsLoading && setIsLoading(true);
      return await workFn();
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

  // Apply theme class to <html> for Tailwind dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (store?.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [store?.theme]);

  return (
    <>
      {/* global loader shown only when store.isLoading is true */}
      {isLoading && <div className="global-loader">Loading…</div>}

      <div className="App">
        <main>
          <div className="w-full min-h-screen relative bg-white dark:bg-[#020b19]">
            <Routes>
              <Route element={<Layout />}> 
                <Route path="/" element={<Home />} />
                <Route path="/category" element={<CategoriesPage />} />
                <Route path="/live" element={<Live />} />
                <Route path="/:slug/:id?" element={<BlogDetails />} />
                <Route path="/writer/:id" element={<WriterPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} /> {/* Add this line */}
              </Route>
              {/* Auth routes */}
              <Route path="/sign-up" element={<SignupPage />} />
              <Route path="/sign-in" element={<LoginPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
