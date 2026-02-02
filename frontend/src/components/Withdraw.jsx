import React, { useState } from "react";
import { ethers } from "ethers";
import CharityABI from "../abi/CharityFund.json";

// QUAN TRỌNG: Thay bằng địa chỉ bạn vừa Deploy thành công trên Remix
const CONTRACT_ADDRESS = "0x6d6C767B40E5c5De87EC70Ec1950cD85c88E5196";

const Withdraw = () => {
  const [amount, setAmount] = useState(""); // Thêm state để nhập số tiền
  const [isPending, setIsPending] = useState(false);

  const handleWithdraw = async () => {
    if (!window.ethereum) return alert("❌ Vui lòng kết nối MetaMask!");
    if (!amount || parseFloat(amount) <= 0) return alert("❌ Vui lòng nhập số tiền hợp lệ!");

    try {
      setIsPending(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CharityABI, signer);

      // Bước 1: Chuyển đổi số người dùng nhập (Ether) sang Wei (uint256)
      // Ví dụ: Nhập 0.1 -> parseEther sẽ biến thành 100000000000000000 Wei
      const amountInWei = ethers.parseEther(amount.toString());

      // Bước 2: Gọi hàm withdraw với tham số uint256 đã chuyển đổi
      const tx = await contract.withdraw(amountInWei);
      
      alert("⏳ Đang xử lý giao dịch trên mạng Cronos...");
      await tx.wait(); 

      alert(`✅ Rút thành công ${amount} TCRO về ví Owner!`);
      setAmount(""); // Xóa trắng ô nhập
      window.location.reload();
    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      // Lỗi này thường do ABI chưa khớp hoặc sai địa chỉ ví Owner
      alert("❌ Lỗi: Kiểm tra lại địa chỉ Contract mới và ABI trong code!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="admin-section" style={{ padding: "20px", border: "1px dashed #ff4d4f", borderRadius: "10px", backgroundColor: "#fff1f0" }}>
      <h3 style={{ color: "#cf1322", display: "flex", alignItems: "center", gap: "10px" }}>
        ⚠️ Khu vực quản trị (Hợp đồng mới)
      </h3>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
        Nhập số TCRO bạn muốn rút (Hệ thống tự động chuyển sang uint256).
      </p>
      
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ví dụ: 0.5"
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ffccc7",
            fontSize: "16px"
          }}
        />
        <button
          onClick={handleWithdraw}
          disabled={isPending}
          style={{
            padding: "12px 25px",
            background: isPending ? "#ffa39e" : "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {isPending ? "Rút tiền" : "Xác nhận rút"}
        </button>
      </div>
    </div>
  );
};

export default Withdraw;