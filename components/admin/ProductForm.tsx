import React, { useState, useEffect, useContext } from 'react';
import type { Product, ProductVariant, VariantOption } from '../../types';
import Modal from '../Modal';
import { useTranslation } from '../../hooks/useTranslation';
import { DataContext } from '../../contexts/DataContext';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import MultiImageUploader from './MultiImageUploader';

interface ProductFormProps {
    product: Product | null;
    onClose: () => void;
}

const emptyProduct: Omit<Product, 'id'> = {
    name: '', description: '', price: 0, images: [], variants: [], category: '', stock: 0
};

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
    const { addProduct, updateProduct } = useContext(DataContext);
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Omit<Product, 'id'>>(emptyProduct);

    useEffect(() => {
        setFormData(product ? { ...product } : emptyProduct);
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: (name === 'price' || name === 'stock') ? Number(value) : value }));
    };

    const handleVariantChange = (variantIndex: number, field: keyof ProductVariant, value: any) => {
        const newVariants = [...formData.variants];
        (newVariants[variantIndex] as any)[field] = value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };
    
    const handleOptionChange = (variantIndex: number, optionIndex: number, field: keyof VariantOption, value: string) => {
        const newVariants = [...formData.variants];
        (newVariants[variantIndex].options[optionIndex] as any)[field] = value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({ ...prev, variants: [...prev.variants, { name: '', type: 'button', options: [{ value: '', label: ''}] }] }));
    };

    const removeVariant = (variantIndex: number) => {
        setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== variantIndex) }));
    };

    const addOption = (variantIndex: number) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].options.push({ value: '', label: '' });
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const removeOption = (variantIndex: number, optionIndex: number) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].options = newVariants[variantIndex].options.filter((_, i) => i !== optionIndex);
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            updateProduct({ ...formData, id: product.id });
        } else {
            addProduct(formData);
        }
        onClose();
    };
    
    const inputClasses = "mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark focus:ring-brand-green";

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{product ? t('product_form_edit_title') : t('product_form_add_title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" name="name" placeholder={t('product_form_name')} value={formData.name} onChange={handleChange} required className={inputClasses} />
                        <input type="text" name="category" placeholder={t('product_form_category')} value={formData.category} onChange={handleChange} required className={inputClasses} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="number" name="price" placeholder={t('product_form_price')} value={formData.price} onChange={handleChange} required className={inputClasses} />
                        <input type="number" name="stock" placeholder={t('product_form_stock')} value={formData.stock} onChange={handleChange} required className={inputClasses} />
                    </div>
                    <textarea name="description" placeholder={t('product_form_description')} value={formData.description} onChange={handleChange} required className={inputClasses} rows={3} />
                    
                    {/* Image Uploader */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('product_form_images')}</label>
                        <MultiImageUploader images={formData.images} onImagesChange={(images) => setFormData(p => ({...p, images}))} />
                    </div>

                    {/* Variants Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">{t('product_form_variants_title')}</h3>
                        {formData.variants.map((variant, vIndex) => (
                            <div key={vIndex} className="p-4 border rounded-lg bg-gray-50 dark:bg-brand-dark space-y-4">
                                <div className="flex items-center gap-4">
                                    <input type="text" placeholder={t('product_form_variant_name')} value={variant.name} onChange={(e) => handleVariantChange(vIndex, 'name', e.target.value)} className={inputClasses} />
                                    <select value={variant.type} onChange={(e) => handleVariantChange(vIndex, 'type', e.target.value)} className={inputClasses}>
                                        <option value="button">Button</option>
                                        <option value="color">Color</option>
                                        <option value="dropdown">Dropdown</option>
                                    </select>
                                    <button type="button" onClick={() => removeVariant(vIndex)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button>
                                </div>
                                <div className="space-y-3 pl-4 border-l-2 ml-2 border-gray-300 dark:border-gray-600">
                                     <label className="text-sm font-medium">{t('product_form_variant_options')}</label>
                                    {variant.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-center gap-2">
                                            {variant.type === 'color' && <input type="color" value={option.value} onChange={(e) => handleOptionChange(vIndex, oIndex, 'value', e.target.value)} className="p-0 border-none rounded h-8 w-8" />}
                                            <input type="text" placeholder={t('product_form_option_value')} value={option.value} onChange={(e) => handleOptionChange(vIndex, oIndex, 'value', e.target.value)} className={`${inputClasses} flex-1`} />
                                            <input type="text" placeholder={t('product_form_option_label')} value={option.label} onChange={(e) => handleOptionChange(vIndex, oIndex, 'label', e.target.value)} className={`${inputClasses} flex-1`} />
                                            <button type="button" onClick={() => removeOption(vIndex, oIndex)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addOption(vIndex)} className="text-sm text-brand-green dark:text-brand-gold flex items-center gap-1 hover:underline"><FaPlus size={12} /> {t('product_form_add_option')}</button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addVariant} className="flex items-center gap-2 bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-500"><FaPlus /> {t('product_form_add_variant')}</button>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">{t('player_form_cancel')}</button>
                        <button type="submit" className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-6 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400">{t('product_form_save')}</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ProductForm;