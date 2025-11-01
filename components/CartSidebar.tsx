import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useTranslation } from '../hooks/useTranslation';
import { FaShoppingCart, FaTimes, FaTrash } from 'react-icons/fa';
import { Page } from '../constants';

interface CartSidebarProps {
    onNavigate: (page: Page) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ onNavigate }) => {
    const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { t, direction } = useTranslation();

    const backdropVariants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    const sidebarVariants = {
        visible: { x: 0 },
        hidden: { x: direction === 'rtl' ? '-100%' : '100%' },
    };

    const handleCheckout = () => {
        closeCart();
        onNavigate(Page.Checkout);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 z-[999]"
                    onClick={closeCart}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        className="fixed top-0 bottom-0 w-full max-w-md bg-white dark:bg-brand-dark-secondary shadow-xl flex flex-col"
                        style={direction === 'rtl' ? { left: 0 } : { right: 0 }}
                        variants={sidebarVariants}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FaShoppingCart /> {t('cart_title')}
                            </h2>
                            <button onClick={closeCart} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FaTimes />
                            </button>
                        </header>
                        
                        <div className="flex-grow overflow-y-auto p-4">
                            {cartItems.length > 0 ? (
                                <ul className="space-y-4">
                                    {cartItems.map(item => (
                                        <li key={item.cartId} className="flex gap-4">
                                            <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                            <div className="flex-grow">
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {Object.entries(item.selectedVariants).map(([name, value]) => {
                                                        const variant = item.variants.find(v => v.name === name);
                                                        if (variant?.type === 'color') {
                                                            return (
                                                                <div key={name} className="flex items-center gap-1.5">
                                                                    <span>{name}:</span>
                                                                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: value }} />
                                                                </div>
                                                            )
                                                        }
                                                        return <span key={name} className="mr-2">{name}: {value}</span>;
                                                    })}
                                                </div>
                                                <p className="font-bold text-brand-green dark:text-brand-gold mt-1">{item.price * item.quantity} MAD</p>
                                            </div>
                                            <div className="flex flex-col items-end justify-between">
                                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                                    <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="px-2 py-1">-</button>
                                                    <span className="px-3">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="px-2 py-1">+</button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:text-red-700 mt-2">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-16">
                                    <FaShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-4 text-gray-500">{t('cart_empty')}</p>
                                </div>
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold">{t('cart_subtotal')}:</span>
                                    <span className="text-xl font-bold">{cartTotal} MAD</span>
                                </div>
                                <button onClick={handleCheckout} className="w-full bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-bold py-3 px-6 rounded-lg hover:bg-brand-green-dark dark:hover:bg-amber-400 transition duration-300">
                                    {t('cart_checkout')}
                                </button>
                            </footer>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;