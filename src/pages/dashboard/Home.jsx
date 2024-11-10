import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchProfile, fetchGenres, fetchArtworks } from "../../api";

// Register necessary chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export function Home() {
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [stats, setStats] = useState({
    totalArtists: 0,
    totalArtworks: 0,
    highestRatedArtwork: null,
    lowRatedArtworksCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistsData = await fetchProfile();
        setArtists(artistsData);

        const genresData = await fetchGenres();
        setGenres(genresData);

        const artworksData = await fetchArtworks(1, 50); // page = 1, pageSize = 50
        setArtworks(artworksData.items);

        // Calculate statistics
        const totalArtists = artistsData.length;
        const totalArtworks = artworksData.items.length;
        const highestRatedArtwork = artworksData.items.reduce((max, artwork) =>
          artwork.artworkRating > (max?.artworkRating || 0) ? artwork : max,
          null
        );
        const lowRatedArtworksCount = artworksData.items.filter(
          (artwork) => artwork.artworkRating < 2
        ).length;

        setStats({
          totalArtists,
          totalArtworks,
          highestRatedArtwork,
          lowRatedArtworksCount,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate total artworks and average rating per artist
  const artistStats = artists.map((artist) => {
    const artistArtworks = artworks.filter(
      (artwork) => artwork.artistID === artist.accountId
    );
    const totalArtworks = artistArtworks.length;
    const averageRating =
      totalArtworks > 0
        ? (
            artistArtworks.reduce(
              (sum, artwork) => sum + artwork.artworkRating,
              0
            ) / totalArtworks
          ).toFixed(2)
        : 0;

    return {
      name: artist.fullName,
      totalArtworks,
      averageRating: parseFloat(averageRating),
    };
  });

  // Data for artist comparison chart
  const artistComparisonData = {
    labels: artistStats.map((artist) => artist.name),
    datasets: [
      {
        label: "Total Artworks",
        data: artistStats.map((artist) => artist.totalArtworks),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Average Rating",
        data: artistStats.map((artist) => artist.averageRating),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Count artworks per genre
  const genreCountData = genres.map((genre) => ({
    name: genre.name,
    count: artworks.filter((artwork) => artwork.genreId === genre.genreId).length,
  }));

  // Data for genre distribution chart
  const genresData = {
    labels: genreCountData.map((item) => item.name),
    datasets: [
      {
        label: "Number of Artworks",
        data: genreCountData.map((item) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const artworksData = {
    labels: artworks.map((artwork) => artwork.name),
    datasets: [
      {
        label: "Artworks by Price",
        data: artworks.map((artwork) => artwork.price),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-12">
      {/* Statistic Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray">
              Total Artists
            </Typography>
            <Typography variant="h4">{stats.totalArtists}</Typography>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray">
              Total Artworks
            </Typography>
            <Typography variant="h4">{stats.totalArtworks}</Typography>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray">
              Highest Rated Artwork
            </Typography>
            <Typography variant="h5">
              {stats.highestRatedArtwork
                ? `${stats.highestRatedArtwork.name} (${stats.highestRatedArtwork.artworkRating})`
                : "N/A"}
            </Typography>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray">
              Low-Rated Artworks (&lt; 2)
            </Typography>
            <Typography variant="h4">{stats.lowRatedArtworksCount}</Typography>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Chart 1: Artist Comparison */}
        <Card className="col-span-1">
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Artist Comparison: Total Artworks and Average Rating
            </Typography>
            <Bar data={artistComparisonData} />
          </CardBody>
        </Card>

        {/* Chart 2: Genre Distribution */}
        <Card className="col-span-1">
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Genre Distribution
            </Typography>
            <Bar data={genresData} />
          </CardBody>
        </Card>

        {/* Chart 3: Artworks by Price */}
        <Card className="col-span-1">
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Artworks by Price
            </Typography>
            <Line data={artworksData} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
