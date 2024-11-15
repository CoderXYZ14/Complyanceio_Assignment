import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { login } from "@/store/authSlice";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toast/toastNotifications";

const useSignin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignin = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/users/login`,
        formData
      );
      dispatch(login({ userData: response.data.data }));
      localStorage.setItem("userData", JSON.stringify(response.data.data));
      localStorage.setItem("accessToken", response.data.data.accessToken); // Corrected this line
      showSuccessToast("Logged in successfully!");
      navigate("/");
    } catch (error) {
      showErrorToast(error);
      console.error("Error logging in:", error);
    }
  };

  return { handleSignin };
};

export default useSignin;
