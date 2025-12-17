import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import './App.css'
import { 
  UserPlus, 
  Pencil, 
  Trash2, 
  User, 
  Phone, 
  RefreshCw, 
  Search, 
  ChevronRight,
  XCircle,
  Users,
  Shield
} from 'lucide-react';

interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
}

const API_URL = 'http://localhost:5000/api/users';

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (isMounted) setProfiles(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ firstName: '', lastName: '', phone: '' });
        setEditingId(null);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setRefreshTrigger(prev => prev + 1);
  };

  const startEdit = (p: Profile) => {
    setEditingId(p.id);
    setFormData({ firstName: p.first_name, lastName: p.last_name, phone: p.phone });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 text-gray-900 font-sans">
      {/* Modern Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                  UserFlow
                </h1>
                <p className="text-xs text-gray-500 font-medium">Team Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{profiles.length} Active Members</span>
              </div>
              <button 
                onClick={() => setRefreshTrigger(p => p + 1)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-linear-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Form Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-32">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-indigo-50 opacity-60"></div>
                <div className="relative p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                      {editingId ? (
                        <>
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Pencil className="w-5 h-5 text-amber-600" />
                          </div>
                          <span>Edit Profile</span>
                        </>
                      ) : (
                        <>
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <UserPlus className="w-5 h-5 text-blue-600" />
                          </div>
                          <span>Add New Member</span>
                        </>
                      )}
                    </h2>
                    {editingId && (
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                        Editing Mode
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all duration-200 placeholder-gray-400 font-medium"
                      placeholder="Enter first name" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all duration-200 placeholder-gray-400 font-medium"
                      placeholder="Enter last name" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all duration-200 placeholder-gray-400 font-medium"
                      placeholder="+1 (555) 123-4567" 
                      required 
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button 
                    type="submit" 
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center space-x-2"
                  >
                    <span>{editingId ? 'Update Profile' : 'Create Profile'}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {editingId && (
                    <button 
                      type="button"
                      onClick={() => { setEditingId(null); setFormData({firstName:'', lastName:'', phone:''}); }} 
                      className="w-full flex items-center justify-center space-x-2 text-gray-600 font-semibold py-3 hover:text-red-600 transition-colors duration-200 bg-gray-50 hover:bg-gray-100 rounded-xl"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Table Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Team Directory</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage all team members in one place</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <span className="text-sm font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {profiles.length} Members
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-gray-50 to-gray-100">
                      <th className="p-4 text-left text-xs font-bold uppercase text-gray-600 tracking-wider">
                        Profile
                      </th>
                      <th className="p-4 text-left text-xs font-bold uppercase text-gray-600 tracking-wider">
                        Contact
                      </th>
                      <th className="p-4 text-right text-xs font-bold uppercase text-gray-600 tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {profiles.length > 0 ? (
                      profiles.map((p) => (
                        <tr 
                          key={p.id} 
                          className="group hover:bg-linear-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200"
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
                                  {p.first_name[0]}{p.last_name[0]}
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                  {p.first_name} {p.last_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <Phone className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="font-medium text-gray-700">{p.phone}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => startEdit(p)} 
                                className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group/btn"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                              </button>
                              <button 
                                onClick={() => handleDelete(p.id)} 
                                className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/btn"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-12 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-6 bg-gray-100 rounded-2xl">
                              <Search className="w-12 h-12 text-gray-300" />
                            </div>
                            <div>
                              <p className="text-gray-500 font-semibold text-lg">No profiles found</p>
                              <p className="text-gray-400 text-sm mt-1">Start by adding your first team member</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}