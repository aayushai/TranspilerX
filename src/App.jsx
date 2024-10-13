import React from 'react';  
import CodeConverter from './CodeConverter';
import HeroSection from './HeroSection';

console.log(
    "%cWhy are you looking at my logs 👀",
    "color: #EEDD49; font-size: 10px;"
);

function App() {
   

    return (
        <>
           <HeroSection />
            <div className='bg-[#020517]  text-white'>
                <CodeConverter />
            </div>
        </>
    );
}

export default App;
