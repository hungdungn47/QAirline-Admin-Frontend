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
  fetchAircrafts,
  fetchAirports,
  filterFlights,
  getFlightsData,
} from "../../apis/api";
import { fromDateTimeLocalFormat } from "../../utils/utils";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Add } from "@mui/icons-material";

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [currentFlight, setCurrentFlight] = useState(null); // Set initial value to null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getFlightsData();
      if (response.code === 401) {
        navigate("/login");
      }
      const flightData = response.results;
      setFlights(flightData);
      if (flightData.length > 0) {
        setCurrentFlight(flightData[0]); // Set the first flight as the default
      }
      const aircraftData = await fetchAircrafts();
      setAircrafts(aircraftData);

      const airportData = await fetchAirports();
      setAirports(airportData);
    } catch (err) {
      setError("Failed to fetch flights data.");
      toast.error("Failed to fetch flights data.");
    } finally {
      setLoading(false);
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
        setFlights(res);
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
    setCurrentFlight(flight);
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
    createFlight(formattedData)
      .then((res) => {
        getFlightsData().then((data) => {
          setFlights(data.results);
          toast.success("Flight created successfully!");
        });
      })
      .catch((err) => {
        toast.error("Failed to create flight.");
      });
  };

  if (loading) {
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
        height: "calc(100vh - 69px)",
        display: "flex",
        alignItems: "start",
        overflowY: "hidden",
      }}
    >
      {/* Left-side flight list */}
      <Box
        sx={{
          height: "calc(100vh - 79px)",
          flex: "3",
          marginTop: "10px",
          marginLeft: "10px",
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            endIcon={<Add />}
          >
            Create new flight
          </Button>
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
              height: "80%",
            }}
          >
            <Typography>
              There is no flights satisfying current condition!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              height: "calc(100vh - 125px)",
              overflowY: "auto",
            }}
          >
            <Box sx={{ marginRight: "5px" }}>
              {flights.map((flight) => (
                <FlightComponent
                  key={flight.id}
                  setCurrentFlight={setCurrentFlight}
                  handleOpenDetails={handleOpenDetails}
                  currentFlight={currentFlight}
                  flight={flight}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Right-side flight details for desktop */}
      {!isMobile && (
        <Box
          sx={{
            flex: "2",
            margin: "20px",
          }}
        >
          <Box
            sx={{
              padding: 2,
            }}
          >
            {currentFlight ? (
              <FlightDetails
                setFlights={setFlights}
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
      {/* Mobile modal for flight details */}
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
                setFlights={setFlights}
                flightData={currentFlight}
                aircrafts={aircrafts}
              />
            )}
          </Box>
        </Modal>
      )}

      {/* Create flight dialog */}
      <CreateFlightDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        aircrafts={aircrafts}
        airports={airports}
      />
      <ToastContainer />
    </Box>
  );
}
