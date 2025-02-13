import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [is_user_login, setIsUserLogin] = useState(false); 
    const location = useLocation(); 
    
    const iconStyle = {
        color: 'black',
        marginLeft: '120px',
        marginTop: '-45px',
        cursor: 'pointer',
        position:'absolute',
    };

    const cartpage = () => {
        window.location.href="/cart";
    }

    useEffect(() => {
      if (!sessionStorage.getItem('isTabOpen')) {
        sessionStorage.setItem('isTabOpen', 'true'); 
      }
      return () => {
        sessionStorage.removeItem('isTabOpen');
      };
    }, []);

    useEffect(() => {
      const isTabOpen = sessionStorage.getItem('isTabOpen');
      if (isTabOpen) {
        sessionStorage.removeItem('isTabOpen');
      }
    }, []);

    useEffect(() => {
        const userLoginStatus = sessionStorage.getItem('role');
        if (userLoginStatus === 'user') {
            setIsUserLogin(true);
        } else {
            setIsUserLogin(false);
        }
    }, []); 

    useEffect(() => {
        window.scrollTo(0,0);
    }, [location]);

    // Toggle the menu state
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Check if the current path is active
    const isActive = (path) => location.pathname === path;

    const isShopActive = () => {
        const shopPaths = ['/shop', '/productdetils', '/filterproduct', '/filtersize'];
        return shopPaths.includes(location.pathname);
    };

    // Logout function
    const UserLogout = () => {
        const confirmation = window.confirm("Are you sure you want to log out?");
        if (confirmation) {
            sessionStorage.clear();
            alert("Logout successful...!");
            window.location.href = "/";
        }
    }

    // Handle clicking outside to close the menu
    const handleOutsideClick = (e) => {
        if (!e.target.closest('.offcanvas-menu-wrapper') && !e.target.closest('.canvas__open')) {
            setIsMenuOpen(false);
        }
    };

    // UseEffect to handle clicks outside
    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <>
            <div id="preloder">
                <div className="loader"></div>
            </div>

            {/* Off-canvas menu overlay */}
            <div className={`offcanvas-menu-overlay ${isMenuOpen ? 'active' : ''}`}></div>

            {/* Off-canvas menu wrapper */}
            <div className={`offcanvas-menu-wrapper ${isMenuOpen ? 'active' : ''}`}>
                <div className="offcanvas__nav__option">
                    <span> Manu </span> 
                    <span className="closebar" onClick={toggleMenu}> <i className="fa fa-times" aria-hidden="true"></i>  </span>
                </div>
                <div id="mobile-menu-wrap">
                    {/* Mobile menu content */}
                    <ul>
                        <li><a href="/" className={`mobileview ${isActive('/') ? 'active' : ''}`}>Home</a></li>
                        <li><a href="/shop" className={`mobileview ${isActive('/shop') ? 'active' : ''}`}>Shop</a></li>
                        {is_user_login && (
                            <>
                                <li><a href="/cart" className={`mobileview ${isActive('/cart') ? 'active' : ''}`}>Cart</a></li>
                                <li><a href="/myorder" className={`mobileview ${isActive('/myorder') ? 'active' : ''}`}>My Order</a></li>
                            </>
                        )}
                        <li><a href="/aboutus" className={`mobileview ${isActive('/aboutus') ? 'active' : ''}`}>About Us</a></li>
                        <li><a href="/contacts" className={`mobileview ${isActive('/contacts') ? 'active' : ''}`}>Contacts</a></li>
                        {is_user_login ? (
                            <>
                                <li><a href="/forgotpassword" className={`mobileview ${isActive('/forgot-password') ? 'active' : ''}`}>Forgot Password</a></li>
                                <li><button onClick={UserLogout} className="mobileview btn btn-light p-0">Logout</button></li>
                            </>
                        ) : (
                            <li><a href="/login" className={`mobileview ${isActive('/login') ? 'active' : ''}`}> Login </a> </li> 
                        )}
                    </ul>
                </div>
                <div className="offcanvas__text">
                    {/* Off-canvas additional text/content */}
                </div>
            </div>

            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 col-md-2">
                            <div className="header__logo">
                                <a href="/">
                                    <img src="../img/taha-fashion-logo.png" alt="Loading..." />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <nav className="header__menu mobile-menu">
                                <ul>
                                    <li><a href="/" className={isActive('/') ? 'active' : ''}>Home</a></li>
                                    <li><a href="/shop" className={isShopActive() ? 'active' : ''}>Shop</a></li>
                                    {is_user_login && (
                                        <li>
                                            <p className="page">Pages</p>
                                            <ul className="dropdown">
                                                <li><a href="/cart" className={`prouser ${isActive('/cart') ? 'active' : ''}`}>Cart</a></li>
                                                <li><a href="/myorder" className={`prouser ${isActive('/myorder') ? 'active' : ''}`}>My Order</a></li>
                                            </ul>
                                        </li>
                                    )}
                                    <li><a href="/aboutus" className={isActive('/aboutus') ? 'active' : ''}>About Us</a></li>
                                    <li><a href="/contacts" className={isActive('/contacts') ? 'active' : ''}>Contacts</a></li>
                                    {is_user_login ? (
                                        <li>
                                            <p className="page">My Profile</p>
                                            <ul className="dropdown">
                                                <li><a href="/forgotpassword" className={`prouser ${isActive('/forgot-password') ? 'active' : ''}`}>Forgot Password</a></li>
                                                <li> <button onClick={UserLogout} className="logoutbtn"> Logout </button>  </li>
                                            </ul>
                                        </li>
                                    ) : (
                                        <li><a href="/login">Login</a></li>
                                    )}
                                </ul>
                            </nav>
                        </div>
                        <div className="col-lg-2">
                            <nav className="header__menu mobile-menu">
                                {is_user_login ? (
                                    <>
                                        <p className="username">Hello {sessionStorage.getItem("name")}</p>
                                        <lord-icon src="https://cdn.lordicon.com/ggirntso.json"
                                            trigger="morph" stroke="bold"
                                            style={iconStyle} onClick={cartpage}>
                                        </lord-icon>
                                    </>
                                ) : null}
                            </nav>
                        </div>
                    </div>

                    {/* Button to toggle the off-canvas menu */}
                    <div className="canvas__open" onClick={toggleMenu}>
                        <i className="fa fa-bars"></i>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;