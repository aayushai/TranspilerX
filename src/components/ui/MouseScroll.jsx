import React from 'react';

const MouseScroll = () => {
  return (
    <div className="flex justify-center">
      <div className="relative w-6 h-10 border-[2.5px] border-white rounded-[15px] cursor-pointer">
        <span className="block w-1 h-1.5 bg-white rounded-full mt-0.5 mx-auto animate-wheel-up-down"></span>
      </div>
    </div>
  );
};

export default MouseScroll;

