import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  TextField,
  Modal,
  MenuItem,
} from "@mui/material";
import { useMediaQuery } from "react-responsive";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import FlightComponent from "../../components/FlightComponent/FlightComponent";
import FlightDetails from "../../components/FlightComponent/FlightDetails";
import CreateFlightDialog from "../../components/FlightComponent/CreateFlightDialog/CreateFlightDialog";
import {
  createFlight,
  createMultipleFlight,
  fetchAircrafts,
  fetchAirports,
  filterFlights,
  getFlightsData,
} from "../../apis/api";
import { fromDateTimeLocalFormat } from "../../utils/utils";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Add } from "@mui/icons-material";
import CreateMultipleFlightDialog from "../../components/FlightComponent/CreateFlightDialog/CreateMultipleFlightDialog";
import { useSelector, useDispatch } from "react-redux";
import { flightsAdded, flightsFetched } from "../../app/flightsSlice";
import { v4 as uuidv4 } from "uuid";
import { setCurrentFlight } from "../../app/flightInfoSlice";

export default function Flights() {
  // const [flights, setFlights] = useState([]);
  const flights = useSelector((state) => state.flights);
  // const [currentFlight, setCurrentFlight] = useState(null); // Set initial value to null
  const currentFlight = useSelector((state) => state.flightInfo.currentFlight);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creatingMultipleFlight, setCreatingMultipleFlight] = useState(false);
  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 700px)" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    departureTimeStart: "",
    departureTimeEnd: "",
  });
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await getFlightsData();
      if (response.code === 401) {
        navigate("/login");
      }
      const flightData = response.results;
      // setFlights(flightData);
      dispatch(flightsFetched(flightData));
      if (flightData.length > 0) {
        dispatch(setCurrentFlight(flightData[0]));
        // setCurrentFlight(flightData[0]); // Set the first flight as the default
      }
      const aircraftData = await fetchAircrafts();
      setAircrafts(aircraftData);

      const airportData = await fetchAirports();
      setAirports(airportData);
    } catch (err) {
      toast.error("Failed to fetch flights data.");
    }
  };

  const handleApplyFilters = () => {
    const formattedFilters = {
      ...filters,
      departureTimeStart: filters.departureTimeStart
        ? fromDateTimeLocalFormat(filters.departureTimeStart)
        : "",
      departureTimeEnd: filters.departureTimeEnd
        ? fromDateTimeLocalFormat(filters.departureTimeEnd)
        : "",
      departureAirport: filters.origin,
      destinationAirport: filters.destination,
    };
    delete formattedFilters.origin;
    delete formattedFilters.destination;
    Object.keys(formattedFilters).forEach((key) => {
      if (formattedFilters[key] == "") {
        delete formattedFilters[key];
      }
    });

    setLoading(true);
    filterFlights(formattedFilters)
      .then((res) => {
        setIsFiltering(false);
        // setFlights(res);
        dispatch(flightsFetched(res));
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Could not filter flights");
      });
  };
  const handleResetFilters = () => {
    setFilters({
      origin: "",
      destination: "",
      departureTimeStart: "",
      departureTimeEnd: "",
    });
    fetchData(); // Reset the flight list
  };

  const handleOpenDetails = (flight) => {
    // setCurrentFlight(flight);
    dispatch(setCurrentFlight(flight));
    if (isMobile) setIsModalOpen(true); // Open modal for mobile
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = (flight) => {
    const formattedData = {
      ...flight,
      departureTime: fromDateTimeLocalFormat(flight.departureTime),
      arrivalTime: fromDateTimeLocalFormat(flight.arrivalTime),
    };
    const tempId = uuidv4();
    dispatch(flightsAdded({ ...formattedData, id: tempId }));
    createFlight(formattedData)
      .then((res) => {
        getFlightsData().then((data) => {
          // setFlights(data.results);
          dispatch(flightsFetched(data.results));
          toast.success("Flight created successfully!");
        });
      })
      .catch((err) => {
        toast.error("Failed to create flight.");
      });
  };

  const handleCreateMultiple = (flight) => {
    const formattedData = {
      ...flight,
      departureTime: flight.departureTime + ":00",
      arrivalTime: flight.arrivalTime + ":00",
      addFrom: fromDateTimeLocalFormat(flight.addFrom),
      addUntil: fromDateTimeLocalFormat(flight.addUntil),
    };
    createMultipleFlight(formattedData)
      .then((res) => {
        getFlightsData().then((data) => {
          // setFlights(data.results);
          dispatch(flightsFetched(data));
          toast.success(data.message);
        });
      })
      .catch((err) => {
        toast.error("Failed to create flight.");
      });
  };

  if (flights.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading flights...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "start",
        overflowY: "hidden",
      }}
    >
      <Box
        sx={{
          flex: "3",
          marginTop: "10px",
        }}
      >
        <div
          className={
            isMobile
              ? "justify-between gap-2 ml-2"
              : "flex justify-between gap-2 ml-2"
          }
        >
          <div className={isMobile ? "mb-2" : ""}>
            <Button
              sx={{ marginRight: 1 }}
              variant="contained"
              onClick={() => setDialogOpen(true)}
              endIcon={<Add />}
            >
              Create flight
            </Button>
            <Button
              variant="contained"
              onClick={() => setCreatingMultipleFlight(true)}
              endIcon={<Add />}
            >
              Create multiple
            </Button>
          </div>
          <Button
            variant="outlined"
            onClick={() => setIsFiltering(true)}
            endIcon={<FilterAltOutlinedIcon />}
          >
            Filter flights
          </Button>
        </div>

        {flights.length === 0 ? (
          <Box
            sx={{
              display: "flex",

              alignItems: "center",
              justifyContent: "center",
              // height: "80%",
            }}
          >
            <Typography>
              There is no flights satisfying current condition!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              marginTop: "10px",
              height: `${
                isMobile
                  ? "calc(100vh - 64px - 110px)"
                  : "calc(100vh - 64px - 60px)"
              }`,
              overflowY: "auto",
            }}
          >
            <Box sx={{ marginX: "7px" }}>
              {flights.map((flight) => (
                <FlightComponent
                  key={flight.id}
                  setCurrentFlight={(flight) =>
                    dispatch(setCurrentFlight(flight))
                  }
                  handleOpenDetails={handleOpenDetails}
                  currentFlight={currentFlight}
                  flight={flight}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {!isMobile && (
        <Box
          sx={{
            flex: "2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 64px)",
          }}
        >
          <Box
            sx={{
              width: "80%",
              borderRadius: 2,
              boxShadow: "0 0 10px rgba(140, 108, 184, 0.6)",
              padding: 3,
            }}
          >
            {currentFlight ? (
              <FlightDetails
                setFlights={(flights) => dispatch(flightsFetched(flights))}
                flightData={currentFlight}
                aircrafts={aircrafts}
              />
            ) : (
              <Typography>Select a flight to view details</Typography>
            )}
          </Box>
        </Box>
      )}
      <Modal
        open={isFiltering}
        onClose={() => setIsFiltering(false)}
        aria-labelledby="filter-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            p: 3,
            boxShadow: 24,
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" id="filter-modal-title">
            Filter Flights
          </Typography>
          <TextField
            select
            label="Origin Airport"
            value={filters.origin}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, origin: e.target.value }))
            }
          >
            {airports.map((airport) => (
              <MenuItem key={airport.id} value={airport.id}>
                {airport.airportName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Destination Airport"
            name="destinationAirport"
            value={filters.destination}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, destination: e.target.value }))
            }
            select
            fullWidth
          >
            {airports.map((airport) => {
              return (
                <MenuItem key={airport.id} value={airport.id}>
                  {airport.airportName}
                </MenuItem>
              );
            })}
          </TextField>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              type="datetime-local"
              label="Departure from"
              sx={{ flex: 1 }}
              InputLabelProps={{ shrink: true }}
              value={filters.departureTimeStart}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  departureTimeStart: e.target.value,
                }))
              }
            />
            <TextField
              type="datetime-local"
              label="Departure to"
              sx={{ flex: 1 }}
              InputLabelProps={{ shrink: true }}
              value={filters.departureTimeEnd}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  departureTimeEnd: e.target.value,
                }))
              }
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button onClick={handleResetFilters} color="error">
              Reset
            </Button>
            <Button onClick={handleApplyFilters} variant="contained">
              Apply
            </Button>
          </Box>
        </Box>
      </Modal>
      {isMobile && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "background.paper",
              p: 3,
              boxShadow: 24,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            {currentFlight && (
              <FlightDetails
                setFlights={(flights) => dispatch(flightsFetched(flights))}
                flightData={currentFlight}
                aircrafts={aircrafts}
              />
            )}
          </Box>
        </Modal>
      )}

      <CreateFlightDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        aircrafts={aircrafts}
        airports={airports}
      />
      <CreateMultipleFlightDialog
        open={creatingMultipleFlight}
        onClose={() => setCreatingMultipleFlight(false)}
        onCreate={handleCreateMultiple}
        aircrafts={aircrafts}
        airports={airports}
      />
      <ToastContainer />
    </Box>
  );
}
