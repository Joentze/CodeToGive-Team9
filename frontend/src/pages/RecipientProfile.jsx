import React, { useState, useEffect } from 'react';
import './ProfilePage.css'; // Import the CSS file for styling

const RecipientProfile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    contactName: 'jane doe',
    phone: '123-456-7890',
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
      <h1>Recipient Profile Page</h1>
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
            </>
          ) : (
            <>
              <h2>Name: {user.name}</h2>
              <p>Email: {user.contactName}</p>
              <p>Phone: {user.phone}</p>
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

export default RecipientProfile;
