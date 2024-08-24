import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";

// Import Firestore functions
import { addDoc, collection } from "firebase/firestore";
import { store } from "../../firebase/base"; // Import your initialized Firestore database

const RecipientForm = () => {
  // Function to handle form submission
  const handleFormSubmit = async (values) => {
    try {
      // Add a new document in the "requests" collection
      await addDoc(collection(store, "foodRequests"), {
        dateOfRequest: values.dateOfRequest,
        receivedAt: values.receivedAt,
        familySize: values.familySize,
        canCook: values.canCook,
        canReheat: values.canReheat,
        hasFridge: values.hasFridge,
        location: {
          latitude: values.latitude,
          longitude: values.longitude,
        },
        dietaryRestrictions: values.dietaryRestrictions
          .split(",")
          .map((item) => item.trim()),
        foodType: values.foodType.split(",").map((item) => item.trim()),
      });

      alert("Request created successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error creating request!");
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
                type="datetime-local"
                label="Received At"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.receivedAt}
                name="receivedAt"
                error={!!touched.receivedAt && !!errors.receivedAt}
                helperText={touched.receivedAt && errors.receivedAt}
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
                    color="primary"
                  />
                }
                label="Can Cook"
                sx={{ gridColumn: "span 1" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.canReheat}
                    onChange={handleChange}
                    name="canReheat"
                    color="primary"
                  />
                }
                label="Can Reheat"
                sx={{ gridColumn: "span 1" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.hasFridge}
                    onChange={handleChange}
                    name="hasFridge"
                    color="primary"
                  />
                }
                label="Has Fridge"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Latitude"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.latitude}
                name="latitude"
                error={!!touched.latitude && !!errors.latitude}
                helperText={touched.latitude && errors.latitude}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Longitude"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.longitude}
                name="longitude"
                error={!!touched.longitude && !!errors.longitude}
                helperText={touched.longitude && errors.longitude}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dietary Restrictions (comma-separated)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dietaryRestrictions}
                name="dietaryRestrictions"
                error={
                  !!touched.dietaryRestrictions && !!errors.dietaryRestrictions
                }
                helperText={
                  touched.dietaryRestrictions && errors.dietaryRestrictions
                }
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Food Type (comma-separated)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.foodType}
                name="foodType"
                error={!!touched.foodType && !!errors.foodType}
                helperText={touched.foodType && errors.foodType}
                sx={{ gridColumn: "span 4" }}
              />
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
  receivedAt: yup.date(),
  familySize: yup.number().required("required"),
  canCook: yup.boolean().required("required"),
  canReheat: yup.boolean().required("required"),
  hasFridge: yup.boolean().required("required"),
  latitude: yup.number().required("required"),
  longitude: yup.number().required("required"),
  dietaryRestrictions: yup.string().required("required"),
  foodType: yup.string().required("required"),
});

// Define the initial form values
const initialValues = {
  dateOfRequest: "",
  receivedAt: "",
  familySize: 0,
  canCook: false,
  canReheat: false,
  hasFridge: false,
  latitude: "",
  longitude: "",
  dietaryRestrictions: "",
  foodType: "",
};

export default RecipientForm;
