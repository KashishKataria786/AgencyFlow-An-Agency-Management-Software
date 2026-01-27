import React from 'react';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
    return (
        <footer className="bg-slate-900 text-white py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6 block">
                            AgencyFlow
                        </Link>
                        <p className="text-slate-400">
                            The all-in-one platform for modern agencies. Streamline, scale, and succeed.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="/features" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
                            <li><span className="text-slate-400 hover:text-white transition-colors cursor-pointer">About Us</span></li>
                            <li><span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Blog</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                            <li><span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} AgencyFlow. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {/* Social Icons Placeholder */}
                        <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-green-500 transition-colors"></div>
                        <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-green-500 transition-colors"></div>
                        <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-green-500 transition-colors"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
