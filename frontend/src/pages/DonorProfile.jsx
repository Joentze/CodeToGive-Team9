import React, { useState, useEffect } from 'react';
import { auth, store } from '../firebase/base';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import './ProfilePage.css'; // Import the CSS file for styling

const DonorProfile = () => {
  const [user, setUser] = useState(null);
  const [userDocId, setUserDocId] = useState(null); // Store document ID
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      console.log(currentUser);

      if (currentUser) {
        console.log("Current user:", currentUser);
        const q = query(
          collection(store, 'donors'),
          where('donorId', '==', currentUser.uid)
        ); // Assuming you use UID to identify the donor
        
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUser(userDoc.data());
          setEditedUser(userDoc.data());
          setUserDocId(userDoc.id); // Store the document ID
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
    if (userDocId && editedUser) {
      const docRef = doc(store, 'donors', userDocId); // Use the stored document ID
      await updateDoc(docRef, editedUser);
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
      <h1>Donor Profile Page</h1>
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
                    Contact Person:
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
                  <label>
                    Food Safety Certification:
                    <input
                      type="text"
                      name="foodSafetyCertification"
                      value={editedUser.foodSafetyCert || ''}
                      onChange={handleChange}
                    />
                  </label>
                </>
              ) : (
                <>
                  <h2>Name: {user.name}</h2>
                  <p>Contact Person: {user.contactPerson}</p>
                  <p>Contact Number: {user.contactNumber}</p>
                  <p>Food Safety Certification: {user.foodSafetyCert}</p>
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

export default DonorProfile;