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
          const recipientQuery = query(
            collection(store, 'recipients'),
            where('recipientId', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(recipientQuery);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; // Get the first document
            const fetchedRecipientId = userDoc.id; // Use the document ID as recipientId

            const requestsQuery = query(
              collection(store, 'foodRequests'),
              where('recipientId', '==', fetchedRecipientId)
            );
            const requestsSnapshot = await getDocs(requestsQuery);

            const fetchedRequests = requestsSnapshot.docs.map((doc) => {
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
          } else {
            setError("Recipient not found.");
          }
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
    let date;
    
    // Check if timestamp is a Firestore Timestamp object
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string' && !isNaN(Date.parse(timestamp))) {
      // If timestamp is a string and can be parsed into a Date object
      date = new Date(timestamp);
    } else {
      // If timestamp is neither, return it as is
      return timestamp;
    }
  
    // Format the date
    const options = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
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
