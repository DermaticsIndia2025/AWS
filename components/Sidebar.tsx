import React from 'react';
import { StepIndicator } from './StepIndicator';
import { RefreshCw, ShoppingCartIcon, X } from './Icons';
import Button from './common/Button';

interface SidebarProps {
  currentStep: number;
  onReset: () => void;
  onCartClick: () => void;
  cartItemCount: number;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentStep,
  onReset,
  onCartClick,
  cartItemCount,
  isOpen,
  onClose
}) => {
  return (
    <aside className={`
      bg-brand-dark border-r border-slate-700/50 flex flex-col
      fixed inset-y-0 left-0 z-50 w-[350px] transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:relative lg:translate-x-0 lg:w-full
    `}>
      {/* Aurora background */}
      <div className="absolute inset-0 bg-aurora-gradient bg-[200%_200%] animate-aurora opacity-20 z-0"></div>

      {/* Scrollable content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-8">
        {/* Logo block with cart */}
        <div className="mb-12 flex items-center justify-center relative bg-white rounded-xl p-6 w-full aspect-[3.5/1] mx-auto">
          <a href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Dermatics Logo"
              className="w-36 h-auto object-contain"
              onLoad={() => console.log('Sidebar logo.png loaded successfully!')}
              onError={(e) => {
                console.log('Sidebar logo.png failed to load, trying SVG fallback...');
                const target = e.target as HTMLImageElement;
                target.src = '/test-logo.svg';
                target.onError = () => {
                  console.log('All sidebar logos failed, showing text fallback');
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.innerHTML = '<span class="text-2xl font-bold text-blue-600">Dermatics</span>';
                  fallback.className = 'text-center';
                  target.parentNode?.appendChild(fallback);
                };
              }}
            />
          </a>
          <button
            onClick={onCartClick}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-blue-100 transition-colors"
          >
            <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-secondary text-xs font-bold text-white shadow-lg">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Heading & Description */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
          AI Skincare Advisor
        </h1>
        <p className="text-base text-slate-400 mb-6">
          Your personalized path to healthier skin, powered by Dermatics Inida.
        </p>

        {/* Static Image */}
        <div className="flex justify-center mb-12">
          <img
            src="/ChatGPT Image Aug 5, 2025, 12_13_55 PM.png"
            alt="AI Skincare Advisor"
            className="w-48 h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Start Over Button */}
        <div className="space-y-4">
          <Button
            onClick={onReset}
            variant="primary"
            size="md"
            className="w-full gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </Button>

          {/* Footer */}
          <footer className="text-center text-xs text-slate-500 font-medium">
            <p>
              Powered by Dermatics India. For informational purposes only.
              Always consult a dermatologist for medical advice.
            </p>
          </footer>
        </div>
      </div>

      {/* Mobile close button */}
      <div className="relative z-10 p-4 border-t border-slate-700 lg:hidden">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
