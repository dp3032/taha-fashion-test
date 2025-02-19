import React from 'react'
import ViewCountChart from "../AdminComponent/ViewCountChart";
import ProductPieChart from "../AdminComponent/ProductPieChart";
import OrderChart  from "../AdminComponent/OrderChart  ";
import LeftSide from '../AdminComponent/LeftSide';
import AmountChartBar from '../AdminComponent/AmountChartBar';
import NotifactionAdmin from '../AdminComponent/NotifactionAdmin';

const Analytics = () => {
    
  
return (
        <>
            <LeftSide/>
                <div className="bord">
                    <section className="breadcrumb-option">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="breadcrumb__text">
                                    <h4> Analytics </h4>
                                        <div className="breadcrumb__links">
                                        {/* <a href="/dashboard"> Dashboard </a> */}
                                        <span>Analytics</span>
                                        </div>
                                    </div>
                                </div>
                                <NotifactionAdmin/>
                            </div>
                        </div>
                    </section>

                    <div className="col-lg-10 mt-3">
                        <AmountChartBar/>
                    </div>
                    <hr/>
                    <div className="col-lg-10">
                        <ViewCountChart/>
                    </div>
                    <hr/>
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-lg-5">
                                <OrderChart/>
                            </div>
                            <div className="col-lg-2">
                                <p></p>
                            </div>
                            <div className="col-lg-5">
                                <ProductPieChart/>
                            </div>
                        </div>
                    </div>
                </div>
        </>
  )
}

export default React.memo(Analytics);