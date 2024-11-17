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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    // Validate data (optional)
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
          />
          <TextField
            label="Departure Time"
            name="departureTime"
            type="datetime-local"
            value={flightData.departureTime}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Arrival Time"
            name="arrivalTime"
            type="datetime-local"
            value={flightData.arrivalTime}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Origin Airport Code"
            name="originAirportCode"
            value={flightData.originAirportCode}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Destination Airport Code"
            name="destinationAirportCode"
            value={flightData.destinationAirportCode}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Available Seats"
            name="availableSeats"
            type="number"
            value={flightData.availableSeats}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Economy Price"
            name="economyPrice"
            type="number"
            value={flightData.economyPrice}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Business Price"
            name="businessPrice"
            type="number"
            value={flightData.businessPrice}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Aircraft Code"
            name="aircraftCode"
            value={flightData.aircraftCode}
            onChange={handleChange}
            select
            fullWidth
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
