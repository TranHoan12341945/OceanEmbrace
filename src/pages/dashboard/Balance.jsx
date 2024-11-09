import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Radio,
} from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchBalanceById,
  fetchBalanceHistory,
  depositBalance,
  withdrawBalance,
} from "../../api";

const Balance = () => {
  const [activeTab, setActiveTab] = useState("displayBalance");
  const [userId, setUserId] = useState("");
  const [balanceData, setBalanceData] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchBalance = async () => {
    if (!userId) {
      setError("Please enter a valid user ID.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await fetchBalanceById(userId);
      setBalanceData(data);
    } catch (err) {
      setError("Failed to fetch balance data. Please try again.");
      console.error("Error fetching balance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!transactionAmount || !userId) {
      setError("Please enter both User ID and an amount.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (transactionType === "deposit") {
        await depositBalance(userId, parseFloat(transactionAmount));
        toast.success("Deposit successful!");
      } else if (transactionType === "withdraw") {
        await withdrawBalance(userId, parseFloat(transactionAmount));
        toast.success("Withdrawal successful!");
      }
      handleFetchBalance(); // Refresh balance after transaction
    } catch (err) {
      setError(`Failed to ${transactionType}. Please try again.`);
      toast.error(`Error during ${transactionType}: ${err.message}`);
      console.error(`Error during ${transactionType}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchHistory = async () => {
    if (!userId) {
      setError("Please enter a valid User ID.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const fromDate = "2024-01-01T00:00:00Z";
      const toDate = new Date().toISOString();
      const data = await fetchBalanceHistory(userId, 1, fromDate, toDate); // Sử dụng transactionType = 1 làm ví dụ
      setHistory(data);
      toast.success("Transaction history fetched successfully!");
    } catch (err) {
      setError("Failed to fetch transaction history.");
      toast.error("Error fetching history.");
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <ToastContainer />
      <Card>
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            Account Balance Management
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-6">
          <div className="flex gap-4">
            <Button
              onClick={() => setActiveTab("displayBalance")}
              color={activeTab === "displayBalance" ? "blue" : "gray"}
            >
              Display Balance
            </Button>
            <Button
              onClick={() => setActiveTab("depositWithdraw")}
              color={activeTab === "depositWithdraw" ? "blue" : "gray"}
            >
              Deposit / Withdraw
            </Button>
            <Button
              onClick={() => setActiveTab("checkHistory")}
              color={activeTab === "checkHistory" ? "blue" : "gray"}
            >
              Check History
            </Button>
          </div>

          {activeTab === "displayBalance" && (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                type="number"
                className="flex-grow"
              />
              <Button onClick={handleFetchBalance} color="blue">
                Display Balance
              </Button>
              {loading && <Typography>Loading...</Typography>}
              {error && <Typography color="red">{error}</Typography>}
              {balanceData && (
                <div className="mt-4">
                  <Typography variant="h6">Balance Information</Typography>
                  <Typography>Account ID: {balanceData.accountId}</Typography>
                  <Typography>Balance: ${balanceData.balance.toLocaleString()}</Typography>
                  <Typography>
                    Last Updated:{" "}
                    {balanceData.lastUpdated === "0001-01-01T00:00:00"
                      ? "N/A"
                      : new Date(balanceData.lastUpdated).toLocaleString()}
                  </Typography>
                </div>
              )}
            </div>
          )}

          {activeTab === "depositWithdraw" && (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                type="number"
                className="flex-grow"
              />
              <Input
                placeholder="Enter Amount"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                type="number"
                className="flex-grow"
              />
              <div className="flex gap-4 mt-4">
                <Radio
                  name="transactionType"
                  label="Deposit"
                  checked={transactionType === "deposit"}
                  onChange={() => setTransactionType("deposit")}
                />
                <Radio
                  name="transactionType"
                  label="Withdraw"
                  checked={transactionType === "withdraw"}
                  onChange={() => setTransactionType("withdraw")}
                />
              </div>
              <Button onClick={handleTransaction} color={transactionType === "deposit" ? "green" : "red"}>
                {transactionType === "deposit" ? "Deposit" : "Withdraw"}
              </Button>
            </div>
          )}

          {activeTab === "checkHistory" && (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                type="number"
                className="flex-grow"
              />
              <Button onClick={handleFetchHistory} color="blue">
                Fetch History
              </Button>
              {loading && <Typography>Loading...</Typography>}
              {history.length > 0 && (
                <div className="mt-4">
                  <Typography variant="h6">Transaction History</Typography>
                  <table className="w-full min-w-[640px] table-auto mt-4">
                    <thead>
                      <tr>
                        {["Transaction ID", "Amount", "Date", "Type"].map((header) => (
                          <th
                            key={header}
                            className="border-b border-blue-gray-50 py-3 px-5 text-left"
                          >
                            <Typography
                              variant="small"
                              className="text-[11px] font-bold uppercase text-blue-gray-400"
                            >
                              {header}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item, index) => (
                        <tr key={index}>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {item.transactionId}
                            </Typography>
                          </td>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              ${item.amount.toLocaleString()}
                            </Typography>
                          </td>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {new Date(item.date).toLocaleString()}
                            </Typography>
                          </td>
                          <td className="py-3 px-5 border-b border-blue-gray-50">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {item.type}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Balance;
