import { useSelector, useDispatch } from "react-redux";
import { addMessage, setLoading } from "../redux/chatSlice";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function ChatBox() {
  const messages = useSelector((state) => state.chat.messages);
  const loading = useSelector((state) => state.chat.loading);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

 const handleSend = async () => {
  if (!input.trim()) return;

  const updatedMessages = [...messages, { sender: "user", text: input }];

  dispatch(addMessage({ sender: "user", text: input }));
  dispatch(setLoading(true));
  setInput("");

  // Create Gemini-compatible history
  const history = updatedMessages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  try {
    const response = await axios.post(`${BASE_URL}/api/chat`, {
      contents: history,
    });

    const botReply = response.data.reply;
    dispatch(addMessage({ sender: "bot", text: botReply }));
  } catch (error) {
    dispatch(
      addMessage({
        sender: "bot",
        text: "Sorry, I'm having trouble connecting. Please try again later.",
      })
    );
  }

  dispatch(setLoading(false));
};
 

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div
          className="bg-blue-600 text-white rounded-t-lg px-4 py-3 shadow-lg cursor-pointer flex items-center"
          onClick={() => setIsMinimized(false)}
        >
          <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
          <span>Support Assistant</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-auto"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 z-50 shadow-2xl rounded-t-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center">
        <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
        <span className="font-medium">Support Assistant</span>
        <div className="ml-auto flex space-x-2">
          <button
            className="text-white hover:text-gray-200"
            onClick={() => setIsMinimized(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="bg-white h-96 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-lg text-gray-700">
              How can I help you today?
            </h3>
            <p className="text-sm mt-1">
              Ask me anything about our products or services
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-2 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-gray-50 border-t border-gray-200 p-3">
        <div className="flex items-center space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-2 rounded-full ${
              input.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by Yash Ved
        </p>
      </div>
    </div>
  );
}
