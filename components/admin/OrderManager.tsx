import React, { useContext, useState } from 'react';
import { DataContext } from '../../contexts/DataContext';
import type { Order, OrderStatus } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import Modal from '../Modal';
import { FaEye } from 'react-icons/fa';

const OrderManager: React.FC = () => {
    const { orders, updateOrderStatus } = useContext(DataContext);
    const { t } = useTranslation();
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

    const handleStatusChange = (orderId: number, status: OrderStatus) => {
        updateOrderStatus(orderId, status);
    };

    const statuses: OrderStatus[] = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('admin_orders_title')}</h2>
            <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3">{t('admin_orders_table_id')}</th>
                            <th className="px-6 py-3">{t('admin_orders_table_customer')}</th>
                            <th className="px-6 py-3">{t('admin_orders_table_date')}</th>
                            <th className="px-6 py-3">{t('admin_orders_table_total')}</th>
                            <th className="px-6 py-3">{t('admin_orders_table_status')}</th>
                            <th className="px-6 py-3">{t('admin_orders_table_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...orders].reverse().map(order => (
                            <tr key={order.id} className="border-b dark:border-gray-700">
                                <td className="px-6 py-4">#{order.id}</td>
                                <td className="px-6 py-4 font-medium">{order.customer.name}</td>
                                <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{order.total} MAD</td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                        className="p-1 rounded-md bg-gray-100 dark:bg-brand-dark border-gray-300 dark:border-gray-600"
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{t(`order_status_${s}`)}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => setViewingOrder(order)} className="text-blue-600 hover:text-blue-800"><FaEye /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {viewingOrder && (
                <Modal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)}>
                    <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-8 max-w-2xl w-full">
                        <h2 className="text-2xl font-bold mb-4">{t('order_details_title')} #{viewingOrder.id}</h2>
                        <div className="mb-4">
                            <p><strong>{t('admin_orders_table_customer')}:</strong> {viewingOrder.customer.name}</p>
                            <p><strong>{t('checkout_email')}:</strong> {viewingOrder.customer.email}</p>
                            <p><strong>{t('checkout_phone')}:</strong> {viewingOrder.customer.phone}</p>
                            <p><strong>{t('checkout_address')}:</strong> {viewingOrder.customer.address}, {viewingOrder.customer.city}, {viewingOrder.customer.postalCode}</p>
                        </div>
                        <ul className="space-y-2 border-t pt-4">
                            {viewingOrder.items.map((item, index) => (
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
                        <p className="text-right font-bold text-lg mt-4 border-t pt-4">Total: {viewingOrder.total} MAD</p>
                    </div>
                </Modal>
            )}
        </section>
    );
};

export default OrderManager;