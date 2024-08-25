import React, { useState, useEffect } from 'react';
import { auth, store } from '../firebase/base';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import './ProfilePage.css'; // Import the CSS file for styling

const RecipientProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const uid = currentUser.uid;
        console.log(uid);
        const q = query(collection(store, 'recipients'), where('recipientId', '==', uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUser({ ...userDoc.data(), recipientId: userDoc.id }); // Add recipientId to track document ID
          setEditedUser(userDoc.data());
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (user) {
      const userDocRef = doc(store, 'recipients', user.recipientId); // Use the recipientId to update the document
      await updateDoc(userDocRef, editedUser);
      setUser(editedUser); // Save the edited user details
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="profile-page">
      <h1>Recipient Profile Page</h1>
      <div className="profile-info">
        <div className="profile-details">
          {user ? (
            <>
              {isEditing ? (
                <>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="name"
                      value={editedUser.name || ''}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Contact person:
                    <input
                      type="text"
                      name="contactPerson"
                      value={editedUser.contactPerson || ''}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Contact Number:
                    <input
                      type="tel"
                      name="contactNumber"
                      value={editedUser.contactNumber || ''}
                      onChange={handleChange}
                    />
                  </label>
                </>
              ) : (
                <>
                  <h2>Name: {user.name}</h2>
                  <p>Contact Person: {user.contactPerson}</p>
                  <p>Phone: {user.contactNumber}</p>
                </>
              )}
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
      {isEditing ? (
        <button className="save-button" onClick={handleSaveClick}>
          Save
        </button>
      ) : (
        <button className="edit-button" onClick={handleEditClick}>
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default RecipientProfile;
