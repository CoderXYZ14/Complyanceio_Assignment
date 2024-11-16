import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus } from "lucide-react";

const QADisplay = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [qaList, setQaList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  const getUserData = () => {
    try {
      const data = JSON.parse(localStorage.getItem("userData") || "{}");
      return {
        username: data.username || "Guest",
        role: data.role || "Viewer",
        country: data.country || "Unknown",
      };
    } catch (error) {
      console.error("Error parsing userData:", error);
      return { username: "Guest", role: "Viewer", country: "Unknown" };
    }
  };

  const userData = getUserData();
  const isAdmin = userData.role === "Admin";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newQA = {
      id: Date.now(),
      question: question.trim(),
      answer: answer.trim(),
      timestamp: new Date().toISOString(),
    };

    setQaList([...qaList, newQA]);
    setQuestion("");
    setAnswer("");
  };

  const handleEdit = (id) => {
    const qaItem = qaList.find((item) => item.id === id);
    setEditingId(id);
    setEditQuestion(qaItem.question);
    setEditAnswer(qaItem.answer);
  };

  const handleSaveEdit = (id) => {
    setQaList(
      qaList.map((item) =>
        item.id === id
          ? { ...item, question: editQuestion, answer: editAnswer }
          : item
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setQaList(qaList.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-blue-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 px-4 py-6 space-y-6">
      {/* Welcome Section - Outside the box */}
      <div className="text-center space-y-2 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-purple-700 to-blue-800 dark:text-white bg-clip-text text-transparent">
          Welcome, {userData.username}!
        </h1>
        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mr-3">
          Role: <span className="font-semibold">{userData.role}</span>
        </span>
        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Country: <span className="font-semibold">{userData.country}</span>
        </span>
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
              />
            </div>

            <Button
              type="submit"
              className="w-full h-9 text-sm bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                       hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 
                       dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700
                       text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              Add Question & Answer <Plus className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Questions List - Outside the box */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Questions & Answers
        </h2>

        {qaList.map((qa) => (
          <Card
            key={qa.id}
            className="bg-white/90 dark:bg-gray-800/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md"
          >
            <CardContent className="p-4 space-y-3">
              {editingId === qa.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <Input
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                    className="text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <Textarea
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    className="min-h-[100px] text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none"
                  />
                  <Button
                    onClick={() => handleSaveEdit(qa.id)}
                    className="text-sm bg-green-500 hover:bg-green-600 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                // Display Mode
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
                        Added: {new Date(qa.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-2 sm:ml-4 w-full sm:w-auto justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(qa.id)}
                          className="border-gray-300 dark:border-gray-700"
                        >
                          <Pencil className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-xs">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(qa.id)}
                          className="border-gray-300 dark:border-gray-700"
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
        ))}

        {qaList.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            No questions added yet. Be the first to add one!
          </p>
        )}
      </div>
    </div>
  );
};

export default QADisplay;
