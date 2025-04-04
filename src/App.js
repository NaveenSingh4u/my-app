import { useState } from "react";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("Write a short motivational quote.");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAPI = async () => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        body: JSON.stringify({
          inputText: inputText,
          textGenerationConfig: {
            maxTokenCount: 1000,
            stopSequences: [],
            temperature: 0.5,
            topP: 0.9,
          },
        }),
      };

      const response = await fetch("https://burvm9t2de.execute-api.us-west-2.amazonaws.com/ibm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const parsedBody = JSON.parse(data.body);
      const outputText = parsedBody.results?.[0]?.outputText || "No response generated.";
      setResponseText(outputText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">IBM AI Text Generator</h2>
      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Enter prompt..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={callAPI}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      {error && <p className="text-red-500">Error: {error}</p>}
      {responseText && (
        <div className="p-3 mt-3 bg-gray-100 rounded">
          <strong>Response:</strong> {responseText}
        </div>
      )}
    </div>
  );
}

export default App;
