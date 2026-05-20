import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Loader from '../components/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      <div className="flex items-center space-x-2">
        <span className="text-xl">📜</span>
        <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 rounded-xl text-center flex flex-col items-center justify-center space-y-3">
          <span className="text-3xl">🍔</span>
          <h3 className="text-base font-bold text-gray-700">No orders placed yet</h3>
          <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
            You haven't made any purchases yet. Your order history will appear here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isSuccess = order.payment_status === 'Paid';

            return (
              <div 
                key={order.id} 
                className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Order #{order.id}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {/* Simple Success / Unsuccessful status message */}
                  {isSuccess ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                      Order Successful
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold">
                      Order Unsuccessful
                    </span>
                  )}
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Items Ordered</h4>
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-gray-600">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-orange-500 font-bold">x{item.quantity}</span>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">₹{Number(item.price) * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address and Contact details */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-500">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Delivery Address</p>
                    <p className="leading-relaxed text-gray-700">{order.delivery_address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Contact Number</p>
                    <p className="text-gray-700">{order.phone}</p>
                  </div>
                </div>

                {/* Total amount and footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-gray-500 text-xs">Payment status: <b className={`${isSuccess ? 'text-emerald-600' : 'text-rose-600'} font-bold`}>{order.payment_status}</b></span>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block font-semibold">Total Paid</span>
                    <span className="text-sm font-bold text-gray-800">₹{order.total_amount}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Orders;
