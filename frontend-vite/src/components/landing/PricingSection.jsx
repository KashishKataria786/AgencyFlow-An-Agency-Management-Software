import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
    const [isYearly, setIsYearly] = useState(false);

    const plans = [
        {
            name: 'Freelancer',
            priceMonthly: 0,
            priceYearly: 0,
            features: [
                'Up to 3 clients',
                'Basic Project Management',
                '5 Invoices/month',
                'Standard Support'
            ],
            cta: 'Start Free',
            highlighted: false
        },
        {
            name: 'Agency',
            priceMonthly: 49,
            priceYearly: 490,
            features: [
                'Unlimited clients',
                'Advanced Project Management',
                'Unlimited Invoices',
                'Client Portal Access',
                'Financial Analytics',
                'Priority Support'
            ],
            cta: 'Start Trial',
            highlighted: true
        },
        {
            name: 'Enterprise',
            priceMonthly: 199,
            priceYearly: 1990,
            features: [
                'Everything in Agency',
                'White Labeling',
                'Dedicated Account Manager',
                'API Access',
                'Custom Integrations',
                'SLA'
            ],
            cta: 'Contact Sales',
            highlighted: false
        }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-lg text-slate-600 mb-8">
                        No hidden fees. Cancel anytime.
                    </p>

                    <div className="flex items-center justify-center space-x-4">
                        <span className={`text-sm font-semibold ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className={`w-14 h-7 flex items-center bg-slate-200 rounded-full p-1 duration-300 ease-in-out ${isYearly ? 'bg-green-600' : ''}`}
                        >
                            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${isYearly ? 'translate-x-7' : ''}`}></div>
                        </button>
                        <span className={`text-sm font-semibold ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
                            Yearly <span className="text-green-600 text-xs ml-1">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`rounded-2xl p-8 relative ${plan.highlighted
                                    ? 'bg-white shadow-xl ring-2 ring-green-600 scale-105 z-10'
                                    : 'bg-white shadow-sm border border-slate-100'
                                }`}
                        >
                            {plan.highlighted && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            )}
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{plan.name}</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-slate-900">
                                    ${isYearly ? plan.priceYearly : plan.priceMonthly}
                                </span>
                                <span className="text-slate-500 ml-1">/{isYearly ? 'year' : 'month'}</span>
                            </div>

                            <ul className="mb-8 space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-slate-600">
                                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/register"
                                className={`block w-full py-3 rounded-lg text-center font-medium transition-colors ${plan.highlighted
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
