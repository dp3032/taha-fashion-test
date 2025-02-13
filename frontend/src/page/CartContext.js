import React, { createContext, useContext, useState, useEffect } from 'react';

// Create CartContext
const CartContext = createContext();
const apiUrl = process.env.REACT_APP_BASE_URL;

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({});

    useEffect(() => {
        const storedCart = sessionStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        if (Object.keys(cart).length > 0) {
            sessionStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            if (updatedCart[product._id]) {
                updatedCart[product._id].quantity += 1;
            } else {
                updatedCart[product._id] = { ...product, quantity: 1 };
            }
            return updatedCart;
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            delete updatedCart[productId];
            return updatedCart;
        });
    };

    const fetchStock = async (productId) => {
        try {
            const response = await fetch(`${apiUrl}/product/${productId}/stock`);
            const data = await response.json();
            return data.stock;
        } catch (error) {
            console.error('Error fetching stock:', error);
            return 0;
        }
    };

    const handleupdate = async (productId, operation) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };

            if (updatedCart[productId]) {
                const currentQuantity = updatedCart[productId].quantity;

                if (operation === 'increase') {
                    fetchStock(productId).then((stock) => {
                        if (currentQuantity < stock) {
                            updatedCart[productId] = {
                                ...updatedCart[productId],
                                quantity: currentQuantity + 1,
                            };
                            setCart(updatedCart);
                        } else {
                            alert('Not Available More than Stock');
                        }
                    });
                } else if (operation === 'decrease' && currentQuantity > 1) {
                    updatedCart[productId] = {
                        ...updatedCart[productId],
                        quantity: currentQuantity - 1,
                    };
                    setCart(updatedCart);
                }
            }

            return updatedCart;
        });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, handleupdate }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
