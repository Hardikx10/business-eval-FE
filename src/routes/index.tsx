import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


const Login = React.lazy(() => import('../pages/login'));
const Signup = React.lazy(() => import('../pages/signup'));
const ResetPassword = React.lazy(() => import('../pages/reset-password'));
const VerifyOtp = React.lazy(() => import('../pages/verify-otp'));
const ConfirmPassword = React.lazy(() => import('../pages/confirm-password'));
// const AddBusiness = React.lazy(() => import('../pages/add-business'));
const Dashboard = React.lazy(() => import('../pages/dashboard'));
const CompareResults = React.lazy(() => import('../pages/compare-results'));
const Business = React.lazy(()=> import('../pages/business'))
const Home = React.lazy(()=> import('../pages/home'))

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex justify-center items-center h-screen bg-blue-100">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>}>
        <Routes>
          {/* <Route path="/" element={<AddBusiness />} /> */}
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/confirm-password" element={<ConfirmPassword />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path='/business/:id' element={<Business/>}/>
          <Route path="/compare-results" element={<CompareResults />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
