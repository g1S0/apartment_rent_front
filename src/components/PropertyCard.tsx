import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Property, statusMap, typeMap, propertyDealTypeMap } from "../interface/interface";

function PropertyCard({ property }: {property: Property}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

  const translatedType = typeMap[property.type] || property.type;
  const translatedDealType = propertyDealTypeMap[property.propertyDealType] || property.propertyDealType;
  const translatedStatus = statusMap[property.status] || property.status;

  return (
    <Card sx={{ maxWidth: 345, cursor: "pointer" }} onClick={handleClick}>
      <CardMedia
        component="img"
        height="180"
        image={property.images?.[0]?.imageUrl || "https://placehold.co/400"}
        alt={property.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
          {property.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {property.description?.slice(0, 100)}...
        </Typography>
        <Box mt={1}>
          <Typography variant="subtitle2">Город: {property.city}</Typography>
          <Typography variant="subtitle2">
            Цена: {new Intl.NumberFormat("ru-RU").format(property.price)} ₽
          </Typography>
          <Typography variant="subtitle2">Тип: {translatedType}</Typography>
          <Typography variant="subtitle2">Сделка: {translatedDealType}</Typography>
          <Typography variant="subtitle2">Статус: {translatedStatus}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default PropertyCard;