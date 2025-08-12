import React, { useCallback, useState } from 'react';
import { SkinConditionCategory, FaceImage } from '../types';
import Button from './common/Button';
import { analyzeImage } from '../services/geminiService';
import Spinner from './common/Spinner';
import { UploadCloud, CheckCircle, X, CameraIcon } from './Icons';
import CameraCapture from './CameraCapture';
import { getCategoryStyle } from '../constants';
import Card from './common/Card';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  faceImages: FaceImage[];
  setFaceImages: (files: FaceImage[] | ((prevFiles: FaceImage[]) => FaceImage[])) => void;
  analysisResult: SkinConditionCategory[] | null;
  setAnalysisResult: (result: SkinConditionCategory[] | null) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const Step2FaceAnalysis: React.FC<Step2Props> = ({
  onNext, onBack, faceImages, setFaceImages, analysisResult, setAnalysisResult, setIsLoading, isLoading,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [hoveredCondition, setHoveredCondition] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      setFaceImages(prevImages => [...prevImages, ...newImages]);
      setAnalysisResult(null); 
      setHoveredCondition(null);
      e.target.value = ''; 
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFaceImages(prevImages => {
      const imageToRemove = prevImages[indexToRemove];
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      const updatedImages = prevImages.filter((_, index) => index !== indexToRemove);
      if (activeImageIndex >= updatedImages.length && updatedImages.length > 0) {
        setActiveImageIndex(updatedImages.length - 1);
      } else if (updatedImages.length === 0) {
        setActiveImageIndex(0);
      }
      return updatedImages;
    });
  };

  const handlePhotoCapture = useCallback(async (dataUrl: string) => {
    setIsCameraOpen(false);
    
    const dataURLtoFile = async (dataUrl: string, filename: string): Promise<File> => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: 'image/jpeg' });
    };

    try {
        const file = await dataURLtoFile(dataUrl, `capture-${Date.now()}.jpg`);
        const newImage: FaceImage = {
            file,
            previewUrl: URL.createObjectURL(file)
        };
        setFaceImages(prevImages => [...prevImages, newImage]);
        setAnalysisResult(null);
        setHoveredCondition(null);
    } catch (error) {
        console.error("Error converting data URL to file:", error);
        alert("Could not process the captured image.");
    }
  }, [setFaceImages, setAnalysisResult]);


  const handleAnalyze = useCallback(async () => {
    if (faceImages.length === 0) return;
    setIsLoading(true);
    setAnalysisResult(null);
    setHoveredCondition(null);
    try {
      const filesToAnalyze = faceImages.map(img => img.file);
      const result = await analyzeImage(filesToAnalyze);
      setAnalysisResult(result);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [faceImages, setAnalysisResult, setIsLoading]);

  const activeImage = faceImages[activeImageIndex];

  return (
    <div className="animate-fade-in-up h-full flex flex-col w-full overflow-hidden rounded-2xl border-t-4 border-brand-primary">
        <Card className="h-full flex flex-col w-full !rounded-t-none">
          <div className="flex-grow">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                <span className="text-brand-primary">Step 2:</span> AI Face Analysis
            </h2>
            <p className="text-base text-slate-600 mb-8">Upload clear, well-lit photos of your face. For best results, add front, left, and right views.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                    {activeImage ? (
                        <>
                            <img src={activeImage.previewUrl} alt={`Face preview ${activeImageIndex + 1}`} className="w-full h-full object-contain" />
                            {analysisResult && (
                                <div className="absolute inset-0">
                                    {analysisResult.flatMap(cat =>
                                        cat.conditions.flatMap(cond =>
                                            cond.boundingBoxes
                                                .filter(bbox => bbox.imageId === activeImageIndex)
                                                .map((bbox, i) => {
                                                    const style = getCategoryStyle(cat.category);
                                                    const isHovered = hoveredCondition === cond.name;
                                                    const opacity = hoveredCondition === null ? 0.7 : (isHovered ? 1 : 0.2);
                                                    const zIndex = isHovered ? 20 : 10;
                                                    const transform = isHovered ? 'scale(1.03)' : 'scale(1)';

                                                    return (
                                                        <div
                                                            key={`${cond.name}-${i}`}
                                                            className="absolute transition-all duration-200 ease-in-out rounded-sm"
                                                            style={{
                                                                border: `3px solid ${style.hex}`,
                                                                top: `${bbox.box.y1 * 100}%`,
                                                                left: `${bbox.box.x1 * 100}%`,
                                                                width: `${(bbox.box.x2 - bbox.box.x1) * 100}%`,
                                                                height: `${(bbox.box.y2 - bbox.box.y1) * 100}%`,
                                                                opacity: opacity,
                                                                transform: transform,
                                                                zIndex: zIndex,
                                                                boxShadow: `0 0 15px ${style.hex}${isHovered ? '80' : '00'}`
                                                            }}
                                                        >
                                                            {isHovered && (
                                                                <span
                                                                    className={`absolute -top-6 left-0 text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${style.tailwind.legendBg}`}
                                                                    style={{
                                                                        color: style.hex,
                                                                        borderColor: style.hex,
                                                                        borderWidth: '1px',
                                                                    }}
                                                                >
                                                                    {cond.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                        )
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-slate-500">Upload an image to begin</p>
                    )}
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {faceImages.map((image, index) => (
                        <div key={image.previewUrl} className="relative group aspect-square">
                            <img 
                              src={image.previewUrl} 
                              alt={`Thumbnail ${index + 1}`} 
                              onClick={() => setActiveImageIndex(index)}
                              className={`w-full h-full object-cover rounded-md shadow-sm cursor-pointer transition-all ${activeImageIndex === index ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'}`}
                            />
                            <button onClick={() => handleRemoveImage(index)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <label htmlFor="face-image-upload" className="flex flex-col items-center justify-center aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-200 hover:border-blue-400 transition-colors cursor-pointer">
                        <UploadCloud className="w-7 h-7"/>
                        <span className="text-xs font-semibold mt-1">Upload</span>
                        <input id="face-image-upload" type="file" accept="image/*" multiple onChange={handleFileChange} className="sr-only" />
                    </label>
                    <button type="button" onClick={() => setIsCameraOpen(true)} className="flex flex-col items-center justify-center aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-200 hover:border-blue-400 transition-colors cursor-pointer">
                        <CameraIcon className="w-7 h-7"/>
                        <span className="text-xs font-semibold mt-1">Camera</span>
                    </button>
                </div>
              </div>
              <div className="flex flex-col justify-center min-h-[300px]">
                  {isLoading && <Spinner text="Analyzing your skin..." />}
                  {!isLoading && !analysisResult && (
                      <div className="text-center md:text-left bg-slate-100 p-6 rounded-xl border border-slate-200">
                          <p className="text-base text-slate-600 mb-6">Once you've uploaded your photos, we'll analyze them and highlight any areas of concern right on your images.</p>
                          <Button onClick={handleAnalyze} disabled={faceImages.length === 0} isLoading={isLoading} size="lg" className="w-full">
                              Analyze My Skin
                          </Button>
                      </div>
                  )}

                  {analysisResult && (
                  <div className="space-y-3 animate-fade-in-up">
                      <div className="flex items-center gap-3 text-2xl font-bold text-green-600">
                          <CheckCircle className="w-8 h-8 text-green-500" />
                          <h3>Analysis Complete!</h3>
                      </div>
                      <div className="max-h-[26rem] overflow-y-auto pr-2 -mr-2 space-y-3">
                        {analysisResult.map((category) => {
                            const style = getCategoryStyle(category.category);
                            const Icon = style.icon;
                            return (
                                <div key={category.category} className={`p-4 rounded-lg border shadow-sm ${style.tailwind.bg} ${style.tailwind.border}`}>
                                    <h4 className={`font-bold text-base mb-2 flex items-center gap-2 ${style.tailwind.text}`}>
                                        <Icon className={`w-5 h-5 ${style.tailwind.icon}`} />
                                        {category.category}
                                    </h4>
                                    <ul className="space-y-1.5">
                                    {category.conditions.map((condition) => (
                                        <li key={condition.name} 
                                            className={`flex justify-between items-center text-sm transition-all rounded-md p-2 -mx-2 cursor-pointer ${hoveredCondition === condition.name ? `bg-white/70 ring-2 ring-blue-400` : 'hover:bg-white/50'}`}
                                            onMouseEnter={() => setHoveredCondition(condition.name)}
                                            onMouseLeave={() => setHoveredCondition(null)}>
                                            <div className="flex-grow pr-2">
                                                <span className="text-slate-700 font-semibold block">{condition.name}</span>
                                                <span className="text-slate-500 text-xs">{condition.location}</span>
                                            </div>
                                            <span className={`font-semibold text-right text-sm flex-shrink-0 ${style.tailwind.text}`}>{condition.confidence}%</span>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                            )
                        })}
                      </div>
                  </div>
                  )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex justify-between mt-8 pt-6 border-t border-slate-200">
            <Button onClick={onBack} variant="primary" size="lg">Back</Button>
            <Button onClick={onNext} disabled={!analysisResult} size="lg">Next: Set My Goals</Button>
          </div>
          {isCameraOpen && <CameraCapture onCapture={handlePhotoCapture} onClose={() => setIsCameraOpen(false)} />}
        </Card>
    </div>
  );
};

export default Step2FaceAnalysis;