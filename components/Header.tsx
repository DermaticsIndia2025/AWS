
import React from 'react';
import { CompanyLogo, RefreshCw, ShoppingCartIcon, MenuIcon } from './Icons';
import Button from './common/Button';

interface HeaderProps {
    onReset: () => void;
    onCartClick: () => void;
    cartItemCount: number;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onCartClick, cartItemCount, onMenuClick }) => {
  return (
    <header className="w-full mx-auto p-4 flex items-center justify-between lg:hidden sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-slate-200">
      <div className="flex items-center gap-2">
        <button onClick={onMenuClick} className="p-2 -ml-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Open menu">
          <MenuIcon className="w-6 h-6 text-brand-text-muted" />
        </button>
        <div className="flex items-center">
          {/* Primary logo - your uploaded PNG file */}
          <img
            src="/logo.png"
            alt="Dermatics Logo"
            className="w-32 h-12 object-contain"
            onLoad={() => console.log('Your logo.png loaded successfully!')}
            onError={(e) => {
              console.log('Your logo.png failed to load, trying alternatives...');
              const target = e.target as HTMLImageElement;
              // Try the test SVG as fallback
              target.src = '/test-logo.svg';
              target.onError = () => {
                console.log('All logo files failed, showing text fallback');
                target.style.display = 'none';
                // Show text fallback
                const parent = target.parentElement;
                if (parent) {
                  const textLogo = document.createElement('span');
                  textLogo.className = 'text-lg font-bold text-slate-800';
                  textLogo.textContent = 'Dermatics';
                  parent.appendChild(textLogo);
                }
              };
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onReset} variant="primary" size="sm" className="gap-1.5 px-3">
            <RefreshCw className="w-4 h-4" />
            Reset
        </Button>
         <Button onClick={onCartClick} variant="primary" size="sm" className="relative !rounded-full !p-2">
            <ShoppingCartIcon className="w-6 h-6" />
            {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-secondary text-xs font-bold text-white shadow-lg">
                    {cartItemCount}
                </span>
            )}
        </Button>
      </div>
    </header>
  );
};

export default Header;