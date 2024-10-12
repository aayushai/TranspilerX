import React from 'react'; 
import { useRef } from 'react'; 
import { useScroll, useTransform } from 'framer-motion'; 
import CodeConverter from './CodeConverter';
import { GoogleGeminiEffect } from './components/ui/google-gemini-effect';

console.log(
    "%cWhy are you looking at my logs 👀",
    "color: #EEDD49; font-size: 10px;"
);

function App() {
    const ref = useRef(null); 

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
    const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
    const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
    const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
    const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

    return (
        <>
            <div
                className="h-[200vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-4 overflow-clip"
                ref={ref}
            >
                <GoogleGeminiEffect
                    pathLengths={[
                        pathLengthFirst,
                        pathLengthSecond,
                        pathLengthThird,
                        pathLengthFourth,
                        pathLengthFifth,
                    ]}
                />
            </div>
            <div className='bg-black text-white'>
                <CodeConverter />
            </div>
        </>
    );
}

export default App;
