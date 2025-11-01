import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { FaUpload, FaLink } from 'react-icons/fa';

interface ImageUploaderProps {
  currentImageUrl: string;
  onImageChange: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImageUrl, onImageChange }) => {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [isUrlMode, setIsUrlMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setImageUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl); // For preview
      // In a real app, you would upload the file and get a URL back.
      // For this demo, we'll just use the object URL which is temporary.
      onImageChange(objectUrl);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setImageUrl(url);
    onImageChange(url);
  };
  
  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  }

  return (
    <div className="space-y-2">
      <div className="w-full h-48 bg-gray-100 dark:bg-brand-dark rounded-md flex items-center justify-center overflow-hidden border border-dashed border-gray-300 dark:border-gray-600">
        {imageUrl ? (
          <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
        ) : (
          <span className="text-gray-400">Image Preview</span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={triggerFileSelect}
          className="flex-1 flex items-center justify-center gap-2 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <FaUpload />
          {t('image_uploader_upload')}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>
        
        <span className="text-xs text-gray-500">{t('image_uploader_or')}</span>
        
         <div className="flex-1 relative">
            <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('image_uploader_paste_url')}
              value={isUrlMode ? imageUrl : ''}
              onChange={handleUrlChange}
              onFocus={() => setIsUrlMode(true)}
              className="w-full p-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark"
            />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;