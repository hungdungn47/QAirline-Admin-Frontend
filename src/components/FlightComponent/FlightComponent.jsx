import { Box, Divider, Typography, Button } from "@mui/material";
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import './flight_component.css'
import formatDateTime from "../../utils/utils";

export default function FlightComponent({ flight, setCurrentFlight }) {
  const departure = formatDateTime(flight.departureTime)
  const arrival = formatDateTime(flight.arrivalTime)
  const departureTime = departure.hour
  const departureDate = departure.date
  const arrivalTime = arrival.hour
  const arrivalDate = arrival.date
  const destination = flight.destinationAirportCode
  const origin = flight.originAirportCode
  const aircraft = flight.aircraftCode

  return (
    <Box
      sx={{
        marginBottom: '10px',
        borderRadius: '12px',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Box sx={{
        flex: '2',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}>
        
        <Box sx={{
          textAlign: 'start'
        }}>
          <div className="destination-code">
            {origin}
          </div>
          <div className="medium-big-text">{departureTime}</div>
          <div className="light-small-text">{departureDate}</div>
        </Box>
        <Box>
          <ConnectingAirportsIcon fontSize='large' color='primary'/>
        </Box>
        <Box sx={{
          textAlign: 'end'
        }}>
          <div className="destination-code">
            {destination}
          </div>
          <div className="medium-big-text">{arrivalTime}</div>
          <div className="light-small-text">{arrivalDate}</div>
        </Box>
        
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem/>
      <Box sx={{
        flex: '1',
        margin: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        gap: 2
      }}>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Flight number: </Typography>
          <Typography color='primary' fontWeight='bold'>{flight.flightID}</Typography>
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Estimated flying time: </Typography>
          <Typography color='primary' fontWeight='bold'>2 hours</Typography>
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Aircraft: </Typography>
          <Typography color='primary' fontWeight='bold'>{aircraft}</Typography>
        </Box>
        <Button onClick={() => setCurrentFlight(flight)} variant='contained' size="small">Details</Button>
      </Box>
    </Box>
  )
}