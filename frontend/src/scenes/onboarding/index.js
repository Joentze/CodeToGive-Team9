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

const Onboarding = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      userType: "",
      donorName: "",
      recipientName: "",
      contactPerson: "",
      contactNumber: "",
      foodSafetyCert: "",
    },
  });

  const userType = watch("userType");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user);
        setIsLoggedIn(true);
        setUserId(user.uid);
      } else {
        console.log("No user is logged in.");
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    try {
      const collectionName =
        data.userType === "donor" ? "donors" : "recipients";

      // Check if donor/recipient already exists
      let existingDocQuery;
      if (data.userType === "donor") {
        existingDocQuery = query(
          collection(store, collectionName),
          where("foodSafetyCert", "==", data.foodSafetyCert)
        );
      } else {
        existingDocQuery = query(
          collection(store, collectionName),
          where("contactNumber", "==", data.contactNumber)
        );
      }

      const querySnapshot = await getDocs(existingDocQuery);

      if (!querySnapshot.empty) {
        // Document already exists
        setMessage({
          text: `This ${data.userType} has already been onboarded!`,
          type: "error",
        });
        return; // Exit the function early
      }

      const docData =
        data.userType === "donor"
          ? {
              donorId: userId,
              name: data.donorName,
              contactPerson: data.contactPerson,
              contactNumber: data.contactNumber,
              foodSafetyCert: data.foodSafetyCert,
            }
          : {
              recipientId: userId,
              name: data.recipientName,
              contactPerson: data.contactPerson,
              contactNumber: data.contactNumber,
            };

      await addDoc(collection(store, collectionName), docData);
      console.log("Document successfully written!");
      setMessage({ text: "Onboarding successful!", type: "success" });

      setTimeout(() => {
        if (data.userType === "donor") {
          navigate('/form'); // REPLACE WITH DONOR-FORM
        } else if (data.userType === "recipient") {
          navigate('/calendar'); // REPLACE WITH RECIPIENT FORM
        }
      }, 2000);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const renderFormFields = () => {
    if (userType === "donor") {
      return (
        <>
          <Grid item xs={12}>
            <Controller
              name="donorName"
              control={control}
              rules={{ required: "Donor name is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Name of Organization / Donor"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="contactPerson"
              control={control}
              rules={{ required: "Contact person is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Contact Person"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="contactNumber"
              control={control}
              rules={{ required: "Contact number is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Contact Number"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="foodSafetyCert"
              control={control}
              rules={{ required: "Food Safety Certificate is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Food Safety Certificate"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
        </>
      );
    } else if (userType === "recipient") {
      return (
        <>
          <Grid item xs={12}>
            <Controller
              name="recipientName"
              control={control}
              rules={{ required: "Recipient name is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Name of Recipient"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="contactPerson"
              control={control}
              rules={{ required: "Contact person is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Contact Person"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="contactNumber"
              control={control}
              rules={{ required: "Contact number is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Contact Number"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
        </>
      );
    }
  };

  return (
    <Box m="20px">
      <Header title="ONBOARDING" subtitle="Onboard as a Donor or Recipient!" />

      {isLoggedIn ? (
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} justifyContent={"center"}>
              {/* Step 1: User Authentication */}
              <Typography variant="h6" gutterBottom>
                <strong>You're logged in, happy onboarding 😊</strong>
              </Typography>

              {/* Step 2: User Type Selection */}
              <Grid item xs={8} sx={{ mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="user-type-label">Select role</InputLabel>
                  <Controller
                    name="userType"
                    control={control}
                    rules={{ required: "User type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="user-type-label"
                        label="User Type"
                      >
                        <MenuItem value="">
                          <em>Select User Type</em>
                        </MenuItem>
                        <MenuItem value="donor">Donor</MenuItem>
                        <MenuItem value="recipient">Recipient</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Step 3: Conditional Form Rendering */}
              {userType && (
                <Grid container spacing={2}>
                  {renderFormFields()}
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>

              {message.text && (
                <Grid item xs={12}>
                  <Typography
                    color={message.type === "error" ? "error" : "success"}
                    align="center"
                  >
                    {message.text}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </form>
        </Container>
      ) : (
        <Box>
          <Typography variant="h6" color="error" align="center" gutterBottom>
            You must sign in first before starting the onboarding process!
          </Typography>
          <SignIn />
        </Box>
      )}
    </Box>
  );
};

export default Onboarding;
