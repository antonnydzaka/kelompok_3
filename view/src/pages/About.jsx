import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
    // Team members data
    const teamMembers = [
        { id: 1, name: "Nama Anggota 1", nim: "NIM 1", role: "Developer" },
        { id: 2, name: "Nama Anggota 2", nim: "NIM 2", role: "Developer" },
        { id: 3, name: "Nama Anggota 3", nim: "NIM 3", role: "Developer" },
        { id: 4, name: "Nama Anggota 4", nim: "NIM 4", role: "Developer" },
        // Add more members as needed
    ];

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-20">
            <Navbar />

            {/* Header Section */}
            <div className="bg-[#111827] pt-28 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Tentang Kami
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Mengenal lebih dekat tim di balik FreshFruit AI.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 -mt-24 relative z-20 max-w-5xl">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">

                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Google Developer Group (Kelompok 3)</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                            Kami adalah sekelompok pengembang yang berdedikasi untuk menciptakan solusi inovatif menggunakan teknologi AI untuk membantu memastikan kualitas pangan.
                        </p>
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center text-blue-600 text-3xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    {member.name.charAt(0)}
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg mb-1">{member.name}</h3>
                                <div className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold mb-3">
                                    {member.nim}
                                </div>
                                <p className="text-gray-500 text-sm">{member.role}</p>
                            </div>
                        ))}
                    </div>

                    {/* Footer Note */}
                    <div className="mt-12 text-center border-t border-gray-100 pt-8">
                        <p className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} FreshFruit AI - Google Developer Student Clubs.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;
