// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import axios from "axios"; // Axios for API calls

// // Import slick-carousel styles
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function HappyClients() {
//   const [clients, setClients] = useState([]); 
//   const apiUrl = process.env.REACT_APP_BASE_URL;

//   useEffect(() => {
//     // Fetch client data from the backend
//     const fetchClients = async () => {
//       try {
//         const response = await axios.get(`${apiUrl}/displayclient`, {
//             headers: {
//                 "x-api-key": process.env.REACT_APP_API_KEY,
//             },
//         }) 
//         setClients(response.data); 
//       } catch (error) {
//         console.error("Error fetching client data:", error);
//       }
//     };

//     fetchClients();
//   }, [apiUrl]);

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 900,
//     slidesToShow: 5,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     responsive: [
//       {
//         breakpoint: 1208,
//         settings: {
//           slidesToShow: 5,
//         },
//       },
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 4,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 3,
//         },
//       },
//       {
//         breakpoint: 620,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//     ],
//   };

//   return (
//     <section className="clients spad">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="section-title">
//               <h2>Happy Clients</h2>
//             </div>
//           </div>
//         </div>
//         <br/>
//         <Slider {...settings}>
//           {clients.length > 0 ? (
//             clients.map((client, index) => (
//               <div key={index}>
//                 <a href={client.link || "/aboutus"} className="client__item">
//                   <img src={client.Clients_img} alt="Loading..." />
//                 </a>
//               </div>
//             ))
//           ) : (
//             null
//           )}
//         </Slider>
//       </div>
//     </section>
//   );
// }

// export default HappyClients;