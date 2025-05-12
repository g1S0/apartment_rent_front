import { useState, ChangeEvent, FormEvent } from "react";
import {
  Container,
  TextField,
  Typography,
  MenuItem,
  Button,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Header from "../components/Header";
import authService from "../services/authService"; 
import { FormState } from "../interface/interface";

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE_MB = 5;

const propertyTypes = ["ДОМ", "КВАРТИРА", "КОТТЕДЖ", "ВИЛЛА"];
const dealTypes = ["АРЕНДА", "ПРОДАЖА"];
const statuses = ["ДОСТУПНО", "ЗАБРОНИРОВАНО", "ПРОДАНО", "В ПРОЦЕССЕ"];

const TYPE_MAP: Record<string, string> = {
  "ДОМ": "HOUSE",
  "КВАРТИРА": "APARTMENT",
  "КОТТЕДЖ": "CONDO",
  "ВИЛЛА": "VILLA",
};

const DEAL_TYPE_MAP: Record<string, string> = {
  "АРЕНДА": "RENT",
  "ПРОДАЖА": "SALE",
};

const STATUS_MAP: Record<string, string> = {
  "ДОСТУПНО": "AVAILABLE",
  "ЗАБРОНИРОВАНО": "BOOKED",
  "ПРОДАНО": "SOLD",
  "В ПРОЦЕССЕ": "IN_PROCESS",
};

function AddProperty() {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    type: "",
    propertyDealType: "",
    price: "",
    city: "",
    status: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Введите название";
    if (form.description.length < 100) newErrors.description = "Описание должно содержать минимум 100 символов";
    if (form.description.length > 2000) newErrors.description = "Описание не может быть больше 2000 символов";
    if (!form.type) newErrors.type = "Выберите тип";
    if (!form.propertyDealType) newErrors.propertyDealType = "Выберите сделку";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0 || Number(form.price) > 1e9)
      newErrors.price = "Введите корректную цену (до 1 млрд)";
    if (!form.city.trim()) newErrors.city = "Введите город";
    if (!form.status) newErrors.status = "Выберите статус";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const validFiles: File[] = [];

    for (let file of files) {
      if (!["image/jpeg", "image/jpg"].includes(file.type)) {
        setImageError("Разрешены только JPG или JPEG изображения");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setImageError("Каждое изображение должно быть не больше 5 МБ");
        return;
      }
      validFiles.push(file);
    }

    if (images.length + validFiles.length > MAX_IMAGES) {
      setImageError("Максимум 3 изображения");
      return;
    }

    setImageError("");
    setImages([...images, ...validFiles]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = authService.getToken();
      if (!token) {
        setSubmitError("Пользователь не авторизован. Пожалуйста, войдите.");
        return;
      }
      const decoded: any = jwtDecode(token);
      const userId = decoded.user_id;

      const propertyDto = {
        title: form.title,
        description: form.description,
        type: TYPE_MAP[form.type],
        price: Number(form.price),
        city: form.city,
        status: STATUS_MAP[form.status],
        propertyDealType: DEAL_TYPE_MAP[form.propertyDealType],
      };

      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(propertyDto)], { type: "application/json" }));

      images.forEach((img) => {
        formData.append("image", img);
      });

      const response = await axios.post("/api/v1/property", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "X-User-Id": userId,
        },
      });

      setSuccessMessage("Объект успешно добавлен!");
      setSubmitError("");
      console.log("Ответ от сервера:", response.data);

      setForm({
        title: "",
        description: "",
        type: "",
        propertyDealType: "",
        price: "",
        city: "",
        status: "",
      });
      setImages([]);
    } catch (error) {
      console.error("Ошибка при добавлении объекта:", error);
      setSubmitError("Не удалось добавить объект. Попробуйте позже.");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Добавить объект недвижимости
        </Typography>

        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <TextField
              label="Название"
              fullWidth
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              variant="outlined"
            />
            <TextField
              label="Описание"
              name="description"
              fullWidth
              multiline
              rows={4}
              value={form.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              variant="outlined"
            />
            <TextField
              select
              label="Тип недвижимости"
              name="type"
              fullWidth
              value={form.type}
              onChange={handleChange}
              error={!!errors.type}
              helperText={errors.type}
              variant="outlined"
            >
              {propertyTypes.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Тип сделки"
              name="propertyDealType"
              fullWidth
              value={form.propertyDealType}
              onChange={handleChange}
              error={!!errors.propertyDealType}
              helperText={errors.propertyDealType}
              variant="outlined"
            >
              {dealTypes.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Цена"
              name="price"
              fullWidth
              type="number"
              value={form.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              variant="outlined"
            />
            <TextField
              label="Город"
              name="city"
              fullWidth
              value={form.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
              variant="outlined"
            />
            <TextField
              select
              label="Статус недвижимости"
              name="status"
              fullWidth
              value={form.status}
              onChange={handleChange}
              error={!!errors.status}
              helperText={errors.status}
              variant="outlined"
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="outlined"
              component="label"
              sx={{ mb: 2, width: "100%" }}
            >
              Загрузить изображения (макс. 3)
              <input
                hidden
                accept=".jpg,.jpeg"
                type="file"
                multiple
                onChange={handleImageUpload}
              />
            </Button>
            {imageError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {imageError}
              </Alert>
            )}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
                  width={100}
                  height={100}
                  style={{ borderRadius: 8 }}
                />
              ))}
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Добавить объект
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default AddProperty;