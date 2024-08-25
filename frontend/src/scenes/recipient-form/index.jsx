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
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";


// Import Firestore functions
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { store, auth } from "../../firebase/base"; // Import your initialized Firestore database

const RecipientForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customDietaryRestrictions, setCustomDietaryRestrictions] =
    useState("");
  const [customFoodType, setCustomFoodType] = useState("");
  const [recipientId, setRecipientId] = useState(null);
  useEffect(() => {
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
        recipientId,
        dateOfRequest: values.dateOfRequest,
        familySize: values.familySize,
        canCook: values.canCook,
        canReheat: values.canReheat,
        hasFridge: values.hasFridge,
        location: {
          latitude,
          longitude,
        },
        dietaryRestrictions: [
          ...values.dietaryRestrictions,
          ...customDietaryRestrictions.split(",").map((item) => item.trim()),
        ].filter(Boolean),
        foodType: [
          ...values.foodType,
          ...customFoodType.split(",").map((item) => item.trim()),
        ].filter(Boolean),
        isMatched: false
      });

      alert("Request created successfully!");
      navigate("/matching"); // Redirect to /matching
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
                  multiple
                  value={values.dietaryRestrictions}
                  name="dietaryRestrictions"
                  onChange={(e) => {
                    const { value } = e.target;
                    handleChange(e);
                    if (value.includes("others")) {
                      setCustomDietaryRestrictions(""); // Clear custom input when selecting "Others"
                    }
                  }}
                  onBlur={handleBlur}
                  error={
                    !!touched.dietaryRestrictions &&
                    !!errors.dietaryRestrictions
                  }
                  renderValue={(selected) =>
                    Array.isArray(selected) ? selected.join(", ") : ""
                  }
                  label="Dietary Restrictions"
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="gluten-free">Gluten Free</MenuItem>
                  <MenuItem value="nut-free">Nut Free</MenuItem>
                  <MenuItem value="dairy-free">Dairy Free</MenuItem>
                  <MenuItem value="halal">Halal</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
                {values.dietaryRestrictions.includes("others") && (
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
                  multiple
                  value={values.foodType}
                  name="foodType"
                  onChange={(e) => {
                    const { value } = e.target;
                    handleChange(e);
                    if (value.includes("others")) {
                      setCustomFoodType(""); // Clear custom input when selecting "Others"
                    }
                  }}
                  onBlur={handleBlur}
                  error={!!touched.foodType && !!errors.foodType}
                  renderValue={(selected) =>
                    Array.isArray(selected) ? selected.join(", ") : ""
                  }
                  label="Food Type"
                >
                  <MenuItem value="vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="fruits">Fruits</MenuItem>
                  <MenuItem value="seafood">Seafood</MenuItem>
                  <MenuItem value="rice">Rice</MenuItem>
                  <MenuItem value="noodle">Noodle</MenuItem>
                  <MenuItem value="meat">Meat</MenuItem>
                  <MenuItem value="dessert">Dessert</MenuItem>
                  <MenuItem value="baked-goods">Baked Goods</MenuItem>
                  <MenuItem value="snacks">Snacks</MenuItem>
                  <MenuItem value="beverages">Beverages</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
                {values.foodType.includes("others") && (
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

// Define the validation schema
const checkoutSchema = yup.object().shape({
  dateOfRequest: yup.date().required("required"),
  familySize: yup.number().required("required"),
  canCook: yup.boolean().required("required"),
  canReheat: yup.boolean().required("required"),
  hasFridge: yup.boolean().required("required"),
  address: yup.string().required("required"),
  dietaryRestrictions: yup.array().of(yup.string()).required("required"),
  foodType: yup.array().of(yup.string()).required("required"),
});

// Define the initial form values
const initialValues = {
  dateOfRequest: "",
  familySize: 0,
  canCook: false,
  canReheat: false,
  hasFridge: false,
  address: "",
  dietaryRestrictions: [],
  foodType: [],
};

export default RecipientForm;
