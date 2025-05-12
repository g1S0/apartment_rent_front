import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Недвижимость
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate("/add")}>
            Добавить недвижимость
          </Button>
          <Button color="inherit" onClick={() => navigate("/profile")}>
            Личный кабинет
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;