import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { forgotPasswordApi } from "../../../apis/api";
import backgroundImage from "../../../assets/background.jpg";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPasswordApi(email);

      setMessage(response);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${backgroundImage})`,
      }}
    >
      <Box
        sx={{
          height: "30%",
          maxWidth: 400,
          padding: 4,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Enter your email to reset password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        {message && (
          <Typography sx={{ marginTop: 2, color: "green" }}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
