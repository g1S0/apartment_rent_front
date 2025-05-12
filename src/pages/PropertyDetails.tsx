import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import Slider from "react-slick";
import axios from "axios";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { Property, statusMap, typeMap, propertyDealTypeMap } from "../interface/interface";

function PropertyDetails() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    axios
      .get(`/api/v1/property/${id}`)
      .then((res) => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Объект не найден");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !property) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">{error}</Typography>
      </Container>
    );
  }

  const translatedStatus = statusMap[property.status] || property.status;
  const translatedType = typeMap[property.type] || property.type;
  const translatedDealType =
    propertyDealTypeMap[property.propertyDealType] || property.propertyDealType;

  const formattedPrice = new Intl.NumberFormat("ru-RU").format(property.price);

  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(property.createdAt));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Slider {...settings}>
          {property.images?.map((img, index) => (
            <div key={index}>
              <img
                src={img.imageUrl || "https://placehold.co/800x600"}
                alt={`Property image ${index + 1}`}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: "12px",
                }}
              />
            </div>
          ))}
        </Slider>

        <Card sx={{ borderRadius: 3, boxShadow: 4, mt: 4 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {property.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {property.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Container sx={{ mt: 4 }}>
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ flex: "1 1 calc(50% - 16px)" }}>
                  <Typography variant="subtitle1">
                    <strong>Город:</strong> {property.city}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Цена:</strong> {formattedPrice} ₽
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Статус:</strong> {translatedStatus}
                  </Typography>
                </div>
                <div style={{ flex: "1 1 calc(50% - 16px)" }}>
                  <Typography variant="subtitle1">
                    <strong>Тип:</strong> {translatedType}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Сделка:</strong> {translatedDealType}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Дата размещения:</strong> {formattedDate}
                  </Typography>
                </div>
              </div>
            </Container>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PropertyDetails;