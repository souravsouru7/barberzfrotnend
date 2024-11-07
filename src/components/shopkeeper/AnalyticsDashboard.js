import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../redux/slices/analyticsSlice';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Bar, BarChart, LineChart, Line
} from 'recharts';
import { Calendar } from 'lucide-react';

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { shop } = useSelector((state) => state.shop);
  const { bookingStats, revenueStats, serviceStats, loading, error } = useSelector((state) => state.analytics);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });

  useEffect(() => {
    if (shop?._id) {
      dispatch(fetchAnalytics({
        shopId: shop._id,
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString()
      }));
    }
  }, [dispatch, shop?._id, dateRange]);

  const prepareBookingData = () => {
    if (!bookingStats) return [];
    return bookingStats.map(stat => ({
      date: `${stat._id.year}-${stat._id.month}-${stat._id.day}`,
      bookings: stat.count
    }));
  };

  const prepareRevenueData = () => {
    if (!revenueStats) return [];
    return revenueStats.map(stat => ({
      month: `${stat._id.year}-${stat._id.month}`,
      revenue: stat.totalRevenue,
      discounts: stat.totalDiscounts
    }));
  };

  const prepareServiceData = () => {
    if (!serviceStats) return [];
    return serviceStats.map(stat => ({
      name: stat._id,
      bookings: stat.totalBookings,
      revenue: stat.totalRevenue
    }));
  };

  const calculateStats = () => {
    if (!bookingStats || !revenueStats || !serviceStats) return null;
    const totalBookings = bookingStats.reduce((total, stat) => total + stat.count, 0);
    const totalRevenue = revenueStats.reduce((total, stat) => total + stat.totalRevenue, 0);
    const totalCost = revenueStats.reduce((total, stat) => total + stat.totalDiscounts, 0);
    const averageBookingsPerDay = totalBookings / bookingStats.length;
    return {
      totalBookings,
      totalRevenue,
      totalCost,
      averageBookingsPerDay: averageBookingsPerDay.toFixed(2)
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-b from-gray-800 to-gray-900 min-h-screen">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg transition-transform transform hover:scale-105">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>
            {stats && (
              <div className="mt-6 text-gray-400">
                <div>Total Bookings: {stats.totalBookings.toLocaleString()}</div>
                <div>Total Revenue: ${stats.totalRevenue.toLocaleString()}</div>
                <div>Average Bookings per Day: {stats.averageBookingsPerDay}</div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="text-purple-400" />
            <input
              type="date"
              value={dateRange.startDate.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.endDate.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Trends */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Booking Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareBookingData()}>
                  <CartesianGrid stroke="#2d2d2d" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }} />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#7c3aed" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Analysis */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Revenue Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prepareRevenueData()}>
                  <CartesianGrid stroke="#2d2d2d" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="#7c3aed" opacity={0.7} />
                  <Area type="monotone" dataKey="discounts" stroke="#10b981" fill="#10b981" opacity={0.7} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Popularity */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg col-span-full">
            <h3 className="text-xl font-semibold text-white mb-4">Service Popularity</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={prepareServiceData()} dataKey="bookings" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {prepareServiceData().map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Services by Revenue */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg col-span-full">
            <h3 className="text-xl font-semibold text-white mb-4">Top Services by Revenue</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareServiceData().sort((a, b) => b.revenue - a.revenue).slice(0, 5)}>
                  <CartesianGrid stroke="#2d2d2d" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#7c3aed" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
