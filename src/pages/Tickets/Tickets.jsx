import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { getBooking, getCityOfAirport, getFlightById } from "../../apis/api";
import { useSelector, useDispatch } from "react-redux";
import { ticketsFetched } from "../../app/ticketsSlice";

const Tickets = () => {
  const ticketsList = useSelector((state) => state.tickets);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    flightNumber: "",
    origin: "",
    destination: "",
    passengerName: "",
    bookingTime: "",
    departureTime: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getBooking();

        const ticketsWithFlights = data.map((ticket) => {
          if (ticket?.flight) {
            return {
              ...ticket,
              origin: ticket.flight.originAirport.city.cityName,
              destination: ticket.flight.destinationAirport.city.cityName,
            };
          }
          return ticket;
        });

        dispatch(ticketsFetched(ticketsWithFlights));
      } catch (error) {
        console.error("Error fetching tickets or flight data:", error);
      }
    };

    if (ticketsList.length === 0) setLoading(true);
    fetchTickets().then((res) => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let filtered = ticketsList;

    if (filters.flightNumber)
      filtered = filtered.filter((ticket) =>
        ticket.flight?.flightNumber
          ?.toLowerCase()
          .includes(filters.flightNumber.toLowerCase())
      );

    if (filters.origin)
      filtered = filtered.filter((ticket) =>
        ticket.origin?.toLowerCase().includes(filters.origin.toLowerCase())
      );

    if (filters.destination)
      filtered = filtered.filter((ticket) =>
        ticket.destination
          ?.toLowerCase()
          .includes(filters.destination.toLowerCase())
      );

    if (filters.passengerName)
      filtered = filtered.filter((ticket) =>
        ticket.name?.toLowerCase().includes(filters.passengerName.toLowerCase())
      );

    if (filters.departureTime) {
      filtered = filtered.filter((ticket) => {
        const departureDate =
          ticket.flight?.delayedDepartureTime?.split(" ")[0];

        const departureDateSplitted = departureDate.split("/");
        const filterDateSplitted = filters.departureTime.split("-");

        return (
          departureDateSplitted[0] === filterDateSplitted[2] &&
          departureDateSplitted[1] === filterDateSplitted[1] &&
          departureDateSplitted[2] === filterDateSplitted[0]
        );
      });
    }

    setFilteredTickets(filtered);
  }, [filters, ticketsList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      flightNumber: "",
      origin: "",
      destination: "",
      passengerName: "",
      bookingTime: "",
      departureTime: "",
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
        <Typography>Loading tickets...</Typography>
      </Box>
    );
  }

  if (ticketsList.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: `calc(100vh - 64px)`,
          // width: "100vw",
        }}
      >
        <Typography
          sx={{ fontSize: "2rem", fontWeight: "bold" }}
          color="warning"
        >
          There is no booked ticket!
        </Typography>
      </Box>
    );
  }

  return (
    <div className="m-5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
        <TextField
          label="Flight number"
          name="flightNumber"
          value={filters.flightNumber}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Origin city"
          name="origin"
          value={filters.origin}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Destination city"
          name="destination"
          value={filters.destination}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Passenger name"
          name="passengerName"
          value={filters.passengerName}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Departure date"
          name="departureTime"
          value={filters.departureTime}
          onChange={handleChange}
          type="date"
          variant="outlined"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <Button
        sx={{ marginTop: "5px" }}
        variant="outlined"
        color="warning"
        onClick={handleClearFilters}
      >
        Clear Filters
      </Button>

      <TableContainer
        style={{
          marginTop: "20px",
          boxShadow: "0 0px 5px rgb(0, 0, 0, 0.3)",
        }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ECDCFF" }}>
              <TableCell>Passenger name</TableCell>
              <TableCell>Flight Number</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Departure Time</TableCell>
              <TableCell>Seat type</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>{ticket.flight?.flightNumber}</TableCell>
                <TableCell>{ticket.origin}</TableCell>
                <TableCell>{ticket.destination}</TableCell>
                <TableCell>{ticket.flight?.delayedDepartureTime}</TableCell>
                <TableCell>{ticket.seatType}</TableCell>
                <TableCell>{ticket.price}</TableCell>
              </TableRow>
            ))}
            {filteredTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Tickets;
