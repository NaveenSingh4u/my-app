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
    <div className="container">
      <div className="card">
        <h2>💡 IBM AI Text Generator</h2>
        <input
          type="text"
          className="input-box"
          placeholder="Enter a prompt..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button className="btn" onClick={callAPI} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>

        {error && <p className="error">⚠️ {error}</p>}

        {responseText && (
          <div className="response-box">
            <strong>Response:</strong>
            <p>{responseText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
