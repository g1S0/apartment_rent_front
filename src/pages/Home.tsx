import { useEffect, useState, ChangeEvent } from "react";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Button,
  Pagination,
  CircularProgress,
} from "@mui/material";
import PropertyCard from "../components/PropertyCard";
import Header from "../components/Header";
import axios from "axios";
import { Filters, Property } from "../interface/interface";

const mapStatusToEnum = (status: string): string => {
  switch (status) {
    case "Доступно":
      return "AVAILABLE";
    case "Забронировано":
      return "BOOKED";
    case "Продано":
      return "SOLD";
    case "В процессе":
      return "IN_PROCESS";
    default:
      return "";
  }
};

function Home() {
  const [filters, setFilters] = useState<Filters>({
    status: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    keyword: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<Filters>(filters);
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/property/search", {
        params: {
          page: page - 1,
          size: 9,
          ...appliedFilters,
          status: mapStatusToEnum(appliedFilters.status),
        },
      });

      setProperties(response.data.content || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Ошибка загрузки недвижимости:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [appliedFilters, page]);


  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    setPage(1); 
    setAppliedFilters(filters);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <Header />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Недвижимость
        </Typography>

        <TextField
          label="Поиск"
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              name="status"
              value={filters.status}
              onChange={handleChange}
              label="Статус"
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="Доступно">Доступно</MenuItem>
              <MenuItem value="Забронировано">Забронировано</MenuItem>
              <MenuItem value="Продано">Продано</MenuItem>
              <MenuItem value="В процессе">В процессе</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Город"
            name="city"
            value={filters.city}
            onChange={handleChange}
          />
          <TextField
            label="Мин. цена"
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            inputProps={{ min: 0 }} 
          />
          <TextField
            label="Макс. цена"
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Button variant="contained" color="primary" onClick={handleApplyFilters}>
            Применить фильтры
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : properties.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Недвижимость не найдена
          </Typography>
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {properties.map((property) => (
                <div
                  key={property.id}
                  style={{
                    flex: '1 1 calc(33.333% - 16px)',
                    boxSizing: 'border-box',
                  }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default Home;