import React, { useEffect, useState } from "react";
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

export default function CreateFlightDialog({
  open,
  onClose,
  onCreate,
  aircrafts,
  airports,
}) {
  const [flightData, setFlightData] = useState({
    departureTime: "",
    arrivalTime: "",
    originAirport: "",
    destinationAirport: "",
    economyPrice: 150,
    businessPrice: 250,
    aircraft: "",
  });

  const resetForm = () => {
    setFlightData({
      departureTime: "",
      arrivalTime: "",
      originAirport: "",
      destinationAirport: "",
      economyPrice: 150,
      businessPrice: 250,
      aircraft: "",
    });
  };

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
    const requestData = {
      ...flightData,
      plane: flightData.aircraft,
    };
    delete requestData.aircraft;
    onCreate(requestData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Create flight</DialogTitle>
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
            label="Origin Airport "
            name="originAirport"
            value={flightData.originAirport}
            onChange={handleChange}
            select
            fullWidth
            error={!!errors.originAirport}
            helperText={errors.originAirport}
          >
            {airports.map((airport) => {
              return (
                <MenuItem key={airport.id} value={airport.id}>
                  {airport.airportName}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            label="Destination Airport "
            name="destinationAirport"
            value={flightData.destinationAirport}
            onChange={handleChange}
            select
            fullWidth
            error={!!errors.destinationAirport}
            helperText={errors.destinationAirport}
          >
            {airports.map((airport) => {
              return (
                <MenuItem key={airport.id} value={airport.id}>
                  {airport.airportName}
                </MenuItem>
              );
            })}
          </TextField>
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
            label="Aircraft"
            name="aircraft"
            value={flightData.aircraft}
            onChange={handleChange}
            select
            fullWidth
            error={!!errors.aircraft}
            helperText={errors.aircraft}
          >
            {aircrafts.map((aircraft) => {
              return (
                <MenuItem key={aircraft.id} value={aircraft.id}>
                  {aircraft.brand} {aircraft.model}
                </MenuItem>
              );
            })}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            resetForm();
            onClose();
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            resetForm();
            handleCreate();
          }}
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
