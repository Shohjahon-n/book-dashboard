import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { checkIfAdmin } from '../firebase';

export default function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState(null);
  const uid = localStorage.getItem('uuid');

  useEffect(() => {
    const verifyAdmin = async () => {
      if (uid) {
        const isAdmin = await checkIfAdmin(uid);
        setIsAdmin(isAdmin);
      } else {
        setIsAdmin(false);
      }
    };

    verifyAdmin();
  }, [uid]);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
}
