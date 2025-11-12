import { createContext, useState, useContext, useEffect } from "react";
// import toast from "react-hot-toast";

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [languageCode, setLanguageCode] = useState("es-ES");
  const [language, setLanguage] = useState("Spanish");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    // console.log(storedLanguage);
    if (storedLanguage) {
      updateLanguage(storedLanguage);
    } else {
      updateLanguage("Spanish");
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [language]);

  const login = async (username, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    // console.log(res);

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log(res);

    if (res.ok) {
      setUser(null);
      setTotalScore(0);
      localStorage.removeItem("user");
    } else {
      console.error("Logout failed");
    }
  };

  const signup = async (username, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    // console.log(res);

    if (!res.ok) {
      throw new Error("Signup failed");
    }

    const data = await res.json();

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const updateLanguage = (newLanguage) => {
    if (newLanguage === "Japanese") {
      setLanguageCode("ja-JP");
    } else if (newLanguage === "Spanish") {
      setLanguageCode("es-ES");
    } else if (newLanguage === "French") {
      setLanguageCode("fr-FR");
    } else if (newLanguage === "Italian") {
      setLanguageCode("it-IT");
    } else if (newLanguage === "German") {
      setLanguageCode("de-DE");
    } else if (newLanguage === "Gujarati") {
      setLanguageCode("gu-IN");
    } else if (newLanguage === "Telugu") {
      setLanguageCode("te-IN");
    } else {
      setLanguageCode("en-US");
    }

    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const refreshUserData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getscores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          language,
        }),
      });
      if (response.ok) {
        const newScores = await response.json();

        const x =
          newScores.languages["FRENCH"] +
          newScores.languages["SPANISH"] +
          newScores.languages["JAPANESE"] +
          newScores.languages["GERMAN"] +
          newScores.languages["ITALIAN"] +
          newScores.languages["TELUGU"] +
          newScores.languages["GUJARATI"];
        setTotalScore(x);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const value = {
    user,
    language,
    languageCode,
    login,
    logout,
    signup,
    updateLanguage,
    refreshUserData,
    totalScore,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
