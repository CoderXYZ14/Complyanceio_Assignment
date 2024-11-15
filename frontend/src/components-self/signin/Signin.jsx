import React from "react";
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

const Signin = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Sign in form submitted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-blue-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <Card className="w-full max-w-md shadow-xl bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-purple-700 to-blue-800 dark:text-white bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label className="dark:text-white">Username</Label>
              <Input
                placeholder="Enter your username"
                className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label className="dark:text-white">Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col">
            <Button
              className="w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                       hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 
                       dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700
                       text-white shadow-md hover:shadow-lg transition-all duration-300"
              type="submit"
            >
              Sign In <LogIn className="ml-2" />
            </Button>
            <p className="text-sm font-light text-slate-600 dark:text-slate-300 mt-2">
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
