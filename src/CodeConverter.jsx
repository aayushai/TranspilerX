import React, { useState, useEffect } from 'react';
import { Editor, loader } from '@monaco-editor/react';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { FaMoon, FaSun } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { registerPythonSuggestions } from './suggestions/python';
import { registerRubySuggestions } from './suggestions/ruby';
import { registerRustSuggestions } from './suggestions/rust';
import { registerGoSuggestions } from './suggestions/go';
import { registerPHPSuggestions } from './suggestions/php';
import { registerJavaSuggestions } from './suggestions/java';
import { registerCSharpSuggestions } from './suggestions/csharp';
import { registerCSuggestions } from './suggestions/c';
import { registerCppSuggestions } from './suggestions/cpp';
import { registerSwiftSuggestions } from './suggestions/swift';

const CodeConverter = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [inputLang, setInputLang] = useState('python');
  const [outputLang, setOutputLang] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    go: `package main

import "fmt"

func main() {
    fmt.Println("Hello World")
}`,
    php: `<?php
  echo "Hello World";
?>`
  };

  useEffect(() => {
    setInputCode(defaultCodes[inputLang]);
  }, [inputLang]);

  useEffect(() => {
    loader.init().then(monaco => {
      monaco.editor.defineTheme('off-white-theme', {
        base: 'vs',
        inherit: true,
        rules: [{ background: 'fafafa' }],
        colors: {
          'editor.background': '#FDF6F5',
          'editor.foreground': '#000000',
          'editor.lineHighlightBackground': '#f0f0f0',
          'editorCursor.foreground': '#000000',
          'editorIndentGuide.background': '#e8e8e8',
          'editorLineNumber.foreground': '#b3b3b3',
        }
      });

      registerPythonSuggestions(monaco);
      registerRubySuggestions(monaco);
      registerRustSuggestions(monaco);
      registerPHPSuggestions(monaco);
      registerCSharpSuggestions(monaco);
      registerCSuggestions(monaco);
      registerGoSuggestions(monaco);
      registerJavaSuggestions(monaco);
      registerCppSuggestions(monaco);
      registerSwiftSuggestions(monaco);
    });
  }, []); 

  const handleConvert = async () => {
    if (!inputCode.trim()) {
      toast.error('Input code cannot be empty!', {
        position: "top-right",
        className: isDarkMode ? 'dark-toast' : '',
        autoClose: 2000,
      });
      return;
    }

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen space-y-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <button onClick={toggleTheme} className="absolute top-4 right-4">
        {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-800" />}
      </button>
      <h1 className={`text-3xl font-bold text-center p-2`}>Input Your Code</h1>
      <div className={`flex flex-col md:flex-row w-[80%] space-x-0 md:space-x-4 space-y-4 md:space-y-0 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className={`flex w-full md:w-[50%] flex-col p-4 shadow-md rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <label className={`font-bold mb-2`}>Input Language</label>
          <select
            className={`border ${isDarkMode ? 'border-white' : 'border-black'} ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} p-2 mb-4 rounded-md`}
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
            <option value="go">Go</option>
            <option value="php">PHP</option>
          </select>

          <Editor
            height="400px"
            defaultLanguage={inputLang}
            language={inputLang}
            theme={isDarkMode ? "vs-dark" : "off-white-theme"}
            value={inputCode}
            onChange={(value) => setInputCode(value)}
          />
        </div>

        <div className={`flex w-full md:w-[50%] flex-col p-4 shadow-md rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <label className={`text-black font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Output Language</label>
          <select
            className={`border ${isDarkMode ? 'border-white' : 'border-black'} ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} p-2 mb-4 rounded-md`}
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
            <option value="go">Go</option>
            <option value="php">PHP</option>
          </select>

          <div className="relative h-[400px]">
            <Editor
              height="100%"
              defaultLanguage={outputLang}
              language={outputLang}
              theme={isDarkMode ? "vs-dark" : "off-white-theme"}
              value={outputCode}
              options={{ readOnly: true }}
            />
          </div>
        </div>
      </div>

      <button onClick={handleConvert} className={`w-40 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition duration-300 ease-in-out`}>
        {loading ? <ClipLoader size={20} color={"#fff"} /> : 'Convert'}
      </button>
      <ToastContainer />
    </div>
  );
};

export default CodeConverter;
