import { Outlet, useNavigate } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('logged out');
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="flex justify-between items-center ">
        <Sidebar handleLogout={handleLogout} />
        <div className="w-full flex flex-col h-screen items-center ml-[250px]">
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  );
}
