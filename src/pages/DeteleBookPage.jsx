import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, deleteBook } from '../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DeleteBookPage() {
  const queryClient = useQueryClient();

  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['books'],
    queryFn: getData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      toast.success('Book deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting book:', error);
      toast.error('Error deleting book: ' + error.message);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading books: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Delete a Book</h1>
      <ul className="space-y-4">
        {books.map((book) => (
          <li key={book.id} className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-4">
              <img src={book.imageUrl} alt={book.title} className="w-16 h-16 object-cover" />
              <div>
                <h2 className="text-xl">{book.title}</h2>
                <p>{book.author}</p>
              </div>
            </div>
            <button
              onClick={() => deleteMutation.mutate(book.id)}
              disabled={deleteMutation.isPending}
              className="text-red-500 font-semibold hover:text-red-700 bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-md"
              type="button">
              Delete
            </button>
          </li>
        ))}
        {!books.length && (
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-icon-download-in-svg-png-gif-file-formats--drive-full-storage-empty-state-pack-miscellaneous-icons-1662569.png?f=webp&w=256"
            alt="No books found"
            className="w-full max-w-xs mx-auto"
          />
        )}
      </ul>
    </div>
  );
}
