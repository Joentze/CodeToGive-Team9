import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import {
    Box,
    Button,
    TextField,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Container,
} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import SignIn from "../../pages/signIn";

import {
    auth,
    store,
    addDoc,
    collection,
    onAuthStateChanged,
    query,
    where,
    getDocs,
} from "../../firebase/base";

import { findOptimalAssignments } from "../../helpers/matching";
import FoodSource from "../../components/FoodSource";

const Matching = () => {


    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const [recipientId, setRecipientId] = useState(null);



    useEffect(() => {
        findOptimalAssignments();

        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const uid = currentUser.uid;
                console.log(uid);
                const q = query(
                    collection(store, "recipients"),
                    where("recipientId", "==", uid)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const fetchedRecipientId = userDoc.id;
                    setRecipientId(fetchedRecipientId);
                } else {
                    console.log("No such document!");
                }
            }
        };

        fetchUserData();
    }, []);

   
    

    return (
        <Box m="20px">
            <Header title="Matching" subtitle="Here, you can get matches for food." />
            <Container>
                <Grid container spacing={2}>
                    <FoodSource />
                </Grid>
            </Container>     
        </Box>
    );
};

export default Matching
