import { useEffect, useState } from "react";
import ViewCountChart from "../AdminComponent/ViewCountChart";
import React from "react";
import LeftSide from "../AdminComponent/LeftSide";
import ProperCalendar from "../AdminComponent/ProperCalendar";
import axios from 'axios';
import useAuth from "../../useAuth";
import NotifactionAdmin from "../AdminComponent/NotifactionAdmin";

function Dashboard() {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [productdata, Setproductdata] = useState([]);
  const [orderdata, Setorderdata] = useState([]);
  const [userdata, Setuserdata] = useState([]);
  const [limitedorder, Setlimitedorder] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  

  const [adminData, setAdminData] = useState(null);


  useAuth();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      window.location.href = "/login"; 
      return;
    }

    axios
      .get(`${apiUrl}/user-log-reg/admin`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      })
      .then((res) => {
        setAdminData(res.data); 
      })
      .catch((error) => {
        console.error(error);
        sessionStorage.clear();
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
      });
  }, [apiUrl]);

useEffect(() => {
  fetch(`${apiUrl}/user-log-reg/userdisplay`,{
    headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
    },
})
  .then((response) => response.json())
  .then((data) => {
    const latestUsers = data.slice(0, 10);
    Setuserdata(latestUsers)
  })
  .catch((error) => console.log("Something Wrong", error));
},[apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}/product-api/products`,{
      headers: {
          "x-api-key": process.env.REACT_APP_API_KEY, 
      },
  })
    .then((response) => response.json())
    .then((data) => {
      Setproductdata(data);
    })
    .catch((error) => console.log("Something Wrong", error));
},[apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}/order-api/ordersonly`,{
      headers: {
          "x-api-key": process.env.REACT_APP_API_KEY, 
      },
  })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Setorderdata(data.orders);
        }})
      .catch((error) => console.log("Something Wrong", error));
  },[apiUrl]);


  useEffect(() => {
    fetch(`${apiUrl}/order-api/ordersonlysuccesslimted`, {
        headers: {
            "x-api-key": process.env.REACT_APP_API_KEY, 
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success && Array.isArray(data.orders)) {
                Setlimitedorder(data.orders); 
            } else {
                Setlimitedorder([]); 
            }
        })
        .catch((error) => {
            console.log("Something went wrong:", error);
            Setlimitedorder([]); 
        });
}, [apiUrl]);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}/chart-api/ordersonlysuccesstotal`, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY, 
          }
        });
        setTotalAmount(response.data.totalAmount);
      } catch (err) {
      }
    };

    fetchOrders();
  }, [apiUrl]);

  if (!adminData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <LeftSide/>
        <div className="bord">

        <section className="breadcrumb-option">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="breadcrumb__text">
                      <h4>Dashboard</h4>
                      <div className="breadcrumb__links">
                        <span>Dashboard</span>
                      </div>
                    </div>
                  </div>
                  <NotifactionAdmin/>
                </div>
              </div>
            </div>
          </div>
        </section>


          <div className="row-container">
            <div className="item-box"> 
              <a href="/analytics"> Total Amount {""}
                {totalAmount || "Loading..." } 
                </a> 
            </div>
            <div className="item-box">
              <a href="/product"> Total Product : {productdata.length || "Loading..."} </a>
            </div>
            <div className="item-box"><a href="/displayorder"> Total Order : {orderdata?.length || "Loading..."} </a> </div>
            
          </div>

          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-4">
                <ProperCalendar/>
              </div>
                <div className="col-lg-7">
                      <ViewCountChart/>
                     
                </div>
            </div>
          </div>   

        {/* Reacnt User Detils */}
          <div className="col-lg-12">
            <p className="anyview">Reacnt User</p>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userdata.length === 0 ? (
                      <tr><td colSpan="4">Loading...</td></tr>
                    ) : (
                      userdata.map((user, index) => (
                        <tr key={user._id}>
                          <td>{index + 1}</td>
                          <td className="overhieed">{user.user_name}</td>
                          <td>{user.user_email}</td>
                          <td>{user.registration_date}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
              </div>
          </div>

        {/* Reacnt Order Detils */}
          <div className="col-lg-12">
            <p className="anyview">Reacnt Order</p>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">User Name</th>
                            <th scope="col">Address</th>
                            <th scope="col">Product</th>
                            <th scope="col">Total Amount</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(limitedorder) && limitedorder.length > 0 ? (
                            limitedorder.map((displayorderdata, index) => (
                                <tr key={displayorderdata._id}>
                                    <td>{index + 1}</td>
                                    <td className="overhieed">{displayorderdata.UserName}</td>
                                    <td className="overhieedd">{displayorderdata.address}</td>
                                    <td>
                                        {Array.isArray(displayorderdata.products) ? (
                                            <ul>
                                                {displayorderdata.products.map((product, i) => (
                                                    <li key={i}>
                                                        {product.product_name} - {product.quantity} x {product.price} - {product.selectedSize}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            "No products"
                                        )}
                                    </td>
                                    <td>{displayorderdata.totalAmount}</td>
                                    <td>{displayorderdata.order_status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No orders available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>

        </div>             
    </>
  );
}

export default React.memo(Dashboard);
