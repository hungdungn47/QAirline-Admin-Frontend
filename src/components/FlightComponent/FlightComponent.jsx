import { Box, Divider, Typography, Button } from "@mui/material";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import { getHourAndDate, parseDateTime } from "../../utils/utils";
import { parse, format, addHours, differenceInHours } from "date-fns";
import { KeyboardArrowRight } from "@mui/icons-material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

export default function FlightComponent({
  flight,
  currentFlight,
  setCurrentFlight,
  handleOpenDetails,
}) {
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
    departureHour: getHourAndDate(flight.departureTime).hour,
    departureDate: getHourAndDate(flight.departureTime).date,
    arrivalHour: getHourAndDate(flight.arrivalTime).hour,
    arrivalDate: getHourAndDate(flight.arrivalTime).date,
  };

  let delayedDepartureTime = flight.delayedDepartureTime;
  let delayedArrivalTime = "";
  const isSelected = flight.id === currentFlight.id;

  if (delayedDepartureTime !== null) {
    delayedArrivalTime = format(
      addHours(
        parseDateTime(flight.arrivalTime),
        differenceInHours(
          parseDateTime(flight.delayedDepartureTime),
          parseDateTime(flight.departureTime)
        )
      ),
      "dd/MM/yyyy HH:mm:ss"
    );
  }

  return (
    <Box
      sx={{
        marginBottom: "10px",
        marginTop: "10px",
        borderRadius: "12px",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
        backgroundColor: `${isSelected ? "white" : "white"}`,
        display: "flex",
        justifyContent: "space-around",
        border: `${isSelected ? "3px solid #69548D" : "none"}`,
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          flex: "2",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          paddingX: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          {originAirport && (
            <div className="text-theme-primary text-lg lg:text-2xl font-bold">
              {originAirport.city.cityName}
            </div>
          )}
          <div className="text-md font-bold lg:text-lg">
            {delayedDepartureTime
              ? format(parseDateTime(delayedDepartureTime), "HH:mm")
              : departureHour}
          </div>
          <div className="text-md lg:text-lg">
            {delayedDepartureTime
              ? format(parseDateTime(delayedDepartureTime), "dd/MM")
              : departureDate}
          </div>
        </Box>
        <ArrowRightAltIcon fontSize="large" color="primary" />
        <Box
          sx={{
            textAlign: "end",
            flex: 1,
          }}
        >
          {destinationAirport && (
            <div className="text-theme-primary text-lg lg:text-2xl font-bold">
              {destinationAirport.city.cityName}
            </div>
          )}
          <div className="text-md font-bold lg:text-lg">
            {delayedArrivalTime !== ""
              ? format(parseDateTime(delayedArrivalTime), "HH:mm")
              : arrivalHour}
          </div>
          <div className="text-md lg:text-lg">
            {delayedArrivalTime !== ""
              ? format(parseDateTime(delayedArrivalTime), "dd/MM")
              : arrivalDate}
          </div>
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
        <Typography color="primary" fontWeight="bold">
          {flight.flightNumber}
        </Typography>
        <Typography color="primary" fontWeight="bold">
          {plane.brand} {plane.model}
        </Typography>
        <Button
          onClick={() => handleOpenDetails(flight)}
          variant={isSelected ? "outlined" : "contained"}
          size="small"
        >
          Details
        </Button>
      </Box>
    </Box>
  );
}
