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

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Preparing': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Preparing': return '🍳';
      case 'Out for Delivery': return '🚚';
      case 'Delivered': return '✅';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Out for Delivery': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

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
            You haven't made any purchases yet. Your delicious order history will appear here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStep = getStatusStep(order.order_status);

            return (
              <div 
                key={order.id} 
                className="bg-white border border-gray-200 rounded-xl p-5 space-y-5 shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3.5 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Order #{order.id}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.order_status)} flex items-center space-x-1`}>
                    <span>{getStatusIcon(order.order_status)}</span>
                    <span>{order.order_status}</span>
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Items ordered</h4>
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

                {/* Shipping info */}
                <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-500">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Delivery Address</p>
                    <p className="leading-relaxed text-gray-700">{order.delivery_address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Contact Number</p>
                    <p className="text-gray-700">{order.phone}</p>
                  </div>
                </div>

                {/* Status Progress Indicator Bar */}
                <div className="pt-1">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Track Delivery</h4>
                  
                  <div className="relative flex justify-between items-center w-full">
                    
                    {/* Progress track background line */}
                    <div className="absolute left-0 right-0 h-1 bg-gray-200 -z-1"></div>
                    <div 
                      className="absolute left-0 h-1 bg-orange-500 -z-1 transition-all duration-300" 
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    ></div>

                    {/* Step Nodes */}
                    {[
                      { step: 1, label: 'Placed' },
                      { step: 2, label: 'Preparing' },
                      { step: 3, label: 'Shipped' },
                      { step: 4, label: 'Delivered' }
                    ].map((s) => (
                      <div key={s.step} className="flex flex-col items-center space-y-1 z-10 bg-white px-2">
                        <div 
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-colors ${
                            currentStep >= s.step 
                              ? 'bg-orange-500 border-orange-500 text-white' 
                              : 'bg-gray-100 border-gray-200 text-gray-400'
                          }`}
                        >
                          {s.step}
                        </div>
                        <span 
                          className={`text-[9px] font-bold uppercase tracking-wider ${
                            currentStep >= s.step ? 'text-orange-500 font-bold' : 'text-gray-400'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}

                  </div>
                </div>

                {/* Total amount and footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-gray-500 text-xs">Payment Status: <b className="text-emerald-600 font-bold">{order.payment_status}</b></span>
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
