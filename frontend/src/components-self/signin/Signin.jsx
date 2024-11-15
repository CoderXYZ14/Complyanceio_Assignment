import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import useSignin from "@/custom-hooks/useSignin";

const Signin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { handleSignin } = useSignin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //console.log("formData", formData);
    handleSignin(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-blue-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 px-2 py-1 sm:p-4">
      <Card className="w-[320px] sm:w-full sm:max-w-md shadow-xl bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1 p-3 sm:p-6">
            <CardTitle className="text-base sm:text-xl font-bold bg-gradient-to-r from-gray-800 via-purple-700 to-blue-800 dark:text-white bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-[10px] sm:text-sm dark:text-gray-400">
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2 sm:space-y-4 p-3 sm:p-6">
            {/* Username Field */}
            <div className="space-y-1 sm:space-y-2">
              <Label className="text-[11px] sm:text-sm dark:text-white">
                Username
              </Label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="text-[11px] sm:text-sm h-7 sm:h-9 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1 sm:space-y-2">
              <Label className="text-[11px] sm:text-sm dark:text-white">
                Password
              </Label>
              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Enter your password"
                className="text-[11px] sm:text-sm h-7 sm:h-9 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col p-3 sm:p-6">
            <Button
              className="w-full h-7 sm:h-9 text-[11px] sm:text-sm bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                       hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 
                       dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700
                       text-white shadow-md hover:shadow-lg transition-all duration-300"
              type="submit"
            >
              Sign In <LogIn className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <p className="text-[10px] sm:text-sm font-light text-slate-600 dark:text-slate-300 mt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-violet-600 dark:text-violet-400 hover:underline"
              >
                Register here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signin;
