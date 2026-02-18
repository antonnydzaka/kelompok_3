import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/placeholder.svg';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2 group no-underline">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 overflow-hidden ${scrolled ? 'bg-white' : 'bg-white'}`}>
                            <img src={logo} alt="FreshFruit AI Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className={`font-bold text-xl tracking-tight transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                            FreshFruit<span className="text-cyan-500">Fate</span>
                        </span>
                    </Link>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className={`font-medium text-sm transition-colors hover:text-cyan-500 no-underline ${scrolled ? 'text-gray-600' : 'text-blue-50'}`}>
                            Home
                        </Link>
                        <Link to="/about" className={`font-medium text-sm transition-colors hover:text-cyan-500 no-underline ${scrolled ? 'text-gray-600' : 'text-blue-50'}`}>
                            About Us
                        </Link>
                        <Link to="/add" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm font-semibold py-2.5 px-6 rounded-full shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5 no-underline">
                            Analyze Fruit
                        </Link>
                    </div>

                    {/* Mobile Menu Button (Placeholder) */}
                    <button className={`md:hidden text-2xl ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                        <i className="bi bi-list"></i>
                    </button>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
