import React, { useContext } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { FaCheckCircle } from 'react-icons/fa';
import { Page } from '../constants';
import { DataContext } from '../contexts/DataContext';

interface OrderConfirmationProps {
    orderId: number | null;
    onNavigate: (page: Page) => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderId, onNavigate }) => {
    const { t } = useTranslation();
    const { orders } = useContext(DataContext);
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Order not found.</h2>
                <button onClick={() => onNavigate(Page.Home)} className="mt-6 bg-brand-green text-white font-bold py-2 px-6 rounded-lg">
                    Go to Homepage
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <FaCheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
            <h1 className="text-4xl font-bold mb-4">{t('order_confirmation_title')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{t('order_confirmation_message')}</p>
            <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-md text-left space-y-4">
                <p><strong>{t('order_confirmation_id')}:</strong> #{order.id}</p>
                <p><strong>{t('checkout_name')}:</strong> {order.customer.name}</p>
                <p><strong>Total:</strong> {order.total} MAD</p>
                <h3 className="font-bold pt-4 border-t mt-4">Items:</h3>
                <ul className="space-y-2">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                            <div>
                                <p>{item.name} (x{item.quantity})</p>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {Object.entries(item.selectedVariants).map(([name, value]) => (
                                        <span key={name} className="mr-2">{name}: {value}</span>
                                    ))}
                                </div>
                            </div>
                            <span>{item.price * item.quantity} MAD</span>
                        </li>
                    ))}
                </ul>
            </div>
            <button 
                onClick={() => onNavigate(Page.Store)}
                className="mt-8 bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-bold py-3 px-8 rounded-lg hover:bg-brand-green-dark dark:hover:bg-amber-400"
            >
                {t('order_confirmation_continue_shopping')}
            </button>
        </div>
    );
};

export default OrderConfirmation;