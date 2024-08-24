import munkres from "munkres-js";
import { store } from "../firebase/base.js";
import { getDocs, collection } from "firebase/firestore";

async function getData() {
  const donationsCollection = collection(store, "donations");
  const requestsCollection = collection(store, "foodRequests");

  let donations = []; 
  let requests = [];

  try {
    const donationsData = await getDocs(donationsCollection);
    donations = donationsData.docs.map((doc) => doc.data());

    const requestsData = await getDocs(requestsCollection);
    requests = requestsData.docs.map((doc) => doc.data());
    
  } catch (err) {
    console.error(err);
  }

  return { donations, requests };
}

// Implement geolocation distance calculation
function calculateDistance(pickUpAddress, deliveryAddress) {
  const { lat: lat1, long: lon1 } = pickUpAddress;
  const { lat: lat2, long: lon2 } = deliveryAddress;

  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function createCostMatrix(donations, requests) {
  const costMatrix = [];
  for (const donation of donations) {
    const row = [];
    for (const request of requests) {
      let cost = 0;

      // Check 1 - if request is halal, donation must be halal
      if (
        !donation.isHalal &&
        request.dietaryRestrictions.includes("halal")
      ) {
        row.push(Infinity);
        continue; // Skip to the next request
      }

      // Check 2 - if donation is perishable, request must be able to cook, reheat, and have a fridge
      if (
        donation.isPerishable &&
        !(request.canCook || request.canReheat || request.hasFridge)
      ) {
        row.push(100);
        continue; // Skip to the next request
      }

      // Check 3 - check expiry date and time
      if (donation.expiryDate <= request.dateOfRequest) {
        row.push(Infinity);
        continue; // Skip to the next request
      }

      // Calculate portion cost
      const portionCost =
        donation.quantity >= request.familySize
          ? donation.quantity / request.familySize
          : request.family_size / donation.quantity;
      cost += portionCost;

      // Calculate distance cost
      const distance = calculateDistance(
        donation.pickUpAddress,
        request.deliveryAddress
      );
      cost += distance; // in km

      // Calculate food type matching cost
      const foodCost = request.foodType.includes(donation.foodItem) ? 0 : 10;
      cost += foodCost;

      row.push(cost);
    }
    costMatrix.push(row);
  }
  return costMatrix;
}

export async function findOptimalAssignments() {
  const { donations, requests } = await getData();
  console.log(donations, requests);

  const costMatrix = createCostMatrix(donations, requests);
  const result = munkres(costMatrix);

  const matches = [];

  for (const [donorIndex, requestIndex] of result) {
    if (requestIndex < requests.length) {
      const donor = donations[donorIndex];
      const request = requests[requestIndex];
      matches.push({
        donorId: donor.donorID,
        foodItem: donor.foodItem,
        quantity: donor.quantity,
        expiryDate: donor.expiryDate,
        isHalal: donor.isHalal,
        isPerishable: donor.isPerishable,
        pickUpAddress: donor.pickUpAddress,
        recipientId: request.recipientID,
        familySize: request.familySize,
        canCook: request.canCook,
        canReheat: request.canReheat,
        hasFridge: request.hasFridge,
        deliveryAddress: request.deliveryAddress
      });
    }
  }

  console.log(matches);
}
