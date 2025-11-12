import { useCallback, useEffect, useState } from "react";
import Layout from "./layout.jsx";
import { FaArrowRight, FaMicrophoneLines } from "react-icons/fa6";
import { useUser } from "../contexts/UserContext.jsx";
import { toast } from "react-hot-toast";
import PronounceButton from "../components/PronounceButton.jsx";

function StoryMode() {
  const [transcript, setTranscript] = useState("");
  const [micActive, setMicActive] = useState(false);
  const { languageCode, user, language, refreshUserData } = useUser();
  const [storyPart, setStoryPart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [final_feedback, setFinalFeedback] = useState(null);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [image, setImage] = useState(null);

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
        refreshUserData();
      }
    } catch (error) {
      console.error("Error incrementing score:", error);
      toast.error("Error incrementing score!");
    }
  };

  const getNewPart = async (transcript) => {
    if (!transcript) {
      alert("Please speak into the microphone and then click next");
      return;
    }

    try {
      setLoading(true);
      setStoryPart(null);
      setTranscript("");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/storynarrate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          transcription: transcript,
        }),
      });

      if (!res.ok) {
        // console.log(res);
        throw new Error("Error fetching cards");
      }

      // console.log(res);
      const data = await res.json();

      // console.log(data);

      if (data.next_part) {
        setStoryPart(data.next_part);

        const im = await query({
          inputs:
            "Generate pixel art style image for:" + data.next_part.description,
        });
        const url = URL.createObjectURL(im);
        setImage(url);

        // console.log(url);
      }

      if (data.current_feedback) {
        setCurrentFeedback(data.current_feedback);
      }

      if (data.final_feedback) {
        setFinalFeedback(data.final_feedback);
        incrementScore();
        refreshUserData();
        setImage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Sorry. Coud not fetch story part. Try again.");
    } finally {
      setLoading(false);
    }
  };

  function handleOnRecord() {
    setMicActive(true);
    setTranscript("");
    const speechRecognition =
      window.speechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();

    recognition.onresult = async function (event) {
      const transcript = event.results[0][0].transcript;
      // console.log(transcript);
      setTranscript(transcript);
      setMicActive(false);
    };

    recognition.lang = languageCode;

    recognition.start();
  }

  const startStory = useCallback(
    async (retryCount = 3) => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/storystart`, {
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
          throw new Error("Error fetching story");
        }

        const data = await res.json();

        if (!data?.current_part) {
          throw new Error("No story part received");
        }

        setStoryPart(data.current_part);
        const im = await query({
          inputs:
            "Generate pixel art style image for:" +
            data.current_part.description,
        });
        const url = URL.createObjectURL(im);
        setImage(url);
      } catch (error) {
        if (retryCount > 0) {
          toast("Getting your story ready...");
          setTimeout(() => startStory(retryCount - 1), 1500);
        } else {
          toast.error("Unable to start story. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [language, user.username]
  );
  async function query(data) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HF}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.blob();
      return result;
    } catch (error) {
      // console.log(error);
      toast.error("Sorry. Image generation failed. Try again.");
    }
  }

  useEffect(() => {
    startStory();
  }, [startStory]);

  return (
    <>
      <Layout>
        <div className="h-screen">
          <div className="relative h-full">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{
                backgroundImage: `url(${image || ""})`,
              }}
            />

            {/* Progress Indicator */}
            {storyPart && !final_feedback && (
              <div className="relative z-10 pt-4 px-8">
                <div className="bg-white bg-opacity-90 rounded-lg p-4 inline-block">
                  <span className="text-2xl font-jersey">
                    Part {storyPart.part_number} of 5
                  </span>
                </div>
              </div>
            )}

            {/* Content Container */}
            {loading && (
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-[20px] border-b-[20px] border-white"></div>
              </div>
            )}
            {!loading && storyPart && (
              <div className="relative z-10 h-full flex flex-col justify-end pb-40 font-jersey">
                <div className="flex justify-center space-x-8 px-10">
                  {/* Left Dialog Box */}
                  <div className="w-1/2 bg-neutral-200 bg-opacity-90 rounded-lg p-6 shadow-lg">
                    <PronounceButton text={storyPart.content} />
                    <div className="text-3xl mb-4 text-gray-900">
                      {storyPart.content}
                    </div>
                    <div className="text-zinc-700 text-2xl">
                      {storyPart.translation}
                    </div>
                  </div>

                  {/* Right Dialog Box with Record Button */}
                  <div className="w-1/2 bg-white bg-opacity-90 rounded-lg p-6 shadow-lg flex flex-col">
                    <div className="flex-grow min-h-[100px] text-zinc-700 text-2xl">
                      {transcript
                        ? transcript
                        : "Tap the microphone! I'm listening..."}
                    </div>
                    <div className="flex justify-center mt-4 space-x-4">
                      <button
                        onClick={handleOnRecord}
                        className={`bg-red-700 hover:bg-red-600 text-white rounded-xl p-4 shadow-lg transition-colors duration-200 ${
                          micActive ? "animate-pulse" : ""
                        }`}
                      >
                        <FaMicrophoneLines size={24} />
                      </button>
                      <button
                        disabled={!transcript}
                        onClick={() => getNewPart(transcript)}
                        className={`bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-4 shadow-lg transition-colors duration-200 ml-4 ${
                          !transcript && "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <FaArrowRight size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Feedback Card */}
                  {currentFeedback && (
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg w-64">
                      <h3 className="text-xl text-gray-900 mb-2">
                        Quick Feedback
                      </h3>
                      <div className="text-lg text-gray-700 mb-2">
                        {currentFeedback?.pronunciation_feedback}
                      </div>
                      <div>
                        <h4 className="text-md text-red-600 mb-1">Improve:</h4>
                        <ul className="list-disc pl-4 text-sm text-gray-600">
                          {currentFeedback?.improvement_areas?.map(
                            (area, index) => (
                              <li key={index}>{area}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {!loading && final_feedback && (
              <div className="relative z-10 h-full flex justify-center items-center font-jersey">
                <div className="bg-white bg-opacity-90 rounded-lg p-8 shadow-lg max-w-3xl w-full">
                  <h2 className="text-4xl text-center mb-6 text-gray-900">
                    Performance Review
                  </h2>

                  <div className="mb-6">
                    <div className="text-3xl text-center text-blue-600 font-bold mb-2">
                      Overall Score: {final_feedback?.overall_score}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl text-green-700 mb-3">
                      Key Strengths:
                    </h3>
                    <ul className="list-disc pl-6 text-xl text-gray-700">
                      {final_feedback?.key_strengths.map((strength, index) => (
                        <li key={index} className="mb-2">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl text-red-700 mb-3">
                      Areas for Improvement:
                    </h3>
                    <p className="text-xl text-gray-700">
                      {final_feedback?.main_improvement_areas.map(
                        (area, index) => (
                          <span key={index} className="mb-2">
                            {area}
                          </span>
                        )
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl text-blue-700 mb-3">
                      Learning Recommendations:
                    </h3>
                    <ul className="list-disc pl-6 text-xl text-gray-700">
                      {final_feedback?.learning_recommendations.map(
                        (recommendation, index) => (
                          <li key={index} className="mb-2">
                            {recommendation}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default StoryMode;
