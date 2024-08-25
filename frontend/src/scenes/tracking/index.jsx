import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { getMatchById, getMatchData } from "../../firebase/match.js";
import { useState, useEffect } from "react";
import LinearStepper from "../../components/LinearStepper";
import MatchDetails from "../../components/MatchDetails";

const Tracking = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    
    const fetchData = async () => {
        try {
          const res = await getMatchById('032ZV4BO9gBrpseyCHPK');
          setMatch(res);

        } catch (err) {
          console.error(err)
        }
      };

    fetchData();

  }, []);

  console.log(match);

  return (
    <Box m="20px">
      <Header title={`Match ID: ${match?.id || 'Loading...'}`} subtitle="Track Food Match" />
      
      <Box
        m="40px 0 0 0"
        height="75vh"
      >
        <LinearStepper />

        {match &&
        <MatchDetails matchData={match.data}/>
        }
       
      </Box>
      
    </Box>
  );
};

export default Tracking;
