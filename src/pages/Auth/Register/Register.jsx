import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    // Mock admin credentials
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        sx={{
          padding: 4,
          width: 400,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Admin Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            fullWidth
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="First name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="off"
            fullWidth
          />
          <TextField
            label="Last name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            fullWidth
          >
            Register
          </Button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </Box>
      </Paper>
    </Box>
  );
}
