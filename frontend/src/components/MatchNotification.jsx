import React, { useState, useEffect } from 'react';
import { auth, store } from '../firebase/base';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import './MatchNotification.css'; // Create or update this CSS file for custom styles

const MatchNotification = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const recipientId = currentUser.uid;
      const q = query(collection(store, 'matches'), where('recipientId', '==', recipientId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const matchData = snapshot.docs.map(doc => doc.data());
          setMatches(matchData);
        } else {
          setMatches([]);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="match-notification-page">
      <h1 className="header">Matches for You!</h1>
      {matches.length > 0 ? (
        <div className="match-container">
          {matches.map((match, index) => (
            <div className="match-card" key={index}>
              <div className="card-header">
                <h2>Match {index + 1}</h2>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <div className="card-item"><strong>Food Item:</strong> {match.foodItem}</div>
                  <div className="card-item"><strong>Quantity:</strong> {match.quantity}</div>
                </div>
                <div className="card-row">
                  <div className="card-item"><strong>Family Size:</strong> {match.familySize}</div>
                  <div className="card-item"><strong>Is Halal:</strong> {match.isHalal ? 'Yes' : 'No'}</div>
                </div>
                <div className="card-row">
                  <div className="card-item"><strong>Is Perishable:</strong> {match.isPerishable ? 'Yes' : 'No'}</div>
                  <div className="card-item"><strong>Can Cook:</strong> {match.canCook ? 'Yes' : 'No'}</div>
                </div>
                <div className="card-row">
                  <div className="card-item"><strong>Can Reheat:</strong> {match.canReheat ? 'Yes' : 'No'}</div>
                  <div className="card-item"><strong>Has Fridge:</strong> {match.hasFridge ? 'Yes' : 'No'}</div>
                </div>
                <div className="card-row">
                  <div className="card-item"><strong>Pick Up Address:</strong> {match.pickUpAddress.latitude}, {match.pickUpAddress.longitude}</div>
                  <div className="card-item"><strong>Delivery Address:</strong> {match.deliveryAddress.latitude}, {match.deliveryAddress.longitude}</div>
                </div>
                <div className="card-row">
                  <div className="card-item"><strong>Expiry Date:</strong> {match.expiryDate.toDate().toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-notification">
          No new matches at the moment.
        </div>
      )}
    </div>
  );
};

export default MatchNotification;
