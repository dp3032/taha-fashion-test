import React, { useState, useEffect } from 'react';

const LeftSide = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [isDropdownOpentwo, setIsDropdownOpentwo] = useState(false);
    const [isDropdownOpenthre, setIsDropdownOpenthre] = useState(false);
    // const [isDropdownOpenfour, setIsDropdownOpenfour] = useState(false);
    const [isDropdownOpenfive, setIsDropdownOpenfive] = useState(false);
    const [isDropdownOpensix, setIsDropdownOpensix] = useState(false);

    const Logout = () => {
        const confirmation = window.confirm("Are you sure you want to log out?");
        if (confirmation) {
            sessionStorage.clear();
            alert("Logout successful...!");
            window.location.href = "/";
        }
    }

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleDropdowntwo = () => {
        setIsDropdownOpentwo(prevState => !prevState);
    };

    const toggleDropdownthre = () => {
        setIsDropdownOpenthre(prevState => !prevState);
    };

    // const toggleDropdownfour = () => {
    //     setIsDropdownOpenfour(prevState => !prevState);
    // };

    const toggleDropdownfive = () => {
        setIsDropdownOpenfive(prevState => !prevState);
    };

    const toggleDropdownsix = () => {
        setIsDropdownOpensix(prevState => !prevState);
    };

    // Handle click outside to close sidebar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarCollapsed === false) {
                const sidebar = document.getElementById('sidebarMenu');
                const toggleButton = document.querySelector('.navbar-toggler');
                if (sidebar && !sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
                    setSidebarCollapsed(true);
                }
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [sidebarCollapsed]);

    useEffect(() => {
        document.title = "Taha Fashion - Admin"; 
      }, []);

    return (

        <>

            <header>
                <nav
                    id="sidebarMenu"
                    className={`collapse d-lg-block sidebar bg-white ${sidebarCollapsed ? '' : 'show'}`}
                >
                    <div className="position-sticky">
                        <div className="list-group list-group-flush mx-3 admintxt">
                            <a className="navbar-brand nvimg" href="/dashboard">
                                <img
                                    src="../img/taha-fashion-logo.png"
                                    height="60"
                                    alt="Loading..."
                                />
                            </a>
                           
                            {/* Icon Start */}
                            <a href="dashboard" className="list-group-item list-group-item-action py-2 ripple" aria-current="true">
                                <lord-icon src="https://cdn.lordicon.com/jeuxydnh.json" trigger="hover" state="roll-to-back"></lord-icon>
                                <p className="icontxt">Dashboard</p>
                            </a>

                            <a href="/userdisplay" className="list-group-item list-group-item-action py-2 ripple">
                                <lord-icon
                                    src="https://cdn.lordicon.com/kdduutaw.json"
                                    trigger="hover"
                                    state="morph-group">
                                </lord-icon>
                                <p className="icontxt">User Info</p>
                            </a>

                            <ul className="list-group-item list-group-item-action py-2 ripple dropul">
                                <lord-icon
                                    src="https://cdn.lordicon.com/dayinyqx.json"
                                    trigger="hover"
                                    state="hover-rack">
                                </lord-icon>
                                <li className="icontxt">
                                    <p className="dropp admintxt" onClick={toggleDropdowntwo}>Product</p>
                                    {isDropdownOpentwo && (
                                        <ul className="dropdown dropul">
                                            <li><a href="/addproduct" className="droptxt">Add Product</a></li>
                                            <li><a href="/addcategory" className="droptxt">Category</a></li>
                                            <li><a href="/product" className="droptxt">Display</a></li>
                                        </ul>
                                    )}
                                </li>
                            </ul>

                            <a href="/productreview" className="list-group-item list-group-item-action py-2 ripple">
                                <lord-icon
                                    src="https://cdn.lordicon.com/cvwrvyjv.json"
                                    trigger="hover"
                                    state="hover-wink">
                                </lord-icon>
                                <p className="icontxt">Review</p>
                            </a>

                            <a href="/analytics" className="list-group-item list-group-item-action py-2 ripple">
                                <lord-icon
                                    src="https://cdn.lordicon.com/fcyboqbm.json"
                                    trigger="hover"
                                    state="loop-all">
                                </lord-icon>
                                <p className="icontxt">Analytics</p>
                            </a>

                            <a href="/displayorder" className="list-group-item list-group-item-action py-2 ripple dropul">
                                <lord-icon
                                    src="icon/wired-outline-108-box-package.json"
                                    trigger="hover"
                                    state="loop-all">
                                </lord-icon>
                                <p className="icontxt">Order</p>
                            </a>

                            <ul className="list-group-item list-group-item-action py-2 ripple dropul">
                                <lord-icon
                                    src="https://cdn.lordicon.com/rszslpey.json"
                                    trigger="hover">
                                </lord-icon>
                                <li className="icontxt">
                                    <p className="dropp admintxt" onClick={toggleDropdownsix}>Gallery</p>
                                    {isDropdownOpensix && (
                                        <ul className="dropdown dropul">
                                            <li><a href="/main-admin-banner" className="droptxt">Main Banner</a></li>
                                            <li><a href="/homepage-gallery-admin" className="droptxt">Banner</a></li>
                                        </ul>
                                    )}
                                </li>
                            </ul>

                            <ul className="list-group-item list-group-item-action py-2 ripple dropul">
                                <lord-icon
                                    src="https://cdn.lordicon.com/vpbspaec.json"
                                    trigger="hover"
                                    state="loop-flying">
                                </lord-icon>
                                <li className="icontxt">
                                    <p className="dropp admintxt" onClick={toggleDropdownthre}>Contact</p>
                                    {isDropdownOpenthre && (
                                        <ul className="dropdown dropul">
                                            <li><a href="/admincontact" className="droptxt">Display</a></li>
                                            <li><a href="/contactinfomation" className="droptxt">Information</a></li>
                                        </ul>
                                    )}
                                </li>
                            </ul>

                            <a href="/report" className="list-group-item list-group-item-action py-2 ripple dropul">
                                <lord-icon
                                    src="https://cdn.lordicon.com/fjvfsqea.json"
                                    trigger="hover">
                                </lord-icon>
                                <p className="icontxt">Report</p>
                            </a>

                            <ul className="list-group-item list-group-item-action py-2 ripple dropul">
                                <lord-icon
                                    src="https://cdn.lordicon.com/shcfcebj.json"
                                    trigger="hover"
                                    state="hover-wave">
                                </lord-icon>
                                <li className="icontxt">
                                    <p className="dropp admintxt" onClick={toggleDropdownfive}>My Profile</p>
                                    {isDropdownOpenfive && (
                                        <ul className="dropdown dropul">
                                            <li> <a href="/adminpassword" className="droptxt">Password</a> </li>
                                            <li> <p onClick={Logout} className="droptxtt">Logout</p> </li>
                                        </ul>
                                    )}
                                </li>
                            </ul>

                        </div>
                    </div>
                </nav>
                <button
                    className="navbar-toggler mb-3"
                    type="button"
                    onClick={toggleSidebar}
                    aria-controls="sidebarMenu"
                    aria-expanded={sidebarCollapsed ? "false" : "true"}
                    aria-label="Toggle navigation"
                >
                    <i className="fa fa-bars"></i>
                </button>
            </header>
        </>
    );
};

export default LeftSide;
