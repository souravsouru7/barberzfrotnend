import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto text-center">
          <p className="text-gray-300">&copy; 2024 BarberShop. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;