import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { PastProduct, SkinConditionCategory, SkincareRoutine, FaceImage } from '../types';
import Button from './common/Button';
import { SKINCARE_GOALS, LOADING_TIPS, LOADING_TIP_STYLES, CATEGORY_STYLES } from '../constants';
import { generateRoutine } from '../services/geminiService';
import { User, ImageIcon, CheckIcon } from './Icons';
import Card from './common/Card';

interface Step3Props {
  onBack: () => void;
  analysisResult: SkinConditionCategory[] | null;
  skincareGoals: string[];
  setSkincareGoals: (goals: string[]) => void;
  pastProducts: PastProduct[];
  setRecommendation: (rec: SkincareRoutine) => void;
  setRoutineTitle: (title: string) => void;
  setStep: (step: number) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  faceImages: FaceImage[];
}

interface LoadingOverlayProps {
  tips: string[];
  title: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ tips, title }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % (tips.length || 1));
    }, 4000);

    const elapsedInterval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(tipInterval);
      clearInterval(elapsedInterval);
    };
  }, [tips.length]);

  const currentTip = tips[currentTipIndex];
  const currentStyle = LOADING_TIP_STYLES[currentTipIndex % LOADING_TIP_STYLES.length];
  const Icon = currentStyle.Icon;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center max-w-lg w-full mx-4 flex flex-col items-center">
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">{elapsedSeconds}s</span>
            </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mt-6">{title}</h2>
        <div className="w-full mt-4 min-h-[90px]">
           <div
              key={currentTipIndex} // Use key to trigger re-render animations
              className={`p-4 rounded-lg border flex items-start gap-3 animate-fade-in-up ${currentStyle.bg}`}
            >
              <Icon className={`w-10 h-10 flex-shrink-0 ${currentStyle.iconColor}`} />
              <div className={`${currentStyle.text} text-left text-sm`}>
                <strong className="block font-bold">Helpful Tip</strong>
                <p>{currentTip}</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};


const Step3Goals: React.FC<Step3Props> = ({
  onBack, analysisResult, skincareGoals, setSkincareGoals, pastProducts,
  setRecommendation, setRoutineTitle, setStep, setIsLoading, isLoading, faceImages
}) => {

  const getGoalStyle = (goal) => {
    if (goal.relatedConditions.length > 0) {
        const category = goal.relatedConditions[0];
        if (CATEGORY_STYLES[category]) {
            return CATEGORY_STYLES[category];
        }
    }
    return CATEGORY_STYLES['Default'];
  };

  const suggestedGoals = useMemo(() => {
    if (!analysisResult) return new Set();
    const detectedCategories = new Set(analysisResult.map(ar => ar.category));
    const suggestions = new Set<string>();
    SKINCARE_GOALS.forEach(goal => {
      if (goal.relatedConditions.some(rc => detectedCategories.has(rc))) {
        suggestions.add(goal.id);
      }
    });
    return suggestions;
  }, [analysisResult]);

  const handleGoalToggle = (goalId: string) => {
    setSkincareGoals(
      skincareGoals.includes(goalId)
        ? skincareGoals.filter(g => g !== goalId)
        : [...skincareGoals, goalId]
    );
  };

  const handleGenerateRoutine = useCallback(async () => {
    if (!analysisResult || skincareGoals.length === 0) {
        alert("Please select at least one skincare goal.");
        return;
    }
    setIsLoading(true);
    try {
      const { recommendation, title } = await generateRoutine(pastProducts, analysisResult, skincareGoals.map(id => SKINCARE_GOALS.find(g => g.id === id)?.label || ''));
      setRecommendation(recommendation);
      setRoutineTitle(title);
      setStep(4);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [analysisResult, skincareGoals, pastProducts, setRecommendation, setRoutineTitle, setStep, setIsLoading]);

  return (
     <>
        {isLoading && <LoadingOverlay title="Crafting your personalized plan..." tips={LOADING_TIPS} />}
        <div className="animate-fade-in-up h-full flex flex-col w-full overflow-hidden rounded-2xl border-t-4 border-brand-primary">
            <Card className="h-full flex flex-col !rounded-t-none">
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                        <span className="text-brand-primary">Step 3:</span> Select Your Skincare Goals
                    </h2>
                    <p className="text-base text-slate-600 mb-8">Choose what you'd like to focus on. We've highlighted some suggestions based on your skin analysis.</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {SKINCARE_GOALS.map(goal => {
                        const isSelected = skincareGoals.includes(goal.id);
                        const isSuggested = suggestedGoals.has(goal.id);
                        const Icon = goal.icon;
                        const style = getGoalStyle(goal);
                        return (
                        <div
                            key={goal.id}
                            onClick={() => handleGoalToggle(goal.id)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center text-center h-36 group hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 ${
                            isSelected 
                                ? 'border-blue-500 bg-blue-50/80 shadow-lg shadow-blue-500/20' 
                                : `${style.tailwind.border} ${style.tailwind.bg}`
                            }`}
                        >
                            <Icon className={`w-8 h-8 mb-2 transition-colors duration-200 ${isSelected 
                                ? 'text-blue-500' 
                                : `${style.tailwind.icon} group-hover:text-blue-500`
                            }`} />
                            <h4 className={`text-sm font-bold transition-colors duration-200 ${isSelected ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'}`}>{goal.label}</h4>
                            {isSuggested && !isSelected && (
                            <span className="absolute top-1.5 right-1.5 text-xs bg-amber-200 text-amber-800 font-semibold px-1.5 py-0.5 rounded-full shadow-sm">Suggested</span>
                            )}
                            {isSelected && (
                            <div className="absolute top-1.5 right-1.5 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                <CheckIcon className="h-3.5 w-3.5 text-white" strokeWidth={3}/>
                            </div>
                            )}
                        </div>
                        );
                    })}
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 sticky top-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600"/>
                            Your Analysis Photos
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {faceImages.length > 0 ? faceImages.map((image) => (
                                <img key={image.previewUrl} src={image.previewUrl} alt={`Analysis Photo`} className="rounded-lg w-full aspect-square object-cover shadow-sm border border-slate-200" />
                            )) : (
                                <div className="rounded-lg col-span-2 w-full aspect-square bg-slate-200 flex items-center justify-center border border-dashed border-slate-300">
                                    <div className="text-center">
                                        <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
                                        <p className="text-slate-500 text-sm mt-1">No images found.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-3">These images are used as the basis for your skin analysis and recommendations.</p>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 flex justify-between mt-8 pt-6 border-t border-slate-200">
                <Button onClick={onBack} variant="primary" size="lg" disabled={isLoading}>Back</Button>
                <Button onClick={handleGenerateRoutine} disabled={skincareGoals.length === 0 || isLoading} size="lg">
                {isLoading ? 'Generating...' : 'Generate My Plan'}
                </Button>
            </div>
            </Card>
        </div>
    </>
  );
};

export default Step3Goals;