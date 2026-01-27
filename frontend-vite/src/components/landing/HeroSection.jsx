import React from 'react';
import { Link } from 'react-router-dom';
import LANDING_IMAGE from '../../assets/johndoe.png'
const HeroSection = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-6 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-green-50 text-green-600 text-sm font-semibold mb-6 border border-green-100">
                    🚀 The #1 Agency Management Platform
                </span>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8">
                    Manage your agency <br />
                    <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                        with absolute clarity
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Streamline operations, manage clients, track finances, and scale your agency from one unified dashboard. Stop juggling multiple tools and start growing.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/register"
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-200"
                    >
                        Start Free Trial
                    </Link>
                    <Link
                        to="/#features"
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-700 font-semibold text-lg border border-slate-200 hover:bg-slate-50 transition-all"
                    >
                        See How It Works
                    </Link>
                </div>

                <div className="mt-16 md:mt-24 relative mx-auto max-w-5xl">
                    <div className="relative rounded-xl bg-slate-900/5 p-2 ring-1 ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200 Aspect-video  md:h-96 flex items-center justify-center bg-slate-50">
                            <img src={LANDING_IMAGE} alt='landingpage'/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
