import React from "react";
import { Moon, Sun, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "@/store/themeSlice";
import { Link, useLocation } from "react-router-dom";
import useLogout from "@/custom-hooks/useLogout";

const Header = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/signin" || location.pathname === "/signup";

  const isLoggedIn = useSelector((state) => state.auth.status);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  const handleThemeToggle = () => dispatch(toggleDarkMode());
  const logout = useLogout();

  return (
    <header
      className={`border-b transition-colors duration-200 shadow-lg backdrop-blur-sm ${
        darkMode
          ? "bg-gradient-to-r from-black via-gray-900 to-purple-700"
          : "bg-gradient-to-r from-gray-100 via-blue-100 to-purple-200 shadow-sm"
      }`}
    >
      <div className="mx-auto px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Website Name wrapped in Link */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div
                className={`p-1.5 sm:p-2 rounded-lg shadow-lg ${
                  darkMode
                    ? "bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700"
                    : "bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"
                }`}
              >
                <Database size={16} className="text-white" />
              </div>
              <span
                className={`text-xs sm:text-sm font-bold bg-clip-text text-transparent ${
                  darkMode
                    ? "bg-gradient-to-r from-white to-gray-300"
                    : "bg-gradient-to-r from-gray-800 via-purple-700 to-blue-800"
                }`}
              >
                DataManager
              </span>
            </Link>
          </div>
          {!isAuthRoute && (
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Theme Toggle */}
              <div
                onClick={handleThemeToggle}
                className="cursor-pointer p-1 sm:p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {darkMode ? (
                  <Sun size={18} className="text-amber-100" />
                ) : (
                  <Moon size={18} className="text-indigo-700" />
                )}
              </div>

              {/* Auth Buttons */}
              {!isLoggedIn ? (
                <>
                  <Link to="/signin">
                    <Button
                      variant="ghost"
                      className={`transition-all duration-300 ${
                        darkMode
                          ? "text-white hover:bg-gray-800"
                          : "text-gray-700 hover:bg-white/50 hover:shadow-md"
                      } text-xs sm:text-sm`}
                      // onClick={handleLogin}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      className={`transition-all duration-300 shadow-md ${
                        darkMode
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          : "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white hover:shadow-lg"
                      } text-xs sm:text-sm`}
                      // onClick={handleLogin}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className={`transition-all duration-300 ${
                    darkMode
                      ? "text-white hover:bg-gray-800"
                      : "text-gray-700 hover:bg-white/50 hover:shadow-md"
                  } text-xs sm:text-sm`}
                  onClick={logout}
                >
                  Logout
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
