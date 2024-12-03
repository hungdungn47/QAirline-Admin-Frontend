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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { getBooking } from "../../apis/api";

// Sample data
const sampleTickets = [
  {
    id: 1,
    passengerName: "John Doe",
    flightNumber: "AI-101",
    origin: "JFK",
    destination: "LAX",
    bookingTime: "2024-11-20T10:30:00",
    departureTime: "2024-11-25T14:00:00",
  },
  {
    id: 2,
    passengerName: "Jane Smith",
    flightNumber: "AI-102",
    origin: "LAX",
    destination: "ORD",
    bookingTime: "2024-11-21T09:15:00",
    departureTime: "2024-11-26T16:00:00",
  },
  {
    id: 3,
    passengerName: "Samuel Green",
    flightNumber: "AI-103",
    origin: "ORD",
    destination: "JFK",
    bookingTime: "2024-11-22T12:00:00",
    departureTime: "2024-11-27T10:00:00",
  },
];

const Tickets = () => {
  const [ticketsList, setTicketsList] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filters, setFilters] = useState({
    flightNumber: "",
    origin: "",
    destination: "",
    passengerName: "",
    bookingTime: "",
    departureTime: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      const data = await getBooking();
      setTicketsList(data);
    };
    fetchTickets();
  }, []);

  // Filter tickets based on criteria
  useEffect(() => {
    let filtered = ticketsList;

    if (filters.flightNumber)
      filtered = filtered.filter((ticket) =>
        ticket.flightNumber
          .toLowerCase()
          .includes(filters.flightNumber.toLowerCase())
      );

    if (filters.origin)
      filtered = filtered.filter((ticket) =>
        ticket.origin.toLowerCase().includes(filters.origin.toLowerCase())
      );

    if (filters.destination)
      filtered = filtered.filter((ticket) =>
        ticket.destination
          .toLowerCase()
          .includes(filters.destination.toLowerCase())
      );

    if (filters.passengerName)
      filtered = filtered.filter((ticket) =>
        ticket.passengerName
          .toLowerCase()
          .includes(filters.passengerName.toLowerCase())
      );

    if (filters.bookingTime)
      filtered = filtered.filter(
        (ticket) => ticket.bookingTime.split("T")[0] === filters.bookingTime
      );

    if (filters.departureTime)
      filtered = filtered.filter(
        (ticket) => ticket.departureTime.split("T")[0] === filters.departureTime
      );

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

  return (
    <div className="m-5">
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 3 }}>
        <TextField
          label="Flight Number"
          name="flightNumber"
          value={filters.flightNumber}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Origin Airport"
          name="origin"
          value={filters.origin}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Destination Airport"
          name="destination"
          value={filters.destination}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Passenger Name"
          name="passengerName"
          value={filters.passengerName}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Booking Date"
          name="bookingTime"
          value={filters.bookingTime}
          onChange={handleChange}
          type="date"
          variant="outlined"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Departure Date"
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
        <Button variant="outlined" color="warning" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Box>

      <TableContainer
        style={{
          marginTop: "20px",
          boxShadow: "0 0px 5px rgb(0, 0, 0, 0.3)",
        }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Passenger Name</TableCell>
              <TableCell>Flight Number</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Booking Time</TableCell>
              <TableCell>Departure Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.passengerName}</TableCell>
                <TableCell>{ticket.flightNumber}</TableCell>
                <TableCell>{ticket.origin}</TableCell>
                <TableCell>{ticket.destination}</TableCell>
                <TableCell>
                  {new Date(ticket.bookingTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(ticket.departureTime).toLocaleString()}
                </TableCell>
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
