import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addServices,
  resetStatus,
  fetchShopDetails,
  fetchServices,
  updateService,
  deleteService,
} from "../../redux/slices/shopSlice";
import { Scissors, Plus, Edit2, Trash2 } from 'lucide-react';

const ServiceManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [editingService, setEditingService] = useState(null);

  const dispatch = useDispatch();

  const { shopkeeper } = useSelector((state) => state.shopkeeper);
  const { shop, loading, success, error, services } = useSelector(
    (state) => state.shop
  );

  useEffect(() => {
    if (shopkeeper?.id && !shop) {
      dispatch(
        fetchShopDetails({ ownerId: shopkeeper.id, token: shopkeeper.token })
      );
    }
  }, [shopkeeper, shop, dispatch]);

  useEffect(() => {
    if (shop?._id) {
      dispatch(fetchServices(shop._id));
    }
  }, [shop, dispatch]);

  useEffect(() => {
    if (success) {
      setServiceName("");
      setServiceDescription("");
      setServicePrice("");
      setServiceDuration("");
      setEditingService(null);
      setShowModal(false);
      dispatch(resetStatus());
      dispatch(fetchServices(shop._id));
    }
  }, [success, dispatch, shop]);

  const handleAddOrUpdateService = (e) => {
    e.preventDefault();
    if (serviceName && servicePrice && serviceDuration) {
      const serviceData = {
        serviceName,
        description: serviceDescription,
        price: parseFloat(servicePrice),
        duration: serviceDuration,
      };

      if (editingService) {
        dispatch(updateService({
          shopId: shop._id,
          serviceId: editingService._id,
          serviceData,
        }));
      } else {
        dispatch(addServices([serviceData]));
      }
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceName(service.serviceName);
    setServiceDescription(service.description || "");
    setServicePrice(service.price.toString());
    setServiceDuration(service.duration);
    setShowModal(true);
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      dispatch(deleteService({ shopId: shop._id, serviceId }))
        .then(() => dispatch(fetchServices(shop._id)));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!shop) return <ErrorMessage message="Please add a shop first." />;

  return (
    <div className="bg-gray-100">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl mb-6">
        <div className="flex items-center">
          <Scissors size={28} className="text-indigo-600 mr-2" />
          <div className="text-2xl text-gray-800 font-bold">Manage Services</div>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/50"
          >
            <Plus size={20} className="mr-2" />
            Add New Service
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services && services.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{service.serviceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{service.description || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">${service.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{service.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditService(service)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service._id)}
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
        <ServiceModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddOrUpdateService}
          editingService={editingService}
          serviceName={serviceName}
          setServiceName={setServiceName}
          serviceDescription={serviceDescription}
          setServiceDescription={setServiceDescription}
          servicePrice={servicePrice}
          setServicePrice={setServicePrice}
          serviceDuration={serviceDuration}
          setServiceDuration={setServiceDuration}
        />
      )}
    </div>
  );
};

const ServiceModal = ({
  onClose,
  onSubmit,
  editingService,
  serviceName,
  setServiceName,
  serviceDescription,
  setServiceDescription,
  servicePrice,
  setServicePrice,
  serviceDuration,
  setServiceDuration,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingService ? 'Edit Service' : 'Add New Service'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Service Name"
          id="service-name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          required
        />
        <InputField
          label="Description"
          id="description"
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          textarea
        />
        <InputField
          label="Price"
          id="price"
          type="number"
          value={servicePrice}
          onChange={(e) => setServicePrice(e.target.value)}
          required
        />
        <InputField
          label="Duration"
          id="duration"
          value={serviceDuration}
          onChange={(e) => setServiceDuration(e.target.value)}
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg shadow-indigo-500/50"
          >
            {editingService ? 'Save Changes' : 'Add Service'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const InputField = ({ label, id, value, onChange, required, textarea, type = "text" }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {textarea ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows="4"
        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        required={required}
      />
    ) : (
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        required={required}
      />
    )}
  </div>
);

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

export default ServiceManagement;