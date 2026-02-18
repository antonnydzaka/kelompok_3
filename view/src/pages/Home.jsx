import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API_BASE = '/api';

const Home = () => {
    const [fruits, setFruits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/fruits`)
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText || `HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => setFruits(Array.isArray(data) ? data : []))
            .catch((err) => {
                setError(err?.message || 'Gagal memuat data. Pastikan backend berjalan di port 8080.');
                setFruits([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#111827] overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/20">
                        AI-Powered Freshness Detection
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Ensure Your Fruit is <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Always Fresh</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Use our advanced AI technology to instantly analyze the freshness of your fruits with just a photo.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/add" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-blue-500/40 transition transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-3 no-underline">
                            <i className="bi bi-camera-fill"></i>
                            Analyze Now
                        </Link>
                        <button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold py-4 px-8 rounded-full backpack-blur-sm transition flex items-center justify-center gap-3">
                            <i className="bi bi-play-circle"></i>
                            Watch Demo
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-6 -mt-16 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0">
                        <div className="text-4xl font-bold text-gray-800 mb-2">98%</div>
                        <div className="text-gray-500 text-sm uppercase tracking-wide">Accuracy Rate</div>
                    </div>
                    <div className="text-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0">
                        <div className="text-4xl font-bold text-gray-800 mb-2">10k+</div>
                        <div className="text-gray-500 text-sm uppercase tracking-wide">Fruits Analyzed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-gray-800 mb-2">24/7</div>
                        <div className="text-gray-500 text-sm uppercase tracking-wide">Availability</div>
                    </div>
                </div>
            </div>

            {/* Recent Analysis Section */}
            <div className="container mx-auto px-6 py-20">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Analysis</h2>
                        <p className="text-gray-500">Track and manage your fruit inventory quality.</p>
                    </div>
                    <Link to="/add" className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition no-underline hover:translate-x-1">
                        View All <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>

                {/* Grid Layout for Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            Memuat data...
                        </div>
                    )}
                    {!loading && error && (
                        <div className="col-span-full text-center py-12 px-4 bg-red-50 rounded-xl border border-red-100">
                            <p className="text-red-600 font-medium mb-2">{error}</p>
                            <p className="text-sm text-gray-500">Jalankan backend dengan: go run .</p>
                        </div>
                    )}
                    {!loading && !error && (fruits || []).map((fruit) => (
                        <div
                            key={fruit.id}
                            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                        >
                            <div className="relative mb-4 overflow-hidden rounded-xl">
                                <img src={fruit.image || fruit.imagePath || 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800'} alt={fruit.name || 'Buah'} className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800'; }} />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1">
                                    <i className="bi bi-clock"></i> {fruit.date}
                                </div>
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition">{fruit.name}</h3>
                                    <p className="text-gray-500 text-sm">{fruit.condition}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${fruit.statusColor || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                    {fruit.status || '-'}
                                </span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                                <span className="text-gray-500">Confidence</span>
                                <span className="font-bold text-gray-800">{fruit.confidence}%</span>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card Placeholder - selalu tampil */}
                    <Link
                        to="/add"
                        className="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center justify-center text-center group cursor-pointer no-underline min-h-[300px]"
                    >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition group-hover:shadow-md">
                            <i className="bi bi-plus-lg text-2xl text-blue-500"></i>
                        </div>
                        <h3 className="font-bold text-gray-400 group-hover:text-blue-600 transition">Analyze New Fruit</h3>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default Home;
