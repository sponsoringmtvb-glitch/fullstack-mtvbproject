import React, { useState, useContext } from 'react';
import { useCart } from '../hooks/useCart';
import { useTranslation } from '../hooks/useTranslation';
import { DataContext } from '../contexts/DataContext';
import { FaShoppingCart } from 'react-icons/fa';
import type { Order } from '../types';
import { Page } from '../constants';

interface CheckoutProps {
    onCheckoutSuccess: (orderId: number) => void;
    onNavigate: (page: Page) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onCheckoutSuccess }) => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { addOrder } = useContext(DataContext);
    const { t } = useTranslation();
    const [customer, setCustomer] = useState({
        name: '', email: '', phone: '', address: '', city: '', postalCode: ''
    });

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <FaShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
                <h2 className="mt-4 text-2xl font-bold">{t('cart_empty')}</h2>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newOrder: Omit<Order, 'id'> = {
            customer,
            items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                selectedVariants: item.selectedVariants
            })),
            total: cartTotal,
            status: 'Pending',
            date: new Date().toISOString()
        };
        const newOrderId = addOrder(newOrder);
        if (newOrderId !== null) {
            clearCart();
            onCheckoutSuccess(newOrderId);
        }
    };
    
    const inputClasses = "w-full px-4 py-2 bg-gray-100 dark:bg-brand-dark border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-gold";

    return (
        <div>
            <h1 className="text-4xl font-bold text-center mb-10">{t('checkout_title')}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold mb-6">{t('checkout_shipping_details')}</h2>
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-brand-dark-secondary p-8 rounded-lg shadow-md space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="name" placeholder={t('checkout_name')} required onChange={handleChange} className={inputClasses} />
                            <input type="email" name="email" placeholder={t('checkout_email')} required onChange={handleChange} className={inputClasses} />
                        </div>
                        <input type="tel" name="phone" placeholder={t('checkout_phone')} required onChange={handleChange} className={inputClasses} />
                        <input type="text" name="address" placeholder={t('checkout_address')} required onChange={handleChange} className={inputClasses} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="city" placeholder={t('checkout_city')} required onChange={handleChange} className={inputClasses} />
                            <input type="text" name="postalCode" placeholder={t('checkout_postal_code')} required onChange={handleChange} className={inputClasses} />
                        </div>
                        <div className="pt-4">
                            <p className="text-sm text-gray-500 mb-4 text-center">{t('checkout_cod_notice')}</p>
                            <button type="submit" className="w-full bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-bold py-3 px-6 rounded-lg hover:bg-brand-green-dark dark:hover:bg-amber-400 transition">
                                {t('checkout_place_order')}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-semibold mb-6">{t('checkout_order_summary')}</h2>
                    <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-md space-y-4">
                        {cartItems.map(item => (
                            <div key={item.cartId} className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    <div>
                                        <p className="font-semibold">{item.name} (x{item.quantity})</p>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {Object.entries(item.selectedVariants).map(([name, value]) => (
                                                <span key={name} className="mr-2">{name}: {value}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="font-semibold whitespace-nowrap">{item.price * item.quantity} MAD</p>
                            </div>
                        ))}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center font-bold text-lg">
                            <span>{t('cart_subtotal')}:</span>
                            <span>{cartTotal} MAD</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;