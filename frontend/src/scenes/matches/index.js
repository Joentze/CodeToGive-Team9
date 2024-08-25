import React, { useState, useEffect } from "react";
import { auth, store, collection, query, where, getDocs } from "../../firebase/base";
import { findOptimalAssignments } from "../../helpers/matching";
import FoodSource from "../../components/FoodSource";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

const Matching = () => {


    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [recipientId, setRecipientId] = useState(null);


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "donorId", headerName: "Donor ID" },
        { field: "foodItem", headerName: "Food Item" },
        { field: "quantity", headerName: "Quantity" },
        { field: "expiryDate", headerName: "Expiry Date" },
        { field: "isHalal", headerName: "Is Halal" },
        { field: "isPerishable", headerName: "Is Perishable" },
        { field: "pickUpAddress", headerName: "Pick Up Address" },
        { field: "recipientId", headerName: "Recipient ID" },
        { field: "familySize", headerName: "Family Size" },
        { field: "canCook", headerName: "Can Cook" },
        { field: "canReheat", headerName: "Can Reheat" },
        { field: "hasFridge", headerName: "Has Fridge" },
        { field: "deliveryAddress", headerName: "Delivery Address" },
        { field: "status", headerName: "Status" }
    ];
    const matches = findOptimalAssignments();

    useEffect(() => {
        // const matches = findOptimalAssignments();

        // const fetchUserData = async () => {
        //     const currentUser = auth.currentUser;
        //     if (currentUser) {
        //         const uid = currentUser.uid;
        //         console.log(uid);
        //         const q = query(
        //             collection(store, "recipients"),
        //             where("recipientId", "==", uid)
        //         );
        //         const querySnapshot = await getDocs(q);

        //         if (!querySnapshot.empty) {
        //             const userDoc = querySnapshot.docs[0];
        //             const fetchedRecipientId = userDoc.id;
        //             setRecipientId(fetchedRecipientId);
        //         } else {
        //             console.log("No such document!");
        //         }
        //     }
        // };
        // fetchUserData();
    }, []);

   
    

    return (
        <Box m="20px">
            <Header title="Matches" subtitle="Matches of all Donors and recipients." />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid checkboxSelection rows={matches} columns={columns} />
            </Box>
        </Box>
    );
};

export default Matching
