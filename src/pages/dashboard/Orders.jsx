import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Input,
  Button,
} from "@material-tailwind/react";
import { fetchOrderById } from "../../api";

export function Orders() {
  const [orderData, setOrderData] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

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

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
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
                  {["Buyer ID", "Total Quantity", "Total Amount", "Details"].map(
                    (el) => (
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
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {orderData.buyerId}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {orderData.totalQuantity}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      ${orderData.totalAmount}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    {orderData.orderDetails.map(({ artworkId, unitPrice }) => (
                      <Chip
                        key={artworkId}
                        variant="gradient"
                        color="blue"
                        value={`Artwork ID: ${artworkId}, Price: $${unitPrice}`}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit mb-1"
                      />
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default Orders;
