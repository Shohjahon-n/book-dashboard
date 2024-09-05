import { fetchOrders } from '../firebase';
import { useQuery } from '@tanstack/react-query';
export default function OrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">Error fetching orders: {error.message}</div>
    );
  }

  return (
    <div className="p-6 w-full max-w-[1280px] mx-auto">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Book Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Author</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-700">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.author}</td>
                <td className="px-6 py-4 text-sm text-gray-700">${order.price}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.user}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
