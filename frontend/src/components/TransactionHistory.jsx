import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CharityABI from "../abi/CharityFund.json";

// ĐỊA CHỈ HỢP ĐỒNG MỚI BẠN VỪA DEPLOY
const CONTRACT_ADDRESS = "0x6d6C767B40E5c5De87EC70Ec1950cD85c88E5196";

export default function TransactionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Sử dụng Provider ổn định của Cronos Testnet
        const provider = new ethers.JsonRpcProvider("https://evm-t3.cronos.org");
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CharityABI, provider);

        // 1. Quét sự kiện 'DonationReceived' từ Blockchain
        // Sử dụng -50000 để quét sâu hơn một chút phòng trường hợp block nhảy nhanh
        const filter = contract.filters.DonationReceived();
        const logs = await contract.queryFilter(filter, -50000, "latest"); 

        const blockchainHistory = await Promise.all(
          logs.map(async (log) => {
            const block = await log.getBlock();
            return {
              donor: log.args[0], 
              // Chuyển đổi từ uint256 (Wei) sang Ether để hiển thị số đọc được
              amount: ethers.formatEther(log.args[1]), 
              date: new Date(Number(block.timestamp) * 1000).toLocaleString("vi-VN"),
              txHash: log.transactionHash,
            };
          })
        );

        // 2. Đồng bộ với LocalStorage (Dữ liệu tạm thời khi vừa nhấn nút Donate)
        const storedHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
        
        // Gộp dữ liệu: Ưu tiên dữ liệu thật từ Blockchain
        const combined = [...blockchainHistory];
        storedHistory.forEach(localTx => {
          if (!combined.some(bcTx => bcTx.txHash === localTx.txHash)) {
            combined.push(localTx);
          }
        });

        // 3. Sắp xếp: Giao dịch mới nhất hiển thị trên cùng
        const sortedHistory = combined.sort((a, b) => {
           return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setHistory(sortedHistory);
      } catch (error) {
        console.error("Lỗi quét Blockchain:", error);
        // Nếu lỗi mạng, hiển thị tạm dữ liệu từ LocalStorage
        const storedHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
        setHistory(storedHistory);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    // Tự động làm mới mỗi 20 giây để cập nhật quyên góp mới
    const interval = setInterval(fetchHistory, 20000); 
    return () => clearInterval(interval);
  }, []);

  const shortenAddress = (address) => {
    if (!address) return "0x000...0000";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div style={{ 
      marginTop: "20px", 
      padding: "25px", 
      background: "#ffffff", 
      borderRadius: "15px", 
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)", 
      width: "100%",
      boxSizing: "border-box" 
    }}>
      <h3 style={{ 
        color: "#002d72", 
        borderBottom: "3px solid #f0f2f5", 
        paddingBottom: "15px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        📜 Nhật ký quyên góp (Contract mới)
      </h3>
      
      {loading && history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="spinner"></div>
          <p style={{ color: "#666", marginTop: "10px" }}>Đang đồng bộ với Cronos Explorer...</p>
        </div>
      ) : (
        <div style={{ overflowX: "hidden" }}>
          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px", color: "#bbb" }}>
               <p>Chưa có dữ liệu quyên góp cho hợp đồng này.</p>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {history.map((tx, index) => (
                <li key={index} style={{ 
                  padding: "20px 10px", 
                  borderBottom: "1px solid #f0f2f5",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ 
                      background: "#e6f7ff", 
                      color: "#1890ff", 
                      padding: "4px 12px", 
                      borderRadius: "20px", 
                      fontWeight: "bold",
                      fontSize: "16px" 
                    }}>
                      +{tx.amount} TCRO
                    </span>
                    <span style={{ fontSize: "13px", color: "#999" }}>{tx.date}</span>
                  </div>
                  
                  <div style={{ fontSize: "14px", color: "#444" }}>
                    <strong>Từ ví:</strong> <code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: "4px" }}>{shortenAddress(tx.donor)}</code>
                  </div>

                  <a 
  // Đảm bảo cấu trúc link đúng chuẩn Explorer mới: /testnet/tx/ + mã hash
  href={`https://explorer.cronos.org/testnet/tx/${tx.txHash}`} 
  target="_blank" 
  rel="noopener noreferrer"
  style={{ 
    color: "#002d72", 
    fontSize: "13px", 
    textDecoration: "none", 
    fontWeight: "bold",
    marginTop: "5px",
    display: "inline-block"
  }}
>
  🔗 Xem chi tiết trên Cronos Explorer
</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}