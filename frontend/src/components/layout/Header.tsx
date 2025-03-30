import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[var(--intel-blue-primary)] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            AI API Interface
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-[var(--intel-gray-light)] transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/api-services" className="hover:text-[var(--intel-gray-light)] transition-colors">
                API Services
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:text-[var(--intel-gray-light)] transition-colors">
                Settings
              </Link>
            </li>
            <li>
              <Link href="/auth" className="hover:text-[var(--intel-gray-light)] transition-colors">
                Account
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
