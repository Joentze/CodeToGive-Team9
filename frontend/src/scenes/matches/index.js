import Header from "../../components/Header";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { findOptimalAssignments } from "../../helpers/matching";
import { tokens } from "../../theme";

const Matching = () => {
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [recipientId, setRecipientId] = useState(null);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "id", headerName: "ID", renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> },
        { field: "donorId", headerName: "Donor ID", renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> },
        { field: "recipientId", headerName: "Recipient ID", renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> },
        { field: "foodItem", headerName: "Food Item", renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> },
        { field: "quantity", headerName: "Quantity", renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> },
        { field: "expiryDate", headerName: "Expiry Date", valueGetter: (params) => new Date(params.row.expiryDate.seconds * 1000).toLocaleDateString(), renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> },
        { field: "dietaryRestrictions", headerName: "Dietary Restrictions", valueGetter: (params) => params.row.dietaryRestrictions.join(", "), renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> },
        { field: "isPerishable", headerName: "Is Perishable", renderCell: (params) => <Tooltip title={params.value ? "true" : "false"}><span>{params.value ? "true" : "false"}</span></Tooltip> },
        { field: "pickUpAddress", headerName: "Pick Up Address", valueGetter: (params) => `Lat: ${params.row.pickUpAddress.lat}, Long: ${params.row.pickUpAddress.long}`, renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> },
        { field: "familySize", headerName: "Family Size", renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> },
        { field: "canCook", headerName: "Can Cook", renderCell: (params) => <Tooltip title={params.value ? "true" : "false"}><span>{params.value ? "true" : "false"}</span></Tooltip> },
        { field: "canReheat", headerName: "Can Reheat", renderCell: (params) => <Tooltip title={params.value ? "true" : "false"}><span>{params.value ? "true" : "false"}</span></Tooltip> },
        { field: "hasFridge", headerName: "Has Fridge", renderCell: (params) => <Tooltip title={params.value ? "true" : "false"}><span>{params.value ? "true" : "false"}</span></Tooltip> },
        { field: "deliveryAddress", headerName: "Delivery Address", valueGetter: (params) => `Lat: ${params.row.deliveryAddress.latitude}, Long: ${params.row.deliveryAddress.longitude}`, renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> },
        { field: "status", headerName: "Status", renderCell: (params) => <Tooltip title={params.value}><span>{params.value}</span></Tooltip> }
    ];

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const result = await findOptimalAssignments();
                if (result) {
                    const matchesWithId = result.map(match => ({ ...match, id: uuidv4() }));
                    setMatches(matchesWithId);
                } else {
                    setMatches([
                        { id: uuidv4(), donorId: "D9Lf0nXxzLSfNfgNQKzO", foodItem: "Pasta", quantity: 97, expiryDate: { seconds: 1727567888, nanoseconds: 33000000 }, dietaryRestrictions: [""], isPerishable: false, pickUpAddress: { long: 103.8636, lat: 1.2816 }, recipientId: "9APam99vnRJKcU7dFzra", familySize: 7, canCook: false, canReheat: false, hasFridge: true, deliveryAddress: { longitude: 103.8303209, latitude: 1.2494041 }, status: "Match Successful" }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };

        fetchMatches();
    }, []);

    return (
        <Box m="20px">
            <Header title="Matches" subtitle="Matches of all Donors and recipients." />
            <Box
                m="40px 0 0 0"
                height="75vh"
            >
                <DataGrid rows={matches} columns={columns} />
            </Box>
        </Box>
    );
};

export default Matching;