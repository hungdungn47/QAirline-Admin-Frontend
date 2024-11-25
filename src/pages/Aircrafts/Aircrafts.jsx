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

import { fetchAircrafts } from "../../apis/api";

// Mock initial data
// const initialAircrafts = [
//   { id: "A319", brand: "Airbus", model: "A319" },
//   { id: "B737", brand: "Boeing", model: "737-800" },
//   { id: "CRJ", brand: "Bombardier", model: "CRJ700" },
// ];

export default function Aircrafts() {
  const [aircrafts, setAircrafts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [formData, setFormData] = useState({ id: "", brand: "", model: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    if (!formData.id) newErrors.id = "ID is required.";
    if (!formData.brand) newErrors.brand = "Brand is required.";
    if (!formData.model) newErrors.model = "Model is required.";
    return newErrors;
  };

  // Handle add or update
  const handleSave = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editMode) {
      // Update aircraft
      setAircrafts((prev) =>
        prev.map((aircraft) =>
          aircraft.id === selectedAircraft.id ? formData : aircraft
        )
      );
    } else {
      // Create new aircraft
      setAircrafts((prev) => [...prev, formData]);
    }

    handleCloseDialog();
  };

  // Open dialog
  const handleOpenDialog = (aircraft = null) => {
    setEditMode(!!aircraft);
    setSelectedAircraft(aircraft);
    setFormData(aircraft || { id: "", brand: "", model: "" });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ id: "", brand: "", model: "" });
    setSelectedAircraft(null);
    setErrors({});
  };

  // Delete aircraft
  const handleDelete = (id) => {
    setAircrafts((prev) => prev.filter((aircraft) => aircraft.id !== id));
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Aircraft Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ marginBottom: 2 }}
      >
        Add Aircraft
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aircrafts.map((aircraft) => (
              <TableRow key={aircraft.id}>
                <TableCell>{aircraft.id}</TableCell>
                <TableCell>{aircraft.brand}</TableCell>
                <TableCell>{aircraft.model}</TableCell>
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

      {/* Dialog for Adding/Editing */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Edit Aircraft" : "Add Aircraft"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleChange}
              fullWidth
              error={!!errors.id}
              helperText={errors.id}
              disabled={editMode} // Disable editing ID
            />
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
    </Box>
  );
}
