import React, { useEffect } from 'react'
import DashboardSystem from './DashboardSystemAdmin';
import DashboardCompany from './DashboardCompanyAdmin';
import { useSelector } from 'react-redux';
import LoginPage from './LoginPage';
const MainDashbord = () => {
      const { isAuthenticate, isloading, error ,user} = useSelector((state) => state.auth);
 let role=user?.role

 if(role ==='SYSTEM_ADMIN'){
    return <DashboardSystem></DashboardSystem>
 }else if (role ==="COMPANY_ADMIN"){
    return <DashboardCompany></DashboardCompany>

 }else {
    return  <LoginPage></LoginPage>
 }
 
}

export default MainDashbord
