import { useState } from 'react'

import LoginPage from './Page/LoginPage'
import { BrowserRouter,Route,Routes } from 'react-router-dom'

import MainDashbord from './Page/MainDashbord'
import CompanyManagement from './Page/CompanyManagement'
import UserManagement from './Page/UserManagement'
import AdminKnowledge from './Page/AdminKnowledge'
import Conversations from './Page/Conversation'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    
      <Routes>
     <Route path='/' element={<LoginPage></LoginPage>}></Route>
     <Route path='/wwsssssssssssdkakkaksdnsndjsd' element={<MainDashbord/>}>  </Route>
     <Route  path='/weijsksskskkxkdkdksalaskdkjdkasjd' element={<CompanyManagement></CompanyManagement>}></Route>
     <Route path='/wedjdjkdjskadjjcbcnxskkkkkkkkdjskd' element={<UserManagement/>}></Route> 
     <Route path='/wecfjjjjjjjjjjjjslakadnjfnjdndjddssd' element={<AdminKnowledge></AdminKnowledge>}></Route>
         <Route path='/wedjfheijsjdjksjslakadnjfnjdndjddssd' element={<Conversations></Conversations>}></Route>
    </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
