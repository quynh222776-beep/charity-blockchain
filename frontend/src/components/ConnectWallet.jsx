import { useState } from "react";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        alert("Vui lòng cài MetaMask!");
        return;
      }

      // 1. Yêu cầu chuyển mạng Cronos Testnet ngay từ đầu
      const chainIdHex = "0x152"; // 338
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });
      } catch (switchError) {
        // Nếu mạng chưa có trong MetaMask, yêu cầu thêm mạng mới
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: chainIdHex,
              chainName: "Cronos Testnet",
              nativeCurrency: { name: "TCRO", symbol: "TCRO", decimals: 18 },
              rpcUrls: ["https://evm-t3.cronos.org"],
              blockExplorerUrls: ["https://cronos.org/explorer/testnet3"],
            }],
          });
        } else {
          throw switchError;
        }
      }

      // 2. Sau khi chắc chắn đã ở đúng mạng, mới khởi tạo Provider và lấy ví
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];
      setAddress(walletAddress);

      // 3. Lấy số dư mới nhất
      const balanceWei = await provider.getBalance(walletAddress);
      const formattedBalance = ethers.formatEther(balanceWei);
      setBalance(formattedBalance);

      if (parseFloat(formattedBalance) === 0) {
        alert("Ví của bạn đang có 0 TCRO. Hãy lấy faucet để thực hiện donate nhé!");
      }

    } catch (error) {
      console.error("Lỗi kết nối:", error);
      if (error.code !== 4001) { // 4001 là lỗi người dùng từ chối kết nối
        alert("Có lỗi xảy ra khi kết nối ví.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">🔗 Hệ thống Từ thiện Minh bạch</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Kết nối với Cronos Testnet</p>

        <button
          onClick={connectWallet}
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3 rounded-xl transition mb-4`}
        >
          {loading ? "Đang kết nối..." : address ? "Làm mới số dư" : "Kết nối ví MetaMask"}
        </button>

        {address && (
          <div className="space-y-3 bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 animate-fade-in">
            <div>
              <p className="font-semibold text-blue-800 text-xs uppercase tracking-wider">Địa chỉ ví</p>
              <p className="font-mono text-sm break-all text-gray-700">{address}</p>
            </div>

            <div>
              <p className="font-semibold text-blue-800 text-xs uppercase tracking-wider">Số dư khả dụng</p>
              <p className="text-2xl font-bold text-blue-600">{parseFloat(balance).toFixed(4)} TCRO</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}