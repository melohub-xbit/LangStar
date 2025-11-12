// src/HomePage.jsx
import { Link } from "react-router-dom";
import Layout from "./layout.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { useEffect, useState } from "react";

function HomePage() {
  const { language, user, updateLanguage, refreshUserData, totalScore } =
    useUser();
  const [currentLeaderboard, setCurrentLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setInterval(() => {
      fetch(`${import.meta.env.VITE_API_URL}/health`).then((response) =>
        response.json()
      );
    }, 100000);
  }, []);

  useEffect(() => {
    const getLeaderboard = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/leaderboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          language,
          username: user.username,
        }),
      });
      // console.log(res);
      const data = await res.json();
      setCurrentLeaderboard(data.leaderboard);
      setLoading(false);
    };

    getLeaderboard();
    refreshUserData();
  }, [language, user, refreshUserData]);

  return (
    <Layout>
      <div className="flex p-4 md:p-12 min-h-screen w-full bg-none text-black font-array">
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 w-full">
          {/* Left Content Area */}
          <div className="space-y-4 w-full md:w-[75%]">
            {/* Banner/Header */}
            <div className="bg-blue-900/70 backdrop-blur-md text-white rounded-lg p-6 md:h-[300px] w-full flex flex-col justify-center">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl md:text-6xl font-medium">
                  Welcome to LangStar, {user.username}
                </h1>
                <div className="flex flex-col md:flex-row md:space-x-2 items-start md:items-center gap-2">
                  <span className="text-lg">
                    Which language do you want to learn?
                  </span>
                  <select
                    value={language}
                    onChange={(e) => updateLanguage(e.target.value)}
                    className="px-4 py-2 text-white rounded-md bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all w-full md:w-auto"
                  >
                    {/* ... existing options ... */}
                    <option value="Telugu" className="text-black">
                      Telugu
                    </option>
                    <option value="Gujarati" className="text-black">
                      Gujarati
                    </option>
                    <option value="Spanish" className="text-black">
                      Spanish
                    </option>
                    <option value="French" className="text-black">
                      French
                    </option>
                    <option value="Italian" className="text-black">
                      Italian
                    </option>
                    <option value="German" className="text-black">
                      German
                    </option>
                    <option value="Japanese" className="text-black">
                      Japanese
                    </option>
                  </select>
                </div>
                <div className="flex justify-between text-2xl md:text-4xl w-full font-jersey">
                  <h1>{totalScore} Points</h1>
                </div>
              </div>
              <Link
                to="/pixey"
                className="mt-4 md:absolute md:bottom-6 md:right-6"
              >
                <button className="w-full md:w-auto px-6 py-3 bg-white/20 hover:bg-white/30 rounded-md backdrop-blur-sm border border-white/30 transition-all text-xl md:text-2xl">
                  Pixey
                </button>
              </Link>
            </div>

            {/* Content Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/dailyLearning"
                className="transform transition-transform hover:scale-105"
              >
                <div
                  className="aspect-square rounded-lg shadow-lg bg-cover bg-center"
                  style={{ backgroundImage: "url(/buttons/daily.png)" }}
                ></div>
              </Link>
              <Link
                to="/storyMode"
                className="transform transition-transform hover:scale-105"
              >
                <div
                  className="aspect-square rounded-lg shadow-lg bg-cover bg-center"
                  style={{ backgroundImage: "url(/buttons/story.png)" }}
                ></div>
              </Link>
              <Link
                to="/memoryGame"
                className="transform transition-transform hover:scale-105"
              >
                <div
                  className="aspect-square rounded-lg shadow-lg bg-cover bg-center"
                  style={{ backgroundImage: "url(/buttons/memory.png)" }}
                ></div>
              </Link>
            </div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="bg-neutral-200/70 backdrop-blur-md rounded-lg shadow-md w-full md:w-[25%] h-[80vh] flex flex-col">
            <h1 className="text-neutral-900 text-2xl p-4 mx-auto">
              Leaderboard
            </h1>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              </div>
            ) : (
              <div className="w-full px-4 font-jersey overflow-y-auto">
                {currentLeaderboard?.map((user) => (
                  <div
                    key={user.rank}
                    className="flex justify-between items-center py-3 border-b border-neutral-500 text-neutral-900 hover:bg-neutral-300/50 rounded-md px-2 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-md">#{user.rank}</span>
                      <span className="text-md">{user.username}</span>
                    </div>
                    <span className="text-md font-bold">{user.points}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
