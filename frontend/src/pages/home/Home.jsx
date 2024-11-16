import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-blue-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 px-2 py-1 sm:p-4">
      <div className="text-center space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-purple-700 to-blue-800 dark:text-white bg-clip-text text-transparent">
          Welcome to Our DataManager
        </h1>

        <Link to="/signup">
          <Button
            className="h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                         hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 
                         dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700
                         text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
