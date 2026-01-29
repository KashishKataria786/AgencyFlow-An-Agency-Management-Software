import React, { useState, useEffect } from 'react';
import { useAgency } from '../context/AgencyContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Loader2, Upload, Globe, Palette, Building2 } from 'lucide-react';

const AgencySettings = () => {
    const { agency, updateAgency, loading: agencyLoading } = useAgency();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [brandColor, setBrandColor] = useState('#000000');
    const [secondaryColor, setSecondaryColor] = useState('#333333');
    const [website, setWebsite] = useState('');
    const [logoType, setLogoType] = useState('upload'); // 'upload' or 'url'
    const [logoUrl, setLogoUrl] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (agency) {
            setName(agency.name || '');
            setBrandColor(agency.settings?.brandColor || '#000000');
            setSecondaryColor(agency.settings?.secondaryColor || '#333333');
            setWebsite(agency.settings?.website || '');
            setLogoUrl(agency.settings?.logo || '');
            setPreviewUrl(agency.settings?.logo || '');
        }
    }, [agency]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('brandColor', brandColor);
        formData.append('secondaryColor', secondaryColor);
        formData.append('website', website);

        if (logoType === 'upload' && logoFile) {
            formData.append('logo', logoFile);
        } else if (logoType === 'url') {
            formData.append('logoUrl', logoUrl);
        }

        const result = await updateAgency(formData);

        if (result.success) {
            toast.success("Agency settings updated successfully!");
        } else {
            toast.error(result.message || "Failed to update settings");
        }

        setIsSaving(false);
    };

    if (agencyLoading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Building2 className="text-primary" /> Agency Settings
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Settings */}
                <div className="potion-card">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        General Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <Globe size={16} /> Website
                            </label>
                            <input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="https://youragency.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Branding Settings */}
                <div className="potion-card">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Palette className="text-primary" /> Branding & Style
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Brand Color</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={brandColor}
                                        onChange={(e) => setBrandColor(e.target.value)}
                                        className="h-12 w-20 cursor-pointer rounded border-none p-0"
                                    />
                                    <input
                                        type="text"
                                        value={brandColor}
                                        onChange={(e) => setBrandColor(e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none uppercase"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Used for buttons, links, and primary UI elements.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="h-12 w-20 cursor-pointer rounded border-none p-0"
                                    />
                                    <input
                                        type="text"
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Agency Logo</label>

                            <div className="flex gap-4 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setLogoType('upload')}
                                    className={`flex-1 py-1 rounded text-sm font-medium ${logoType === 'upload' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Upload File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLogoType('url')}
                                    className={`flex-1 py-1 rounded text-sm font-medium ${logoType === 'url' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Image URL
                                </button>
                            </div>

                            {logoType === 'upload' ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                                    <input
                                        type="file"
                                        id="logo-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="logo-upload" className="cursor-pointer space-y-2">
                                        <Upload className="mx-auto text-gray-400" />
                                        <div className="text-sm text-gray-600">Click to upload or drag and drop</div>
                                        <div className="text-xs text-gray-400">PNG, JPG or WebP (max 500x500)</div>
                                    </label>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={logoUrl}
                                    onChange={(e) => {
                                        setLogoUrl(e.target.value);
                                        setPreviewUrl(e.target.value);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="https://example.com/logo.png"
                                />
                            )}

                            {previewUrl && (
                                <div className="mt-4">
                                    <p className="text-xs font-medium text-gray-500 mb-2 italic">Preview:</p>
                                    <div className="h-16 w-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded p-2">
                                        <img src={previewUrl} alt="Logo Preview" className="max-h-full object-contain" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgencySettings;
