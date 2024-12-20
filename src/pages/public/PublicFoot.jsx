import React from 'react';

const PublicFoot = () => {
  return (
    <footer className="bg-main-1 text-white py-5 bottom-0 absolute h-[60px] w-full">
      <div className="flex items-center justify-center">
        <span className="text-xl">SWP Booking Mentor System | SWP391-Group 03 &copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default PublicFoot;
