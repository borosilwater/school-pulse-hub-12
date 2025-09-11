import React from 'react';

const AnnouncementBar = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 shadow-md">
        <marquee 
          behavior="scroll" 
          direction="left" 
          className="font-medium text-sm md:text-base"
        >
          <span className="mr-12 inline-block">🎉 EMRS Entrance Exam 2024 registration starts from 15th June!</span>
          <span className="mr-12 inline-block">📢 School reopens on 1st July after summer break</span>
          <span className="mr-12 inline-block">🏆 Our students won 3 gold medals in state-level sports competition</span>
        </marquee>
      </div>
    </>
  );
};

export default AnnouncementBar;
