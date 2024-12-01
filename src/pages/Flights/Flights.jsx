import FlightComponent from "../../components/FlightComponent/FlightComponent";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { fetchAircrafts, fetchAirports, getFlightsData } from "../../apis/api";
import { useEffect } from "react";
import FlightDetails from "../../components/FlightComponent/FlightDetails";
import CreateFlightDialog from "../../components/FlightComponent/CreateFlightDialog/CreateFlightDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fromDateTimeLocalFormat } from "../../utils/utils";

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [currentFlight, setCurrentFlight] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);

  const handleCreate = (flight) => {
    const formattedData = {
      ...flight,
      departureTime: fromDateTimeLocalFormat(flight.departureTime),
      arrivalTime: fromDateTimeLocalFormat(flight.arrivalTime),
    };
    console.log("New Flight Data:", formattedData);
    // Add logic to save the flight
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const flightData = await getFlightsData();
        toast.success("Fetched flights!");
        setFlights(flightData);
        setCurrentFlight(flightData[0]);
        fetchAircrafts()
          .then((data) => {
            setAircrafts(data);
          })
          .catch((error) => {
            console.error(error);
            toast.error(error);
          });

        fetchAirports()
          .then((data) => {
            setAirports(data);
          })
          .catch((error) => {
            console.error(error);
            toast.error(error);
          });
      } catch (err) {
        setError("Failed to fetch flights data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <Typography>Loading board...</Typography>
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
      <Box
        sx={{
          height: "calc(100vh - 79px)",
          flex: "4",
          marginTop: "10px",
          overflowY: "auto",
        }}
      >
        <Box sx={{ margin: "10px", marginTop: "1px", marginBottom: "0" }}>
          {flights.map((flight) => {
            return (
              <FlightComponent
                key={flight.id}
                setCurrentFlight={setCurrentFlight}
                flight={flight}
              />
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          flex: "2",
          margin: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <FlightDetails flight={currentFlight} aircrafts={aircrafts} />
        <Button
          sx={{ width: "40%", marginX: "auto" }}
          variant="contained"
          onClick={() => setDialogOpen(true)}
        >
          Create new flight
        </Button>
      </Box>
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
