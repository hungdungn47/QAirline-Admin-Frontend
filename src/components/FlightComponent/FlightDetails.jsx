import {
  Box,
  Typography,
  Button,
  TextField,
  Input,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import formatDateTime from "../../utils/utils";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import { useState, useEffect } from "react";

export default function FlightDetails({ flight }) {
  const flightID = flight.flightID;
  const [departureTime, setDepartureTime] = useState(
    new Date(flight.departureTime)
  );
  const [arrivalTime, setArrivalTime] = useState(new Date(flight.arrivalTime));
  const destination = flight.destinationAirportCode;
  const origin = flight.originAirportCode;

  const [economyPrice, setEconomyPrice] = useState(flight.economyPrice);
  const [businessPrice, setBusinessPrice] = useState(flight.businessPrice);
  const [aircraft, setAircraft] = useState(flight.aircraftCode);

  const [inputAircraft, setInputAircraft] = useState(flight.aircraftCode);
  const [inputEconomyPrice, setInputEconomyPrice] = useState(
    flight.economyPrice
  );
  const [inputBusinessPrice, setInputBusinessPrice] = useState(
    flight.businessPrice
  );

  const [isEditing, setIsEditing] = useState(false);

  // New states for delay functionality
  const [isDelaying, setIsDelaying] = useState(false);
  const [delayTime, setDelayTime] = useState(0);

  useEffect(() => {
    setDepartureTime(new Date(flight.departureTime));
    setArrivalTime(new Date(flight.arrivalTime));
    setAircraft(flight.aircraftCode);
    setEconomyPrice(flight.economyPrice);
    setBusinessPrice(flight.businessPrice);

    // Reset inputs when the flight changes
    setInputAircraft(flight.aircraftCode);
    setInputEconomyPrice(flight.economyPrice);
    setInputBusinessPrice(flight.businessPrice);
    setIsEditing(false);
    setIsDelaying(false);
    setDelayTime(0);
  }, [flight]);

  const handleCancel = () => {
    setInputAircraft(aircraft);
    setInputEconomyPrice(economyPrice);
    setInputBusinessPrice(businessPrice);
    setIsEditing(false);
  };

  const applyDelay = () => {
    if (delayTime > 0) {
      const newDepartureTime = new Date(departureTime);
      newDepartureTime.setHours(
        newDepartureTime.getHours() + parseInt(delayTime, 10)
      );
      setDepartureTime(newDepartureTime);

      // Optionally update the arrival time similarly (example assumes same delay for simplicity)
      const newArrivalTime = new Date(arrivalTime);
      newArrivalTime.setHours(
        newArrivalTime.getHours() + parseInt(delayTime, 10)
      );
      setArrivalTime(newArrivalTime);

      setIsDelaying(false);
      console.log(`Flight delayed by ${delayTime} hours`);
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "12px",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
        padding: "20px",
      }}
    >
      <Typography fontSize="24px" color="primary">
        {flightID}
      </Typography>
      <Box
        sx={{
          marginY: "15px",
          flex: "2",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "start" }}>
          <div className="destination-code">{origin}</div>
          <div className="medium-big-text">
            {departureTime.toLocaleTimeString()}
          </div>
          <div className="light-small-text">
            {departureTime.toLocaleDateString()}
          </div>
        </Box>
        <Box>
          <ConnectingAirportsIcon fontSize="large" color="primary" />
        </Box>
        <Box sx={{ textAlign: "end" }}>
          <div className="destination-code">{destination}</div>
          <div className="medium-big-text">
            {arrivalTime.toLocaleTimeString()}
          </div>
          <div className="light-small-text">
            {arrivalTime.toLocaleDateString()}
          </div>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography>Aircraft: </Typography>
          {!isEditing ? (
            <Typography color="primary" fontWeight="bold" fontSize="20px">
              {aircraft}
            </Typography>
          ) : (
            <Select
              sx={{ height: "3rem" }}
              onChange={(e) => {
                setInputAircraft(e.target.value);
              }}
              value={inputAircraft}
            >
              <MenuItem value="Airbus A320">Airbus A320</MenuItem>
              <MenuItem value="Boeing 747">Boeing 747</MenuItem>
              <MenuItem value="Boeing 737">Boeing 737</MenuItem>
            </Select>
          )}
        </Box>
      </Box>
      {/* Economy Price */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography>Economy price: </Typography>
          {!isEditing ? (
            <Typography color="primary" fontWeight="bold" fontSize="20px">
              {economyPrice}
            </Typography>
          ) : (
            <Input
              type="number"
              onChange={(e) => {
                setInputEconomyPrice(e.target.value);
              }}
              value={inputEconomyPrice}
            />
          )}
        </Box>
      </Box>
      {/* Business Price */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography>Business price: </Typography>
          {!isEditing ? (
            <Typography color="primary" fontWeight="bold" fontSize="20px">
              {businessPrice}
            </Typography>
          ) : (
            <Input
              type="number"
              onChange={(e) => {
                setInputBusinessPrice(e.target.value);
              }}
              value={inputBusinessPrice}
            />
          )}
        </Box>
      </Box>
      {/* Editing Buttons */}
      {isEditing && (
        <Box sx={{ marginTop: "20px", display: "flex", gap: 2 }}>
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            onClick={() => {
              setIsEditing(false);
              setAircraft(inputAircraft);
              setEconomyPrice(inputEconomyPrice);
              setBusinessPrice(inputBusinessPrice);
            }}
          >
            Apply changes
          </Button>
          <Button
            sx={{ flex: 1 }}
            variant="outlined"
            color="warning"
            onClick={handleCancel}
          >
            Cancel changes
          </Button>
        </Box>
      )}
      {isDelaying && (
        <Box sx={{ marginTop: "20px", display: "flex", gap: 2 }}>
          <TextField
            label="Delay (hours)"
            type="number"
            value={delayTime}
            onChange={(e) => setDelayTime(e.target.value)}
            sx={{ flex: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={applyDelay}
            sx={{ flex: 1 }}
          >
            Apply
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              setIsDelaying(false);
            }}
            sx={{ flex: 1.2 }}
          >
            Cancel delay
          </Button>
        </Box>
      )}
      <Divider
        sx={{ marginTop: "10px", border: "0.8px solid rgb(200, 200, 200)" }}
      />
      <Box sx={{ marginTop: "20px", display: "flex", gap: 2 }}>
        <Button
          sx={{ flex: 1 }}
          variant="contained"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
        <Button
          sx={{ flex: 1 }}
          variant="contained"
          onClick={() => setIsDelaying(!isDelaying)}
        >
          Delay
        </Button>
        <Button
          sx={{ flex: 1 }}
          variant="outlined"
          color="error"
          onClick={() => {}}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
