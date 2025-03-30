import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--intel-blue-dark)] text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} AI API Interface. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:text-[var(--intel-gray-light)] transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-[var(--intel-gray-light)] transition-colors">Terms of Service</a>
            <a href="#" className="text-sm hover:text-[var(--intel-gray-light)] transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
