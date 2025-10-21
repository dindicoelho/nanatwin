import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-4 w-full bg-[#f0f4f8]">
      <div className="container mx-auto px-4">
        <p className="text-xs text-[#4b4a4a]/60">
          project developed by @dindicoelho | Dindi.coelho@gmail.com |{' '}
          <a 
            href="https://github.com/dindicoelho" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#f873cf] hover:underline font-medium"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;