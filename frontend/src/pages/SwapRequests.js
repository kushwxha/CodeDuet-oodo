import { useEffect, useState } from 'react';
import API from '../services/api';

function SwapRequests() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSwaps = async () => {
    try {
      const res = await API.get('/swaps');
      setSent(res.data.sent);
      setReceived(res.data.received);
    } catch (err) {
      console.error('Error fetching swaps:', err);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const respondToSwap = async (id, action) => {
    try {
      await API.put(`/swaps/${id}/respond`, { action });
      setMessage(`Swap ${action}`);
      fetchSwaps();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error responding to swap');
    }
  };

  const deleteSwap = async (id) => {
    try {
      await API.delete(`/swaps/${id}`);
      setMessage('Swap deleted');
      fetchSwaps();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error deleting swap');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">My Swap Requests</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Sent Requests</h3>
        {sent.length === 0 && <p>No sent swap requests.</p>}
        {sent.map((swap) => (
          <div key={swap._id} className="border p-3 rounded mb-2">
            <p>
              To: <strong>{swap.toUser.name}</strong>
            </p>
            <p>Skill: <em>{swap.skill}</em></p>
            <p>Status: <strong>{swap.status}</strong></p>
            {swap.status === 'pending' && (
              <button
                onClick={() => deleteSwap(swap._id)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete Request
              </button>
            )}
          </div>
        ))}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Received Requests</h3>
        {received.length === 0 && <p>No received swap requests.</p>}
        {received.map((swap) => (
          <div key={swap._id} className="border p-3 rounded mb-2">
            <p>
              From: <strong>{swap.fromUser.name}</strong>
            </p>
            <p>Skill: <em>{swap.skill}</em></p>
            <p>Status: <strong>{swap.status}</strong></p>
            {swap.status === 'pending' && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => respondToSwap(swap._id, 'accepted')}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToSwap(swap._id, 'rejected')}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default SwapRequests;
