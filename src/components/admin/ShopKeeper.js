import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShopkeepers } from '../../redux/slices/adminSlice'; // Import your async thunk
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Update to use correct state properties
    const { shopkeepers, shopkeepersStatus } = useSelector(state => state.admin);

    useEffect(() => {
        if (shopkeepersStatus === 'idle') {
            dispatch(fetchShopkeepers());
        }
    }, [dispatch, shopkeepersStatus]);

    const handleViewClick = (id) => {
        navigate(`/admin/shopkeeperprofile/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <header className="bg-gray-800 p-5 shadow-md border-b border-gray-700 fixed top-0 w-full z-50">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <button className="bg-red-500 hover:bg-red-600 text-gray-100 py-2 px-4 rounded">Logout</button>
                </div>
            </header>

            <div className="flex pt-20">
                <aside className="w-64 bg-gray-800 p-5 border-r border-gray-700 fixed h-full">
                    <nav>
                        <ul>
                            {/* Sidebar navigation */}
                        </ul>
                    </nav>
                </aside>

                <main className="flex-1 ml-64 p-5">
                    <section id="shopkeeper-management">
                        <h2 className="text-2xl mb-5">Shopkeeper Management</h2>

                        <section id="view-all-shopkeepers">
                            <h3 className="text-xl mb-4">View All Shopkeepers</h3>
                            <table className="w-full table-auto mb-5">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="p-3 border border-gray-600">ID</th>
                                        <th className="p-3 border border-gray-600">Name</th>
                                        <th className="p-3 border border-gray-600">Email</th>
                                        <th className="p-3 border border-gray-600">Status</th>
                                        <th className="p-3 border border-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shopkeepersStatus === 'loading' ? (
                                        <tr>
                                            <td colSpan="5" className="p-3 text-center">Loading...</td>
                                        </tr>
                                    ) : shopkeepersStatus === 'succeeded' ? (
                                        shopkeepers.map(shopkeeper => (
                                            <tr key={shopkeeper._id} className="bg-gray-800">
                                                <td className="p-3 border border-gray-600">{shopkeeper._id}</td>
                                                <td className="p-3 border border-gray-600">{shopkeeper.name}</td>
                                                <td className="p-3 border border-gray-600">{shopkeeper.email}</td>
                                                <td className="p-3 border border-gray-600">{shopkeeper.isVerified ? 'Verified' : 'Not Verified'}</td>
                                                <td className="p-3 border border-gray-600">
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-600 text-gray-100 py-1 px-2 rounded inline-block mr-2"
                                                        onClick={() => handleViewClick(shopkeeper._id)}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-3 text-center text-red-500">
                                                Failed to load shopkeepers.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </section>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
