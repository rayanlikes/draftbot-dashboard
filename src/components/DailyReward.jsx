import React, { useState, useEffect } from "react";

const DailyReward = () => {
  // Simulate fetching initial state (e.g., from localStorage or backend)
  const [claimed, setClaimed] = useState(() => {
    const lastClaim = localStorage.getItem('dailyRewardLastClaim');
    if (!lastClaim) return false;
    const lastClaimTime = new Date(parseInt(lastClaim));
    const now = new Date();
    // Check if 24 hours have passed
    return now.getTime() - lastClaimTime.getTime() < 24 * 60 * 60 * 1000;
  });
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem('userCoins') || '0'));
  const [nextClaimTime, setNextClaimTime] = useState(null);

  useEffect(() => {
    if (claimed) {
      const lastClaimTime = new Date(parseInt(localStorage.getItem('dailyRewardLastClaim')));
      const nextTime = new Date(lastClaimTime.getTime() + 24 * 60 * 60 * 1000);
      setNextClaimTime(nextTime);

      const interval = setInterval(() => {
        const now = new Date();
        if (now >= nextTime) {
          setClaimed(false);
          setNextClaimTime(null);
          clearInterval(interval);
        }
      }, 1000 * 60); // Check every minute

      return () => clearInterval(interval);
    }
  }, [claimed]);

  const handleClaim = () => {
    // TODO: Integrate with backend to persist daily claim and update coins
    const now = new Date();
    const newCoins = coins + 100; // Example: 100 coins per claim
    setClaimed(true);
    setCoins(newCoins);
    localStorage.setItem('dailyRewardLastClaim', now.getTime().toString());
    localStorage.setItem('userCoins', newCoins.toString());
    setNextClaimTime(new Date(now.getTime() + 24 * 60 * 60 * 1000));
    alert("Daily reward claimed! +100 coins (Client-side simulation)");
  };

  const formatTimeLeft = (time) => {
    const totalSeconds = Math.floor((time - new Date().getTime()) / 1000);
    if (totalSeconds <= 0) return "Ready!";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m left`;
  };

  return (
    <section className="daily-reward">
      <h2>Daily Reward</h2>
      {claimed ? (
        <div>
          <p>You have claimed your daily reward today!</p>
          {nextClaimTime && <p>Next claim available in: {formatTimeLeft(nextClaimTime)}</p>}
        </div>
      ) : (
        <button onClick={handleClaim} disabled={claimed}>
          Claim Daily Coins (+100)
        </button>
      )}
      <p>Total Coins: {coins}</p>
    </section>
  );
};

export default DailyReward;