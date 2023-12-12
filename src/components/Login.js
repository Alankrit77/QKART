import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar(); // Move this inside the component

  const [loggingIn, setloggingIn] = useState(false);

  const [loginForm, setloginForm] = useState({
    username: "",
    password: "",
  });

  function handleChange(e) {
    setloginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  }

  const login = async (formData) => {
    try {
      if (validateInput(formData)) {
        setloggingIn(true);
        const res = await axios.post(`${config.endpoint}/auth/login`, {
          username: formData.username,
          password: formData.password,
        });
        persistLogin(res.data.token, res.data.username, res.data.balance);

        enqueueSnackbar("Logged In Successfully", {
          variant: "success",
        });
        history.push("/");
      }
    } catch (e) {
      if (e.response && e.response.data) {
        enqueueSnackbar(e.response.data.message, {
          variant: "error",
        });
      }
    } finally {
      setloggingIn(false);
    }
  };

  const validateInput = (data) => {
    if (data.username === "") {
      enqueueSnackbar("Username is a required field", {
        variant: "warning",
      });
      return false;
    }

    if (data.password === "") {
      enqueueSnackbar("Password is a required field", {
        variant: "warning",
      });
      return false;
    }
    return true;
  };
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={loginForm.username}
            onChange={handleChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be at least 6 characters length"
            fullWidth
            placeholder="Enter a password with a minimum of 6 characters"
            value={loginForm.password}
            onChange={handleChange}
          />
          {loggingIn ? (
            <Stack justifyContent="center" alignItems="center">
              <CircularProgress />
            </Stack>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                login(loginForm);
              }}
            >
              Login to QKart
            </Button>
          )}

          <p className="secondary-action">
            Don't have an account?{" "}
            <Link classaName="link" to="/register">
              Register Now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
