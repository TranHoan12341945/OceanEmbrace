import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import { fetchProfileById } from "../../api"; // Import hàm fetch API

export function Tables() {
  const [artistsData, setArtistsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtistsData = async () => {
      try {
        setLoading(true);
        const artistIds = Array.from({ length: 10 }, (_, i) => i + 1); // Tạo mảng ID từ 1 đến 10
        const artistProfiles = await Promise.all(
          artistIds.map((id) => fetchProfileById(id))
        );

        // Xử lý dữ liệu artist và tính toán thông tin cần thiết
        const formattedData = artistProfiles.map((profile) => {
          const totalArtworks = profile.viewArtworks.length;
          const averageRating =
            profile.viewArtworks.reduce(
              (acc, artwork) => acc + artwork.artworkRating,
              0
            ) / totalArtworks || 0; // Tránh chia cho 0 khi không có artwork

          return {
            id: profile.accountId,
            fullName: profile.fullName,
            emailAddress: profile.emailAddress,
            avatar: profile.avatar,
            role: profile.role,
            totalArtworks,
            averageRating: averageRating.toFixed(2),
          };
        });

        setArtistsData(formattedData);
        setError(null);
      } catch (error) {
        setError("Failed to fetch artists data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadArtistsData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="red">{error}</Typography>;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Artist Table  
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Artist", "Role", "Total Artwork", "Average Artwork's Rating"].map((el) => (
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
              {artistsData.map((artist) => (
                <tr key={artist.id}>
                  {/* Artist */}
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex items-center gap-4">
                      <Avatar src={artist.avatar} alt={artist.fullName} size="sm" variant="rounded" />
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {artist.fullName}
                        </Typography>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {artist.emailAddress}
                        </Typography>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      {artist.role}
                    </Typography>
                  </td>

                  {/* Total Artwork */}
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      {artist.totalArtworks}
                    </Typography>
                  </td>

                  {/* Average Artwork's Rating */}
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      {artist.averageRating}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
