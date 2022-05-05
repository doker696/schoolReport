import React, {useEffect, useState} from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import { Layout } from 'antd';
import Header from './components/Header';
import Contacts from './pages/Contacts';
import Publications from "./pages/Publications";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [isAuthenticate, setIsAuthenticate] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    if (!isAuthenticate) setIsAdmin(false)
  }, [isAuthenticate])
  return (
    <BrowserRouter>
      <Layout>
        <Header isAuthenticate={isAuthenticate} setIsAuthenticate={setIsAuthenticate}/>
        <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Layout.Content
            style={{ padding: '10px 160px' }}
          >
            <Routes>
              <Route path='/' element={<Main isAdmin={isAdmin}/>} />
              <Route path='/contacts' element={<Contacts />} />
              <Route path='/publications' element={<Publications />} />
              <Route path='/login' element={<Login isAuthenticate={isAuthenticate} setIsAuthenticate={setIsAuthenticate} setIsAdmin={setIsAdmin} />} />
              <Route path='/register' element={<Register isAuthenticate={isAuthenticate} setIsAuthenticate={setIsAuthenticate} setIsAdmin={setIsAdmin} />} />
            </Routes>
          </Layout.Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
