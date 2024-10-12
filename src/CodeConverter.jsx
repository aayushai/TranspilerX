import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp'; // must load after prism-c
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-swift';

const CodeConverter = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('Click Convert');
  const [inputLang, setInputLang] = useState('python');
  const [outputLang, setOutputLang] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [highlightedInputCode, setHighlightedInputCode] = useState('');
  const [highlightedOutputCode, setHighlightedOutputCode] = useState('');

  const defaultCodes = {
    python: `print("Hello World")`,
    javascript: `console.log("Hello World")`,
    java: `System.out.println("Hello World");`,
    cpp: `#include <iostream>
  int main() {
    std::cout << "Hello World";
  }`,
    c: `#include <stdio.h>
  int main() {
    printf("Hello World");
    return 0;
  }`,
    csharp: `Console.WriteLine("Hello World");`,
    ruby: `puts "Hello World"`,
    typescript: `console.log("Hello World")`,
    rust: `fn main() {
    println!("Hello World");
  }`,
    swift: `print("Hello World")`
  };
  

  // Set default input code based on the selected language
  useEffect(() => {
    setInputCode(defaultCodes[inputLang]);
  }, [inputLang]);

  useEffect(() => {
    highlightCode(inputCode, inputLang, setHighlightedInputCode);
  }, [inputCode, inputLang]);

  useEffect(() => {
    highlightCode(outputCode, outputLang, setHighlightedOutputCode);
  }, [outputCode, outputLang]);

  const highlightCode = (code, language, setHighlightedCode) => {
    const grammar = Prism.languages[language] || Prism.languages.javascript;
    const highlighted = Prism.highlight(code, grammar, language);
    setHighlightedCode(highlighted);
  };

  const handleConvert = async () => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text: `Convert this ${inputLang} [${inputCode}] to ${outputLang}. Do not give explanation, just give the code.`
              }
            ]
          }
        ]
      };
      setLoading(true);
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_API_KEY}`,
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: requestData
      });

      if (response) {
        setLoading(false);
      }

      const output = response.data.candidates[0].content.parts[0].text;
      const cleanedOutput = output.replace(/```[a-z]*\n?|\n```/g, '').trim();
    
      setOutputCode(cleanedOutput);
    } catch (error) {
      console.error('Error converting code:', error);
      setLoading(false);  
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      { (
        <>
          <h1 className='text-3xl font-bold text-center p-2'>Input Your Code</h1>
          <div className='flex flex-col md:flex-row w-[80%] space-x-0 md:space-x-4 space-y-4 md:space-y-0'> 
            <div className="flex w-full md:w-[50%] flex-col p-4 shadow-md rounded-lg bg-white"> 
              <label className="text-black font-bold mb-2">Input Language</label>
              <select 
                className="bg-gray-200 text-black p-2 mb-4 rounded-md"
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}>
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

              <div className="mt-4">
                <h3 className="text-black font-bold mb-2">Highlighted Input Code:</h3>
                <pre className="p-4 bg-gray-800 rounded-md overflow-x-auto max-h-[200px]">
                  <code dangerouslySetInnerHTML={{ __html: highlightedInputCode }} />
                </pre>
              </div>
            </div>

            <div className="flex w-full md:w-[50%] flex-col p-4 shadow-md rounded-lg bg-white">
              <label className="text-black font-bold mb-2">Output Language</label>
              <select 
                className="bg-gray-200 text-black p-2 mb-4 rounded-md" 
                value={outputLang}
                onChange={(e) => setOutputLang(e.target.value)}>
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

              <div className="relative h-[400px]">
                <Editor
                  height="100%"
                  defaultLanguage={outputLang}
                  language={outputLang}
                  theme="vs-dark"
                  value={outputCode}
                  options={{
                    readOnly: true
                  }}
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <ClipLoader color="#ffffff" loading={true} size={50} />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-black font-bold mb-2">Highlighted Output Code:</h3>
                <pre className="p-4 bg-gray-800 rounded-md overflow-x-auto max-h-[200px]">
                  <code dangerouslySetInnerHTML={{ __html: highlightedOutputCode }} />
                </pre>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center"> 
            <button 
              className={`px-6 py-2 mb-3 md:mb-0 ${loading ? 'bg-gray-400' : 'bg-transparent'} border text-white font-semibold rounded-md`} 
              onClick={handleConvert} 
              disabled={loading}>
              {loading ? 'Converting...' : 'Convert'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CodeConverter;
