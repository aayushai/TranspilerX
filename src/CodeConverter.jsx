import React, { useState, useEffect, useRef } from 'react';
import { Editor, loader } from '@monaco-editor/react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { shikiToMonaco } from '@shikijs/monaco';
import { createHighlighter } from 'shiki';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DarkMode, LightMode, ContentCopy } from '@mui/icons-material';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
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

const CodeConverter = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [inputLang, setInputLang] = useState('python');
  const [outputLang, setOutputLang] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
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
    let saved = localStorage.getItem('SavedLang');
    if (saved) {
      saved = JSON.parse(saved);
    } else {
      saved = {
        Input: 'python',
        Output: 'javascript',
      };
    }
    
      setInputLang(saved.Input);
      setInputCode(defaultCodes[saved.Input]);
      setOutputLang(saved.Output);
  }, []); 

  function handleChange(langType, newLang) {
    let updated = JSON.parse(localStorage.getItem('SavedLang')) || {
      Input: 'python',
      Output: 'javascript',
    };
    if (langType === 'input') {
      setInputLang((prevInputLang) => {
        updated.Input = newLang;
        localStorage.setItem('SavedLang', JSON.stringify(updated)); // Update localStorage
        setInputCode(defaultCodes[newLang]);
        console.log('Lang Change');
        return newLang; // Return the new input language
      });
    } else if (langType === 'output') {
      setOutputLang((prevOutputLang) => {
        updated.Output = newLang;
        localStorage.setItem('SavedLang', JSON.stringify(updated)); // Update localStorage
        setOutputCode(''); // After cahnging the output code refreshes the output code
        return newLang; // Return the new output language
      });
    }
  }

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
      toast.error('Input code cannot be empty!', {
        position: 'top-right',
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

const handleCopy = (code, fieldType) => {
  if (!code || !code.trim()) {
    toast.error(`${fieldType} field is empty!`, {
      position: 'top-right',
      className: isDarkMode ? 'dark-toast' : '',
      autoClose: 2000,
    });
    return;
  }

  navigator.clipboard.writeText(code).then(() => {
    toast.success('Copied!', {
      autoClose: 2000,
      className: isDarkMode ? 'dark-toast' : '',
      position: 'top-right',
    });
  }).catch(err => {
    console.error('Error copying text:', err);
    toast.error('Failed to copy!', {
      position: 'top-right',
      autoClose: 2000,
    });
  });
};

  if (!isReady) {
    return <div>Loading editor...</div>;
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const options = [
    'javascript',
    'java',
    'cpp',
    'c',
    'python',
    'csharp',
    'ruby',
    'typescript',
    'rust',
    'swift',
  ];

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen space-y-6 `}>
      <div className="flex justify-end items-center w-full p-4">
        <button onClick={toggleTheme}>
          {isDarkMode ? (
            <LightMode className="text-yellow-400 text-xl" />
          ) : (
            <DarkMode className="text-white text-xl" />
          )}
        </button>
      </div>
      {
        <>
          <h1 className={`text-3xl font-semi-bold text-center p-2`}>Let's Begin</h1>
          <div
            className={`flex flex-col md:flex-row w-[80%] space-x-0 md:space-x-4 space-y-4 md:space-y-0 bg-transparent`}
          >
            <div
              className={`flex w-full md:w-[50%] flex-col p-4 shadow-md rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            >
              <label className={`font-bold mb-2  ${isDarkMode ? 'text-white' : 'text-black'} `}>
                Input Language
              </label>
              <div className="flex items-center space-x-4">
                <Menu as="div" className="relative inline-block text-left w-full">
                  <MenuButton
                    className={`border ${
                      isDarkMode
                        ? 'border-white bg-black text-white'
                        : 'border-black bg-white text-black'
                    } p-2 rounded-md w-full mb-3`}
                  >
                    {inputLang.charAt(0).toUpperCase() + inputLang.slice(1)}
                  </MenuButton>

                  <MenuItems
                    className={`absolute mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-10
            ${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    {options.map((option) => (
                      <MenuItem key={option}>
                        <button
                          onClick={() => {
                            handleChange('input', option);
                          }}
                          className={`w-full text-left px-4 py-2 ${
                            isDarkMode
                              ? 'hover:bg-blue-500 bg-black text-white '
                              : 'bg-white text-black hover:bg-blue-500'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>

                <button
                  className="ml-5 mb-4 bg-gray-500 text-white rounded-md flex items-center justify-center"
                  onClick={() => handleCopy(inputCode, 'Input')}
                  style={{
                    backgroundColor: '#42a4bd',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                  }}
                >
                  <ContentCopy /> {/* Add the copy icon */}
                </button>
              </div>

              <Editor
                height="400px"
                defaultLanguage={inputLang}
                language={inputLang}
                theme={isDarkMode ? 'vitesse-dark' : 'vitesse-light'}
                value={inputCode}
                onChange={(value) => setInputCode(value)}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: true,
                  fontSize: 16,
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
              <div className="flex items-center space-x-4">
                <Menu as="div" className="relative inline-block text-left w-full">
                  <MenuButton
                    className={`border ${
                      isDarkMode
                        ? 'border-white bg-black text-white'
                        : 'border-black bg-white text-black'
                    } p-2 rounded-md w-full mb-3`}
                  >
                    {outputLang.charAt(0).toUpperCase() + outputLang.slice(1)}
                  </MenuButton>

                  <MenuItems
                    className={`absolute mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-10
            ${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    {options.map((option) => (
                      <MenuItem key={option}>
                        <button
                          onClick={() => {
                            handleChange('output', option);
                          }}
                          className={`w-full text-left px-4 py-2 ${
                            isDarkMode
                              ? 'hover:bg-blue-500 bg-black text-white '
                              : 'bg-white text-black hover:bg-blue-500'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>

                <button
                  className="ml-5 mb-4 bg-gray-500 text-white rounded-md flex items-center justify-center"
                  onClick={() => handleCopy(outputCode, 'Output')}
                  style={{
                    backgroundColor: '#42a4bd',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                  }}
                >
                  <ContentCopy /> {/* Add the copy icon */}
                </button>
              </div>
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
                    scrollBeyondLastLine: true,
                    fontSize: 16,
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
            <button
              className="px-8 py-2 rounded-full bg-[#26a3bc] text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 mb-4"
              onClick={handleConvert}
              disabled={loading}
            >
              {loading ? 'Converting...' : 'Convert'}
            </button>
          </div>
        </>
      }
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
