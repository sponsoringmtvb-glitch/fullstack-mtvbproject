import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import classNames from 'classnames';

interface ProductCardProps {
    product: Product;
    onViewDetails: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
    const { t } = useTranslation();
    const isOutOfStock = product.stock === 0;

    return (
        <motion.div
            className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-lg overflow-hidden flex flex-col group cursor-pointer"
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onViewDetails}
        >
            <div className="relative overflow-hidden">
                <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className={classNames("w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110", {
                        'grayscale': isOutOfStock
                    })} 
                />
                {isOutOfStock && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                        {t('product_out_of_stock')}
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-brand-dark-text dark:text-brand-light-text flex-grow">{product.name}</h3>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-semibold text-brand-green dark:text-brand-gold">{product.price} MAD</p>
                    <button className="text-sm font-semibold text-brand-green dark:text-brand-gold hover:underline">
                        {t('player_card_view_details')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;