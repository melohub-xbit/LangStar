import { useState } from "react";
import Layout from "./layout.jsx";
import { FaMicrophoneLines } from "react-icons/fa6";
import { useUser } from "../contexts/UserContext.jsx";
import { toast } from "react-hot-toast";
import PronounceButton from "../components/PronounceButton.jsx";

function Pixey() {
  const [selectedInput, setSelectedInput] = useState("chat");
  const [transcript, setTranscript] = useState("");
  const [micActive, setMicActive] = useState(false);
  const { languageCode, language, user } = useUser();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectChange = (event) => {
    setOutput(null);
    setSelectedInput(event.target.value);
    setTranscript("");
  };

  function handleOnRecord() {
    setMicActive(true);
    setTranscript("");
    const speechRecognition =
      window.speechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();

    recognition.onresult = async function (event) {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      setMicActive(false);
      processTranscript(transcript);
    };

    recognition.lang = languageCode;
    recognition.start();
  }

  const processTranscript = async (transcript) => {
    try {
      setIsLoading(true);
      switch (selectedInput) {
        case "tongue-twister":
          await handleTongueTwister(transcript);
          break;
        case "chat":
          await handleChat(transcript);
          break;
        case "grammar-buddy":
          await handleGrammarCheck(transcript);
          break;
        default:
          toast.error("Please select a mode first!");
      }
    } catch (error) {
      toast.error("Error processing your speech");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTongueTwister = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tongue_twisters`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language }),
        }
      );

      // console.log(response);

      if (!response.ok) {
        throw new Error("Try again. Maybe its not the language selected.");
      }

      const data = await response.json();

      // console.log(data);

      if (data.data) {
        const combinedText = data.data.tongue_twisters
          .map(
            (twister) =>
              `Text: ${twister.text}\nPronunciation: ${twister.pronunciation}\nTranslation: ${twister.translation}`
          )
          .join("\n\n");
        setOutput(data.data);
        // console.log(combinedText);
      }
    } catch (error) {
      toast.error("Coulnd not fetch tongue twisters. Try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async (transcript) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/language_teacher`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: transcript, language }),
        }
      );

      if (!response.ok) {
        throw new Error("Try again. Maybe its not the language selected.");
      }

      const data = await response.json();

      // console.log(data);
      if (data) {
        setOutput(data.data);
      } else {
        toast.error("Try again. Maybe its not the language selected.");
      }
    } catch (error) {
      toast.error("Error processing your speech");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrammarCheck = async (transcript) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/speech_analysis`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcription: transcript,
            language,
            username: user.username,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      // console.log(data);
      if (data) {
        setOutput(data);
      } else {
        toast.error("Failed to process grammar check. Try again.");
      }
    } catch (error) {
      toast.error("Error processing your speech");
    } finally {
      setIsLoading(false);
    }
  };

  const TongueTwisterOutput = () => {
    return (
      <div className="space-y-4">
        {output.tongue_twisters.map((twister, index) => (
          <div key={index} className="bg-white/50 p-4 rounded-lg">
            <PronounceButton text={twister.text} />
            <p className="text-xl font-bold text-indigo-800">{twister.text}</p>
            <p className="text-lg text-gray-700">
              Pronunciation: {twister.pronunciation}
            </p>
            <p className="text-md text-gray-600">
              Translation: {twister.translation}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Add this component for chat responses
  const ChatOutput = () => {
    return (
      <div className="space-y-4">
        <div className="bg-white/50 p-4 rounded-lg">
          <p className="text-xl text-indigo-800">{output.response}</p>
          <div className="mt-4">
            <p className="font-bold text-gray-700">Examples:</p>
            <ul className="list-disc pl-4">
              {Array.isArray(output?.examples) ? (
                output.examples.map((example, index) => (
                  <li key={index} className="text-gray-600">
                    {example}
                  </li>
                ))
              ) : (
                <li className="text-gray-600">{output.examples}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const GrammarOutput = () => {
    return (
      <div className="bg-white/50 p-4 rounded-lg">
        <div className="mb-4">
          <p className="font-bold text-gray-700">Original:</p>
          <p className="text-lg text-red-600">{output.original}</p>
        </div>
        <div>
          <p className="font-bold text-gray-700">Correction:</p>
          <p className="text-lg text-green-600">{output.correct_form}</p>
        </div>
      </div>
    );
  };

  const renderOutput = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-900"></div>
        </div>
      );
    }

    switch (selectedInput) {
      case "tongue-twister":
        return <TongueTwisterOutput />;
      case "chat":
        return <ChatOutput />;
      case "grammar-buddy":
        return <GrammarOutput />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="h-screen flex items-center justify-center font-jersey text-2xl">
        <div className="bg-neutral-200/80 p-6 rounded-lg shadow-md w-[4/5] md:w-[50%] font-bold text-indigo-900">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl">How can I assist you?</span>
            <select
              className="w-[40%] p-2 border rounded-md bg-neutral-200/80 hover:bg-neutral-100/100 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
              value={selectedInput}
              onChange={handleSelectChange}
            >
              <option value="chat">Chat</option>
              <option value="tongue-twister">Tongue Twister</option>
              <option value="grammar-buddy">Grammar Buddy</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="h-[30vh] border rounded-md p-6 bg-neutral-200/70 hover:bg-neutral-100/70">
              {selectedInput !== "tongue-twister" && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex-grow">
                    {transcript
                      ? transcript
                      : "Tap the microphone to start speaking..."}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={handleOnRecord}
                      className={`bg-red-700 hover:bg-red-600 text-white rounded-xl p-4 shadow-lg transition-colors duration-200 ${
                        micActive ? "animate-pulse" : ""
                      }`}
                    >
                      <FaMicrophoneLines size={24} />
                    </button>
                  </div>
                </div>
              )}
              {selectedInput === "tongue-twister" && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex-grow text-center">
                    Click the button below to get a tongue twister!
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={handleTongueTwister}
                      className="bg-indigo-700/90 hover:bg-indigo-600/90 text-white rounded-xl p-4 shadow-lg transition-colors duration-200"
                    >
                      Get Tongue Twister
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="h-[30vh] border rounded-md p-6 bg-neutral-200/70 hover:bg-neutral-100/70 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-900"></div>
                </div>
              ) : // output
              output ? (
                renderOutput()
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Pixey;
