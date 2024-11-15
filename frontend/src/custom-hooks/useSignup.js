import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/store/authSlice";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toast/toastNotifications";

const useSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    try {
      const registerResponse = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/users/register`,
        formData
      );
      console.log("registerResponse", registerResponse);
      const loginData = {
        username: formData.username,
        password: formData.password,
      };
      console.log("loginData", loginData);
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/users/login`,
        loginData
      );
      console.log("loginResponse", loginResponse);
      dispatch(login({ userData: loginResponse.data.data }));
      localStorage.setItem("userData", JSON.stringify(loginResponse.data.data));
      localStorage.setItem("accessToken", loginResponse.data.data.accessToken);
      showSuccessToast("Account created and logged in successfully");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error creating account or logging in. Please try again.";
      showErrorToast(errorMessage);
      console.error("Error creating account or logging in:", error);
    }
  };

  return { handleSignup };
};

export default useSignup;
