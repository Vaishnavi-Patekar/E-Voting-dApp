import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, PRIVATE_KEY, PROVIDER_URL } from "./config";
import contractArtifact from "./Voting.json";
import "./App.css";

function App() {
  const [candidateName, setCandidateName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [phase, setPhase] = useState("Loading...");
  const [account, setAccount] = useState("");

  const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, wallet);

  // 🔹 Load current phase
  const getPhase = async () => {
    try {
      const currentPhase = await contract.currentPhase();
      const phaseNames = ["Init", "Registration", "Voting", "Ended"];
      setPhase(phaseNames[currentPhase]);
    } catch (err) {
      console.error(err);
      setPhase("Unknown");
    }
  };

  // 🔹 Load connected wallet address
  const getAccount = async () => {
    try {
      const address = await wallet.getAddress();
      setAccount(address);
    } catch (err) {
      console.error("Error fetching wallet:", err);
    }
  };

  const addCandidate = async () => {
    if (!candidateName.trim()) return alert("Enter a candidate name!");
    try {
      const tx = await contract.addCandidate(candidateName);
      await tx.wait();
      alert("✅ Candidate added successfully!");
      setCandidateName("");
    } catch (err) {
      console.error("Add candidate failed:", err);
      alert("❌ Failed to add candidate");
    }
  };

  const showCandidates = async () => {
    try {
      const count = await contract.candidatesCount();
      const list = [];
      for (let i = 1; i <= count; i++) {
        const c = await contract.candidates(i);
        list.push({
          id: c.id.toString(),
          name: c.name,
          votes: c.voteCount.toString(),
        });
      }
      setCandidates(list);
    } catch (err) {
      console.error("Show candidates failed:", err);
      alert("❌ Failed to load candidates");
    }
  };

  useEffect(() => {
    getPhase();
    getAccount();
  }, []);

  return (
    <div className="app-container">
      {/* 🔹 Navigation Bar */}
      <nav className="navbar">
        <div className="nav-title">🗳️ E-Voting dApp</div>
        <div className="nav-right">
          <span className="phase-tag">Phase: <strong>{phase}</strong></span>
          <span className="wallet-tag">
            Wallet: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
      </nav>

      {/* 🔹 Main Content */}
      <div className="content">
        <h2 className="section-title">Candidate Registration</h2>
        <div className="input-section">
          <input
            className="input-box"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Enter Candidate Name"
          />
          <button className="btn add-btn" onClick={addCandidate}>
            ➕ Add Candidate
          </button>
        </div>

        <button className="btn show-btn" onClick={showCandidates}>
          👀 Show Candidates
        </button>

        <h3 className="subheading">Candidates List</h3>
        <ul className="candidate-list">
          {candidates.map((c) => (
            <li key={c.id} className="candidate-item">
              <span className="candidate-name">{c.name}</span>
              <span className="candidate-votes">🗳️ {c.votes} votes</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
