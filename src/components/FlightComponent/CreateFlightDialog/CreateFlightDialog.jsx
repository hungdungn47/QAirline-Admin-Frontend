import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";

export default function CreateFlightDialog({ open, onClose, onCreate }) {
  const [flightData, setFlightData] = useState({
    flightID: "",
    departureTime: "",
    arrivalTime: "",
    originAirportCode: "",
    destinationAirportCode: "",
    availableSeats: "",
    economyPrice: "",
    businessPrice: "",
    aircraftCode: "",
    arrangedBy: "",
  });

  const [errors, setErrors] = useState({}); // State to track validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const validateFields = () => {
    const newErrors = {};
    Object.keys(flightData).forEach((key) => {
      if (!flightData[key]) {
        newErrors[key] = "This field is required.";
      }
    });
    return newErrors;
  };

  const handleCreate = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onCreate(flightData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Flight</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
        >
          <TextField
            label="Flight ID"
            name="flightID"
            value={flightData.flightID}
            onChange={handleChange}
            fullWidth
            error={!!errors.flightID}
            helperText={errors.flightID}
          />
          <TextField
            label="Departure Time"
            name="departureTime"
            type="datetime-local"
            value={flightData.departureTime}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.departureTime}
            helperText={errors.departureTime}
          />
          <TextField
            label="Arrival Time"
            name="arrivalTime"
            type="datetime-local"
            value={flightData.arrivalTime}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.arrivalTime}
            helperText={errors.arrivalTime}
          />
          <TextField
            label="Origin Airport Code"
            name="originAirportCode"
            value={flightData.originAirportCode}
            onChange={handleChange}
            fullWidth
            error={!!errors.originAirportCode}
            helperText={errors.originAirportCode}
          />
          <TextField
            label="Destination Airport Code"
            name="destinationAirportCode"
            value={flightData.destinationAirportCode}
            onChange={handleChange}
            fullWidth
            error={!!errors.destinationAirportCode}
            helperText={errors.destinationAirportCode}
          />
          <TextField
            label="Available Seats"
            name="availableSeats"
            type="number"
            value={flightData.availableSeats}
            onChange={handleChange}
            fullWidth
            error={!!errors.availableSeats}
            helperText={errors.availableSeats}
          />
          <TextField
            label="Economy Price"
            name="economyPrice"
            type="number"
            value={flightData.economyPrice}
            onChange={handleChange}
            fullWidth
            error={!!errors.economyPrice}
            helperText={errors.economyPrice}
          />
          <TextField
            label="Business Price"
            name="businessPrice"
            type="number"
            value={flightData.businessPrice}
            onChange={handleChange}
            fullWidth
            error={!!errors.businessPrice}
            helperText={errors.businessPrice}
          />
          <TextField
            label="Aircraft Code"
            name="aircraftCode"
            value={flightData.aircraftCode}
            onChange={handleChange}
            select
            fullWidth
            error={!!errors.aircraftCode}
            helperText={errors.aircraftCode}
          >
            <MenuItem value="A319">A319</MenuItem>
            <MenuItem value="A320">A320</MenuItem>
            <MenuItem value="B737">B737</MenuItem>
          </TextField>
          <TextField
            label="Arranged By"
            name="arrangedBy"
            value={flightData.arrangedBy}
            onChange={handleChange}
            fullWidth
            error={!!errors.arrangedBy}
            helperText={errors.arrangedBy}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
