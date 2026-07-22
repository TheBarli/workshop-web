import React from 'react';
import Navbar from '../Components/common/Navbar';
import Footer from '../Components/common/Footer';

const GuestLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9ff]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
