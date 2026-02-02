import { useState } from "react";
import { ethers } from "ethers";
import CharityABI from "../abi/CharityFund.json";

const CONTRACT_ADDRESS = "0x6d6C767B40E5c5De87EC70Ec1950cD85c88E5196";

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleDonate = async () => {
    if (!window.ethereum) return alert("❌ Hãy cài đặt MetaMask!");
    if (!amount || parseFloat(amount) <= 0) return alert("❌ Nhập số TCRO hợp lệ!");

    try {
      setIsPending(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CharityABI, signer);

      console.log(`Đang thực hiện Donate: ${amount} TCRO`);

      // 1. Thực hiện giao dịch trên Blockchain
      const tx = await contract.donate({
        value: ethers.parseEther(amount.toString()),
      });

      alert("⏳ Đang chờ xác nhận từ Blockchain...");
      await tx.wait();

      // 2. LOGIC BẠN VỪA THÊM: Lưu vào localStorage sau khi tx.wait() thành công
      const storedHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];

      const newTransaction = {
        amount: amount,
        date: new Date().toLocaleString(),
        txHash: tx.hash,
      };

      localStorage.setItem(
        "transactionHistory",
        JSON.stringify([newTransaction, ...storedHistory])
      );

      // 3. Thông báo và cập nhật giao diện
      alert(`✅ Donate thành công 🎉! Đã quyên góp ${amount} TCRO.`);
      setAmount("");
      
      // Tải lại trang để các component khác (như Campaign) cập nhật số dư mới
      window.location.reload();

    } catch (err) {
      console.error("Lỗi chi tiết:", err);
      if (err.message.includes("insufficient funds")) {
        alert("❌ Tài khoản không đủ TCRO để thực hiện giao dịch và trả phí Gas.");
      } else {
        alert("❌ Donate thất bại");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="donate-container" style={{ padding: "20px", background: "#fff", borderRadius: "10px", marginTop: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
      <h3 style={{ color: "#002d72" }}>💎 Thực hiện quyên góp</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ví dụ: 0.5"
          style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleDonate}
          disabled={isPending}
          style={{
            padding: "10px 20px",
            background: isPending ? "#ccc" : "#002d72",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {isPending ? "Đang xử lý..." : "Donate"}
        </button>
      </div>
    </div>
  );
};

export default Donate;