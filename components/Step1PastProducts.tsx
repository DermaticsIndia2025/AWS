import React, { useState, useMemo } from 'react';
import { PastProduct } from '../types';
import Button from './common/Button';
import { COMMON_PRODUCTS, COMMON_DURATIONS } from '../constants';
import { X, Plus, ImageIcon, CameraIcon, UploadCloud, TrashIcon } from './Icons';
import CameraCapture from './CameraCapture';
import Card from './common/Card';

interface Step1Props {
  onNext: () => void;
  pastProducts: PastProduct[];
  setPastProducts: React.Dispatch<React.SetStateAction<PastProduct[]>>;
}

const Step1PastProducts: React.FC<Step1Props> = ({ onNext, pastProducts, setPastProducts }) => {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [customProductName, setCustomProductName] = useState('');
  const [isUsing, setIsUsing] = useState(true);
  const [duration, setDuration] = useState('');
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [cameraForProduct, setCameraForProduct] = useState<string | null>(null);

  const productsToCustomize = useMemo(() => {
    const names = new Set(selectedNames);
    if (customProductName.trim()) {
      names.add(customProductName.trim());
    }
    return Array.from(names);
  }, [selectedNames, customProductName]);

  const totalProductsToAdd = productsToCustomize.length;

  const handleToggleProductSelection = (name: string) => {
    setSelectedNames(prev =>
      prev.includes(name)
        ? prev.filter(p => p !== name)
        : [...prev, name]
    );
  };

  const handleAddProducts = () => {
    if (totalProductsToAdd === 0 || !duration.trim()) return;

    const productsToAdd: PastProduct[] = productsToCustomize.map(name => ({
      id: new Date().toISOString() + name,
      name,
      isUsing,
      duration,
      image: productImages[name] || undefined,
    }));

    setPastProducts([...productsToAdd, ...pastProducts]);
    
    // Reset form
    setSelectedNames([]);
    setCustomProductName('');
    setIsUsing(true);
    setDuration('');
    setProductImages({});
    setCameraForProduct(null);
  };
  
  const handleRemoveProduct = (id: string) => {
    setPastProducts(pastProducts.filter(p => p.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, productName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImages(prev => ({ ...prev, [productName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Allow re-uploading the same file
    }
  };

  const handlePhotoCapture = (imageDataUrl: string) => {
    if (cameraForProduct) {
      setProductImages(prev => ({ ...prev, [cameraForProduct]: imageDataUrl }));
    }
    setCameraForProduct(null);
  };

  const handleRemoveImage = (productName: string) => {
      setProductImages(prev => {
          const newImages = {...prev};
          delete newImages[productName];
          return newImages;
      })
  }

  return (
    <div className="animate-fade-in-up h-full flex flex-col w-full overflow-hidden rounded-2xl border-t-4 border-brand-primary">
        <Card className="h-full flex flex-col !rounded-t-none">
          <div className="flex-grow">
            <h2 className="text-3xl font-extrabold text-brand-text-main mb-2">
                <span className="text-brand-primary">Step 1:</span> Past Product Usage
            </h2>
            <p className="text-base text-brand-text-muted mb-8">Tell us about products you've used. This helps us avoid recommending things that didn't work for you.</p>

            <div className="p-6 border border-slate-200/80 rounded-xl bg-slate-50 mb-8 flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-text-main mb-3">
                  Common Products (Select one or more)
                </label>
                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white rounded-lg border border-slate-200">
                  {COMMON_PRODUCTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleToggleProductSelection(p)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                        selectedNames.includes(p)
                          ? "bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20"
                          : "bg-white border-slate-300 text-slate-700 hover:border-brand-primary hover:text-brand-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  id="customProductName"
                  value={customProductName}
                  onChange={(e) => setCustomProductName(e.target.value)}
                  className="block w-full bg-white text-brand-text-main placeholder-slate-400 border border-slate-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary-light focus:border-brand-primary-light transition-all text-base shadow-sm"
                  placeholder="Or add a product not on the list..."
                />
              </div>
              
              {totalProductsToAdd > 0 && (
                <div className="border-t border-slate-200 pt-6 space-y-6 animate-fade-in-up">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-text-main mb-4">Set Details for Selected Products</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-sm font-medium text-brand-text-main mb-1.5">Are you currently using it?</label>
                          <div className="relative w-full h-11 bg-slate-200 rounded-lg p-1 flex items-center border border-slate-300">
                            <div className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-transform duration-300 ease-in-out ${isUsing ? 'translate-x-0' : 'translate-x-full'}`}></div>
                            <button type="button" onClick={() => setIsUsing(true)} className={`flex-1 text-center font-semibold z-10 transition-colors text-sm ${isUsing ? 'text-brand-primary' : 'text-slate-600'}`}>Yes</button>
                            <button type="button" onClick={() => setIsUsing(false)} className={`flex-1 text-center font-semibold z-10 transition-colors text-sm ${!isUsing ? 'text-brand-primary' : 'text-slate-600'}`}>No</button>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-brand-text-main mb-1.5">How long have you used it?</label>
                          <input
                            type="text"
                            id="duration"
                            list="duration-options"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="block w-full bg-white text-brand-text-main placeholder-slate-400 border border-slate-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary-light focus:border-brand-primary-light transition-all text-base shadow-sm"
                            placeholder="e.g., 3 Months"
                          />
                          <datalist id="duration-options">
                            {COMMON_DURATIONS.map((d) => (
                              <option key={d} value={d} />
                            ))}
                          </datalist>
                        </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-brand-text-main mb-4">Add Images (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {productsToCustomize.map(name => (
                        <div key={name} className="bg-white p-3 rounded-lg border border-slate-200">
                          <p className="font-semibold text-brand-text-main mb-2 truncate text-sm">{name}</p>
                          <div className="w-full aspect-video bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center relative overflow-hidden">
                            {productImages[name] ? (
                              <>
                                <img src={productImages[name]} alt={name} className="w-full h-full object-contain" />
                                <button onClick={() => handleRemoveImage(name)} className="absolute top-1 right-1 bg-black/40 text-white rounded-full p-1 hover:bg-black/70 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <label htmlFor={`image-upload-${name.replace(/\s+/g, '-')}`} className="cursor-pointer flex-1">
                              <Button as="div" variant="secondary" size="sm" className="w-full gap-1.5 text-xs">
                                <UploadCloud className="w-4 h-4" />
                                <span>Upload</span>
                              </Button>
                              <input id={`image-upload-${name.replace(/\s+/g, '-')}`} type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e, name)} />
                            </label>
                            <Button onClick={() => setCameraForProduct(name)} variant="secondary" size="sm" className="flex-1 gap-1.5 text-xs">
                              <CameraIcon className="w-4 h-4" />
                              <span>Take Photo</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-200 mt-2">
                  <Button onClick={handleAddProducts} className="gap-1.5" size="md" disabled={totalProductsToAdd === 0 || !duration.trim()}>
                      <Plus className="w-5 h-5" /> 
                      Add {totalProductsToAdd > 0 ? `${totalProductsToAdd} Product${totalProductsToAdd > 1 ? 's' : ''}` : 'Product'}
                  </Button>
              </div>
            </div>
            
            {pastProducts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-brand-text-main mb-4">Your Products:</h3>
                <ul className="space-y-3 max-h-[18rem] overflow-y-auto pr-2 -mr-2">
                  {pastProducts.map(p => (
                    <li key={p.id} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-soft animate-fade-in-up">
                        <div className="flex items-center gap-4 flex-grow min-w-0">
                            {p.image ? <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover border border-slate-200 flex-shrink-0" /> : <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 flex-shrink-0"><ImageIcon className="w-6 h-6 text-slate-400" /></div>}
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-base text-brand-text-main truncate">{p.name}</p>
                                <p className={`text-sm font-medium ${p.isUsing ? 'text-green-600' : 'text-slate-500'}`}>{p.isUsing ? 'Currently using' : 'Used in past'} for {p.duration}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                           <Button
                                onClick={() => handleRemoveProduct(p.id)}
                                variant="secondary"
                                size="sm"
                                className="!border-slate-300 !text-red-600 hover:!bg-red-50 hover:!border-red-400 gap-1.5"
                            >
                                <TrashIcon className="w-4 h-4" />
                                <span>Remove</span>
                            </Button>
                        </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex justify-end mt-8 pt-6 border-t border-slate-200">
            <Button onClick={onNext} variant="primary" size="lg">
              Next: Analyze My Skin
            </Button>
          </div>
          {cameraForProduct && (
            <CameraCapture
                onCapture={handlePhotoCapture}
                onClose={() => setCameraForProduct(null)}
            />
          )}
        </Card>
    </div>
  );
};

export default Step1PastProducts;