import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import axios from "axios";
import { UserData, Passwords, ShowPasswords, Errors } from "../interface/interface";

function Profile() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    secondName: "",
    email: "",
  });

  const [passwords, setPasswords] = useState<Passwords>({
    currentPassword: "",
    newPassword: "",
    confirmationPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = (field: keyof ShowPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswords = (): boolean => {
    const newErrors: Errors = {};

    if (!passwords.currentPassword) {
      newErrors.currentPassword = "Введите текущий пароль";
    }

    if (!passwordRegex.test(passwords.newPassword)) {
      newErrors.newPassword =
        "Пароль должен быть не менее 8 символов, содержать заглавную букву, цифру и спецсимвол";
    }

    if (passwords.newPassword !== passwords.confirmationPassword) {
      newErrors.confirmationPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseJwt = (token: string): { user_id: string } | null => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const token = authService.getToken();
  const payload = token ? parseJwt(token) : null;
  const userId = payload?.user_id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/v1/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({
          firstName: res.data.firstName,
          secondName: res.data.secondName,
          email: res.data.email,
        });
      } catch (e) {
        console.error("Ошибка загрузки данных пользователя:", e);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;

    try {
      await axios.put(
        "/api/v1/users",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmationPassword: passwords.confirmationPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Пароль успешно изменен");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmationPassword: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
      alert("Не удалось изменить пароль. Проверьте данные и попробуйте снова.");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`/api/v1/auth/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Данные успешно обновлены");
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      alert("Не удалось обновить данные");
    }
  };

  const handleDeleteAccount = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete("/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Ваш аккаунт был удален.");
      authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
      alert("Произошла ошибка при удалении аккаунта.");
    }
    setShowConfirmDelete(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4, pb: 6 }}>
        <Typography variant="h6" gutterBottom>
          Личные данные
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Имя"
          value={userData.firstName}
          onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Фамилия"
          value={userData.secondName}
          onChange={(e) => setUserData({ ...userData, secondName: e.target.value })}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />

        <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpdateProfile}>
          Сохранить изменения
        </Button>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Смена пароля
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Текущий пароль"
          name="currentPassword"
          type={showPasswords.current ? "text" : "password"}
          value={passwords.currentPassword}
          onChange={handlePasswordChange}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleTogglePassword("current")} edge="end">
                  {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Новый пароль"
          name="newPassword"
          type={showPasswords.new ? "text" : "password"}
          value={passwords.newPassword}
          onChange={handlePasswordChange}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleTogglePassword("new")} edge="end">
                  {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Подтверждение пароля"
          name="confirmationPassword"
          type={showPasswords.confirm ? "text" : "password"}
          value={passwords.confirmationPassword}
          onChange={handlePasswordChange}
          error={!!errors.confirmationPassword}
          helperText={errors.confirmationPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleTogglePassword("confirm")} edge="end">
                  {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="secondary"
          onClick={handleChangePassword}
          sx={{ mt: 2 }}
        >
          Сменить пароль
        </Button>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
            Удалить аккаунт
          </Button>
          <Button variant="outlined" color="primary" onClick={handleLogout}>
            Выйти из аккаунта
          </Button>
        </Box>

        <Dialog open={showConfirmDelete} onClose={() => setShowConfirmDelete(false)}>
          <DialogTitle>Подтвердите удаление</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить аккаунт? Это действие необратимо.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDelete(false)}>Отмена</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default Profile;