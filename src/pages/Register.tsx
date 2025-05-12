import { useState, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authService from "../services/authService";
import { RegisterForm, ValidationErrors } from "../interface/interface";

function Register() {
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    secondName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "Имя обязательно";
    } else if (form.firstName.length < 2 || form.firstName.length > 50) {
      newErrors.firstName = "Имя должно содержать от 2 до 50 символов";
    }

    if (!form.secondName.trim()) {
      newErrors.secondName = "Фамилия обязательна";
    } else if (form.secondName.length < 2 || form.secondName.length > 50) {
      newErrors.secondName = "Фамилия должна содержать от 2 до 50 символов";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Некорректный email";
    }

    if (!form.password) {
      newErrors.password = "Пароль обязателен";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("/api/v1/auth/register", form);
      const accessToken: string = response.data.access_token;
      const refreshToken: string = response.data.refresh_token;
      authService.saveToken(accessToken);
      authService.saveRefreshToken(refreshToken);
      navigate("/");
    } catch (error) {
      console.error("Ошибка регистрации", error);
      alert("Ошибка регистрации. Попробуйте снова.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Регистрация
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Имя"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Фамилия"
            name="secondName"
            value={form.secondName}
            onChange={handleChange}
            error={!!errors.secondName}
            helperText={errors.secondName}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Пароль"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
            Зарегистрироваться
          </Button>
        </form>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2">
            Уже есть аккаунт?{" "}
            <Link href="/login" underline="hover">
              Войти
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;