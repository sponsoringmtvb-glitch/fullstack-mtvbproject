import React, { createContext, useState, useEffect, useMemo } from 'react';
import type { CartItem, Product } from '../types';
import { useToasts } from '../hooks/useToasts';

interface ICartContext {
    cartItems: CartItem[];
    addToCart: (product: Product, selectedVariants: { [key: string]: string }, quantity?: number) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    toggleCart: () => void;
    closeCart: () => void;
}

export const CartContext = createContext<ICartContext>({} as ICartContext);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { addToast } = useToasts();
    
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            setCartItems([]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: Product, selectedVariants: { [key: string]: string }, quantity = 1) => {
        const variantString = Object.keys(selectedVariants).sort().map(key => `${key}-${selectedVariants[key]}`).join('_');
        const cartId = `${product.id}-${variantString}`;

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.cartId === cartId);
            if (existingItem) {
                return prevItems.map(item => 
                    item.cartId === cartId 
                        ? { ...item, quantity: item.quantity + quantity } 
                        : item
                );
            }
            return [...prevItems, { ...product, cartId, quantity, selectedVariants }];
        });
        addToast(`${product.name} added to cart`, 'success');
        setIsCartOpen(true);
    };

    const removeFromCart = (cartId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(cartId);
            return;
        }
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.cartId === cartId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };
    
    const toggleCart = () => setIsCartOpen(prev => !prev);
    const closeCart = () => setIsCartOpen(false);

    const { itemCount, cartTotal } = useMemo(() => {
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { itemCount: count, cartTotal: total };
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        cartTotal,
        isCartOpen,
        toggleCart,
        closeCart
    };
    
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};