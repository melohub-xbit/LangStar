import PronounceButton from "../components/PronounceButton.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import Layout from "./layout.jsx";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function DailyLearning() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [flippedStates, setFlippedStates] = useState(Array(10).fill(false));
  const [scoredCards, setScoredCards] = useState(new Set());

  const { language, user, refreshUserData } = useUser();

  const getCards = useCallback(
    async (retryCount = 3) => {
      try {
        // console.log("Fetching cards...");
        toast("Fetching cards...");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dailies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language,
            username: user.username,
          }),
        });

        if (!res.ok) {
          throw new Error("Error fetching cards");
        }

        const data = await res.json();
        if (data.dailies.cards.length) {
          setCards(data.dailies.cards);
          refreshUserData();
        } else {
          throw new Error("No cards received");
        }
      } catch (error) {
        if (retryCount > 0) {
          toast.loading("Retrying to fetch cards...");
          setTimeout(() => getCards(retryCount - 1), 1500);
        } else {
          toast.error(
            "Unable to load learning cards. Please refresh the page."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [language, user.username, refreshUserData]
  );

  useEffect(() => {
    getCards();
  }, [getCards]);
  const incrementScore = async (cardId) => {
    // Check if this card has already been scored
    if (scoredCards.has(cardId)) {
      return;
    }

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
            score: 1,
          }),
        }
      );

      if (response.ok) {
        // Add card to scored set
        setScoredCards((prev) => new Set(prev).add(cardId));
        toast.success("Score incremented successfully");
      }
    } catch (error) {
      // console.error("Error incrementing score:", error);
      toast.error("Failed to update score");
    }
  };

  const handleClick = (index) => {
    setFlippedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    // Increment score when card is flipped for the first time
    incrementScore(cards[index].id || index);
  };

  return (
    <Layout>
      <div className="p-12 min-h-screen font-jersey">
        {loading && (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-[20px] border-b-[20px] border-white"></div>
          </div>
        )}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="relative h-80 hover:scale-105"
                style={{ perspective: "1000px" }}
                onClick={() => handleClick(index)}
              >
                <div
                  className={`absolute w-full h-full transition-transform duration-70 cursor-pointer`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flippedStates[index]
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                  }}
                >
                  {/* Front of card */}
                  <div
                    className="absolute w-full h-full rounded-xl bg-blue-900/70 backdrop-blur-md p-6 shadow-xl"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <h2 className="text-4xl font-bold text-white mb-4">
                        {card.new_concept} • {card.concept_pronunciation}
                      </h2>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-indigo-200">
                          Click to flip
                        </span>
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="z-10"
                        >
                          <PronounceButton
                            text={card.new_concept}
                            colour="text-white"
                          ></PronounceButton>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute w-full h-full rounded-xl bg-neutral-200/70 backdrop-blur-md p-6 shadow-xl"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="flex flex-col h-full">
                      <h3 className="text-3xl font-bold text-indigo-900 mb-2">
                        {card.english}
                      </h3>
                      <p className="text-indigo-700 mb-4">{card.meaning}</p>
                      <div className="mt-auto">
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <p className="text-indigo-900 font-medium mb-2">
                            {card.example} • {card.example_pronunciation}
                          </p>
                          <p>{card.translation}</p>
                          <div onClick={(e) => e.stopPropagation()}>
                            <PronounceButton
                              text={card.example}
                              colour="text-indigo-900"
                            ></PronounceButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default DailyLearning;
