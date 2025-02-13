import React from 'react'
import LeftSide from '../AdminComponent/LeftSide';
import NotifactionAdmin from '../AdminComponent/NotifactionAdmin';

const Report = () => {
  return (
    <>
        <LeftSide/>

            <div className="bord">

                <section className="breadcrumb-option">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="breadcrumb__text">
                                    <h4> Report Detils </h4>
                                    <div className="breadcrumb__links">
                                        <a href="/dashboard"> Dashboard </a>
                                        <span>Report</span>
                                    </div>
                                </div>
                            </div>
                            <NotifactionAdmin/>
                        </div>
                    </div>
                </section>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col"> # </th>
                                    <th scope="col"> Report Name </th>
                                    <th scope="col"> Action </th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                    <tr>
                                        <td> 1 </td>
                                        <td> User List</td>
                                        <td> <a href="/userreport" className="ordeview"> View Detils </a> </td>
                                    </tr>

                                    <tr>
                                        <td> 2 </td>
                                        <td> Order List</td>
                                        <td> <a href="/orderreport" className="ordeview"> View Detils </a> </td>
                                    </tr>

                                    <tr>
                                        <td> 3 </td>
                                        <td> Product List</td>
                                        <td> <a href="/productreport" className="ordeview"> View Detils </a> </td>
                                    </tr>
                                
                            </tbody>
                        </table>    
                    </div>            
            </div>
    </>
  )
}

export default React.memo(Report);