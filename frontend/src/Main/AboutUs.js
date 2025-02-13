import React, { useEffect, useState } from "react";
import Footer from "../component/Footer";
import Header from "../component/Header";
// import HappyClients from "../page/HappyClients";
function AboutUs(){
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [productdata, Setproductdata] = useState([]);
    const [catgordata, Setcatgordata] = useState([]);

    // Fetch product data for Total Count
      useEffect(() => {
        fetch(`${apiUrl}/product-api/products`,{
          headers: {
              "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
          },
      })
        .then((response) => response.json())
        .then((data) => {
          Setproductdata(data);
        })
        .catch((error) => console.log("Something Wrong", error));
    },[apiUrl]);

    // Fetch product data for Total Count
    useEffect(() => {
        fetch(`${apiUrl}/catgory-api/displaycategory`,{
          headers: {
              "x-api-key": process.env.REACT_APP_API_KEY, 
          },
      })
        .then((response) => response.json())
        .then((data) => {
            Setcatgordata(data);
        })
        .catch((error) => console.log("Something Wrong", error));
    },[apiUrl]);
    
    return(
        <>
            <Header/>
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>About Us</h4>
                                <div className="breadcrumb__links">
                                    <a href="/"> Home </a>
                                    <span>About Us</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
            <section className="about spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="about__pic">
                                <img src="img/about/about-us-1.jpg" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="about__item">
                                <h4>Who We Are ?</h4>
                                <p> We are a dynamic fashion brand committed to d style and quality. 
                                    Our curated collections reflect the latest trends while focusing 
                                    on sustainability and individuality.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="about__item">
                                <h4>Who We Do ?</h4>
                                <p> We design and create high-quality fashion pieces that 
                                    empower individuals to express their unique style. 
                                    Our focus is on blending comfort, innovation, and 
                                    trendsetting designs for every occasion.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="about__item">
                                <h4>Why Choose Us</h4>
                                <p>Choose us for our commitment to quality, sustainability, 
                                    and cutting-edge designs. We offer fashion that not only 
                                    looks good but also feels great, made to last and inspire 
                                    confidence
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
           
            <section className="counter spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="counter__item">
                                <div className="counter__item__number">
                                    <h2 className="cn_num">{catgordata.length || null}</h2> 
                                </div>
                                <span>Total <br />Categories</span>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="counter__item">
                                <div className="counter__item__number">
                                    <h2 className="cn_num">{productdata.length || null}</h2>
                                </div>
                                <span>Our <br />Product</span>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="counter__item">
                                <div className="counter__item__number">
                                    <h2 className="cn_num">98</h2>
                                    <strong>%</strong>
                                </div>
                                <span>Happy <br />Customer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <HappyClients/> */}

            <Footer/>
        </>
    )
}

export default React.memo(AboutUs);