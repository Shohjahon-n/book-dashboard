import Login from './pages/Login';
import Regsiter from './pages/Regsiter';
import Layout from './Layout/Layout';
import PrivateRoute from './routes/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import Products from './pages/Products';
import AddBookPage from './pages/AddBookPage';
import DeleteBookPage from './pages/DeteleBookPage';
import OrdersPage from './pages/OrdersPage';
import { useState } from 'react';
import AdminRoute from './routes/AdminRoute';
export default function App() {
  const [user, setUser] = useState(null);
  console.log(user);

  const uid = localStorage.getItem('uuid');
  console.log('Retrieved UID from localStorage:', uid);

  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index path="/products" element={<Products />} />
            <Route path="/" element={<AdminRoute />}>
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/add-book" element={<AddBookPage />} />
              <Route path="/delete-book" element={<DeleteBookPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Regsiter />} />
      </Routes>
    </>
  );
}
