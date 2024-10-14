import React from 'react'
import { LampContainer } from './components/ui/lamp';
import { motion } from "framer-motion";
import MouseScroll from './components/ui/MouseScroll';

const HeroSection =() => {
  return (
    <LampContainer>
    <motion.h1
      initial={{ opacity: 0.5, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
    >
      
     Transform Code<br/>  from any language<br/> to any language.
     
    </motion.h1>
    <div 
      className="fixed left-1/2 transform -translate-x-1/2" 
      style={{ bottom: '100px', transform: 'translateY(900%)' }}>
      <MouseScroll/>
    </div>
  </LampContainer>
  )
}

export default HeroSection
