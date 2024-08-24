import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { auth, store, collection, addDoc, onAuthStateChanged } from "../firebase/base";

import Button from "@mui/material/Button";
import {
  Container,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Grid,
} from "@mui/material";

const Onboarding = () => {
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Listen to authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set user UID if logged in
      } else {
        setUserId(null); // Clear user UID if not logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    // Send data to Firebase here
    try {
      // Determine which collection to use based on userType
      const collectionName = userType === "donor" ? "donors" : "recipients";

      // Prepare data for submission
      const docData =
        userType === "donor"
          ? {
              donorId: userId, // firebase auth UID
              name: data.donorName,
              contactPerson: data.contactPerson,
              contactNumber: parseInt(data.contactNumber),
              location: [0, 0], // Replace with actual geolocation
            }
          : {
              recipientId: userId, // firebase auth UID
              name: data.recipientName,
              contactPerson: data.contactPerson,
              contactNumber: parseInt(data.contactNumber),
            };

      // Add document to Firestore
      await addDoc(collection(store, collectionName), docData);

      console.log("Document successfully written!");
      // Optionally redirect or show a success message
    } catch (error) {
      console.error("Error adding document: ", error);
      // Optionally show an error message
    }
  };

  const renderFormFields = () => {
    if (userType === "donor") {
      return (
        <>
          <Grid item xs={12}>
            <TextField
              label="Name of Organization / Donor"
              fullWidth
              {...register("donorName", { required: true })}
              error={!!errors.donorName}
              helperText={errors.donorName ? "This field is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact Person"
              fullWidth
              {...register("contactPerson", { required: true })}
              error={!!errors.contactPerson}
              helperText={errors.contactPerson ? "This field is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact Number"
              fullWidth
              {...register("contactNumber", { required: true })}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber ? "This field is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload Food Safety Certification
              <input type="file" hidden {...register("foodSafetyCert")} />
            </Button>
          </Grid>
        </>
      );
    } else if (userType === "recipient") {
      return (
        <>
          <Grid item xs={12}>
            <TextField
              label="Name of Recipient"
              fullWidth
              {...register("recipientName", { required: true })}
              error={!!errors.recipientName}
              helperText={errors.recipientName ? "This field is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact Person"
              fullWidth
              {...register("contactPerson", { required: true })}
              error={!!errors.contactPerson}
              helperText={errors.contactPerson ? "This field is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact Number"
              fullWidth
              {...register("contactNumber", { required: true })}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber ? "This field is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dietary Restrictions"
              fullWidth
              {...register("dietaryRestrictions")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Food Type" fullWidth {...register("foodType")} />
          </Grid>
        </>
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ mt: 4 }}>
        <Typography color="black" variant="h4" gutterBottom>
          Join us in our mission to reduce food waste!
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Step 2: User Type Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="user-type-label">Select role</InputLabel>
                <Select
                  labelId="user-type-label"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  label="User Type"
                >
                  <MenuItem value="">
                    <em>Select User Type</em>
                  </MenuItem>
                  <MenuItem value="donor">Donor</MenuItem>
                  <MenuItem value="recipient">Recipient</MenuItem>
                </Select>
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
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Onboarding;
