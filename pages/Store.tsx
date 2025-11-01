import React, { useContext, useState, useEffect, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import { useCart } from '../hooks/useCart';
import { useTranslation } from '../hooks/useTranslation';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import { FaShoppingBag, FaSearch } from 'react-icons/fa';
import type { Product } from '../types';
import classNames from 'classnames';

const Store: React.FC = () => {
    const { products } = useContext(DataContext);
    const { addToCart } = useCart();
    const { t } = useTranslation();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
    const [activeImage, setActiveImage] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products]);

    const filteredProducts = useMemo(() => products
        .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())), 
    [products, selectedCategory, searchTerm]);
    
    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
    };

    useEffect(() => {
        if (selectedProduct) {
            const initialVariants: { [key: string]: string } = {};
            selectedProduct.variants.forEach(variant => {
                if (variant.options.length > 0) {
                    initialVariants[variant.name] = variant.options[0].value;
                }
            });
            setSelectedVariants(initialVariants);
            setActiveImage(selectedProduct.images[0]);
        }
    }, [selectedProduct]);
    
    const handleVariantChange = (variantName: string, value: string) => {
        setSelectedVariants(prev => ({ ...prev, [variantName]: value }));
    };

    const handleAddToCart = () => {
        if (selectedProduct && selectedProduct.stock > 0) {
            addToCart(selectedProduct, selectedVariants);
            setSelectedProduct(null);
        }
    };

    const renderVariantSelector = (variant: Product['variants'][0]) => {
        const selectedValue = selectedVariants[variant.name];
        switch (variant.type) {
            case 'color':
                return (
                    <div className="flex flex-wrap gap-2">
                        {variant.options.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleVariantChange(variant.name, option.value)}
                                style={{ backgroundColor: option.value }}
                                className={classNames('w-8 h-8 rounded-full border-2', {
                                    'ring-2 ring-offset-2 ring-brand-green dark:ring-brand-gold ring-offset-white dark:ring-offset-brand-dark-secondary': selectedValue === option.value,
                                    'border-gray-300 dark:border-gray-500': selectedValue !== option.value
                                })}
                                aria-label={`Select ${option.label || option.value}`}
                                title={option.label || option.value}
                            />
                        ))}
                    </div>
                );
            case 'button':
                return (
                    <div className="flex flex-wrap gap-2">
                        {variant.options.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleVariantChange(variant.name, option.value)}
                                className={`px-4 py-2 border rounded-md text-sm font-medium ${selectedValue === option.value ? 'bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark' : 'bg-gray-100 dark:bg-brand-dark hover:bg-gray-200'}`}
                            >
                                {option.label || option.value}
                            </button>
                        ))}
                    </div>
                );
            case 'dropdown':
                 return (
                    <select
                        value={selectedValue}
                        onChange={(e) => handleVariantChange(variant.name, e.target.value)}
                        className="w-full p-2 border rounded-md bg-white dark:bg-brand-dark"
                    >
                        {variant.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label || option.value}
                            </option>
                        ))}
                    </select>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <FaShoppingBag className="mx-auto h-12 w-12 text-brand-green dark:text-brand-gold" />
                <h1 className="text-4xl font-bold text-brand-green-dark dark:text-brand-light-text mt-4">{t('store_page_title')}</h1>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder={t('store_search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-2 border rounded-md bg-white dark:bg-brand-dark-secondary"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border rounded-md bg-white dark:bg-brand-dark-secondary"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? t('store_filter_all_categories') : cat}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onViewDetails={() => handleViewDetails(product)} />
                ))}
            </div>

            {selectedProduct && (
                <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
                    <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-6 sm:p-8 max-w-4xl w-full text-brand-dark-text dark:text-brand-light-text max-h-[90vh] overflow-y-auto">
                         <h2 className="text-2xl font-bold mb-6 text-brand-dark-text dark:text-brand-light-text">{t('product_details_title')}</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="relative">
                                    <img src={activeImage} alt={selectedProduct.name} className="w-full h-96 object-contain rounded-lg mb-4" />
                                    {selectedProduct.stock === 0 && (
                                        <div className="absolute top-3 right-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full uppercase">{t('product_out_of_stock')}</div>
                                    )}
                                </div>
                                <div className="flex gap-2 justify-center">
                                    {selectedProduct.images.map((img, index) => (
                                        <img 
                                            key={index} 
                                            src={img} 
                                            alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                                            onClick={() => setActiveImage(img)}
                                            className={classNames("w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all", {
                                                'border-brand-green dark:border-brand-gold': activeImage === img,
                                                'border-transparent hover:border-gray-300': activeImage !== img
                                            })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-3xl font-bold mb-2">{selectedProduct.name}</h3>
                                <p className="text-2xl font-semibold text-brand-green dark:text-brand-gold mb-4">{selectedProduct.price} MAD</p>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">{selectedProduct.description}</p>
                                
                                <div className="space-y-6 mb-6">
                                    {selectedProduct.variants.map(variant => (
                                        <div key={variant.name}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{variant.name}</label>
                                            {renderVariantSelector(variant)}
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={handleAddToCart}
                                    disabled={selectedProduct.stock === 0}
                                    className="w-full flex justify-center items-center gap-2 bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-bold py-3 px-6 rounded-lg hover:bg-brand-green-dark dark:hover:bg-amber-400 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <FaShoppingBag /> {selectedProduct.stock === 0 ? t('product_out_of_stock') : t('product_add_to_cart')}
                                </button>
                            </div>
                         </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Store;