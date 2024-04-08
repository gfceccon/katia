import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  Menu,
  MenuItem,
  MenuPaper,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

interface AdminMenuItemProps {}

const AdminMenuItem = (props: AdminMenuItemProps) => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <MenuItem>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <Button onClick={handleOpenUserMenu}>
            <MenuIcon color="primary" />
          </Button>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={() => navigate("/employee")}>
            <Typography>Funcionários</Typography>
          </MenuItem>
          <MenuItem onClick={() => navigate("/service")}>
            <Typography>Serviços</Typography>
          </MenuItem>
          <MenuItem onClick={() => navigate("/client")}>
            <Typography>Clientes</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </MenuItem>
  );
};

export default AdminMenuItem;
