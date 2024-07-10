import { useEffect, useState } from 'react';
import '@arco-design/web-react/dist/css/arco.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderBar from './layout/header';
import Content from './layout/content';
import Toolbar from './layout/toolbar';
import Footer from './layout/footer';

import './App.css';

function Main() {
  return (
    <div className="main">
      <div className="main-layout">
        <Toolbar />
        <HeaderBar />
        <Content />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
