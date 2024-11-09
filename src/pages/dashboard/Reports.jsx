import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { createReport, fetchArtworks } from "../../api"; // Import hàm tạo báo cáo và fetch artworks

export function Reports() {
  const [reportsData, setReportsData] = useState([
    {
      reportReason: "Inappropriate content",
      artworkId: 101,
      reporterId: 1,
    },
    {
      reportReason: "Copyright issue",
      artworkId: 102,
      reporterId: 2,
    },
  ]);
  const [newReport, setNewReport] = useState({
    reportReason: "",
    artworkId: "",
    reporterId: "",
  });
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(""); // State để lưu tên artwork được chọn

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const artworksData = await fetchArtworks();
        setArtworks(artworksData);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    loadArtworks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleArtworkSelect = (value, label) => {
    setNewReport((prev) => ({ ...prev, artworkId: value }));
    setSelectedArtwork(label); // Lưu tên artwork được chọn vào state
  };

  const handleCreateReport = async () => {
    try {
      const createdReport = await createReport(newReport);
      setReportsData([...reportsData, createdReport]); // Cập nhật danh sách báo cáo
      setNewReport({ reportReason: "", artworkId: "", reporterId: "" }); // Xóa form sau khi tạo
      setSelectedArtwork(""); // Reset tên artwork được chọn
      alert("Report created successfully!");
    } catch (error) {
      alert("Failed to create report. Please try again.");
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Reports Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Report Reason", "Artwork ID", "Reporter ID"].map((el) => (
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
              {reportsData.map(({ reportReason, artworkId, reporterId }, key) => {
                const className = `py-3 px-5 ${
                  key === reportsData.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={key}>
                    <td className={className}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        {reportReason}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        {artworkId}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        {reporterId}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Card className="p-4">
        <Typography variant="h6" color="gray" className="mb-4">
          Create New Report
        </Typography>
        <div className="space-y-4 mb-4">
          <Input
            label="Report Reason"
            name="reportReason"
            value={newReport.reportReason}
            onChange={handleInputChange}
            className="mb-4"
          />
          <Select
            label="Select Artwork"
            name="artworkId"
            value={selectedArtwork} // Hiển thị tên artwork được chọn
            onChange={(value, label) => handleArtworkSelect(value, label)}
            className="mb-4"
          >
            {artworks.map((artwork) => (
              <Option key={artwork.artworkId} value={artwork.artworkId} label={artwork.name}>
                {artwork.name}
              </Option>
            ))}
          </Select>
          <Input
            label="Reporter ID"
            type="number"
            name="reporterId"
            value={newReport.reporterId}
            onChange={handleInputChange}
            className="mb-4"
          />
        </div>
        <Button color="green" onClick={handleCreateReport} fullWidth>
          Submit Report
        </Button>
      </Card>
    </div>
  );
}

export default Reports;
