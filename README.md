# 🗳️ E-Voting dApp

A decentralized voting application built using **Solidity**, **Hardhat**, and **React.js** for secure and transparent blockchain-based elections.

---

## 🚀 Features
- Add and display candidates on the blockchain  
- Controlled voting phases (Registration, Voting, Ended)  
- Only the admin can manage the election process  
- Transparent and tamper-proof voting using smart contracts  

---

## 🛠️ Tech Stack
- **Smart Contract:** Solidity  
- **Blockchain Framework:** Hardhat  
- **Frontend:** React.js  
- **Blockchain Interaction:** Ethers.js  

---

## ⚙️ Installation and Setup


1️⃣ Clone the Repository
git clone https://github.com/<your-username>/E-Voting-dApp.git
cd E-Voting-dApp

2️⃣ Install Dependencies
npm install

3️⃣ Start Hardhat Local Blockchain
npx hardhat node

4️⃣ Deploy the Smart Contract
npx hardhat run scripts/deploy.js --network localhost

5️⃣ Start the React App
cd client
npm start

---


##🔑 Configuration

Create a config.js file inside your React project folder (/src) and add the following:

export const PROVIDER_URL = "http://127.0.0.1:8545";
export const PRIVATE_KEY = "<your-private-key>";
export const CONTRACT_ADDRESS = "<deployed-contract-address>";

✅ Replace <your-private-key> and <deployed-contract-address> with your actual values.
