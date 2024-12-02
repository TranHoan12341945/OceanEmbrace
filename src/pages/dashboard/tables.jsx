import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { fetchArtists, fetchArtworksByArtistId } from "../../api";

export function Tables() {
  const [artistsData, setArtistsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtistsData = async () => {
      try {
        setLoading(true);
        const artists = await fetchArtists(); // Fetch artists from /admin/account

        const dataWithArtworks = await Promise.all(
          artists.map(async (artist) => {
            try {
              const artworks = await fetchArtworksByArtistId(artist.accountId);
              const totalArtworks = artworks.length;
              const averageRating =
                totalArtworks > 0
                  ? (
                      artworks.reduce(
                        (acc, artwork) => acc + (artwork.artworkRating || 0),
                        0
                      ) / totalArtworks
                    ).toFixed(2)
                  : 0;

              return {
                id: artist.accountId,
                fullName: artist.fullName,
                emailAddress: artist.emailAddress,
                avatar: artist.avatar,
                totalArtworks,
                averageRating,
              };
            } catch {
              return {
                id: artist.accountId,
                fullName: artist.fullName,
                emailAddress: artist.emailAddress,
                avatar: artist.avatar,
                totalArtworks: 0,
                averageRating: "N/A",
              };
            }
          })
        );

        setArtistsData(dataWithArtworks);
        setError(null);
      } catch (err) {
        setError("Failed to fetch artists data");
        console.error(err);
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
                {["Artist", "Total Artwork", "Average Artwork's Rating"].map(
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
              {artistsData.map((artist) => (
                <tr key={artist.id}>
                  {/* Artist */}
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={artist.avatar}
                        alt={artist.fullName}
                        size="sm"
                        variant="rounded"
                      />
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
