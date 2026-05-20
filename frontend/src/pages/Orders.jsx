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
      case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Preparing': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Out for Delivery': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      <div className="flex items-center space-x-2.5">
        <span className="text-2xl text-primary">📜</span>
        <h1 className="text-2xl font-bold text-white tracking-wide">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#181818] border border-white/10 p-12 rounded-3xl text-center flex flex-col items-center justify-center space-y-4">
          <span className="text-4xl">🍔</span>
          <h3 className="text-lg font-bold text-gray-300">No orders placed yet</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            You haven't made any purchases yet. Your delicious order history will appear here!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStatusStep(order.order_status);

            return (
              <div 
                key={order.id} 
                className="bg-[#181818] border border-white/10 rounded-3xl p-6 space-y-6"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-white text-base">Order #{order.id}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.order_status)} flex items-center space-x-1.5`}>
                    <span>{getStatusIcon(order.order_status)}</span>
                    <span>{order.order_status}</span>
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Items ordered</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                          <span className="text-primary font-bold">x{item.quantity}</span>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-semibold">₹{Number(item.price) * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping info */}
                <div className="bg-[#242424] p-4 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400">
                  <div>
                    <p className="text-gray-500 font-bold uppercase tracking-wider mb-1">Delivery Address</p>
                    <p className="leading-relaxed text-gray-300">{order.delivery_address}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-bold uppercase tracking-wider mb-1">Contact Number</p>
                    <p className="text-gray-300">{order.phone}</p>
                  </div>
                </div>

                {/* Status Progress Indicator Bar */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Track Delivery</h4>
                  
                  <div className="relative flex justify-between items-center w-full">
                    
                    {/* Progress track background line */}
                    <div className="absolute left-0 right-0 h-1 bg-white/5 -z-1"></div>
                    <div 
                      className="absolute left-0 h-1 bg-primary -z-1 transition-all duration-300" 
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    ></div>

                    {/* Step Nodes */}
                    {[
                      { step: 1, label: 'Placed' },
                      { step: 2, label: 'Preparing' },
                      { step: 3, label: 'Shipped' },
                      { step: 4, label: 'Delivered' }
                    ].map((s) => (
                      <div key={s.step} className="flex flex-col items-center space-y-1.5 z-10 bg-[#181818] px-2">
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                            currentStep >= s.step 
                              ? 'bg-primary border-primary text-white' 
                              : 'bg-[#242424] border-white/10 text-gray-500'
                          }`}
                        >
                          {s.step}
                        </div>
                        <span 
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            currentStep >= s.step ? 'text-primary' : 'text-gray-500'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}

                  </div>
                </div>

                {/* Total amount and footer */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-gray-400 text-xs">Payment status: <b className="text-emerald-500 font-bold">{order.payment_status}</b></span>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">Total paid</span>
                    <span className="text-lg font-black text-white">₹{order.total_amount}</span>
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
