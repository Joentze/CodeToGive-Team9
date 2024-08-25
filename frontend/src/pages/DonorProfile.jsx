import React, { useState, useEffect } from 'react';
import './ProfilePage.css'; // Import the CSS file for styling

const DonorProfile = () => {
  const [user, setUser] = useState({
    name: 'Skyline Restaurant',
    contactName: 'Mark',
    phone: '123-456-7890',
    certification: 'ISO 22000'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setUser(editedUser); // Save the edited user details
    setIsEditing(false);
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
          {isEditing ? (
            <>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                />
              </label>
              <label>
                Contact person:
                <input
                  type="text"
                  name="contactName"
                  value={editedUser.contactName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Contact Number:
                <input
                  type="tel"
                  name="phone"
                  value={editedUser.phone}
                  onChange={handleChange}
                />
              </label>
              <label>
                Food Safety Certification:
                <input
                  type="text"
                  name="certification"
                  value={editedUser.certification}
                  onChange={handleChange}
                />
              </label>
            </>
          ) : (
            <>
              <h2>Name: {user.name}</h2>
              <p>Contact Person: {user.contactName}</p>
              <p>Contact Number: {user.phone}</p>
              <p>Certification: {user.certification}</p>
            </>
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
