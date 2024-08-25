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
    ListItemText,
  } from "@mui/material";
  import { Formik } from "formik";
  import * as yup from "yup";
  import Header from "../../components/Header";
  import { useTheme } from "@mui/material/styles";
  import { useState } from "react";
  
  import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
  import { store } from "../../firebase/base";
  
  const Donor = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const [, setLoading] = useState(false);
    const [, setError] = useState("");
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
  
    const handleFormSubmit = async (values) => {
      setLoading(true);
      setError("");
  
      try {
        const { latitude, longitude } = await getCoordinatesFromAddress(
          values.pickUpAddress
        );

        if (customFoodType) {
          values.foodType.push(customFoodType);
        }
        if (customDietaryRestrictions) {
          values.dietaryRestrictions.push(customDietaryRestrictions);
        }
  
        await addDoc(collection(store, "donations"), {
          expiryDate: values.expiryDate,
          foodItem: values.foodItem,
          foodType: values.foodType.map((item) => item.trim()),
          isHalal: values.isHalal,
          isPerishable: values.isPerishable,
          quantity: values.quantity,
          pickUpAddress: {
            latitude,
            longitude,
          },
          // dietaryRestrictions: values.dietaryRestrictions.map((item) => item.trim()),
        });
  
        alert("Donation request created successfully!");
      } catch (error) {
        console.error("Error adding document for donation: ", error);
        setError("Error creating donation request!");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Box m="20px">
        <Header title="Submit Your Donation" />
  
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
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Food Item"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.foodItem}
                  name="foodItem"
                  error={!!touched.foodItem && !!errors.foodItem}
                  helperText={touched.foodItem && errors.foodItem}
                  sx={{ gridColumn: "span 4" }}
                />
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
                      if (e.target.value.includes("others")) {
                        setCustomFoodType("");
                      }
                    }}
                    onBlur={handleBlur}
                    error={!!touched.foodType && !!errors.foodType}
                    label="Food Type"
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {["Rice", "Noodle", "Vegetables", "Meat", "Fruits", "Seafood", "Desserts", "Baked Goods", "Canned Food", "Snacks", "Beverages", "Others"].map((foodType) => (
                    <MenuItem key={foodType} value={foodType}>
                      <Checkbox
                        checked={values.foodType.indexOf(foodType) > -1}
                        sx={{
                          color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "primary.main",
                          '&.Mui-checked': {
                            color: isDarkMode ? "white" : "primary.main",
                          },
                          '&:hover': {
                            backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.04)",
                          },
                          '&.Mui-focusVisible': {
                            outline: isDarkMode ? "2px solid white" : "2px solid primary.main",
                          },
                        }}
                      />
                      <ListItemText primary={foodType.charAt(0).toUpperCase() + foodType.slice(1).replace('_', ' ')} />
                    </MenuItem>
                  ))}
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
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Food Quantity"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.quantity}
                  name="quantity"
                  error={!!touched.quantity && !!errors.quantity}
                  helperText={touched.quantity && errors.quantity}
                  sx={{ gridColumn: "span 4" }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isPerishable}
                      onChange={handleChange}
                      name="isPerishable"
                      color={isDarkMode ? "default" : "primary"}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          color: isDarkMode ? "white" : "default",
                        },
                      }}
                    />
                  }
                  label="Perishable"
                  sx={{
                    gridColumn: "span 1",
                    color: isDarkMode ? "white" : "black",
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isHalal}
                      onChange={handleChange}
                      name="isHalal"
                      color={isDarkMode ? "default" : "primary"}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          color: isDarkMode ? "white" : "default",
                        },
                      }}
                    />
                  }
                  label="Halal"
                  sx={{
                    gridColumn: "span 2",
                    color: isDarkMode ? "white" : "black",
                  }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="datetime-local"
                  label="Expiry Date and Time"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.expiryDate}
                  name="expiryDate"
                  error={!!touched.expiryDate && !!errors.expiryDate}
                  helperText={touched.expiryDate && errors.expiryDate}
                  InputLabelProps={{ shrink: true }}
                  sx={{ gridColumn: "span 4" }}
                />
                 {/* <FormControl
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
                      if (e.target.value.includes("others")) {
                        setCustomDietaryRestrictions("");
                      }
                    }}
                    onBlur={handleBlur}
                    error={
                      !!touched.dietaryRestrictions &&
                      !!errors.dietaryRestrictions
                    }
                    renderValue={(selected) => selected.join(", ")}
                    label="Dietary Restrictions"
                  >
                    {["None", "Halal", "Vegetarian", "Gluten-free", "Nut-free", "Dairy-free", "Others"].map((restriction) => (
                    <MenuItem key={restriction} value={restriction}>
                      <Checkbox
                        checked={values.dietaryRestrictions.indexOf(restriction) > -1}
                        sx={{
                          color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "primary.main",
                          '&.Mui-checked': {
                            color: isDarkMode ? "white" : "primary.main",
                          },
                          '&:hover': {
                            backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.04)",
                          },
                          '&.Mui-focusVisible': {
                            outline: isDarkMode ? "2px solid white" : "2px solid primary.main",
                          },
                        }}
                      />
                      <ListItemText primary={restriction.charAt(0).toUpperCase() + restriction.slice(1).replace('_', ' ')} />
                    </MenuItem>
                  ))}
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
                </FormControl> */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Pick Up Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.pickUpAddress}
                  name="pickUpAddress"
                  error={!!touched.pickUpAddress && !!errors.pickUpAddress}
                  helperText={touched.pickUpAddress && errors.pickUpAddress}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Submit
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };
  
  // Function to fetch donor id
  const fetchDonorId = async (email) => {
    try {
      const q = query(
        collection(store, "donors"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const donorData = querySnapshot.docs[0].data();
        const donorId = querySnapshot.docs[0].id;
        console.log("Donor ID:", donorId);
        return donorId;
      } else {
        console.log("No matching donor found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching donor:", error);
    }
  };
  
  // Define the validation schema
  const checkoutSchema = yup.object().shape({
    expiryDate: yup.date(),
    foodItem: yup.string().required("required"),
    quantity: yup.number().required("required"),
    isPerishable: yup.boolean().required("required"),
    pickUpAddress: yup.string().required("required"),
    // dietaryRestrictions: yup.array().min(1, "At least one restriction is required"),
    foodType: yup.array().min(1, "At least one food type is required"),
    isHalal: yup.boolean().required("required"),
  });
  
  // Define the initial form values
  const initialValues = {
    expiryDate: "",
    foodItem: "",
    quantity: 0,
    pickUpAddress: "",
    // dietaryRestrictions: [],
    foodType: [],
    isPerishable: false,
    isHalal: false,
  };
  
  export default Donor;
  