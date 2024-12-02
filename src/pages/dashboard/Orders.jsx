import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Chip,
} from "@material-tailwind/react";
import { fetchOrderById, fetchOrders } from "../../api";

export function Orders() {
  const [orderData, setOrderData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Load all orders with pagination
  const loadOrders = async (page) => {
    try {
      const data = await fetchOrders(page, pageSize);
      setOrders(data.items || []);
      setTotalPages(Math.ceil(data.totalItems / pageSize));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Failed to load orders.");
    }
  };

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  // Handle search by Order ID
  const handleSearch = async () => {
    if (!orderId) return;

    try {
      const data = await fetchOrderById(orderId);
      setOrderData(data);
      setError("");
    } catch (error) {
      setError("Order not found or an error occurred.");
      setOrderData(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Search Order */}
      <Card className="mb-8 p-6">
        <Typography variant="h6" color="gray" className="mb-4">
          Search Order
        </Typography>
        <div className="flex gap-4">
          <Input
            label="Order ID"
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-grow"
          />
          <Button color="blue" onClick={handleSearch}>
            Search
          </Button>
        </div>
        {error && <Typography color="red" className="mt-2">{error}</Typography>}
      </Card>

      {/* Single Order Details */}
      {orderData && (
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Order Details
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Order ID", "Buyer ID", "Total Amount", "Order Date", "Status"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {orderData.orderId}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {orderData.buyerId}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      ${orderData.totalAmount}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {new Date(orderData.orderDate).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography
                      variant="small"
                      color={orderData.status ? "green" : "red"}
                      className="font-semibold"
                    >
                      {orderData.status ? "Completed" : "Pending"}
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      {/* All Orders Table */}
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between items-center"
        >
          <Typography variant="h6" color="white">
            All Orders
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Order ID", "Buyer ID", "Total Amount", "Order Date", "Status"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, key) => (
                <tr key={order.orderId}>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {order.orderId}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray">
                      {order.buyerId}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray">
                      ${order.totalAmount}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography
                      variant="small"
                      color={order.status ? "green" : "red"}
                      className="font-semibold"
                    >
                      {order.status ? "Completed" : "Pending"}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <Typography className="px-4">
          Page {currentPage} of {totalPages}
        </Typography>
        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default Orders;
