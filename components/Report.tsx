import React, { useState } from 'react';
import { SkincareRoutine, SkinConditionCategory, FaceImage, RoutineStep, AlternativeProduct } from '../types';
import Button from './common/Button';
import { 
    RefreshCw, SunIcon, MoonIcon, CompanyLogo, WandSparklesIcon, KeyIcon, HeartIcon, 
    TriangleAlertIcon, ArrowLeftIcon, Download, ShoppingCartIcon, CheckCircle, CheckIcon,
    ArrowRightIcon, Plus, ChevronDownIcon
} from './Icons';
import { getCategoryStyle, CATEGORY_STYLES } from '../constants';
import Card from './common/Card';

interface ReportProps {
  recommendation: SkincareRoutine | null;
  routineTitle: string;
  onReset: () => void;
  onBack: () => void;
  onNext: () => void;
  faceImages: FaceImage[];
  analysisResult: SkinConditionCategory[] | null;
  skincareGoals: string[];
  onAddToCart: (product: RoutineStep | AlternativeProduct) => void;
  onBulkAddToCart: (products: (RoutineStep | AlternativeProduct)[]) => void;
}

const Report: React.FC<ReportProps> = ({ 
    recommendation, 
    routineTitle, 
    onReset, 
    onBack, 
    onNext,
    faceImages, 
    analysisResult,
    skincareGoals,
    onAddToCart,
    onBulkAddToCart
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [addedProducts, setAddedProducts] = useState<string[]>([]);
  const [allAdded, setAllAdded] = useState(false);

  const handleAddToCartClick = (product: RoutineStep | AlternativeProduct) => {
    onAddToCart(product);
    setAddedProducts(prev => [...prev, product.productId]);
    setTimeout(() => {
        setAddedProducts(prev => prev.filter(id => id !== product.productId));
    }, 2000);
  };

  const handleAddAllProductsToCartClick = () => {
    if (!recommendation) return;

    const allPrimaryProducts = [...recommendation.am, ...recommendation.pm];
    const allAlternatives = allPrimaryProducts.flatMap(step => step.alternatives || []);
    
    const allProductsToAdd = [...allPrimaryProducts, ...allAlternatives];

    if (allProductsToAdd.length > 0) {
      onBulkAddToCart(allProductsToAdd);
      setAllAdded(true);
      setTimeout(() => {
        setAllAdded(false);
      }, 2000);
    }
  };

  const handleDownload = async () => {
    const reportElement = document.getElementById('report-content');
    if (!reportElement || !window.html2canvas || !window.jspdf) return;

    setIsDownloading(true);
    try {
        // Temporarily remove max-height for full capture
        reportElement.style.maxHeight = 'none';

        window.scrollTo(0, 0);
        const canvas = await window.html2canvas(reportElement, { 
            scale: 2, 
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        
        // Restore max-height after capture
        reportElement.style.maxHeight = '';
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const pdf = new window.jspdf.jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const ratio = imgWidth / pdfWidth;
        const canvasHeightOnPdf = imgHeight / ratio;
        
        let heightLeft = canvasHeightOnPdf;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeightOnPdf, undefined, 'FAST');
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeightOnPdf, undefined, 'FAST');
            heightLeft -= pdfHeight;
        }

        pdf.save('Dermatics_India_Skincare_Plan.pdf');

    } catch (error) {
        console.error("Failed to download PDF:", error);
        alert("Sorry, there was an error creating the PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };


  if (!recommendation) {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Generating your report...</h2>
            <p className="text-slate-600">If you're seeing this for a while, something might have gone wrong.</p>
            <Button onClick={onReset} variant="primary" size="lg" className="mt-6 gap-2">
              <RefreshCw className="w-5 h-5"/>
              Start Over
            </Button>
        </div>
    )
  }

  return (
    <div className="animate-fade-in-up h-full flex flex-col w-full overflow-hidden rounded-2xl border-t-4 border-brand-primary">
      <Card className="h-full flex flex-col !rounded-t-none">
        <div id="report-content-wrapper" className="flex-grow overflow-y-auto">
            <div id="report-content" className="p-6 sm:p-10 text-slate-800 space-y-10">
                <header className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src="/logo.png"
                            alt="Dermatics Logo"
                            className="w-28 h-14 object-contain flex-shrink-0"
                            onLoad={() => console.log('Report logo.png loaded successfully!')}
                            onError={(e) => {
                                console.log('Report logo.png failed to load, trying alternatives...');
                                const target = e.target as HTMLImageElement;
                                // Try the test SVG as fallback
                                target.src = '/test-logo.svg';
                                target.onerror = () => {
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
                        <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-wide">Your AI Skincare Plan</h1>
                        <p className="text-slate-500">Personalized by Dermatics India</p>
                        </div>
                    </div>
                </header>
                
                <section className="text-center">
                    <WandSparklesIcon className="w-10 h-10 mx-auto text-brand-primary mb-2" />
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900">{routineTitle}</h2>
                    <p className="text-lg text-slate-600 mt-3 max-w-3xl mx-auto">{recommendation.introduction}</p>
                </section>
                
                <div className="space-y-8">
                    {analysisResult && (
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
                                <CheckCircle className="w-7 h-7 text-blue-500"/> Your Analysis Summary
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                                {faceImages.map((image, index) => (
                                    <div key={image.previewUrl} className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200">
                                        <img src={image.previewUrl} alt={`Analyzed view ${index + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                {analysisResult.map((category) => {
                                    const style = getCategoryStyle(category.category);
                                    const Icon = style.icon;
                                    return (
                                        <div key={category.category}>
                                            <h4 className={`font-bold text-base mb-2 flex items-center gap-2 ${style.tailwind.text}`}>
                                                <Icon className={`w-5 h-5 ${style.tailwind.icon}`} />
                                                {category.category}
                                            </h4>
                                            <ul className="space-y-1 pl-2">
                                                {category.conditions.map((condition) => (
                                                    <li key={condition.name} className="text-sm text-slate-700">
                                                        {condition.name}
                                                        <span className="text-slate-500 text-xs ml-1">({condition.location})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
                            <h3 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
                                <SunIcon className="w-7 h-7 text-amber-500" /> Morning (AM) Routine
                            </h3>
                            <ol className="space-y-4">
                                {recommendation.am.map((step, index) => (
                                    <li key={`am-${step.productId}`} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm shadow mt-1">{index + 1}</div>
                                        <div className="flex-grow bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                                            <div className="p-4">
                                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                                                        <img src={step.productImageUrl} alt={step.productName} className="w-24 h-24 sm:w-20 sm:h-20 self-center sm:self-start object-contain rounded-md bg-slate-100 p-1 border flex-shrink-0"/>
                                                        <div className="text-center sm:text-left">
                                                            <p className="font-bold text-base text-slate-800">{step.productName}</p>
                                                            <p className="text-sm text-slate-600 mt-1">{step.purpose}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <Button onClick={() => handleAddToCartClick(step)} variant={addedProducts.includes(step.productId) ? 'secondary' : 'primary'} size="sm" className="flex-grow gap-2">
                                                            {addedProducts.includes(step.productId) ? <CheckIcon className="w-4 h-4" /> : <ShoppingCartIcon className="w-4 h-4" />}
                                                            {addedProducts.includes(step.productId) ? 'Added!' : 'Add to Cart'}
                                                        </Button>
                                                    </div>
                                            </div>
                                            {step.alternatives && step.alternatives.length > 0 && (
                                                    <div className="p-4 border-t border-slate-200 bg-slate-50/80">
                                                        <h5 className="text-sm font-semibold text-slate-800 mb-3">Suggested Alternatives:</h5>
                                                        <ul className="space-y-3">
                                                            {step.alternatives.map(alt => (
                                                                <li key={alt.productId} className="flex items-center gap-3">
                                                                    <img src={alt.productImageUrl} alt={alt.productName} className="w-12 h-12 object-contain rounded-md bg-white p-1 border border-slate-200 flex-shrink-0" />
                                                                    <div className="flex-grow">
                                                                        <p className="text-sm font-medium text-slate-700 leading-tight">{alt.productName}</p>
                                                                    </div>
                                                                    <Button
                                                                        onClick={() => handleAddToCartClick(alt)}
                                                                        variant={addedProducts.includes(alt.productId) ? 'secondary' : 'secondary'}
                                                                        size="sm"
                                                                        className={`!p-2 !rounded-md transition-colors ${addedProducts.includes(alt.productId) ? '!bg-green-100 !border-green-300 !text-green-600' : ''}`}
                                                                        aria-label={`Add ${alt.productName} to cart`}
                                                                    >
                                                                        {addedProducts.includes(alt.productId)
                                                                            ? <CheckIcon className="w-5 h-5" />
                                                                            : <Plus className="w-5 h-5" />
                                                                        }
                                                                    </Button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="p-6 rounded-xl bg-indigo-50 border border-indigo-200">
                            <h3 className="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
                                <MoonIcon className="w-7 h-7 text-indigo-500" /> Evening (PM) Routine
                            </h3>
                            <ol className="space-y-4">
                                {recommendation.pm.map((step, index) => (
                                    <li key={`pm-${step.productId}`} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 bg-indigo-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm shadow mt-1">{index + 1}</div>
                                            <div className="flex-grow bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                                            <div className="p-4">
                                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                                                        <img src={step.productImageUrl} alt={step.productName} className="w-24 h-24 sm:w-20 sm:h-20 self-center sm:self-start object-contain rounded-md bg-slate-100 p-1 border flex-shrink-0"/>
                                                        <div className="text-center sm:text-left">
                                                            <p className="font-bold text-base text-slate-800">{step.productName}</p>
                                                            <p className="text-sm text-slate-600 mt-1">{step.purpose}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <Button onClick={() => handleAddToCartClick(step)} variant={addedProducts.includes(step.productId) ? 'secondary' : 'primary'} size="sm" className="flex-grow gap-2">
                                                            {addedProducts.includes(step.productId) ? <CheckIcon className="w-4 h-4" /> : <ShoppingCartIcon className="w-4 h-4" />}
                                                            {addedProducts.includes(step.productId) ? 'Added!' : 'Add to Cart'}
                                                        </Button>
                                                    </div>
                                            </div>
                                            {step.alternatives && step.alternatives.length > 0 && (
                                                    <div className="p-4 border-t border-slate-200 bg-slate-50/80">
                                                        <h5 className="text-sm font-semibold text-slate-800 mb-3">Suggested Alternatives:</h5>
                                                        <ul className="space-y-3">
                                                            {step.alternatives.map(alt => (
                                                                <li key={alt.productId} className="flex items-center gap-3">
                                                                    <img src={alt.productImageUrl} alt={alt.productName} className="w-12 h-12 object-contain rounded-md bg-white p-1 border border-slate-200 flex-shrink-0" />
                                                                    <div className="flex-grow">
                                                                        <p className="text-sm font-medium text-slate-700 leading-tight">{alt.productName}</p>
                                                                    </div>
                                                                    <Button
                                                                        onClick={() => handleAddToCartClick(alt)}
                                                                        variant={addedProducts.includes(alt.productId) ? 'secondary' : 'secondary'}
                                                                        size="sm"
                                                                        className={`!p-2 !rounded-md transition-colors ${addedProducts.includes(alt.productId) ? '!bg-green-100 !border-green-300 !text-green-600' : ''}`}
                                                                        aria-label={`Add ${alt.productName} to cart`}
                                                                    >
                                                                        {addedProducts.includes(alt.productId)
                                                                            ? <CheckIcon className="w-5 h-5" />
                                                                            : <Plus className="w-5 h-5" />
                                                                        }
                                                                    </Button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    
                    <div className="text-center py-6">
                        <Button onClick={handleAddAllProductsToCartClick} variant={allAdded ? 'secondary' : 'primary'} size="lg" className="gap-2">
                            {allAdded ? <CheckIcon className="w-5 h-5"/> : <ShoppingCartIcon className="w-5 h-5"/>}
                            {allAdded ? 'All Products Added' : 'Add All Products to Cart'}
                        </Button>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <KeyIcon className="w-6 h-6 text-blue-500"/> Key Ingredients
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {recommendation.keyIngredients.map((ingredient, index) => (
                                <span key={`ingredient-${index}`} className="px-4 py-1.5 bg-white text-slate-700 text-base font-medium rounded-full border border-slate-300 shadow-sm">{ingredient}</span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <HeartIcon className="w-6 h-6 text-blue-500"/> Lifestyle & Wellness Tips
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 text-base columns-1 md:columns-2">
                            {recommendation.lifestyleTips.map((tip, index) => (
                                <li key={`tip-${index}`}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-4">
                            <div className="flex-shrink-0">
                            <TriangleAlertIcon className="w-6 h-6 text-amber-500 mt-0.5"/>
                            </div>
                            <div>
                            <h4 className="font-bold text-lg text-amber-900">Important Disclaimer</h4>
                            <p className="text-amber-800 text-sm mt-1">{recommendation.disclaimer}</p>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="flex-shrink-0 flex justify-center items-center flex-wrap gap-4 p-6 border-t border-slate-200">
          <Button onClick={onBack} variant="primary" size="lg" className="gap-2">
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Goals
          </Button>
          <Button onClick={handleDownload} isLoading={isDownloading} variant="primary" size="lg" className="gap-2">
            <Download className="w-5 h-5"/>
            Download Report
          </Button>
          <Button onClick={onReset} variant="primary" size="lg" className="gap-2">
            <RefreshCw className="w-5 h-5"/>
            Start Over
          </Button>
          <Button onClick={onNext} variant="primary" size="lg" className="gap-2">
              Next: Ask AI Assistant
              <ArrowRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Report;