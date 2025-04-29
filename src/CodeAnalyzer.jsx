import React, { useState } from "react";
import "./CodeAnalyzer.css";
import { GoogleGenAI } from "@google/genai";

const CodeAnalyzer = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    setLoading(true);
    setResult("");

    const prompt = `
      Analyze the time and space complexity of the following code:
  
      \`\`\`
      ${code}
      \`\`\`
  
      Provide the analysis in the following format and don't give anything else:
      Time Complexity: ...
      Space Complexity: ...
    `;

    try {
      const ai = new GoogleGenAI({
        apiKey: "AIzaSyAn7ytRgrVBwJgu3hbGIUdTitSzhPp98nM",
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const rawResult = response.text || "No valid response received.";

      const timeComplexity =
        rawResult
          .match(/Time Complexity:([^]*?)(?=Space Complexity|$)/)?.[0]
          ?.trim() || "Time Complexity: Not found";
      const spaceComplexity =
        rawResult
          .match(/Space Complexity:([^]*?)(?=Time Complexity|$)/)?.[0]
          ?.trim() || "Space Complexity: Not found";

      setResult(`${timeComplexity}\n\n${spaceComplexity}`);
    } catch (err) {
      console.error("Error:", err);
      setResult("Error analyzing code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Big O Calculator</h1>
      <p style={{ marginLeft: "10px" }}>
        Calculate the time and space complexity of your code using Big O
        notation
      </p>
      <div className="content">
        <div className="left">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            placeholder="Paste your code here..."
          ></textarea>
          <button onClick={analyzeCode} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        <div className="right">
          {result && (
            <div className="result">
              <strong>Result:</strong>
              <p>{result}</p>
            </div>
          )}
          <div className="image-section" style={{ margin: "auto" }}>
            <img
              src="https://dkq85ftleqhzg.cloudfront.net/algo_book/images/big_o/big_o_chart2.png"
              width={"500px"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAnalyzer;
