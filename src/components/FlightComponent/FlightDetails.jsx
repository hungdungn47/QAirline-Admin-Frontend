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
import { parse, format, addHours, differenceInHours } from "date-fns";
import {
  changeFlightAircraft,
  closeFlight,
  delayFlight,
  getFlightById,
  getFlightsData,
  openFlight,
} from "../../apis/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseDateTime } from "../../utils/utils";

export default function FlightDetails({ setFlights, flightData, aircrafts }) {
  const [flight, setFlight] = useState(flightData);

  let initialDepartureTime = flight.delayedDepartureTime
    ? parseDateTime(flight.delayedDepartureTime)
    : parseDateTime(flight.departureTime);
  const [departureTime, setDepartureTime] = useState(initialDepartureTime);

  let initialArrivalTime = flight.delayedDepartureTime
    ? addHours(
        parseDateTime(flight.arrivalTime),
        differenceInHours(
          parseDateTime(flight.delayedDepartureTime),
          parseDateTime(flight.departureTime)
        )
      )
    : parseDateTime(flight.arrivalTime);
  const [arrivalTime, setArrivalTime] = useState(initialArrivalTime);

  const destination = flight.destinationAirport.airportCode;
  const origin = flight.originAirport.airportCode;
  const [aircraft, setAircraft] = useState(flight.plane.id);

  const [inputAircraft, setInputAircraft] = useState(flight.plane.id);

  const [isEditing, setIsEditing] = useState(false);

  // New states for delay functionality
  const [isDelaying, setIsDelaying] = useState(false);
  const [delayTime, setDelayTime] = useState(0);

  const fetchFlightData = async () => {
    const data = await getFlightById(flightData.id);
    setFlight(data);
  };

  useEffect(() => {
    setFlight(flightData);
  }, [flightData]);

  useEffect(() => {
    setDepartureTime(initialDepartureTime);
    setArrivalTime(initialArrivalTime);
    setAircraft(flight.plane.id);

    // Reset inputs when the flight changes
    setInputAircraft(flight.plane.id);
    setIsEditing(false);
    setIsDelaying(false);
    setDelayTime(0);
  }, [flight]);

  const handleCloseFlight = () => {
    closeFlight(flight.id)
      .then((res) => {
        fetchFlightData();
        getFlightsData().then((res) => {
          setFlights(res.results);
        });
        toast.success(res);
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };
  const handleOpenFlight = () => {
    openFlight(flight.id)
      .then((res) => {
        fetchFlightData();
        getFlightsData().then((res) => {
          setFlights(res.results);
        });
        toast.success(res);
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  const handleCancel = () => {
    setInputAircraft(aircraft);
    setIsEditing(false);
  };

  const applyDelay = () => {
    if (delayTime > 0) {
      const newDepartureTime = addHours(departureTime, parseInt(delayTime, 10));
      const newArrivalTime = addHours(arrivalTime, parseInt(delayTime, 10));

      delayFlight(flight.id, format(newDepartureTime, "dd/MM/yyyy HH:mm:ss"))
        .then((message) => {
          setDepartureTime(newDepartureTime);
          setArrivalTime(newArrivalTime);

          setIsDelaying(false);
          fetchFlightData();
          getFlightsData().then((res) => {
            setFlights(res.results);
          });
          toast.success(message);
        })
        .catch((err) => {
          toast.error(err);
        });

      // console.log(`Flight delayed by ${delayTime} hours`);
    } else {
      toast.error("Delaying time cannot be smaller than 0!");
    }
  };

  if (!flight.available) {
    return (
      <Box>
        <Typography fontSize="24px" color="primary">
          {flight.flightNumber}
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
            <div className="text-theme-primary font-bold text-2xl">
              {origin}
            </div>
            <div className="font-bold text-xl">
              {format(departureTime, "HH:mm")}
            </div>
            <div>{format(departureTime, "dd/MM/yyyy")}</div>
          </Box>
          <Box>
            <ConnectingAirportsIcon fontSize="large" color="primary" />
          </Box>
          <Box sx={{ textAlign: "end" }}>
            <div className="text-theme-primary font-bold text-2xl">
              {destination}
            </div>
            <div className="font-bold text-xl">
              {format(departureTime, "HH:mm")}
            </div>
            <div>{format(departureTime, "dd/MM/yyyy")}</div>
          </Box>
        </Box>
        <Typography color="error">This flight is closed!</Typography>
        <div className="text-gray-400 !important">
          {flight.delayedDepartureTime ? (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>Delayed until: </div>
              <div className="font-bold text-xl">
                {format(
                  parseDateTime(flight.delayedDepartureTime),
                  "HH:mm dd/MM"
                )}
              </div>
            </Box>
          ) : (
            <div>Not delayed</div>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>Aircraft: </div>
            <div className="font-bold text-xl">
              {flight.plane.brand} {flight.plane.model}
            </div>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>Economy price: </div>
            <div className="font-bold text-xl">{flight.economyPrice} $</div>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>Business price: </div>
            <div className="font-bold text-xl">{flight.businessPrice} $</div>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>Economy seats left: </div>
            <div className="font-bold text-xl">
              {flight.availableEconomySeats}
            </div>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>Business seats left: </div>
            <div className="font-bold text-xl">
              {flight.availableBusinessSeats}
            </div>
          </Box>
        </div>
        <Divider
          sx={{ marginTop: "10px", border: "0.8px solid rgb(200, 200, 200)" }}
        />
        <Box sx={{ marginTop: "20px", display: "flex", gap: 2 }}>
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
            color="success"
            onClick={handleOpenFlight}
          >
            Open
          </Button>
        </Box>
      </Box>
    );
  }
  return (
    <Box>
      <Typography fontSize="24px" color="primary">
        {flight.flightNumber}
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
          <div className="text-theme-primary font-bold text-2xl">{origin}</div>
          <div className="font-bold text-xl">
            {format(departureTime, "HH:mm")}
          </div>
          <div>{format(departureTime, "dd/MM/yyyy")}</div>
        </Box>
        <Box>
          <ConnectingAirportsIcon fontSize="large" color="primary" />
        </Box>
        <Box sx={{ textAlign: "end" }}>
          <div className="text-theme-primary font-bold text-2xl">
            {destination}
          </div>
          <div className="font-bold text-xl">
            {format(departureTime, "HH:mm")}
          </div>
          <div className="light-small-text">
            {format(departureTime, "dd/MM/yyyy")}
          </div>
        </Box>
      </Box>
      {flight.delayedDepartureTime ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>Delayed until: </Typography>
          <Typography color="primary" fontWeight="bold" fontSize="20px">
            {format(parseDateTime(flight.delayedDepartureTime), "HH:mm dd/MM")}
          </Typography>
        </Box>
      ) : (
        <Typography>Not delayed</Typography>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Typography>Aircraft: </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
                  <MenuItem key={aircraft.id} value={aircraft.id}>
                    {aircraft.brand} {aircraft.model}
                  </MenuItem>
                );
              })}
            </Select>
          )}
          {isEditing ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setIsEditing(false);
                  changeFlightAircraft(flight, inputAircraft)
                    .then((message) => {
                      toast.success(message);
                      setAircraft(inputAircraft);
                      fetchFlightData();
                      getFlightsData().then((res) => {
                        setFlights(res.results);
                      });
                    })
                    .catch((err) => {
                      toast.error(err);
                    });
                }}
              >
                Apply
              </Button>
              <Button variant="outlined" color="warning" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          ) : null}
        </Box>
      </Box>

      {/* Economy Price */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>Economy price: </Typography>
        <Typography color="primary" fontWeight="bold" fontSize="20px">
          {flight.economyPrice} $
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>Business price: </Typography>
        <Typography color="primary" fontWeight="bold" fontSize="20px">
          {flight.businessPrice} $
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>Economy seats left: </Typography>
        <Typography color="primary" fontWeight="bold" fontSize="20px">
          {flight.availableEconomySeats}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>Business seats left: </Typography>
        <Typography color="primary" fontWeight="bold" fontSize="20px">
          {flight.availableBusinessSeats}
        </Typography>
      </Box>
      {/* Editing Buttons */}

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
          Change plane
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
          onClick={handleCloseFlight}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
}
