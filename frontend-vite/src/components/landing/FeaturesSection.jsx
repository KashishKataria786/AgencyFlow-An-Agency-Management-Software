import React from 'react';

const FeaturesSection = () => {
    const features = [
        {
            title: 'Client Portal',
            description: 'Give your clients a professional dashboard to view project progress, invoices, and share files.',
            icon: '👥',
        },
        {
            title: 'Project Management',
            description: 'Track tasks, milestones, and deadlines with our intuitive Kanban and list views.',
            icon: '📊',
        },
        {
            title: 'Automated Invoicing',
            description: 'Create and send professional invoices in seconds. Get paid faster with automated reminders.',
            icon: '💰',
        },
        {
            title: 'Team Collaboration',
            description: 'Assign roles, chat in real-time, and keep everyone on the same page.',
            icon: '🤝',
        },
        {
            title: 'Financial Insights',
            description: 'Real-time profit and loss tracking. Know your agency numbers at a glance.',
            icon: '📈',
        },
        {
            title: 'White Labeling',
            description: 'Customize the portal with your agency branding, logo, and domain.',
            icon: '🎨',
        }
    ];

    return (
        <section id="features" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Everything you need to run a
                        <span className="text-green-600"> modern agency</span>
                    </h2>
                    <p className="text-lg text-slate-600">
                        Replace your disconnected stack of tools with one powerful platform designed for growth.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
                        >
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
