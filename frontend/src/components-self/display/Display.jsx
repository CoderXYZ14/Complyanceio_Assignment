import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus } from "lucide-react";
import { countryData } from "@/utils/countryData.js";
import axios from "axios";
import {
  showErrorToast,
  showSuccessToast,
} from "@/utils/toast/toastNotifications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Display = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [qaList, setQaList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [userData, setUserData] = useState({
    username: "Guest",
    role: "Viewer",
    country: "AF",
  });

  const getUserData = () => {
    try {
      const data = JSON.parse(localStorage.getItem("userData"));

      // Return just the user data we need
      return {
        username: data.username || "Guest",
        role: data.role || "Viewer",
        country: data.country || "AF",
      };
    } catch (error) {
      console.error("Error parsing userData:", error);
      return {
        username: "Guest",
        role: "Viewer",
        country: "AF",
      };
    }
  };

  // Get accessToken separately
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const data = getUserData();

    console.log("Setting userData from localStorage:", data);

    setSelectedCountry(data.country);
    console.log(data.country);

    console.log("New Selected", selectedCountry);

    setUserData(data);
    // const fetchData = async () => {
    //   await fetchQAData();
    // };
    // fetchData();
  }, []); // Run once on mount

  useEffect(() => {
    if (selectedCountry !== null) {
      const fetchData = async () => {
        await fetchQAData();
      };
      fetchData();
    }
  }, [selectedCountry]);
  // Derive admin status from current userData
  const isAdmin = userData.role === "Admin";
  const fetchQAData = async () => {
    setIsLoading(true);

    try {
      console.log("selected", selectedCountry);
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/v1/data?country=${selectedCountry}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (response.data?.data) {
        setQaList(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showErrorToast(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = async (newCountry) => {
    try {
      console.log(newCountry);
      setSelectedCountry(newCountry);

      await fetchQAData();
      showSuccessToast("Country updated successfully");
    } catch (error) {
      console.error("Failed to update country:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to update country"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/data`,
        {
          question: question.trim(),
          answer: answer.trim(),
          country: selectedCountry,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (response.data && response.data.data) {
        setQaList([response.data.data, ...qaList]);
        setQuestion("");
        setAnswer("");
        showSuccessToast("Question and answer added successfully");
      }
    } catch (error) {
      console.error("Error details:", error);
      showErrorToast(error.response?.data?.message || "Failed to create Q&A");
    } finally {
      setIsLoading(false);
    }
  };
  const startEditing = (qa) => {
    setEditingId(qa._id);
    setEditQuestion(qa.question);
    setEditAnswer(qa.answer);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const handleSaveEdit = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/data/${id}`,
        {
          question: editQuestion,
          answer: editAnswer,
          country: selectedCountry,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.data) {
        setQaList(
          qaList.map((item) => (item._id === id ? response.data.data : item))
        );
        setEditingId(null);
        setEditQuestion("");
        setEditAnswer("");
        showSuccessToast("Question and answer updated successfully");
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to update Q&A");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an existing Q&A
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);

      const response = await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/data/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );

      setQaList(qaList.filter((item) => item._id !== id));
      showSuccessToast("Question and answer deleted successfully");
    } catch (error) {
      console.error("Delete error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        token: accessToken ? "Token exists" : "No token",
      });
      showErrorToast(error.response?.data?.message || "Failed to delete Q&A");
    } finally {
      setIsLoading(false);
    }
  };

  // Also add this useEffect to verify token availability
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("AccessToken in localStorage:", token ? "exists" : "missing");
    if (!token) {
      showErrorToast("No access token found. Please login again.");
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-blue-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 px-4 py-6 space-y-6">
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-purple-700 to-blue-800 dark:text-white bg-clip-text text-transparent">
          Welcome, {userData.username}!
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Role: <span className="font-semibold">{userData.role}</span>
          </span>

          {isAdmin ? (
            <Select
              onValueChange={handleCountryChange}
              value={selectedCountry}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px] bg-white/80 dark:bg-gray-800/90">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countryData.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      {country.emoji} {country.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Country: <span className="font-semibold">{userData.country}</span>
            </span>
          )}
        </div>
      </div>

      {/* Question Input Card */}
      <Card className="max-w-2xl mx-auto shadow-xl bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 via-purple-700 to-blue-800 dark:text-white bg-clip-text text-transparent">
            Add New Question & Answer
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question
              </label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question..."
                className="text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Answer
              </label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="min-h-[100px] text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-9 text-sm bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                       hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 
                       dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700
                       text-white shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  Add Question & Answer <Plus className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Questions & Answers
        </h2>

        {isLoading && qaList.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        ) : (
          qaList.map((qa) => (
            <Card
              key={qa._id}
              className="bg-white/90 dark:bg-gray-800/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            >
              <CardContent className="p-4 space-y-3">
                {editingId === qa._id ? (
                  <div className="space-y-3">
                    <Input
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                      className="text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      disabled={isLoading}
                      placeholder="Question"
                    />
                    <Textarea
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      className="min-h-[100px] text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none"
                      disabled={isLoading}
                      placeholder="Answer"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleSaveEdit(qa._id)}
                        className="text-sm bg-green-500 hover:bg-green-600 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                        className="text-sm"
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="space-y-2 flex-1">
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            Q: {qa.question}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            A: {qa.answer}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Added: {new Date(qa.createdAt).toLocaleString()}
                          {qa.createdBy && ` by ${qa.createdBy.username}`}
                        </p>
                      </div>
                      {isAdmin && (
                        <div className="flex space-x-2 sm:ml-4 w-full sm:w-auto justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(qa)}
                            className="border-gray-300 dark:border-gray-700"
                            disabled={isLoading}
                          >
                            <Pencil className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-xs">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(qa._id)}
                            className="border-gray-300 dark:border-gray-700"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-xs">Delete</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}

        {!isLoading && qaList.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            No questions added yet. Be the first to add one!
          </p>
        )}
      </div>
    </div>
  );
};

export default Display;
