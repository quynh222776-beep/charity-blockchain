import { useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x6d6C767B40E5c5De87EC70Ec1950cD85c88E5196";

const Campaign = () => {
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const getRealBalance = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://evm-t3.cronos.org");
        // Lấy số dư thực tế từ Blockchain
        const currentBalance = await provider.getBalance(CONTRACT_ADDRESS);
        setBalance(ethers.formatEther(currentBalance));
      } catch (err) {
        console.error("Lỗi lấy số dư:", err);
      }
    };

    getRealBalance();
    const interval = setInterval(getRealBalance, 5000); // Cập nhật mỗi 5 giây
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
      <h2 style={{ color: "#002d72" }}>Quỹ Từ Thiện Phi Lợi Nhuận</h2>
      <p style={{ fontSize: "12px", color: "#666" }}>
        Địa chỉ hợp đồng: <span style={{ fontFamily: "monospace", color: "#333" }}>{CONTRACT_ADDRESS}</span>
      </p>
      
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "5px" }}>
        <span>Tổng số tiền đã quyên góp:</span>
        <span style={{ color: "#28a745", fontSize: "1.2rem" }}>{parseFloat(balance).toFixed(4)} TCRO</span>
      </div>

      {/* Thanh tiến độ chạy vô hạn (Indeterminate Progress Bar) */}
      <div style={{ width: "100%", height: "10px", backgroundColor: "#eee", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
        <div style={{ 
          width: "30%", 
          height: "100%", 
          backgroundColor: "#28a745", 
          borderRadius: "10px",
          position: "absolute",
          animation: "moveInfinite 2s linear infinite" // Tạo hiệu ứng chạy liên tục
        }}></div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "13px", color: "#666" }}>
        <span>Mục tiêu: <strong>Vô hạn (Không giới hạn)</strong></span>
        <span>Trạng thái: <strong>Đang hoạt động</strong></span>
      </div>

      <style>{`
        @keyframes moveInfinite {
          0% { left: -30%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Campaign;