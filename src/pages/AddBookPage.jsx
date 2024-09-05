import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBook } from '../firebase';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddBookPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const queryClient = useQueryClient();

  const addBookMutation = useMutation({
    mutationFn: (data) => addBook(data, uuid()),
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      toast.success('Book added successfully!');
      reset();
      setPreviewImage(null);
    },
    onError: (error) => {
      console.error('Error adding book:', error);
      toast.error('Error adding book: ' + error.message);
    },
  });

  const onSubmit = async (data) => {
    addBookMutation.mutate(data);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Add a New Book</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Book Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Book Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            placeholder="Book Title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.title && <p className="mt-2 text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            {...register('author', { required: 'Author is required' })}
            placeholder="Author"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.author && <p className="mt-2 text-red-500 text-sm">{errors.author.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            {...register('price', { required: 'Price is required', min: 0 })}
            placeholder="Price"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.price && <p className="mt-2 text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        {/* Book Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Book Image</label>
          <input
            type="file"
            {...register('image', { required: 'Image is required' })}
            onChange={handleImageChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.image && <p className="mt-2 text-red-500 text-sm">{errors.image.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={addBookMutation.isPending}>
          {addBookMutation.isPending ? 'Adding...' : 'Add Book'}
        </button>
      </form>

      {/* Image Preview */}
      {previewImage && (
        <div className="mt-4">
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-auto max-h-64 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
}
