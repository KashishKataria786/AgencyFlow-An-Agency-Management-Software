import React from 'react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "AgencyFlow has completely transformed how we manage our clients. The portal is a game changer.",
            author: "Sarah Jenkins",
            role: "Founder, Creative Pulse",
            image: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
            quote: "I used to spend hours on invoicing and project tracking. Now it's all automated. Highly recommended.",
            author: "Michael Chen",
            role: "CEO, TechGrowth",
            image: "https://randomuser.me/api/portraits/men/44.jpg"
        },
        {
            quote: "The interface is beautiful and so easy to use. My team actually enjoys logging their tasks now.",
            author: "Jessica Williams",
            role: "Director, Designify",
            image: "https://randomuser.me/api/portraits/women/68.jpg"
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Trusted by top agencies
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-slate-50 p-8 rounded-2xl relative">
                            {/* Quote Icon */}
                            <svg className="absolute top-8 right-8 w-8 h-8 text-green-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21L14.017 18C14.017 16.896 14.912 16 16.017 16H19C19.553 16 20 15.553 20 15V9C20 8.447 19.553 8 19 8H15C14.447 8 14 8.447 14 9V11C14 11.553 13.553 12 13 12H12V8H15V5H9V12C9 14.646 10.957 16.837 13.483 17.654L14.017 21ZM5 21L5 18C5 16.896 5.896 16 7 16H10C10.553 16 11 15.553 11 15V9C11 8.447 10.553 8 10 8H6C5.447 8 5 8.447 5 9V11C5 11.553 4.553 12 4 12H3V8H6V5H0V12C0 14.646 1.957 16.837 4.483 17.654L5 21Z" />
                            </svg>

                            <p className="text-slate-600 mb-6 relative z-10 font-medium">
                                "{testimonial.quote}"
                            </p>

                            <div className="flex items-center">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900">{testimonial.author}</h4>
                                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
