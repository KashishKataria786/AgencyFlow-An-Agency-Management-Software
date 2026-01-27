import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Users,
    UserPlus,
    Search,
    MoreVertical,
    Shield,
    User,
    Trash2,
    Key,
    CheckCircle,
    XCircle,
    AlertCircle,
    Edit,
    X
} from "lucide-react";

const TeamManagement = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null); // stores member object
    const [showPasswordModal, setShowPasswordModal] = useState(null); // stores memberId
    const [clients, setClients] = useState([]);
    const [newMember, setNewMember] = useState({ name: "", email: "", password: "", role: "member", clientId: "" });
    const [editData, setEditData] = useState({ name: "", role: "member", clientId: "" });
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");

    const fetchMembers = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/team");
            setMembers(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load team members");
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/clients");
            setClients(data);
        } catch (err) { }
    };

    useEffect(() => {
        fetchMembers();
        fetchClients();
    }, []);

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/team", newMember);
            setShowAddModal(false);
            setNewMember({ name: "", email: "", password: "", role: "member", clientId: "" });
            fetchMembers();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add member");
        }
    };

    const handleUpdateMember = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/team/${showEditModal._id}`, editData);
            setShowEditModal(null);
            fetchMembers();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update member");
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/team/${id}/status`, { isActive: !currentStatus });
            fetchMembers();
        } catch (err) {
            setError("Failed to update status");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/team/${showPasswordModal}/password`, { newPassword });
            setShowPasswordModal(null);
            setNewPassword("");
            alert("Password updated successfully");
        } catch (err) {
            setError("Failed to update password");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            try {
                await axios.delete(`http://localhost:5000/api/team/${id}`);
                fetchMembers();
            } catch (err) {
                setError("Failed to delete member");
            }
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Team Personnel</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-tighter">Manage access, roles, and security for your agency members.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 bg-emerald-500 text-white px-5 py-2.5 rounded-sm text-sm font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all uppercase italic"
                >
                    <UserPlus size={18} />
                    <span>Add Personnel</span>
                </button>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center space-x-3 text-rose-600 text-sm font-bold animate-shake">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button onClick={() => setError("")} className="ml-auto"><X size={14} /></button>
                </div>
            )}

            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-96">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-sm text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Users size={14} />
                        <span>{members.length} Members Registered</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-100 italic text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-4">Personnel Profile</th>
                                <th className="px-8 py-4">System Role</th>
                                <th className="px-8 py-4">Account Status</th>
                                <th className="px-8 py-4">Onboarding Date</th>
                                <th className="px-8 py-4 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold italic">Loading Agency Directory...</td>
                                </tr>
                            ) : members.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold italic uppercase tracking-widest">No personnel found. Start by adding a member.</td>
                                </tr>
                            ) : members.map((member) => (
                                <tr key={member._id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-sm flex items-center justify-center font-black shadow-sm ${member.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                                {member.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase italic">{member.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-tighter">
                                                    {member.email} {member.clientId && <span className="text-emerald-500 ml-1">({member.clientId.company})</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            <Shield size={14} className={member.role === 'owner' ? 'text-amber-500' : 'text-slate-400'} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{member.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <button
                                            onClick={() => handleStatusToggle(member._id, member.isActive)}
                                            className={`status-badge min-w-[90px] text-center cursor-pointer transition-all active:scale-95 ${member.isActive ? 'badge-green' : 'badge-red'}`}
                                        >
                                            {member.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-bold text-slate-500">
                                        {new Date(member.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => {
                                                    setShowEditModal(member);
                                                    setEditData({ name: member.name, role: member.role, clientId: member.clientId?._id || "" });
                                                }}
                                                className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-sm transition-all"
                                                title="Edit Personnel"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => setShowPasswordModal(member._id)}
                                                className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-sm transition-all"
                                                title="Reset Password"
                                            >
                                                <Key size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member._id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-sm transition-all"
                                                title="Remove Member"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl overflow-hidden relative border border-white/20">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Onboard Personnel</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X /></button>
                            </div>
                            <form onSubmit={handleAddMember} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-bold text-slate-700 uppercase"
                                        placeholder="Enter Name"
                                        value={newMember.name}
                                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-bold text-slate-700"
                                        placeholder="name@agency.com"
                                        value={newMember.email}
                                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initialize Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-bold"
                                        placeholder="••••••••"
                                        value={newMember.password}
                                        onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Role</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-bold text-slate-700 uppercase"
                                        value={newMember.role}
                                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                    >
                                        <option value="member">Team Member</option>
                                        <option value="client">Client Portal Access</option>
                                    </select>
                                </div>
                                {newMember.role === "client" && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Associated Business Entity</label>
                                        <select
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-bold text-slate-700 uppercase"
                                            value={newMember.clientId}
                                            onChange={(e) => setNewMember({ ...newMember, clientId: e.target.value })}
                                        >
                                            <option value="">Select Business</option>
                                            {clients.map(c => (
                                                <option key={c._id} value={c._id}>{c.company}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-sm shadow-xl shadow-slate-200 uppercase italic tracking-widest hover:bg-emerald-600 transition-all">Complete Onboarding</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-sm w-full max-w-sm shadow-2xl p-8 relative">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-slate-900 uppercase italic">Security Update</h2>
                            <button onClick={() => setShowPasswordModal(null)} className="text-slate-400 hover:text-rose-500"><X /></button>
                        </div>
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Credentials</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 font-bold"
                                    placeholder="Enter New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="w-full bg-amber-500 text-white font-black py-4 rounded-sm shadow-lg shadow-amber-200 uppercase italic tracking-widest hover:bg-amber-600 transition-all">Overwrite Password</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Member Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl overflow-hidden relative border border-white/20">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-sky-500"></div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Modify Personnel</h2>
                                <button onClick={() => setShowEditModal(null)} className="text-slate-400 hover:text-rose-500 transition-colors"><X /></button>
                            </div>
                            <form onSubmit={handleUpdateMember} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 font-bold text-slate-700 uppercase"
                                        placeholder="Enter Name"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Role</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 font-bold text-slate-700 uppercase"
                                        value={editData.role}
                                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                    >
                                        <option value="member">Team Member</option>
                                        <option value="client">Client Portal Access</option>
                                    </select>
                                </div>
                                {editData.role === "client" && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Associated Business Entity</label>
                                        <select
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 font-bold text-slate-700 uppercase"
                                            value={editData.clientId}
                                            onChange={(e) => setEditData({ ...editData, clientId: e.target.value })}
                                        >
                                            <option value="">Select Business</option>
                                            {clients.map(c => (
                                                <option key={c._id} value={c._id}>{c.company}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-sm shadow-xl shadow-slate-200 uppercase italic tracking-widest hover:bg-sky-600 transition-all">Synchronize Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;
