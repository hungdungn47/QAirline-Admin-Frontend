import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import {
  createAircraft,
  deleteAircraft,
  fetchAircrafts,
  updateAircraft,
} from "../../apis/api";
import { useMediaQuery } from "react-responsive";
import AircraftComponent from "../../components/Aircraft/AircraftComponent";

export default function Aircrafts() {
  const [aircrafts, setAircrafts] = useState([]);
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
  const loadAircrafts = async () => {
    try {
      const data = await fetchAircrafts();
      setAircrafts(data);
    } catch (err) {
      setErrors("Failed to load aircraft data.");
    } finally {
      setLoading(false);
    }
  };
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
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
      updateAircraft({ ...formData, id: selectedAircraft.id }).then((res) => {
        loadAircrafts();
      });
    } else {
      createAircraft(formData).then((res) => {
        loadAircrafts();
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
    setAircrafts((prev) => prev.filter((aircraft) => aircraft.id !== id));
    deleteAircraft(id).then((res) => {
      loadAircrafts();
    });
  };

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
      {isMobile ? (
        aircrafts.map((aircraft) => (
          <AircraftComponent
            key={aircraft.id}
            aircraft={aircraft}
            handleDelete={handleDelete}
            handleOpenDialog={handleOpenDialog}
          />
        ))
      ) : (
        <TableContainer
          style={{
            boxShadow: "0 0px 5px rgb(0, 0, 0, 0.3)",
          }}
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Economy seats</TableCell>
                <TableCell>Business seats</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aircrafts.map((aircraft) => (
                <TableRow key={aircraft.id}>
                  <TableCell>{aircraft.id}</TableCell>
                  <TableCell>{aircraft.brand}</TableCell>
                  <TableCell>{aircraft.model}</TableCell>
                  <TableCell>{aircraft.numOfEconomySeats}</TableCell>
                  <TableCell>{aircraft.numOfBusinessSeats}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleOpenDialog(aircraft)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleDelete(aircraft.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
    </div>
  );
}
