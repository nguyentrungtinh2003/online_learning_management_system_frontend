import './App.css';
import React from 'react';
import Navbar from './component/navbar/myNavbar';
import Slidebar from './component/center/slidebar/Slidebar';
import Content from './component/center/content/Content';
import Footer from './component/footer/myFooter';

function App() {
  return (
    <div className='container'>
      <Navbar />
      <div className='content-center'>
      <Slidebar />
      <Content />
      <Footer />
      </div>
    </div>
  );
}

export default App;
