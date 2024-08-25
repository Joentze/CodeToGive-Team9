import { Box, IconButton, useTheme } from "@mui/material";
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
import { auth, store} from "../../firebase/base";
import { collection, where, query, getDocs } from "firebase/firestore";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const uid = currentUser.uid;

        // Query Firestore for the user's type
        const recipientQuery = query(collection(store, 'recipients'), where('recipientId', '==', uid));
        const recipientSnapshot = await getDocs(recipientQuery);

        if (!recipientSnapshot.empty) {
          setUserType("recipient");
        } else {
          const donorQuery = query(
            collection(store, 'donors'),
            where('donorId', '==', currentUser.uid)
          );
          const donorSnapshot = await getDocs(donorQuery);

          if (!donorSnapshot.empty) {
            setUserType("donor");
          }
        }
      }
    };

    fetchUserType();
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
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        {/* Conditional Routing Based on User Type */}
        <IconButton
          component={Link}
          to={userType === "donor" ? "/donorprofile" : "/profile"}
          title="Profile"
        >
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
