import { useEffect, useState } from 'react';
import API from '../services/api';

function BrowseUsers() {
  const [users, setUsers] = useState([]);
  const [skill, setSkill] = useState('');
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await API.get(`/users${skill ? `?skill=${skill}` : ''}`);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // initial load

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const sendSwapRequest = async (toUserId, skill) => {
    try {
      await API.post('/swaps', { toUserId, skill });
      setMessage('Swap request sent!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Browse Users</h2>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by skill..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="p-2 border w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4">Search</button>
      </form>

      {message && <p className="text-green-600 mb-2">{message}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <div key={u._id} className="border p-4 rounded">
              <h3 className="font-bold">{u.name}</h3>
              <p><strong>Skills Offered:</strong> {u.skillsOffered?.join(', ')}</p>
              <p><strong>Skills Wanted:</strong> {u.skillsWanted?.join(', ')}</p>
              <p><strong>Availability:</strong> {u.availability}</p>

              {u.skillsWanted?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {u.skillsWanted.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => sendSwapRequest(u._id, skill)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Swap for "{skill}"
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseUsers;
