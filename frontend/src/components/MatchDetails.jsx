import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { getDonorById } from "../helpers/donorHelpers.js";
import { getRecipientById } from "../helpers/recipientHelpers.js";
import { useState, useEffect } from "react";

const MatchDetails = ({ matchData }) => {
  let [donor, setDonor] = useState(null);
  let [recipient, setRecipient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(matchData.donorId, matchData.recipientId);
        donor = await getDonorById(matchData.donorId);
        recipient = await getRecipientById(matchData.recipientId);
        setDonor(donor);
        setRecipient(recipient);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  console.log(donor, recipient);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          "& .MuiTextField-root": {
            m: 1,
            width: "100%", // Adjust width to fit available space
          },
        }}
      >
        {donor && recipient && (
          <TextField disabled label="Donor Name" defaultValue={donor.name} />
        )}
        {donor && recipient && (
          <TextField
            disabled
            label="Recipient Name"
            defaultValue={recipient.name}
          />
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mt: 2, // Margin-top for spacing between rows
          "& .MuiTextField-root": {
            m: 1,
            width: "100%",
          },
        }}
      >
        {/* Add new components for the new row here */}
        <TextField disabled label="New Field 1" defaultValue="Value 1" />
        <TextField disabled label="New Field 2" defaultValue="Value 2" />
      </Box>
    </Box>
  );
};

export default MatchDetails;
