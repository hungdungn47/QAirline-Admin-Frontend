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
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import { useState, useEffect } from "react";
import { parse, format, addHours } from "date-fns";

export default function FlightDetails({ flight, aircrafts }) {
  const flightID = flight.flightID;
  const parseDateTime = (dateTimeString) => {
    return parse(dateTimeString, "dd/MM/yyyy HH:mm:ss", new Date());
  };
  const [departureTime, setDepartureTime] = useState(
    parseDateTime(flight.departureTime)
  );
  const [arrivalTime, setArrivalTime] = useState(
    parseDateTime(flight.arrivalTime)
  );
  const destination = flight.destinationAirport;
  const origin = flight.originAirport;
  const economyPrice = flight.economyPrice;
  const businessPrice = flight.businessPrice;
  const [aircraft, setAircraft] = useState(flight.plane.id);

  const [inputAircraft, setInputAircraft] = useState(flight.plane.id);

  const [isEditing, setIsEditing] = useState(false);

  // New states for delay functionality
  const [isDelaying, setIsDelaying] = useState(false);
  const [delayTime, setDelayTime] = useState(0);

  useEffect(() => {
    setDepartureTime(parseDateTime(flight.departureTime));
    setArrivalTime(parseDateTime(flight.arrivalTime));
    setAircraft(flight.plane.id);

    // Reset inputs when the flight changes
    setInputAircraft(flight.plane.id);
    setIsEditing(false);
    setIsDelaying(false);
    setDelayTime(0);
  }, [flight]);

  const handleCancel = () => {
    setInputAircraft(aircraft);
    setIsEditing(false);
  };

  const applyDelay = () => {
    if (delayTime > 0) {
      const newDepartureTime = addHours(departureTime, parseInt(delayTime, 10));
      setDepartureTime(newDepartureTime);

      const newArrivalTime = addHours(arrivalTime, parseInt(delayTime, 10));
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
            {format(departureTime, "HH:mm")}
          </div>
          <div className="light-small-text">
            {format(departureTime, "dd/MM/yyyy")}
          </div>
        </Box>
        <Box>
          <ConnectingAirportsIcon fontSize="large" color="primary" />
        </Box>
        <Box sx={{ textAlign: "end" }}>
          <div className="destination-code">{destination}</div>
          <div className="medium-big-text">
            {format(departureTime, "HH:mm")}
          </div>
          <div className="light-small-text">
            {format(departureTime, "dd/MM/yyyy")}
          </div>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography>Aircraft: </Typography>
          {!isEditing ? (
            <Typography color="primary" fontWeight="bold" fontSize="20px">
              {flight.plane.brand} {flight.plane.model}
            </Typography>
          ) : (
            <Select
              sx={{ height: "3rem" }}
              onChange={(e) => {
                setInputAircraft(e.target.value);
              }}
              value={inputAircraft}
            >
              {aircrafts.map((aircraft) => {
                return (
                  <MenuItem value={aircraft.id}>
                    {aircraft.brand} {aircraft.model}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </Box>
      </Box>
      {/* Economy Price */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography>Economy price: </Typography>
          <Typography color="primary" fontWeight="bold" fontSize="20px">
            {economyPrice}
          </Typography>
        </Box>
      </Box>
      {/* Business Price */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography>Business price: </Typography>
          <Typography color="primary" fontWeight="bold" fontSize="20px">
            {businessPrice}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography>Economy seats left: </Typography>
          <Typography color="primary" fontWeight="bold" fontSize="20px">
            {flight.availableEconomySeats}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography>Business seats left: </Typography>
          <Typography color="primary" fontWeight="bold" fontSize="20px">
            {flight.availableBusinessSeats}
          </Typography>
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
