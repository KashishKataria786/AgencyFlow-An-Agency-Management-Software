import React, { useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import LandingFooter from '../components/landing/LandingFooter';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <LandingNavbar />
            <div className="pt-24 pb-12 bg-slate-50">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Powerful features for <br />
                        <span className="text-green-600">modern agencies</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
                        From lead generation to final invoice, we've got you covered. Explore the tools that will help you scale.
                    </p>
                </div>
            </div>

            <FeaturesSection />

            <section className="py-24 bg-slate-900 text-white">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to streamline your workflow?
                        </h2>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center">
                                <span className="text-green-400 mr-3">✓</span> Unlimited Projects
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-400 mr-3">✓</span> Client Portal
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-400 mr-3">✓</span> Automated Invoicing
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-400 mr-3">✓</span> 24/7 Support
                            </li>
                        </ul>
                        <Link
                            to="/register"
                            className="inline-block px-8 py-4 rounded-full bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
                        >
                            Get Started Now
                        </Link>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                        {/* Placeholder for feature detail image/graphic */}
                        <div className="aspect-video bg-slate-700/50 rounded-lg flex items-center justify-center">
                            <span className="text-slate-500">Feature Dashboard View</span>
                        </div>
                    </div>
                </div>
            </section>

            <TestimonialsSection />
            <LandingFooter />
        </div>
    );
};

export default FeaturesPage;
