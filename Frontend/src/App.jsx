import ChatBox from "./components/chatBox";

function App() {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome to Our Support Portal
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <p className="text-gray-600 mb-4">
            Browse our knowledge base or chat with our AI assistant for help.
          </p>
        </div>
      </div>

      {/* ChatBox automatically  bottom-right me aa jayega */}
      <ChatBox />
    </div>
  );
}

export default App;
