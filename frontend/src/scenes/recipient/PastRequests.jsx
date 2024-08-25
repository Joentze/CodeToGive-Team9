import React, { useState, useEffect } from 'react';
import { auth, store } from '../../firebase/base';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './PastRequests.css'; // Import the CSS file for custom styling

const PastRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const recipientId = currentUser.uid;
          const q = query(
            collection(store, 'foodRequests'),
            where('recipientID', '==', recipientId)
          );
          const querySnapshot = await getDocs(q);

          const fetchedRequests = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              dateOfRequest: data.dateOfRequest || new Date(), // Default to current date if missing
              receivedAt: data.receivedAt || new Date(), // Default to current date if missing
              foodType: data.foodType || 'Unknown',
              canCook: data.canCook ?? false,
              canReheat: data.canReheat ?? false,
              hasFridge: data.hasFridge ?? false,
              familySize: data.familySize ?? 'Unknown',
              dietaryRestrictions: Array.isArray(data.dietaryRestrictions) ? data.dietaryRestrictions : [],
              deliveryAddress: data.deliveryAddress || { lat: 'N/A', long: 'N/A' }, // Default values
              zipCode: data.zipCode || 'N/A', // Default value
            };
          });

          setRequests(fetchedRequests);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError("Failed to load requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Helper function to format the date to month/date and time in 12-hour format
  const formatDate = (timestamp) => {
    if (timestamp?.toDate) {
      const date = timestamp.toDate();
      const options = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } else if (timestamp instanceof Date) {
      const options = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      return new Intl.DateTimeFormat('en-US', options).format(timestamp);
    }
    return timestamp; // Handle as string or other format
  };

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="past-requests-container">
      <h1 className="title">Past Requests</h1>
      {requests.length > 0 ? (
        <div className="requests-grid">
          {requests.map((request) => (
            <div className="request-card" key={request.id}>
              <h3 className="request-date">{formatDate(request.dateOfRequest)}</h3>
              <div className="request-details">
                <p><strong>Food Item:</strong> {request.foodType}</p>
                <p><strong>Received At:</strong> {formatDate(request.receivedAt)}</p>
                <p><strong>Can Cook:</strong> {request.canCook ? 'Yes' : 'No'}</p>
                <p><strong>Can Reheat:</strong> {request.canReheat ? 'Yes' : 'No'}</p>
                <p><strong>Has Fridge:</strong> {request.hasFridge ? 'Yes' : 'No'}</p>
                <p><strong>Family Size:</strong> {request.familySize}</p>
                <p><strong>Dietary Restrictions:</strong> {request.dietaryRestrictions.join(', ') || 'None'}</p>
                <p><strong>Delivery Address:</strong></p>
                <ul>
                  <li>Latitude: {request.deliveryAddress.lat}</li>
                  <li>Longitude: {request.deliveryAddress.long}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-requests">No past requests found.</p>
      )}
    </div>
  );
};

export default PastRequests;
