import React, { useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import PricingSection from '../components/landing/PricingSection';
import LandingFooter from '../components/landing/LandingFooter';

const PricingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <LandingNavbar />
            <div className="pt-24">
                <PricingSection />
            </div>
            <div className="bg-white py-24">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto text-left space-y-8">
                        <div>
                            <h4 className="font-semibold text-lg text-slate-900 mb-2">Can I cancel my subscription?</h4>
                            <p className="text-slate-600">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg text-slate-900 mb-2">Do you offer refunds?</h4>
                            <p className="text-slate-600">We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied, just let us know.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg text-slate-900 mb-2">Is my data secure?</h4>
                            <p className="text-slate-600">Absolutely. We use bank-level encryption to protect your data and perform regular backups.</p>
                        </div>
                    </div>
                </div>
            </div>
            <LandingFooter />
        </div>
    );
}

export default PricingPage;
