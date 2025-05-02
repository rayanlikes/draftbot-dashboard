import React from "react";

const Leaderboard = () => {
  // Placeholder for leaderboard data
  const leaderboard = [
    { username: "User123", coins: 1200 },
    { username: "Player456", coins: 950 },
    { username: "Gamer789", coins: 800 }
  ];

  return (
    <section className="leaderboard">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Coins</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, idx) => (
            <tr key={user.username}>
              <td>{idx + 1}</td>
              <td>{user.username}</td>
              <td>{user.coins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Leaderboard;