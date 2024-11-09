import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { fetchProfile, fetchGenres } from "../../api";

export function Profile() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");

  // Fetch genres once when the component is mounted
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };
    loadGenres();
  }, []);

  // Fetch all profiles once when the component is mounted
  useEffect(() => {
    const loadProfiles = async () => {
      setError("");
      try {
        const data = await fetchProfile();
        setProfiles(data);
        setSelectedProfile(data[0]); // Set the first profile as the default selection
      } catch (err) {
        setError("Failed to fetch profiles.");
      }
    };
    loadProfiles();
  }, []);

  // Helper function to get genre name from genreId
  const getGenreName = (genreId) => {
    const genre = genres.find((g) => g.genreId === genreId);
    return genre ? genre.name : "Unknown Genre";
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <Card className="w-full max-w-5xl border border-blue-gray-100 shadow-lg">
        <CardBody className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-8">
              {selectedProfile && (
                <>
                  <Avatar
                    src={selectedProfile.avatar}
                    alt={selectedProfile.fullName}
                    size="xxl"
                    variant="rounded"
                    className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                  />
                  <div className="text-center md:text-left">
                    <Typography variant="h4" color="blue-gray" className="mb-1 font-bold">
                      {selectedProfile.fullName}
                    </Typography>
                    <Typography variant="small" className="font-normal text-blue-gray-600 mb-1">
                      {selectedProfile.emailAddress}
                    </Typography>
                    <Typography variant="small" color="green" className="font-semibold">
                      Balance: ${selectedProfile.balance}
                    </Typography>
                  </div>
                </>
              )}
            </div>
            <div className="w-64">
              <Select
                label="Select Artist"
                value={selectedProfile ? selectedProfile.accountId : ""}
                onChange={(value) => {
                  const profile = profiles.find((p) => p.accountId === value);
                  setSelectedProfile(profile);
                }}
                size="lg"
              >
                {profiles.map((profile) => (
                  <Option key={profile.accountId} value={profile.accountId}>
                    {profile.fullName}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {error && (
            <Typography variant="small" color="red" className="mb-4 text-center">
              {error}
            </Typography>
          )}

          {/* Artworks Information */}
          {selectedProfile && selectedProfile.viewArtworks && (
            <div>
              <Typography variant="h5" color="blue-gray" className="mb-4 font-semibold">
                Artworks
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedProfile.viewArtworks.map((artwork) => (
                  <Card
                    key={artwork.artworkId}
                    color="transparent"
                    shadow={false}
                    className="border border-blue-gray-50 shadow-sm"
                  >
                    <CardHeader floated={false} color="gray" className="mx-0 mt-0 mb-4 h-64 rounded-lg overflow-hidden">
                      <img src={artwork.image} alt={artwork.name} className="h-full w-full object-cover" />
                    </CardHeader>
                    <CardBody className="px-4 py-2">
                      <Typography variant="small" color="blue-gray" className="font-normal mb-1">
                        Genre: {getGenreName(artwork.genreId)}
                      </Typography>
                      <Typography variant="h6" color="blue-gray" className="font-semibold mb-1">
                        {artwork.name}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-normal mb-2">
                        {artwork.description}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-semibold mb-1">
                        Price: ${artwork.price}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        Rating: {artwork.artworkRating || "N/A"}
                      </Typography>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Profile;
