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
        console.log(matchData);
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
          flexWrap: "wrap",
          alignItems: "center",
          mt: 2, // Margin-top for spacing between rows
          "& .MuiTextField-root": {
            m: 1,
            width: "30%",
          },
        }}
      >
        {/* Add new components for the new row here */}
        <TextField disabled label="Food Item" defaultValue={matchData.foodItem} />
        <TextField disabled label="Quantity" defaultValue={matchData.quantity} />
        <TextField disabled label="Family Size" defaultValue={matchData.familySize} />
        <TextField disabled label="Can Cook" defaultValue={matchData.canCook ? "Yes" : "No"} />
        <TextField disabled label="Can Reheat" defaultValue={matchData.canReheat ? "Yes" : "No"} />
        <TextField disabled label="Has Fridge" defaultValue={matchData.hasFridge ? "Yes" : "No"} />
        <TextField disabled label="Is Halal" defaultValue={matchData.isHalal ? "Yes" : "No"} />
        <TextField disabled label="Is Perishable" defaultValue={matchData.isPerishable ? "Yes" : "No"} />
        <TextField disabled label="Expiry Date" defaultValue={new Date(matchData.expiryDate.seconds * 1000).toLocaleDateString()} />
        <TextField disabled label="Delivery Address" defaultValue={`Lat: ${matchData.deliveryAddress.lat}, Long: ${matchData.deliveryAddress.long}`} />
        <TextField disabled label="Pick-Up Address" defaultValue={`Lat: ${matchData.pickUpAddress.lat}, Long: ${matchData.pickUpAddress.long}`} />
        <TextField disabled label="Status" defaultValue={matchData.status} />
      </Box>
    </Box>
  );
};

export default MatchDetails;
