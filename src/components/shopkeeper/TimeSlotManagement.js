import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  fetchTimeSlots,
  resetStatus,
} from "../../redux/slices/shopSlice";
import { Clock, Plus, Edit2, Trash2 } from 'lucide-react';

const TimeSlotManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editingSlot, setEditingSlot] = useState(null);

  const dispatch = useDispatch();
  const { shopkeeper } = useSelector((state) => state.shopkeeper);
  const { shop, loading, success, error, timeSlots } = useSelector(
    (state) => state.shop
  );

  const fetchData = useCallback(() => {
    if (shop?._id) {
      dispatch(fetchTimeSlots(shop._id));
    }
  }, [shop, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (success) {
      setStartTime("");
      setEndTime("");
      setEditingSlot(null);
      setShowModal(false);
      dispatch(resetStatus());
      fetchData();
    }
  }, [success, dispatch, fetchData]);

  const handleAddOrUpdateTimeSlot = (e) => {
    e.preventDefault();
    if (startTime && endTime) {
      const timeSlotData = {
        startTime,
        endTime,
      };

      if (editingSlot) {
        dispatch(
          updateTimeSlot({
            shopId: shop._id,
            slotId: editingSlot._id,
            ...timeSlotData,
          })
        );
      } else {
        dispatch(
          addTimeSlot({
            shopId: shop._id,
            ...timeSlotData,
          })
        );
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!shop) return <ErrorMessage message="Please add a shop first." />;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen p-6">
      <header className="flex justify-between items-center bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-xl mb-6 shadow-lg">
        <div className="flex items-center">
          <Clock size={28} className="text-pink-500 mr-2" />
          <div className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">
            Manage Time Slots
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <img src="avatar.png" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-pink-500" />
          <span className="text-gray-100 cursor-pointer">
            {shopkeeper?.name || "Shop Owner"}
          </span>
        </div>
      </header>

      <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg shadow-pink-500/50 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Time Slot
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800 bg-opacity-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {timeSlots && timeSlots.map((slot) => (
                <tr key={slot._id} className="hover:bg-gray-700 hover:bg-opacity-50 transition-colors duration-300">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{slot.startTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{slot.endTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => {
                        setEditingSlot(slot);
                        setStartTime(slot.startTime);
                        setEndTime(slot.endTime);
                        setShowModal(true);
                      }}
                      className="text-pink-500 hover:text-pink-400 mr-4"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this time slot?")) {
                          dispatch(deleteTimeSlot({ shopId: shop._id, slotId: slot._id }));
                        }
                      }}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg backdrop-filter backdrop-blur-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingSlot(null);
                  setStartTime("");
                  setEndTime("");
                }} 
                className="text-gray-400 hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddOrUpdateTimeSlot} className="space-y-4">
              <div>
                <label htmlFor="start-time" className="block text-sm font-medium text-gray-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-gray-100 rounded-lg shadow-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="end-time" className="block text-sm font-medium text-gray-300 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-gray-100 rounded-lg shadow-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-pink-500/50"
                >
                  {editingSlot ? 'Save Changes' : 'Add Time Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-xl shadow-lg border-l-4 border-red-500">
    <h3 className="text-lg font-bold text-red-500 mb-2">Error</h3>
    <p className="text-gray-300">{message}</p>
  </div>
);

export default TimeSlotManagement;