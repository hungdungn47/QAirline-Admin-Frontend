import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Modal,
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
  getFlightsData,
} from "../../apis/api";
import { fromDateTimeLocalFormat } from "../../utils/utils";

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

  const handleOpenDetails = (flight) => {
    setCurrentFlight(flight);
    if (isMobile) setIsModalOpen(true); // Open modal for mobile
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
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
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Create new flight
        </Button>
        <Box
          sx={{
            height: "100%",
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
