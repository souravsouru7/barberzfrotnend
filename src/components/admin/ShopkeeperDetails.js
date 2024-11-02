import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopkeeperById, verifyShopkeeper } from "../../redux/slices/adminSlice";

const ShopkeeperDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { shopkeeper, shopkeeperStatus, shopkeeperError } = useSelector(
    (state) => state.admin
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(fetchShopkeeperById(id));
  }, [dispatch, id]);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleVerify = (shopkeeperId) => {
    dispatch(verifyShopkeeper(shopkeeperId));
  };

  if (shopkeeperStatus === "loading") return <p>Loading...</p>;
  if (shopkeeperStatus === "failed") return <p>{shopkeeperError}</p>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a202c', color: '#edf2f7', padding: '20px' }}>
      <header style={{ backgroundColor: '#2d3748', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #4A5568', position: 'fixed', top: 0, width: '100%', zIndex: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Shopkeeper Details</h1>
        </div>
      </header>

      <main style={{ paddingTop: '96px' }}>
        <section style={{ backgroundColor: '#2d3748', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Shopkeeper Information</h2>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>ID:</strong> {shopkeeper?._id}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Name:</strong> {shopkeeper?.name}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Email:</strong> {shopkeeper?.email}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Status:</strong>{" "}
              <span style={{ color: shopkeeper?.isVerified ? '#48bb78' : '#f56565' }}>
                {shopkeeper?.isVerified ? "Verified" : "Not Verified"}
              </span>
            </p>
            <p style={{ marginBottom: '16px' }}>
              <strong>Contact Number:</strong> {shopkeeper?.contactNumber}
            </p>

            {shopkeeper?.shopLicense && (
              <div style={{ marginTop: '24px' }}>
                <strong style={{ display: 'block', marginBottom: '8px' }}>Shop License:</strong>
                <img
                  src={shopkeeper.shopLicense}
                  alt="Shop License"
                  style={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', maxWidth: '200px', border: '1px solid #4A5568', cursor: 'pointer' }}
                  onClick={() => openModal(shopkeeper.shopLicense)}
                />
              </div>
            )}

            {/* Verify button */}
            {!shopkeeper?.isVerified && (
              <button
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  backgroundColor: '#48bb78',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
                onClick={() => handleVerify(shopkeeper._id)}
              >
                Verify
              </button>
            )}
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={closeModal}>
          <img
            src={selectedImage}
            alt="Shop License"
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};

export default ShopkeeperDetails;
