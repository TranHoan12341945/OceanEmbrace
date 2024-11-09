import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchArtworks,
  fetchGenres,
  updateArtwork,
  addArtwork,
  deleteArtwork,
} from "../../api";

export function ArtworksTable() {
  const [artworks, setArtworks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newArtwork, setNewArtwork] = useState({
    name: "",
    description: "",
    image: "",
    price: 0,
    artistID: 0,
    isPublic: true,
    isBuyAvailable: true,
    genreName: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [artworksData, genresData] = await Promise.all([fetchArtworks(), fetchGenres()]);
        setArtworks(artworksData);
        setGenres(genresData);
        setError(null);
      } catch (error) {
        setError("Failed to fetch data");
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getGenreName = (genreId) => {
    const genre = genres.find((g) => g.genreId === genreId);
    return genre ? genre.name : "N/A";
  };

  const handleEditClick = (artworkId) => {
    setEditId(artworkId);
  };

  const handleSaveClick = async (artwork) => {
    try {
      await updateArtwork(artwork.artworkId, artwork);
      setArtworks((prevArtworks) =>
        prevArtworks.map((item) =>
          item.artworkId === artwork.artworkId ? artwork : item
        )
      );
      setEditId(null);
      toast.success("Artwork updated successfully!");
    } catch (error) {
      toast.error("Update failed. Please try again.");
    }
  };

  const handleDeleteClick = async (artworkId) => {
    if (window.confirm("Are you sure you want to delete this artwork?")) {
      try {
        await deleteArtwork(artworkId);
        setArtworks((prevArtworks) => prevArtworks.filter((item) => item.artworkId !== artworkId));
        toast.success("Artwork deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete artwork. Please try again.");
      }
    }
  };

  const handleCancelClick = () => {
    setEditId(null);
  };

  const handleChange = (artworkId, field, value) => {
    setArtworks((prevArtworks) =>
      prevArtworks.map((item) =>
        item.artworkId === artworkId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleOpenAddDialog = () => setIsDialogOpen(true);

  const handleCloseAddDialog = () => {
    setIsDialogOpen(false);
    setNewArtwork({
      name: "",
      description: "",
      image: "",
      price: 0,
      artistID: 0,
      isPublic: true,
      isBuyAvailable: true,
      genreName: "",
    });
  };

  const handleAddArtwork = async () => {
    try {
      const addedArtwork = await addArtwork(newArtwork);
      setArtworks([...artworks, addedArtwork]);
      toast.success("Artwork added successfully!");
      handleCloseAddDialog();
    } catch (error) {
      toast.error("Failed to add artwork. Please try again.");
    }
  };

  const handleNewArtworkChange = (field, value) => {
    setNewArtwork((prevArtwork) => ({ ...prevArtwork, [field]: value }));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="red">{error}</Typography>;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <ToastContainer />
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Artworks Management
          </Typography>
          <Button color="blue" onClick={handleOpenAddDialog}>
            Add New Artwork
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Description", "Image", "Price", "Public", "Available for Purchase", "Genre", "Actions"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artworks.map((artwork, key) => {
                const isEditing = editId === artwork.artworkId;
                const className = `py-3 px-5 ${key === artworks.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={artwork.artworkId}>
                    <td className={className}>
                      {isEditing ? (
                        <Input value={artwork.name} onChange={(e) => handleChange(artwork.artworkId, "name", e.target.value)} />
                      ) : (
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {artwork.name}
                        </Typography>
                      )}
                    </td>
                    <td className={className}>
                      {isEditing ? (
                        <Input value={artwork.description} onChange={(e) => handleChange(artwork.artworkId, "description", e.target.value)} />
                      ) : (
                        <Typography className="text-xs font-normal text-blue-gray-500">{artwork.description}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {isEditing ? (
                        <Input value={artwork.image} onChange={(e) => handleChange(artwork.artworkId, "image", e.target.value)} />
                      ) : (
                        <Avatar src={artwork.image} alt={artwork.name} size="sm" />
                      )}
                    </td>
                    <td className={className}>
                      {isEditing ? (
                        <Input type="number" value={artwork.price} onChange={(e) => handleChange(artwork.artworkId, "price", parseFloat(e.target.value))} />
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">${artwork.price}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {isEditing ? (
                        <select value={artwork.isPublic} onChange={(e) => handleChange(artwork.artworkId, "isPublic", e.target.value === "true")}>
                          <option value="true">Public</option>
                          <option value="false">Private</option>
                        </select>
                      ) : (
                        <Chip variant="gradient" color={artwork.isPublic ? "green" : "blue-gray"} value={artwork.isPublic ? "Public" : "Private"} className="py-0.5 px-2 text-[11px] font-medium w-fit" />
                      )}
                    </td>
                    <td className={className}>
                      {isEditing ? (
                        <select value={artwork.isBuyAvailable} onChange={(e) => handleChange(artwork.artworkId, "isBuyAvailable", e.target.value === "true")}>
                          <option value="true">Available</option>
                          <option value="false">Unavailable</option>
                        </select>
                      ) : (
                        <Chip variant="gradient" color={artwork.isBuyAvailable ? "green" : "red"} value={artwork.isBuyAvailable ? "Available" : "Unavailable"} className="py-0.5 px-2 text-[11px] font-medium w-fit" />
                      )}
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{getGenreName(artwork.genreId)}</Typography>
                    </td>
                    <td className={className}>
                      {isEditing ? (
                        <>
                          <Button size="sm" color="green" onClick={() => handleSaveClick(artwork)} className="mr-2">
                            Save
                          </Button>
                          <Button size="sm" color="red" onClick={handleCancelClick}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography as="a" href="#" onClick={() => handleEditClick(artwork.artworkId)} className="text-xs font-semibold text-blue-gray-600 mr-3">
                            Edit
                          </Typography>
                          <Typography as="a" href="#" onClick={() => handleDeleteClick(artwork.artworkId)} className="text-xs font-semibold text-red-500">
                            Delete
                          </Typography>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Dialog thêm dữ liệu mới */}
      <Dialog open={isDialogOpen} handler={handleOpenAddDialog}>
        <DialogHeader>Add New Artwork</DialogHeader>
        <DialogBody divider className="space-y-4">
          <Input label="Name" value={newArtwork.name} onChange={(e) => handleNewArtworkChange("name", e.target.value)} />
          <Input label="Description" value={newArtwork.description} onChange={(e) => handleNewArtworkChange("description", e.target.value)} />
          <Input label="Image URL" value={newArtwork.image} onChange={(e) => handleNewArtworkChange("image", e.target.value)} />
          <Input label="Price" type="number" value={newArtwork.price} onChange={(e) => handleNewArtworkChange("price", parseFloat(e.target.value))} />
          <Input label="Artist ID" type="number" value={newArtwork.artistID} onChange={(e) => handleNewArtworkChange("artistID", parseInt(e.target.value, 10))} />
          <select className="p-2 border border-gray-300 rounded-md w-full" value={newArtwork.genreName} onChange={(e) => handleNewArtworkChange("genreName", e.target.value)}>
            <option value="" disabled>Select Genre</option>
            {genres.map((genre) => (
              <option key={genre.genreId} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
          <select className="p-2 border border-gray-300 rounded-md w-full" value={newArtwork.isPublic} onChange={(e) => handleNewArtworkChange("isPublic", e.target.value === "true")}>
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>
          <select className="p-2 border border-gray-300 rounded-md w-full" value={newArtwork.isBuyAvailable} onChange={(e) => handleNewArtworkChange("isBuyAvailable", e.target.value === "true")}>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleCloseAddDialog} className="mr-2">
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleAddArtwork}>
            Add Artwork
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ArtworksTable;
