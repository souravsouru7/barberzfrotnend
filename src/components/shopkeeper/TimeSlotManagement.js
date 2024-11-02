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
    <div className="bg-gray-100">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl mb-6">
        <div className="flex items-center">
          <Clock size={28} className="text-indigo-600 mr-2" />
          <div className="text-2xl text-gray-800 font-bold">Manage Time Slots</div>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/50"
          >
            <Plus size={20} className="mr-2" />
            Add New Time Slot
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots && timeSlots.map((slot) => (
                <tr key={slot._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{slot.startTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{slot.endTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => {
                        setEditingSlot(slot);
                        setStartTime(slot.startTime);
                        setEndTime(slot.endTime);
                        setShowModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this time slot?")) {
                          dispatch(deleteTimeSlot({ shopId: shop._id, slotId: slot._id }));
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
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
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingSlot(null);
                  setStartTime("");
                  setEndTime("");
                }} 
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddOrUpdateTimeSlot} className="space-y-4">
              <div>
                <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg shadow-indigo-500/50"
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
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
    <h3 className="text-lg font-bold text-red-500 mb-2">Error</h3>
    <p className="text-gray-800">{message}</p>
  </div>
);

export default TimeSlotManagement;