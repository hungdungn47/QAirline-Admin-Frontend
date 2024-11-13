import { Box, Typography, Button } from "@mui/material"
import formatDateTime from "../../utils/utils"
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';

export default function FlightDetails({ flight }) {
  const flightID = flight.flightID
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
    <Box sx={{  
      flex: '2',
      margin: '20px',
      borderRadius: '12px',
      boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
      padding: '20px',
    }}>
      <Typography fontSize='24px' color="primary">{flightID}</Typography>
      <Box sx={{
        marginY: '15px',
        flex: '2',
        display: 'flex',
        justifyContent: 'space-between',
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
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center'
        }}>
          <Typography>Aircraft: </Typography><Typography color="primary" fontWeight="bold" fontSize="20px">{aircraft}</Typography>
        </Box>
        <Button variant="contained">Change aircraft</Button>
      </Box>
      
      <Box sx={{
        marginTop: '20px',
        display: 'flex',
        gap: 2,
      }}>
        <Button sx={{ flex: 1 }} variant="contained">Delay</Button>
        <Button sx={{ flex: 1 }} variant="outlined" color="error">Cancel</Button>
      </Box>
      
      
    </Box>
  )
}