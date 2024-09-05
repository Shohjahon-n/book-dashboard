import { useQuery } from '@tanstack/react-query';
import { getData, addOrder } from '../firebase';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
export default function Products() {
  const {
    data: books,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['books'],
    queryFn: getData,
  });

  const auth = getAuth();
  const user = auth.currentUser;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const handleAddOrder = async (book, user) => {
    const nickname = user?.displayName || 'Anonymous';

    try {
      await addOrder(book, nickname)
        .then(async () => {
          toast.success('Order added successfully!');
        })
        .catch((error) => {
          console.error('Error adding order:', error);
          toast.error('Error adding order: ' + error.message);
        });
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  return (
    <div className="p-6 w-full max-w-[1280px] mx-auto h-screen">
      {!books.length && (
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-icon-download-in-svg-png-gif-file-formats--drive-full-storage-empty-state-pack-miscellaneous-icons-1662569.png?f=webp&w=256"
          alt="No books found"
          className="w-full max-w-xs mx-auto"
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {books.map((book) => (
          <div
            className="w-full max-w-[250px] h-[450px] bg-white flex flex-col items-center justify-between p-4 shadow-lg rounded-lg transition-transform transform hover:scale-105"
            key={book.id}>
            <div className="w-full h-[220px] flex items-center justify-center mb-4">
              <img
                className="w-full h-full object-cover rounded-t-lg"
                src={book.imageUrl}
                alt={book.title}
              />
            </div>
            <div className="flex flex-col items-center flex-grow">
              <h1 className="text-xl font-semibold mb-2 text-center">{book.title}</h1>
              <p className="text-md text-gray-600 mb-4 text-center">{book.author}</p>
              <p className="text-lg font-bold text-gray-800 mb-4">${book.price}</p>
            </div>
            <button
              onClick={() => handleAddOrder(book)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
