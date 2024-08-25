import React, { useState, useEffect } from 'react';
import { auth, store } from '../firebase/base';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import './MatchNotification.css'; // Create or update this CSS file for custom styles

const MatchNotification = () => {
  const [matchDetails, setMatchDetails] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const recipientId = currentUser.uid;
      const q = query(collection(store, 'matches'), where('recipientId', '==', recipientId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          // Assuming you want to display the first match
          const matchData = snapshot.docs[0].data();
          setMatchDetails(matchData);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="match-notification-page">
      {matchDetails ? (
        <div className="match-card">
          <h2>New Match Found!</h2>
          <p><strong>Food Item:</strong> {matchDetails.foodItem}</p>
          <p><strong>Quantity:</strong> {matchDetails.quantity}</p>
          <p><strong>Family Size:</strong> {matchDetails.familySize}</p>
          <p><strong>Is Halal:</strong> {matchDetails.isHalal ? 'Yes' : 'No'}</p>
          <p><strong>Is Perishable:</strong> {matchDetails.isPerishable ? 'Yes' : 'No'}</p>
          <p><strong>Can Cook:</strong> {matchDetails.canCook ? 'Yes' : 'No'}</p>
          <p><strong>Can Reheat:</strong> {matchDetails.canReheat ? 'Yes' : 'No'}</p>
          <p><strong>Has Fridge:</strong> {matchDetails.hasFridge ? 'Yes' : 'No'}</p>
          <p><strong>Pick Up Address:</strong> {matchDetails.pickUpAddress.latitude}, {matchDetails.pickUpAddress.longitude}</p>
          <p><strong>Delivery Address:</strong> {matchDetails.deliveryAddress.latitude}, {matchDetails.deliveryAddress.longitude}</p>
          <p><strong>Expiry Date:</strong> {matchDetails.expiryDate.toDate().toLocaleString()}</p>
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
