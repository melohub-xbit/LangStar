import { useUser } from "../contexts/UserContext.jsx";
import Layout from "./layout.jsx";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const Card = ({ word, pronunciation, isFlipped, isMatched, onClick }) => {
  // console.log(pronunciation);
  return (
    <div
      onClick={onClick}
      className={`aspect-square cursor-pointer perspective-1000 relative transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? "rotate-y-180" : ""
        }`}
    >
      <div className="absolute w-full h-full backface-hidden rounded-lg shadow-lg bg-blue-900/70 hover:bg-blue-900/80 hover:scale-105 backdrop-blur-md transition-colors"></div>
      <div
        className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-lg flex flex-col items-center justify-center p-2 text-center shadow-lg ${isMatched
          ? "bg-green-500/95 text-white"
          : "bg-white/60 backdrop-blur-md text-black"
          }`}
      >
        <span className="text-base sm:text-lg md:text-2xl font-medium mb-2">
          {word}
        </span>
        <span className="text-sm font-medium mb-2">{pronunciation}</span>
      </div>
    </div>
  );
};

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [wordPairs, setWordPairs] = useState([]);
  const { user, language } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;
    if (isGameActive) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive]);

  const fetchAndInitializeGame = async (retryCount = 3) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/memorypairs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          username: user.username,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch word pairs");

      const data = await res.json();
      if (!data.words?.pairs?.length) throw new Error("No word pairs received");

      const pairs = data.words.pairs;
      setWordPairs(pairs);

      const allWords = pairs.flat();
      const newCards = [];
      for (let i = 0; i < allWords.length; i++) {
        if (i % 3 === 1) {
          // English word
          newCards.push({
            id: i,
            word: allWords[i],
            pronunciation: "",
            isFlipped: false,
            isMatched: false,
          });
        } else if (i % 3 === 0) {
          // Foreign word with pronunciation
          newCards.push({
            id: i,
            word: allWords[i],
            pronunciation: allWords[i + 2],
            isFlipped: false,
            isMatched: false,
          });
        }
      }


      const shuffledWords = [...newCards].sort(() => Math.random() - 0.5);
      setCards(shuffledWords);
      setFlippedCards([]);
      setMatchedPairs(0);
      setTime(0);
      setIsGameActive(false);
      setHasGameStarted(false);
    } catch (error) {
      if (retryCount > 0) {
        setTimeout(() => fetchAndInitializeGame(retryCount - 1), 1000);
      } else {
        toast.error("Unable to load game. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (clickedCard) => {
    if (!hasGameStarted) {
      setHasGameStarted(true);
      setIsGameActive(true);
    }

    if (
      isLocked ||
      flippedCards.includes(clickedCard) ||
      clickedCard.isMatched ||
      flippedCards.length === 2
    )
      return;

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const updatedFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(updatedFlippedCards);

    if (updatedFlippedCards.length === 2) {
      setIsLocked(true);
      const [firstCard, secondCard] = updatedFlippedCards;

      const isMatch = wordPairs.some(
        (pair) =>
          pair.includes(firstCard.word) &&
          pair.includes(secondCard.word) &&
          firstCard.word !== secondCard.word
      );

      if (isMatch) {
        setTimeout(() => {
          const matchedCards = cards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs((prev) => prev + 1);
          setIsLocked(false);

          if (matchedPairs + 1 === wordPairs.length) {
            setIsGameActive(false);
            // Add score increment here - can adjust the score value as needed
            incrementScore();
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = cards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const incrementScore = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/updatescore`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            language: language,
            score: 5,
          }),
        }
      );

      if (response.ok) {
        toast.success("Score incremented successfully!");
      }
    } catch (error) {
      console.error("Error incrementing score:", error);
      toast.error("Error incrementing score!");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    fetchAndInitializeGame();
  }, []);

  const isGameComplete =
    matchedPairs === wordPairs.length && wordPairs.length > 0;

  return (
    <Layout>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-[20px] border-b-[20px] border-white"></div>
        </div>
      ) : (
        <div className="max-w-[95%] sm:max-w-[85%] md:max-w-[75%] mx-auto p-3 sm:p-4 md:p-6 font-jersey">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 gap-3">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-white/40 hover:bg-white/60 rounded-xl p-2 backdrop-blur-md">
              Time: {formatTime(time)}
            </div>
            <button
              onClick={fetchAndInitializeGame}
              className="text-xl sm:text-2xl md:text-3xl font-bold bg-white/40 hover:bg-white/60 rounded-xl px-4 py-2 backdrop-blur-md"
            >
              Restart Game
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 md:gap-8">
            {cards.map((card) => (
              <Card
                key={card.id}
                word={card.word}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={() => handleCardClick(card)}
                pronunciation={card.pronunciation}
              />
            ))}
          </div>
          {!isGameActive && isGameComplete && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-md p-8 rounded-lg text-center shadow-xl transform scale-100 transition-all">
                <h2 className="text-3xl font-bold mb-4">Congratulations! 🎉</h2>
                <p className="text-xl">
                  You completed the game in {formatTime(time)}!
                </p>
                <button
                  onClick={fetchAndInitializeGame}
                  className="mt-6 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default MemoryGame;
