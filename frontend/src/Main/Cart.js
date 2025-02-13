import React, { useEffect } from 'react';
import { useCart } from '../page/CartContext';
import Footer from "../component/Footer";
import Header from '../component/Header';
import config from "../config";

function Cart() {
    const shippingCharge = config.SHIPPING_CHARGE;
    
    const { cart, removeFromCart, handleupdate } = useCart();
    const cartItems = Object.values(cart);

    

    const handleRemoveFromCart = (productId) => {
        removeFromCart(productId);
        sessionStorage.removeItem("cart", "");
    };

    useEffect(() => {
        const user_id = sessionStorage.getItem('user_id');
        if (!user_id) {
            alert("Login is required!");
            window.location.href = "/login";
        }
    }, []);

    return (
        <>
            <Header />

            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>Shopping Cart</h4>
                                <div className="breadcrumb__links">
                                    <a href="/">Home</a>
                                    <a href="/shop">Shop</a>
                                    <span>Shopping Cart</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="shopping-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="shopping__cart__table">
                                <table className="table-hover">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Size</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.length > 0 ? (
                                            cartItems.map(item => (
                                                <tr key={item._id}>
                                                    <td className="product__cart__item">
                                                        <div className="product__cart__item__pic">
                                                            <img src={item.Product_img[0]} alt={item.Product_name} />
                                                        </div>
                                                        <div className="product__cart__item__text">
                                                            <h6>{item.Product_name}</h6>
                                                            <h5>Price : {item.Product_price}</h5>
                                                        </div>
                                                    </td>
                                                    <td className="product__cart__item__text">
                                                        {item.selectedSize}
                                                    </td>
                                                    <td className="quantity__item">
                                                        <div className="quantity">
                                                            <button onClick={() => handleupdate(item._id, 'decrease')}>-</button>
                                                            <input type="number" value={item.quantity} readOnly />
                                                            <button onClick={() => handleupdate(item._id, 'increase')}>+</button>
                                                        </div>
                                                    </td>
                                                    <td className="cart__price">{item.Product_price * item.quantity}</td>
                                                    <td className="cart__close">
                                                        <i className="fa fa-close"
                                                            onClick={() => handleRemoveFromCart(item._id)}>
                                                        </i>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4">Your cart is empty</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <span>Note : Onse Order Are Pleaced Then This Order Are Not Cancellation / Return </span>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="continue__btn">
                                        <a href="/shop">Continue Shopping</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="cart__total">
                                <h6>Cart total</h6>
                                <ul>
                                    {cartItems.length > 0 ? (
                                        cartItems.map(item => (
                                            <li key={item._id}>
                                                {item.Product_name} x {item.quantity} 
                                                <span>{item.Product_price * item.quantity}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No Product Available</li>
                                    )}
                                    <hr />
                                    <li>Sub Total <span>{cartItems.reduce((total, item) => total + item.Product_price * item.quantity, 0)}</span></li>
                                    <li>Shopping Charges <span>+ {shippingCharge}</span></li>
                                    <li>Total 
                                        <span>
                                            {cartItems.reduce((total, item) => total + item.Product_price * item.quantity, 0) + Number(shippingCharge)}
                                        </span>
                                    </li>
                                </ul>
                                <a
                                    href="/checkout"
                                    className="primary-btn"
                                    disabled={cartItems.length === 0}
                                    style={{ pointerEvents: cartItems.length === 0 ? 'none' : 'auto', opacity: cartItems.length === 0 ? 0.5 : 1 }}>
                                    Proceed to checkout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Cart;
