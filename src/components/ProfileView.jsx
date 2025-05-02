import React from "react";

const ProfileView = ({ profile }) => {
  return (
    <section className="profile-view">
      <h2>{profile.username}'s Profile</h2>
      {profile.banner && (
        <img src={profile.banner} alt="Profile Banner" className="profile-banner" />
      )}
      <p>{profile.info}</p>
    </section>
  );
};

// Example usage with mock data
// Remove or replace with real data fetching in integration
ProfileView.defaultProps = {
  profile: {
    username: "User123",
    banner: "https://via.placeholder.com/728x90.png?text=Banner",
    info: "This is a sample user profile."
  }
};

export default ProfileView;