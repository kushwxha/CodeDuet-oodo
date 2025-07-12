import { useEffect, useState } from 'react';
import API from '../services/api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    skillsOffered: '',
    skillsWanted: '',
    availability: '',
    isPublic: true,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/users/me')
      .then((res) => {
        setUser(res.data);
        setForm({
          name: res.data.name || '',
          skillsOffered: res.data.skillsOffered?.join(', ') || '',
          skillsWanted: res.data.skillsWanted?.join(', ') || '',
          availability: res.data.availability || '',
          isPublic: res.data.isPublic,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await API.put('/users/profile', {
        ...form,
        skillsOffered: form.skillsOffered.split(',').map(s => s.trim()),
        skillsWanted: form.skillsWanted.split(',').map(s => s.trim()),
      });
      setMessage('Profile updated!');
    } catch (err) {
      setMessage('Error updating profile');
    }
  };

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border" />

        <input type="text" name="skillsOffered" value={form.skillsOffered} onChange={handleChange} placeholder="Skills Offered (comma-separated)" className="w-full p-2 border" />

        <input type="text" name="skillsWanted" value={form.skillsWanted} onChange={handleChange} placeholder="Skills Wanted (comma-separated)" className="w-full p-2 border" />

        <input type="text" name="availability" value={form.availability} onChange={handleChange} placeholder="Availability (e.g., evenings, weekends)" className="w-full p-2 border" />

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} />
          <span>Make my profile public</span>
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white p-2">Update Profile</button>
      </form>
    </div>
  );
}

export default Dashboard;
