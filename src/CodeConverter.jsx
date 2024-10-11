import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import CircleLoader from "react-spinners/CircleLoader";

const CodeConverter = () => {
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [inputLang, setInputLang] = useState("python");
  const [outputLang, setOutputLang] = useState("javascript");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text: `Convert this ${inputLang} [${inputCode}] to ${outputLang}. Do not give explanation, just give the code.`,
              },
            ],
          },
        ],
      };
      setLoading(true);
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
          import.meta.env.VITE_API_KEY
        }`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      });

      if (response) {
        setLoading(false);
      }

      const output = response.data.candidates[0].content.parts[0].text;
      const cleanedOutput = output.replace(/```[a-z]*\n?|\n```/g, "").trim();

      setOutputCode(cleanedOutput);
    } catch (error) {
      console.error("Error converting code:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      {loading ? (
        <CircleLoader
          color="purple"
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
        />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mt-4 md:mt-4 p-2">
            Input Your Code
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-[80%]">
            <div className="flex md:w-[50%] w-[80%] flex-col p-4 shadow-md rounded-lg bg-white">
              <label className="text-black font-bold mb-2">
                Input Language
              </label>
              <select
                className="bg-gray-200 text-black p-2 mb-4 rounded-md"
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="python">Python</option>
                <option value="csharp">C#</option>
                <option value="ruby">Ruby</option>
                <option value="typescript">TypeScript</option>
                <option value="rust">Rust</option>
                <option value="swift">Swift</option>
              </select>

              <Editor
                height="400px"
                defaultLanguage={inputLang}
                language={inputLang}
                theme="vs-dark"
                value={inputCode}
                onChange={(value) => setInputCode(value)}
              />
            </div>

            <div className="flex md:w-[50%] w-[80%] flex-col p-4 shadow-md rounded-lg bg-white">
              <label className="text-black font-bold mb-2">
                Output Language
              </label>
              <select
                className="bg-gray-200 text-black p-2 mb-4 rounded-md"
                value={outputLang}
                onChange={(e) => setOutputLang(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="python">Python</option>
                <option value="csharp">C#</option>
                <option value="ruby">Ruby</option>
                <option value="typescript">TypeScript</option>
                <option value="rust">Rust</option>
                <option value="swift">Swift</option>
              </select>

              <Editor
                height="400px"
                defaultLanguage={outputLang}
                language={outputLang}
                theme="vs-dark"
                value={outputCode}
                options={{
                  readOnly: true,
                }}
              />
            </div>
          </div>

          <div className="w-full mb-4 md:mb-0 flex justify-center">
            <button
              className={`px-6 py-2 ${
                loading ? "bg-gray-400" : "bg-transparent"
              } border text-white font-semibold rounded-md`}
              onClick={handleConvert}
              disabled={loading}
            >
              {loading ? "Converting..." : "Convert"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CodeConverter;
