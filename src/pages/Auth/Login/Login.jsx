import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../../apis/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Handling login");
    setError(null);

    try {
      const { results } = await loginApi(email, password);
      localStorage.setItem("accessToken", results.jwtToken);
      localStorage.setItem("refreshToken", results.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response.data.message);
    }
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
          Admin Login
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
          <Link to="/forgetPassword" className="text-theme-primary underline">
            Forgot password?
          </Link>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
          >
            Login
          </Button>
          <span>
            Don't have an account?{" "}
            <Link to="/register" className="text-theme-primary underline">
              Register
            </Link>
          </span>
        </Box>
      </Paper>
      <ToastContainer />
    </Box>
  );
}
