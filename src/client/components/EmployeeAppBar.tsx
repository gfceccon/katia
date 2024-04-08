import { Employee } from "../../core/Employee";
import { redirect, useNavigate } from "react-router-dom";
import {
  AppBar,
  Container,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import AdminMenuItem from "./AdminMenuItem";

export interface LayoutProps {
  employees: Employee[];
}

const EmployeeAppBar = (props: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderRadius: "999px",
            bgcolor:
              theme.palette.mode === "light"
                ? "rgba(255, 255, 255, 0.4)"
                : "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(24px)",
            maxHeight: 40,
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              theme.palette.mode === "light"
                ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
          })}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              px: 0,
            }}
          >
            <MenuItem onClick={() => navigate("/")}>
              <HomeIcon color={"primary"}></HomeIcon>
            </MenuItem>
            {props.employees?.map((e) => (
              <MenuItem
                sx={{ py: "6px", px: "12px" }}
                onClick={() => navigate(`/employee/${e.id}`)}
                key={e.id}
              >
                <Typography variant="body2" color="text.primary">
                  {e.name}
                </Typography>
              </MenuItem>
            ))}
            <Box sx={{flex: 1}}></Box>
            <AdminMenuItem></AdminMenuItem>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default EmployeeAppBar;
