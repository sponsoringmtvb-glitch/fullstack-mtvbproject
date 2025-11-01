import React, { useRef, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { FaUpload, FaLink, FaTimes } from 'react-icons/fa';

interface MultiImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ images, onImagesChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          newImageUrls.push(URL.createObjectURL(file));
        }
      }
      onImagesChange([...images, ...newImageUrls]);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleUrlAdd = () => {
    if (urlInput.trim()) {
      const urls = urlInput.split(',').map(url => url.trim()).filter(Boolean);
      onImagesChange([...images, ...urls]);
      setUrlInput('');
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };
  
  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  }

  return (
    <div className="space-y-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
        {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square">
                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md" />
                        <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove image ${index + 1}`}
                        >
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>
        )}
      
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={triggerFileSelect}
          className="flex-1 flex items-center justify-center gap-2 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <FaUpload />
          {t('image_uploader_upload')}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
        
        <span className="text-xs text-gray-500">{t('image_uploader_or')}</span>
        
         <div className="flex-1 relative flex">
            <div className="relative flex-grow">
                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Paste one or more image URLs, comma-separated"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full p-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-brand-dark"
                />
            </div>
            <button type="button" onClick={handleUrlAdd} className="bg-brand-green text-white px-3 rounded-r-md text-sm">Add</button>
        </div>
      </div>
    </div>
  );
};

export default MultiImageUploader;