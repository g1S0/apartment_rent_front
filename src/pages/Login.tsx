import { useState, FormEvent } from "react";
import { TextField, Button, Container, Typography, Box, InputAdornment, IconButton } from "@mui/material";
import axios from "axios";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormErrors } from "../interface/interface";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email) newErrors.email = "Пожалуйста, введите email.";
    if (!password) newErrors.password = "Пожалуйста, введите пароль.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("/api/v1/auth/authenticate", {
        email,
        password,
      });
      const accessToken: string = response.data.access_token;
      const refreshToken: string = response.data.refresh_token;
      authService.saveToken(accessToken);
      authService.saveRefreshToken(refreshToken);
      navigate("/");
    } catch (error) {
      console.error("Ошибка логина", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container component="main" maxWidth="xs">
        <Typography variant="h5" align="center" gutterBottom>
          Вход
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Пароль"
            type={passwordVisible ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    edge="end"
                  >
                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Войти
          </Button>
        </form>
      </Container>
    </Box>
  );
}

export default Login;