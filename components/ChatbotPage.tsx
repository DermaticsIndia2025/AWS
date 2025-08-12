import React from 'react';
import { SkinConditionCategory, ChatMessage, SkincareRoutine } from '../types';
import Button from './common/Button';
import Chatbot from './Chatbot';
import Card from './common/Card';
import { ArrowLeftIcon, RefreshCw } from './Icons';

interface ChatbotPageProps {
  onBack: () => void;
  onReset: () => void;
  analysisResult: SkinConditionCategory[] | null;
  skincareGoals: string[];
  recommendation: SkincareRoutine | null;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatbotPage: React.FC<ChatbotPageProps> = ({
  onBack,
  onReset,
  analysisResult,
  skincareGoals,
  recommendation,
  chatHistory,
  setChatHistory,
}) => {
  return (
    <div className="animate-fade-in-up h-full flex flex-col w-full overflow-hidden rounded-2xl border-t-4 border-brand-primary">
      <Card className="h-full flex flex-col !rounded-t-none">
        <div className="flex-grow">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            <span className="text-brand-primary">Step 5:</span> AI Assistant
          </h2>
          <p className="text-base text-slate-600 mb-8">
            Have questions about your new routine? Ask our AI assistant for more details about the products or why they were chosen for you.
          </p>

          <Chatbot
            analysisResult={analysisResult}
            skincareGoals={skincareGoals}
            recommendation={recommendation}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        </div>

        <div className="flex-shrink-0 flex justify-between mt-8 pt-6 border-t border-slate-200">
          <Button onClick={onBack} variant="primary" size="lg" className="gap-2">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Your Plan
          </Button>
          <Button onClick={onReset} variant="primary" size="lg" className="gap-2">
            <RefreshCw className="w-5 h-5"/>
            Start Over
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotPage;