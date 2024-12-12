import './App.css';
import React from 'react';
import Navbar from './component/Navbar/myNavbar';
import Slidebar from './component/center/Slidebar/Slidebar';
import Content from './component/center/Content/Content';
import Footer from './component/Footer/myFooter';
import AuthForm from './component/Auth/AuthForm';

function App() {
  return (
    <div className='container'>
      <Navbar />
      <div className='content-center'>
      <Slidebar />
      <Content />
      <Footer />
      <AuthForm />
      </div>
    </div>
  );
}

export default App;
