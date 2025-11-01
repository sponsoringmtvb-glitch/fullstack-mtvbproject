import React, { useState, useContext } from 'react';
import type { GalleryPhoto } from '../types';
import { HiPhoto } from 'react-icons/hi2';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { initialGallery } from '../data/mockData'; // Assuming photos come from here for now
import EmptyState from '../components/EmptyState';
import { FaImage } from 'react-icons/fa';

const containerVariants = {
  hidden: { },
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryPhoto | null>(null);
  const { t } = useTranslation();
  const photos = initialGallery; // In a real app, this would come from DataContext

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <HiPhoto className="h-10 w-10 text-brand-green dark:text-brand-gold" />
        <h1 className="text-4xl font-bold text-brand-green-dark dark:text-brand-light-text">{t('gallery_page_title')}</h1>
      </div>
      {photos.length > 0 ? (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {photos.map((photo) => (
            <motion.div 
              key={photo.id} 
              className="group relative cursor-pointer" 
              onClick={() => setSelectedImage(photo)}
              variants={itemVariants}
              layoutId={`card-container-${photo.id}`}
            >
              <img 
                src={photo.imageUrl} 
                alt={photo.caption} 
                className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
                <p className="text-white text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
            icon={FaImage}
            title={t('empty_state_gallery_title')}
            message={t('empty_state_gallery_message')}
        />
      )}

      {selectedImage && (
        <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
            <motion.div layoutId={`card-container-${selectedImage.id}`}>
              <img src={selectedImage.imageUrl} alt={selectedImage.caption} className="max-w-full max-h-[80vh] rounded-lg" />
              <p className="text-center text-white mt-4">{selectedImage.caption}</p>
            </motion.div>
        </Modal>
      )}
    </div>
  );
};

export default Gallery;