import React, { useState, useEffect, useRef } from 'react';
import { Editor, loader } from '@monaco-editor/react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { FaMoon, FaSun } from 'react-icons/fa';
import { shikiToMonaco } from '@shikijs/monaco';
import { createHighlighter } from 'shiki';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useShikiMonaco = () => {
  const [isReady, setIsReady] = useState(false);
  const highlighterRef = useRef(null);

  useEffect(() => {
    const initializeShikiMonaco = async () => {
      const monaco = await loader.init();
      const highlighter = await createHighlighter({
        themes: ['vitesse-dark', 'vitesse-light'],
        langs: [
          'javascript',
          'typescript',
          'python',
          'java',
          'cpp',
          'c',
          'csharp',
          'ruby',
          'rust',
          'swift',
        ],
      });

      highlighterRef.current = highlighter;

      // Register languages
      [
        'javascript',
        'typescript',
        'python',
        'java',
        'cpp',
        'c',
        'csharp',
        'ruby',
        'rust',
        'swift',
      ].forEach((lang) => monaco.languages.register({ id: lang }));

      // Register themes and provide syntax highlighting
      shikiToMonaco(highlighter, monaco);

      setIsReady(true);
    };

    initializeShikiMonaco();
  }, []);

  return { isReady, highlighter: highlighterRef.current };
};

import ClipLoader from "react-spinners/ClipLoader";
import { FaMoon, FaSun } from 'react-icons/fa'; 
const CodeConverter = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [inputLang, setInputLang] = useState('python');
  const [outputLang, setOutputLang] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isReady } = useShikiMonaco();

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
    swift: `print("Hello World")`,
  };

  useEffect(() => {
    setInputCode(defaultCodes[inputLang]);
  }, [inputLang]);

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme('off-white-theme', {
        base: 'vs', // light base
        inherit: true,
        rules: [{ background: 'fafafa' }],
        colors: {
          'editor.background': '#FDF6F5',
          'editor.foreground': '#000000',
          'editor.lineHighlightBackground': '#f0f0f0',
          'editorCursor.foreground': '#000000',
          'editorIndentGuide.background': '#e8e8e8',
          'editorLineNumber.foreground': '#b3b3b3',
        },
      });
    });
  }, []);

  const handleConvert = async () => {
    if (!inputCode.trim()) {
      // Check if inputCode is empty
      toast.error('Input code cannot be empty!', {
        // Display error toast
        position: 'top-right', // Position the toast in the top right corner
        className: isDarkMode ? 'dark-toast' : '', // Apply dark-toast class if in dark mode
        autoClose: 2000, // Set the toast to close after 2 seconds
      });
      return; // Exit the function if input is empty
    }

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
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: requestData,
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

  if (!isReady) {
    return <div>Loading editor...</div>;
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen space-y-6 `}>
      <div className="flex justify-end items-center w-full p-4">
    
      <button onClick={toggleTheme} className=" ">
        {isDarkMode ? <FaSun className="text-yellow-500 text-xl" /> : <FaMoon className="text-white text-xl" />}
      </button>
        
      </div>
      { (
        <>
          <h1 className={`text-3xl font-bold text-center p-2`}>Let's Begin</h1>
          <div className={`flex flex-col md:flex-row w-[80%] space-x-0 md:space-x-4 space-y-4 md:space-y-0 bg-transparent`}>
            <div className={`flex w-full md:w-[50%] flex-col p-4 shadow-md rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <label className={`font-bold mb-2  ${isDarkMode ? 'text-white' : 'text-black'} `}>Input Language</label>
              <select 
                className={`border ${isDarkMode ? 'border-white' : 'border-black'} ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} p-2 mb-4 rounded-md`}
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
                theme={isDarkMode ? 'vitesse-dark' : 'vitesse-light'}
                value={inputCode}
                onChange={(value) => setInputCode(value)}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  cursorStyle: 'line',
                  automaticLayout: true,
                }}
              />
            </div>

            <div
              className={`flex w-full md:w-[50%] flex-col p-4 shadow-md rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            >
              <label
                className={`text-black font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                Output Language
              </label>
              <select
                className={`border ${isDarkMode ? 'border-white' : 'border-black'} ${
                  isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
                } p-2 mb-4 rounded-md`}
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

              <div className="relative h-[400px]">
                <Editor
                  height="100%"
                  defaultLanguage={outputLang}
                  language={outputLang}
                  theme={isDarkMode ? 'vitesse-dark' : 'vitesse-light'}
                  value={outputCode}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    cursorStyle: 'line',
                    automaticLayout: true,
                  }}
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <ClipLoader
                      color={isDarkMode ? '#ffffff' : '#000000'}
                      loading={true}
                      size={50}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center"> 
            
            <button className="px-8 py-2 rounded-full bg-[#26a3bc] text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 mb-4"
            onClick={handleConvert} 
              disabled={loading}>
                  {loading ? 'Converting...' : 'Convert'}
            </button>
          </div>
        </>
     ) }

      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      <style>
        {`
          .dark-toast {
            background-color: black !important; /* Set background to black */
            color: white !important; /* Set text color to white */
          }
        `}
      </style>
    </div>
  );
};

export default CodeConverter;
