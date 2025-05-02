import React, { useState, useEffect } from "react";

const ProfileEditor = ({ profile: initialProfile, onSave }) => {
  const [profile, setProfile] = useState(initialProfile || {
    username: "",
    banner: "",
    info: ""
  });

  // Update local state if the initialProfile prop changes
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onSave function passed from the parent (App.jsx)
    if (onSave) {
      onSave(profile);
    } else {
      // Fallback if onSave is not provided (though it should be)
      alert("Profile save handler not configured!");
    }
    // TODO: Integrate with backend to save profile
    // alert("Profile saved! (Backend integration needed)"); // Replaced by onSave call
  };

  return (
    <section className="profile-editor">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Banner URL:
          <input
            type="text"
            name="banner"
            value={profile.banner}
            onChange={handleChange}
          />
        </label>
        <label>
          Info:
          <textarea
            name="info"
            value={profile.info}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save Profile</button>
      </form>
    </section>
  );
};

export default ProfileEditor;