import React, { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Campaign from "./components/Campaign";
import Donate from "./components/Donate";
import TransactionHistory from "./components/TransactionHistory";
import Withdraw from "./components/Withdraw"; //
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("donate");

  return (
    <div className="app-container">
      {/* Header Full Width */}
      <header className="app-header">
        <h1>Quyên góp từ thiện</h1>
        <p>Hệ thống Từ thiện Minh bạch trên Blockchain</p>
        
        <div className="nav-tabs">
          <button 
            className={activeTab === "donate" ? "active" : ""} 
            onClick={() => setActiveTab("donate")}
          >
            💎 Quyên góp & Hợp đồng
          </button>
          <button 
            className={activeTab === "history" ? "active" : ""} 
            onClick={() => setActiveTab("history")}
          >
            📜 Lịch sử giao dịch
          </button>
        </div>

        <div className="wallet-section">
          <ConnectWallet />
        </div>
      </header>

      {/* Giao diện tràn màn hình */}
      <main className="main-content full-width">
        {activeTab === "donate" ? (
          <div className="tab-page fade-in">
            {/* Trang 1: Quyên góp và Quản trị */}
            <div className="card full-card">
              <Campaign />
            </div>
            <div className="card full-card">
              <Donate />
            </div>
            {/* Nút rút tiền dành cho Owner */}
            <div className="card full-card admin-card">
              <Withdraw />
            </div>
          </div>
        ) : (
          <div className="tab-page fade-in">
            {/* Trang 2: Toàn bộ lịch sử từ Blockchain */}
            <div className="card full-card">
              <TransactionHistory />
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Contract: 0x29b1CB6c4b356A8ff9Da407c5af5d6EE9f102B44</p>
      </footer>
    </div>
  );
}

export default App;