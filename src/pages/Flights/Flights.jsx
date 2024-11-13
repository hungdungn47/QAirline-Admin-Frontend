import FlightComponent from "../../components/FlightComponent/FlightComponent"
import { Box, Button, CircularProgress, Typography } from "@mui/material"
import { useState } from "react";
import { getFlightsData } from "../../apis/api";
import { useEffect } from "react";
import FlightDetails from "../../components/FlightComponent/FlightDetails";

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [currentFlight, setCurrentFlight] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFlightsData();
        console.log('Data: ', data);
        setFlights(data);
        setCurrentFlight(data[0]);
      } catch (err) {
        setError("Failed to fetch flights data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if(loading) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Loading board...</Typography>
      </Box>
    )
  }
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'start',
    }}>
      <Box sx={{
        flex: '4',
        margin: '20px auto',
        paddingLeft: '20px',
      }}>
        
        {flights.map( (flight) => {
          return <FlightComponent key={flight.flightID} flight={flight}/>
        } )}
      </Box>
      <FlightDetails flight={currentFlight}/>
    </Box>
  )
}