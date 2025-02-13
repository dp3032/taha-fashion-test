import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook , faInstagram , faWhatsapp} from "@fortawesome/free-brands-svg-icons";

function Footer(){
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch(`${apiUrl}/catgory-api/displaycategory`,{
          headers: {
              "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
          },
      })
          .then((response) => response.json())
          .then((data) => setCategories(data))
          .catch((error) => console.error('Error fetching categories', error));
      }, [apiUrl]);
    
      const handleCategoryClick = (categoryId) => {
        sessionStorage.setItem('selectedCategory', categoryId);  // Store category ID in session storage
        window.location.href = '/filterproduct';
      };
    

    return(
        <>
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="footer__about">
                                <div className="footer__logo">
                                    <a href="/"><img src="../img/taha-fashio-white-logo.png" alt="Loading..."/></a>
                                </div>
                                <p>The customer is at the heart of our unique business model, which includes design.</p>
                                
                                <FontAwesomeIcon icon={faFacebook} className="iconcolor" title="FaceBook" />
                                
                                <a href="https://www.instagram.com/tahafashionofficial/"> 
                                    <FontAwesomeIcon icon={faInstagram} className="iconcolor" title="Instgram"/> 
                                </a>
                                
                                <FontAwesomeIcon icon={faWhatsapp} className="iconcolor" title="Whatsapp" />

                            </div>
                        </div>
                        <div className="col-lg-3 offset-lg-1 col-md-3 col-sm-6">
                            <div className="footer__widget">
                                <h6> Top Categories</h6>
                                <ul>
                                    {categories.slice(0, 4).map((category) => (
                                        <li key={category._id}>
                                            <p className="foterptext" onClick={() => handleCategoryClick(category._id)} >
                                                {category.name}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6">
                            <div className="footer__widget">
                                <h6>Pages</h6>
                                <ul>
                                    <li> <a href="/"> Home </a> </li>
                                    <li> <a href="/shop"> Shop </a> </li>
                                    <li> <a href="/aboutus"> About Us </a> </li>
                                    <li> <a href="/contacts"> Contact Us </a> </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-3 col-sm-6">
                            <div className="footer__widget">
                                <h6>Terms</h6>
                                <ul>
                                    <li> <a href="/privacy-policy"> Privacy Policy </a> </li>
                                    <li> <a href="/terms-conditions"> Terms & Conditions </a> </li>
                                    <li> <a href="/refund-policy"> Refund Policy </a> </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="footer__copyright__text">
                                
                                <p>Copyright © 2025
                                    All rights reserved by <a href="https://grouptakey.com/" className="atagponit"> Group Takey </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;