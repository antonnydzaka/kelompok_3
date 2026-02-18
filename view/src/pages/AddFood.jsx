import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API_BASE = '/api';

const AddFood = () => {
    const [mode, setMode] = useState('upload');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // File object untuk upload
    const [imageBase64, setImageBase64] = useState(null);   // Base64 untuk camera
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setSelectedFile(file);
            setImageBase64(null);
            setAnalysisResult(null);
        }
    };

    const startCamera = async () => {
        setMode('camera');
        setCameraActive(true);
        setSelectedImage(null);
        setSelectedFile(null);
        setImageBase64(null);
        setAnalysisResult(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please make sure you have granted permission.");
            setMode('upload');
            setCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);

            const imageUrl = canvasRef.current.toDataURL('image/jpeg');
            setSelectedImage(imageUrl);
            setImageBase64(imageUrl);
            setSelectedFile(null);
            stopCamera();
        }
    };

    const handleReset = () => {
        setSelectedImage(null);
        setSelectedFile(null);
        setImageBase64(null);
        setAnalysisResult(null);
        stopCamera();
        setMode('upload');
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!selectedImage) {
            alert("Silakan pilih atau ambil gambar terlebih dahulu.");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            let res;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
                res = await fetch(`${API_BASE}/analyze`, {
                    method: 'POST',
                    body: formData,
                });
            } else if (imageBase64) {
                res = await fetch(`${API_BASE}/analyze`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: imageBase64 }),
                });
            } else {
                alert("Data gambar tidak valid.");
                setIsAnalyzing(false);
                return;
            }

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || 'Gagal menganalisis');
            }
            const data = await res.json();
            setAnalysisResult(data);
        } catch (err) {
            alert(err.message || 'Terjadi kesalahan. Pastikan backend berjalan di port 8080.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-20">
            <Navbar />

            {/* Header / Backdrop */}
            <div className="bg-[#111827] pt-28 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Analyze Fruit Freshness
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Upload a photo or use your camera to instantly detect fruit quality using our advanced AI.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-24 relative z-20 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    <div className="p-1">
                        {/* Custom Segmented Control */}
                        <div className="grid grid-cols-2 p-1 bg-gray-100/80 rounded-2xl mx-6 mt-6 max-w-md md:mx-auto">
                            <button
                                onClick={() => { setMode('upload'); stopCamera(); }}
                                className={`py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'upload' ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <i className="bi bi-cloud-upload text-lg"></i> Upload
                            </button>
                            <button
                                onClick={startCamera}
                                className={`py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'camera' ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <i className="bi bi-camera-video text-lg"></i> Camera
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        <form onSubmit={handleAnalyze}>
                            {/* Main Input Area */}
                            <div className={`relative min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden group ${selectedImage ? 'border-blue-500 bg-black' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 bg-gray-50'}`}>

                                {selectedImage ? (
                                    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-black/90">
                                        <img src={selectedImage} alt="Selected" className="max-h-[500px] max-w-full object-contain shadow-2xl" />
                                        <div className="absolute top-4 right-4 flex gap-2">
                                                <button
                                                type="button"
                                                onClick={() => { setSelectedImage(null); setSelectedFile(null); setImageBase64(null); setAnalysisResult(null); }}
                                                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition shadow-lg border border-white/20"
                                                title="Remove Image"
                                            >
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                ) : mode === 'camera' && cameraActive ? (
                                    <div className="relative w-full h-full min-h-[400px] bg-black flex items-center justify-center">
                                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                                        <button
                                            type="button"
                                            onClick={captureImage}
                                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-2xl transition hover:scale-110"
                                        >
                                            <div className="w-16 h-16 rounded-full border-4 border-blue-600 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-blue-600 rounded-full"></div>
                                            </div>
                                        </button>
                                        <canvas ref={canvasRef} className="hidden"></canvas>
                                    </div>
                                ) : (
                                    /* Empty State */
                                    <label htmlFor="foodImage" className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-12 text-center">
                                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${mode === 'camera' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <i className={`bi ${mode === 'camera' ? 'bi-camera' : 'bi-image'} text-5xl`}></i>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            {mode === 'camera' ? 'Start Camera' : 'Drag & Drop or Click'}
                                        </h3>
                                        <p className="text-gray-500 max-w-sm mx-auto">
                                            {mode === 'camera' ? 'Allow access to your camera to take a realtime photo.' : 'Upload a clear image of the fruit (JPG, PNG) to begin analysis.'}
                                        </p>

                                        {mode === 'upload' ? (
                                            <input
                                                type="file"
                                                id="foodImage"
                                                name="foodImage"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={startCamera}
                                                className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold shadow-lg shadow-purple-500/30 transition transform hover:-translate-y-1"
                                            >
                                                Activate Camera
                                            </button>
                                        )}
                                    </label>
                                )}
                            </div>

                            {/* Scanning Animation */}
                            {isAnalyzing && (
                                <div className="mt-8 rounded-2xl bg-white border border-gray-100 shadow-xl overflow-hidden relative p-8 text-center">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shimmer w-[200%] -translate-x-full"></div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <h3 className="text-xl font-bold text-gray-800">Processing Image...</h3>
                                        <p className="text-gray-500">Our AI is analyzing texture, color, and shape.</p>
                                    </div>
                                </div>
                            )}

                            {/* Premium Result Card */}
                            {analysisResult && !isAnalyzing && (
                                <div className={`mt-8 rounded-3xl p-1 bg-gradient-to-br ${analysisResult.status === 'Fresh' ? 'from-green-400 to-emerald-600' : analysisResult.status === 'Rotten' ? 'from-red-400 to-pink-600' : 'from-yellow-400 to-orange-500'}`}>
                                    <div className="bg-white rounded-[22px] p-6 md:p-8 overflow-hidden relative">
                                        <div className="flex flex-col md:flex-row gap-6 items-center">
                                            {/* Icon/Badge */}
                                            <div className={`w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 ${analysisResult.bg}`}>
                                                <i className={`bi ${analysisResult.icon} text-5xl ${analysisResult.color}`}></i>
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex-1 text-center md:text-left">
                                                <h4 className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-1">Analysis Complete</h4>
                                                <h2 className={`text-3xl font-bold mb-2 ${analysisResult.color}`}>{analysisResult.status}</h2>
                                                <p className="text-gray-600 mb-4">{analysisResult.description}</p>

                                                {/* Confidence Bar */}
                                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${analysisResult.status === 'Fresh' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : analysisResult.status === 'Rotten' ? 'bg-gradient-to-r from-red-400 to-pink-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}
                                                        style={{ width: `${analysisResult.confidence}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between mt-2 text-sm font-semibold text-gray-400">
                                                    <span>Confidence Score</span>
                                                    <span className={analysisResult.color}>{analysisResult.confidence}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-8 pt-8 border-t border-gray-100">
                                <Link to="/" className="flex-1 py-4 text-center text-gray-600 hover:text-gray-900 font-bold bg-gray-50 hover:bg-gray-100 rounded-xl transition no-underline">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={!selectedImage || isAnalyzing}
                                    className={`flex-[2] py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 border-0 ${!selectedImage || isAnalyzing
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white'
                                        }`}
                                >
                                    {isAnalyzing ? 'Analyzing...' : <><i className="bi bi-stars"></i> Analyze Fruit</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddFood;
