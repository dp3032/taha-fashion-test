import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminProtectedRoute from './AdminProtectedRoute ';
import useAuth from './useAuth';

import Home from './Main/Home';
import Shop from './Main/Shop';
import AboutUs from './Main/AboutUs';
import ProductDetils from './Main/ProductDetils';
import Contacts from './Main/Contacts';
import Cart from './Main/Cart';
import Checkout from './Main/Checkout';
import Registration from './UserLogin/Registration';
import Login from './UserLogin/Login';
import MyOrder from './page/MyOrder';
import MyReturn from './page/MyReturn';
import FilterProduct from './product/Categories/FilterProduct';
import UserRefund from './page/UserRefund';
import ForgotPassword from './UserLogin/ForgotPassword ';
import ResetPassword from './UserLogin/ResetPassword';
import ThankYouPage from './payment/ThankYouPage';
import Paymentfail from './payment/Paymentfail';

// Import the PrivateRouteWrapper
import Dashboard from './admin/MainPage/Dashboard';
import AddProduct from './admin/ProductAdmin/AddProduct';
import EditProduct from './admin/ProductAdmin/EditProduct';
import AdminContact from './admin/Contactus/AdminContact';
import Displayproduct from './admin/ProductAdmin/Displayproduct';
import DisplayOrder from './admin/Order/DisplayOrder';
import ViewOrderDetils from './admin/Order/ViewOrderDetils';
import ViewRefundDetails from './admin/Refund/ViewRefundDetils';
import LeftSide from './admin/AdminComponent/LeftSide';
import Analytics from './admin/MainPage/Analytics';
import UserDisplay from './admin/MainPage/UserDisplay';
import AddCategory from './admin/ProductAdmin/AddCategory';
import Report from './admin/report/Report';
import UserReport from './admin/report/UserReport';
import OrderReport from './admin/report/OrderReport';
import OrderRefund from './admin/Refund/OrderRefund';
import DisplayReturnOrder from './admin/Return-Order/DisplayReturnOrder';
import ViewReturnOrderDetils from './admin/Return-Order/ViewReturnOrderDetils';
import ProductReport from './admin/report/ProductReport';
import ProductSize from './product/Size/ProductSize';
import UserReview from './admin/ProductAdmin/UserReview';
import Infomation from './admin/Contactus/Infomation';
import EditInfo from './admin/Contactus/EditInfo';
import AdminPassword from './admin/AdminProfile/AdminPassword';
import ForgotAdminPass from './admin/AdminProfile/ForgotAdminPass';
import ResetAdminPass from './admin/AdminProfile/ResetAdminPass';
import AdminHomeGallery from './admin/Gallery-Image-Admin/AdminHomeGallery';
import MainBannerAdmin from './admin/Gallery-Image-Admin/MainBannerAdmin';
import PrivacyPolicy from './Terms/PrivacyPolicy';
import TermsConditions from './Terms/TermsConditions';
import RefundPolicy from './Terms/RefundPolicy';

function App() {  
  useAuth();

  return (
    <Router>
      <Routes>
        
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/productdetils" element={<ProductDetils />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/filterproduct" element={<FilterProduct />} />
        <Route path="/filtersize" element={<ProductSize />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/myorder" element={<MyOrder/>}/>
        <Route path="/myreturn" element={<MyReturn/>}/>
        <Route path="/userrefund" element={<UserRefund/>}/>
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/paymentsuccess" element={<ThankYouPage />} />
        <Route path="/paymentfailure" element={<Paymentfail/>} />   
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />   
        <Route path="/terms-conditions" element={<TermsConditions/>} />   
        <Route path="/refund-policy" element={<RefundPolicy/>} />  

        {/* Protected Route for Admin */}
        <Route path="/adminpassword" element={<AdminProtectedRoute element={<AdminPassword/>} />}/>
        <Route path="/forgotadminpass" element={<AdminProtectedRoute element={<ForgotAdminPass/>} />}/>
        <Route path="/resetpassword-admin/:token" element={<ResetAdminPass />} />
        <Route path="/homepage-gallery-admin" element={<AdminProtectedRoute element={<AdminHomeGallery/>} />}/>
        <Route path="/main-admin-banner" element={<AdminProtectedRoute element={<MainBannerAdmin/>} />}/>
        <Route path="/dashboard" element={<AdminProtectedRoute element={<Dashboard />} />} />
        <Route path="/analytics" element={<AdminProtectedRoute element={<Analytics/>} />}/>
        <Route path="/userdisplay" element={<AdminProtectedRoute element={<UserDisplay/>} />}/>
        <Route path="/product" element={<AdminProtectedRoute element={<Displayproduct/>} />}/>
        <Route path="/addproduct" element={<AdminProtectedRoute element={<AddProduct/>} />}/>
        <Route path="/productreview" element={<AdminProtectedRoute element={<UserReview/>} />}/>
        <Route path="/edit-product" element={<AdminProtectedRoute element={<EditProduct/>} />}/>
        <Route path="/addcategory" element={<AdminProtectedRoute element={<AddCategory />} />} />
        <Route path="/displayorder" element={<AdminProtectedRoute element={<DisplayOrder/>} />}/>
        <Route path="/vieworder" element={<AdminProtectedRoute element={<ViewOrderDetils />} />} />
        <Route path="/orderrefund" element={<AdminProtectedRoute element={<OrderRefund />} />} />
        <Route path="/orderrefunddetils" element={<AdminProtectedRoute element={<ViewRefundDetails />} />} />
        <Route path="/returnorder" element={<AdminProtectedRoute element={<DisplayReturnOrder />} />} />
        <Route path="/returnorderdetils" element={<AdminProtectedRoute element={<ViewReturnOrderDetils />} />} />
        <Route path="/report" element={<AdminProtectedRoute element={<Report />} />} />
        <Route path="/userreport" element={<AdminProtectedRoute element={<UserReport />} />} />
        <Route path="/orderreport" element={<AdminProtectedRoute element={<OrderReport />} />} />
        <Route path="/productreport" element={<AdminProtectedRoute element={<ProductReport />} />} />
        <Route path="/leftside" element={<AdminProtectedRoute element={<LeftSide/>} />}/>
        <Route path="/admincontact" element={<AdminProtectedRoute element={<AdminContact/>} />}/>
        <Route path="/contactinfomation" element={<AdminProtectedRoute element={<Infomation/>} />}/>
        <Route path="/edit-contact-infomation" element={<AdminProtectedRoute element={<EditInfo/>} />}/>
      </Routes>
    </Router>
  );
}

export default App;
