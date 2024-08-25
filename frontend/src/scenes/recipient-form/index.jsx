import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

// Import Firestore functions
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { store } from "../../firebase/base"; // Import your initialized Firestore database

const RecipientForm = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customDietaryRestrictions, setCustomDietaryRestrictions] =
    useState("");
  const [customFoodType, setCustomFoodType] = useState("");

  const getCoordinatesFromAddress = async (address) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      throw new Error("Unable to get coordinates from address");
    }
  };

  // Function to handle form submission
  const handleFormSubmit = async (values) => {
    setLoading(true);
    setError("");

    try {
      const { latitude, longitude } = await getCoordinatesFromAddress(
        values.address
      );

      await addDoc(collection(store, "foodRequests"), {
        dateOfRequest: values.dateOfRequest,
        familySize: values.familySize,
        canCook: values.canCook,
        canReheat: values.canReheat,
        hasFridge: values.hasFridge,
        location: {
          latitude,
          longitude,
        },
        dietaryRestrictions: values.dietaryRestrictions
          .split(",")
          .map((item) => item.trim()),
        foodType: values.foodType.split(",").map((item) => item.trim()),
      });

      alert("Request created successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Error creating request!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Recipient Page" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
                fullWidth
                variant="filled"
                type="datetime-local"
                label="Date of Request"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dateOfRequest}
                name="dateOfRequest"
                error={!!touched.dateOfRequest && !!errors.dateOfRequest}
                helperText={touched.dateOfRequest && errors.dateOfRequest}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Family Size"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.familySize}
                name="familySize"
                error={!!touched.familySize && !!errors.familySize}
                helperText={touched.familySize && errors.familySize}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.canCook}
                    onChange={handleChange}
                    name="canCook"
                    color={isDarkMode ? "default" : "primary"}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: isDarkMode ? "white" : "default",
                      },
                    }}
                  />
                }
                label="Can Cook"
                sx={{
                  gridColumn: "span 1",
                  color: isDarkMode ? "white" : "black",
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.canReheat}
                    onChange={handleChange}
                    name="canReheat"
                    color={isDarkMode ? "default" : "primary"}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: isDarkMode ? "white" : "default",
                      },
                    }}
                  />
                }
                label="Can Reheat"
                sx={{
                  gridColumn: "span 1",
                  color: isDarkMode ? "white" : "black",
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.hasFridge}
                    onChange={handleChange}
                    name="hasFridge"
                    color={isDarkMode ? "default" : "primary"}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: isDarkMode ? "white" : "default",
                      },
                    }}
                  />
                }
                label="Has Fridge"
                sx={{
                  gridColumn: "span 1",
                  color: isDarkMode ? "white" : "black",
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 4" }}
              >
                <InputLabel id="dietaryRestrictions-label">
                  Dietary Restrictions
                </InputLabel>
                <Select
                  labelId="dietaryRestrictions-label"
                  value={values.dietaryRestrictions}
                  name="dietaryRestrictions"
                  onChange={(e) => {
                    const { value } = e.target;
                    handleChange(e);
                    if (value === "others") {
                      setCustomDietaryRestrictions(""); // Clear custom input when selecting "Others"
                    }
                  }}
                  onBlur={handleBlur}
                  error={
                    !!touched.dietaryRestrictions &&
                    !!errors.dietaryRestrictions
                  }
                  label="Dietary Restrictions"
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="gluten-free">Gluten Free</MenuItem>
                  <MenuItem value="nut-free">Nut Free</MenuItem>
                  <MenuItem value="dairy-free">Dairy Free</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
                {values.dietaryRestrictions === "others" && (
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Specify Dietary Restrictions (comma-separated)"
                    value={customDietaryRestrictions}
                    onChange={(e) =>
                      setCustomDietaryRestrictions(e.target.value)
                    }
                    sx={{ mt: "10px" }}
                  />
                )}
              </FormControl>
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 4" }}
              >
                <InputLabel id="foodType-label">Food Type</InputLabel>
                <Select
                  labelId="foodType-label"
                  value={values.foodType}
                  name="foodType"
                  onChange={(e) => {
                    const { value } = e.target;
                    handleChange(e);
                    if (value === "others") {
                      setCustomFoodType(""); // Clear custom input when selecting "Others"
                    }
                  }}
                  onBlur={handleBlur}
                  error={!!touched.foodType && !!errors.foodType}
                  label="Food Type"
                >
                  <MenuItem value="vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="fruits">Fruits</MenuItem>
                  <MenuItem value="halal">Halal</MenuItem>
                  <MenuItem value="seafood">Seafood</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
                {values.foodType === "others" && (
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Specify Food Type (comma-separated)"
                    value={customFoodType}
                    onChange={(e) => setCustomFoodType(e.target.value)}
                    sx={{ mt: "10px" }}
                  />
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Request
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// After onboarding

// Function to fetch recipient id
const fetchRecipientId = async (email) => {
  try {
    const q = query(
      collection(store, "recipients"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const recipientData = querySnapshot.docs[0].data();
      const recipientId = querySnapshot.docs[0].id; // Fetching the document id
      console.log("Recipient ID:", recipientId);
      return recipientId;
    } else {
      console.log("No matching recipient found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching recipient:", error);
  }
};

// Define the validation schema
const checkoutSchema = yup.object().shape({
  dateOfRequest: yup.date().required("required"),
  familySize: yup.number().required("required"),
  canCook: yup.boolean().required("required"),
  canReheat: yup.boolean().required("required"),
  hasFridge: yup.boolean().required("required"),
  address: yup.string().required("required"),
  dietaryRestrictions: yup.string().required("required"),
  foodType: yup.string().required("required"),
});

// Define the initial form values
const initialValues = {
  dateOfRequest: "",
  familySize: 0,
  canCook: false,
  canReheat: false,
  hasFridge: false,
  address: "",
  dietaryRestrictions: "",
  foodType: "",
};

export default RecipientForm;
