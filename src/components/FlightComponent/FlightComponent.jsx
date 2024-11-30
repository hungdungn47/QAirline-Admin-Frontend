import { Box, Divider, Typography, Button } from "@mui/material";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import "./flight_component.css";
import formatDateTime from "../../utils/utils";

export default function FlightComponent({ flight, setCurrentFlight }) {
  const {
    departureHour,
    departureDate,
    arrivalHour,
    arrivalDate,
    destinationAirport,
    originAirport,
    plane,
  } = {
    ...flight,
    departureHour: formatDateTime(flight.departureTime).hour,
    departureDate: formatDateTime(flight.departureTime).date,
    arrivalHour: formatDateTime(flight.arrivalTime).hour,
    arrivalDate: formatDateTime(flight.arrivalTime).date,
  };

  return (
    <Box
      sx={{
        marginBottom: "10px",
        borderRadius: "12px",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          flex: "2",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "start",
          }}
        >
          <div className="destination-code">{originAirport.location}</div>
          <div className="medium-big-text">{departureHour}</div>
          <div className="light-small-text">{departureDate}</div>
        </Box>
        <Box>
          <ConnectingAirportsIcon fontSize="large" color="primary" />
        </Box>
        <Box
          sx={{
            textAlign: "end",
          }}
        >
          <div className="destination-code">{destinationAirport.location}</div>
          <div className="medium-big-text">{arrivalHour}</div>
          <div className="light-small-text">{arrivalDate}</div>
        </Box>
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Box
        sx={{
          flex: "1",
          margin: "15px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          gap: 2,
        }}
      >
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>Flight number: </Typography>
          <Typography color="primary" fontWeight="bold">
            {flight.flightID}
          </Typography>
        </Box>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>Estimated flying time: </Typography>
          <Typography color="primary" fontWeight="bold">
            2 hours
          </Typography>
        </Box>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>Aircraft: </Typography>
          <Typography color="primary" fontWeight="bold">
            {plane.brand}
          </Typography>
        </Box>
        <Button
          onClick={() => setCurrentFlight(flight)}
          variant="contained"
          size="small"
        >
          Details
        </Button>
      </Box>
    </Box>
  );
}
