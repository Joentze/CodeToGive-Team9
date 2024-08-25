import { Box, IconButton, useTheme, Badge } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { auth, store } from "../../firebase/base";
import { collection, where, query, onSnapshot } from "firebase/firestore";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [userType, setUserType] = useState(null);
  const [hasNewMatches, setHasNewMatches] = useState(false);

  useEffect(() => {
    const unsubscribe = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const recipientId = currentUser.uid;
        const q = query(
          collection(store, 'matches'),
          where('recipientId', '==', recipientId),
          where('status', '==', 'Match Successful')
        );

        // Real-time listener for the matches collection
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          setHasNewMatches(!snapshot.empty);
        });

        return unsubscribeSnapshot;
      }
    };

    // Set up real-time listener
    const unsubscribeListener = unsubscribe();

    // Clean up the listener on component unmount
    return () => {
      if (unsubscribeListener) {
        unsubscribeListener();
      }
    };
  }, []);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton
          component={Link}
          to={"/notifications"}
          title="Notifications"
        >
          <Badge
            badgeContent="!" // This ensures the indicator is always shown
            color="error"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton
          component={Link}
          to={"/donorprofile"}
          title="Profile"
        >
          <SettingsOutlinedIcon />
        </IconButton>

        <IconButton
          component={Link}
          to={"/profile"}
          title="Profile"
        >
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
