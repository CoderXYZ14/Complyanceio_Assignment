import { useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "@/store/authSlice";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toast/toastNotifications";

const useLogout = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found.");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/users/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      dispatch(logout());
      localStorage.removeItem("userData");
      localStorage.removeItem("accessToken");

      showSuccessToast("User logged out successfully !!");
    } catch (error) {
      showErrorToast("Error logging out. Please try again.");
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  return handleLogout;
};

export default useLogout;
