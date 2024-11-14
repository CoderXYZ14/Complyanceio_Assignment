import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Header } from "./components-self";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import { showErrorToast } from "./utils/toast/toastNotifications";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.accessToken) {
          dispatch(
            login({ userData: parsedData, accessToken: parsedData.accessToken })
          );
        } else {
          showErrorToast("Access token missing. Please log in again.");
          dispatch(logout());
          navigate("/login");
        }
      } catch (error) {
        showErrorToast("Failed to parse user data. Please log in again.");
        dispatch(logout());
        console.error("Failed to parse user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col w-full">
      <Header />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
      <Outlet />
    </div>
  );
}

export default App;
