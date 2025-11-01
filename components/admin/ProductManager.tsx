import React, { useState, useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import type { Product } from '../../types';
import ProductForm from './ProductForm';
import { useTranslation } from '../../hooks/useTranslation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ProductManager: React.FC = () => {
    const { products, deleteProduct } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const { t } = useTranslation();

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t('admin_products_delete_confirm'))) {
            deleteProduct(id);
        }
    };

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('admin_products_title')}</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark"
                >
                    <FaPlus className="mr-2" />
                    {t('admin_products_add_button')}
                </button>
            </div>
            <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin_products_table_product')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_products_table_category')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_products_table_stock')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_products_table_price')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_products_table_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="bg-white dark:bg-brand-dark-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-4">
                                    <img src={product.images?.[0]} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                                    <span>{product.name}</span>
                                </td>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4">{product.price} MAD</td>
                                <td className="px-6 py-4 flex space-x-4">
                                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800"><FaEdit size={18} /></button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800"><FaTrash size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ProductForm
                    product={editingProduct}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </section>
    );
};

export default ProductManager;