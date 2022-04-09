import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import { Layout } from 'antd';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header />
        <Layout style={{ minHeight: '100vh' }}>
          <Layout.Content
            style={{ padding: '10px 160px', maxWidth: '1200px' }}
          >
            <Routes>
              <Route path='/' element={<Main />} />
              <Route path='/contacts' element={<Main />} />
            </Routes>
          </Layout.Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
