import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

import {
  createAircraft,
  deleteAircraft,
  fetchAircrafts,
  updateAircraft,
} from "../../apis/api";
import { useMediaQuery } from "react-responsive";
import AircraftComponent from "../../components/Aircraft/AircraftComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  aircraftsAdded,
  aircraftsDeleted,
  aircraftsFetched,
  aircraftsUpdated,
} from "../../app/aircraftsSlice";
import { v4 as uuidv4 } from "uuid";

export default function Aircrafts() {
  // const [aircrafts, setAircrafts] = useState([]);
  const aircrafts = useSelector((state) => state.aircrafts);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    numOfEconomySeats: 0,
    numOfBusinessSeats: 0,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const loadAircrafts = async () => {
    try {
      const data = await fetchAircrafts();
      // setAircrafts(data);
      dispatch(aircraftsFetched(data));
    } catch (err) {
      setErrors("Failed to load aircraft data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAircrafts();
  }, []);
  // Handle form input changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.brand) newErrors.brand = "Brand is required.";
    if (!formData.model) newErrors.model = "Model is required.";
    return newErrors;
  };

  // Handle add or update
  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editMode) {
      dispatch(aircraftsUpdated({ ...formData, id: selectedAircraft.id }));
      updateAircraft({ ...formData, id: selectedAircraft.id }).then((res) => {
        // loadAircrafts();
        toast.success(res);
      });
    } else {
      const tempId = uuidv4();
      dispatch(aircraftsAdded({ ...formData, id: tempId }));
      createAircraft(formData).then((res) => {
        loadAircrafts();
        toast.success(res);
      });
    }

    handleCloseDialog();
  };

  // Open dialog
  const handleOpenDialog = (aircraft = null) => {
    setEditMode(!!aircraft);
    setSelectedAircraft(aircraft);
    setFormData(
      aircraft || {
        brand: "",
        model: "",
        numOfEconomySeats: 0,
        numOfBusinessSeats: 0,
      }
    );
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      brand: "",
      model: "",
      numOfEconomySeats: 0,
      numOfBusinessSeats: 0,
    });
    setSelectedAircraft(null);
    setErrors({});
  };

  // Delete aircraft
  const handleDelete = (id) => {
    // setAircrafts((prev) => prev.filter((aircraft) => aircraft.id !== id));
    dispatch(aircraftsDeleted(id));
    deleteAircraft(id).then((res) => {
      // loadAircrafts();
      toast.success(res);
    });
  };

  if (aircrafts.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading aircrafts...</Typography>
      </Box>
    );
  }

  return (
    <div className="m-5">
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ marginBottom: 2 }}
      >
        Add Aircraft
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-2">
        {aircrafts.map((aircraft) => (
          <AircraftComponent
            key={aircraft.id}
            aircraft={aircraft}
            handleDelete={handleDelete}
            handleOpenDialog={handleOpenDialog}
          />
        ))}
      </div>

      {/* Dialog for Adding/Editing */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Edit Aircraft" : "Add Aircraft"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              fullWidth
              error={!!errors.brand}
              helperText={errors.brand}
            />
            <TextField
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              fullWidth
              error={!!errors.model}
              helperText={errors.model}
            />
            <TextField
              label="Economy seats"
              name="numOfEconomySeats"
              value={formData.numOfEconomySeats}
              onChange={handleChange}
              fullWidth
              error={!!errors.numOfEconomySeats}
              helperText={errors.numOfEconomySeats}
            />
            <TextField
              label="Business seats"
              name="numOfBusinessSeats"
              value={formData.numOfBusinessSeats}
              onChange={handleChange}
              fullWidth
              error={!!errors.numOfBusinessSeats}
              helperText={errors.numOfBusinessSeats}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
}
