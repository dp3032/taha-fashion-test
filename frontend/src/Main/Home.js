import React from "react";
import LimitedProductApi from "../product/LimitedProductApi";
import Instagram from "../page/Instagram";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { useEffect } from "react";
import axios from "axios";
import Banner from "../page/Banner";
import MainBanner from "../page/MainBanner";
import "react-toastify/dist/ReactToastify.css";


function Home(){

    const apiUrl = process.env.REACT_APP_BASE_URL;
  
    useEffect(() => {
        axios.get(`${apiUrl}/chart-api/api/home`, {
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY,
            },
          })
          .then((response) => {
          })
          .catch((error) => {
            console.error("There was an error incrementing the view count!", error);
          });
      },[apiUrl]);
      

    return(
        <>  
            <Header/>

                <MainBanner/>

                <Banner/>
                        
                <LimitedProductApi/>
            
                <Instagram/>

            <Footer/>
        </>
    )
}

export default Home;