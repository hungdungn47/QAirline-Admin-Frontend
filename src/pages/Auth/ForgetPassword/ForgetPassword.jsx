import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

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
      // Send request to the server (replace with your backend endpoint)
      // const response = await fetch("/api/forgot-password", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   setMessage("A reset password link has been sent to your email.");
      //   setError("");
      // } else {
      //   setError(data.message || "Failed to send email.");
      // }
      setMessage("A reset password link has been sent to your email.");
    } catch (error) {
      setError("Something went wrong. Please try again.");
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
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          height: "30%",
          borderRadius: 12,
          margin: "auto",
          padding: 2,
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
