import munkres from "munkres-js";
import { getUnMatchedData, storeMatchData, updateIsMatched } from "../firebase/match";

// Implement geolocation distance calculation
function calculateDistance(pickUpAddress, deliveryAddress) {
  const { lat: lat1, long: lon1 } = pickUpAddress;
  const { latitude: lat2, longitude: lon2 } = deliveryAddress;

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
        request.dietaryRestrictions.includes("halal") &&
        !donation.dietaryRestrictions.includes("halal")
      ) {
        console.log("1")
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
      const donation_timestamp = donation.expiryDate.seconds;
      const donation_date = new Date(donation_timestamp*1000);

      const recipient_dateString = request.dateOfRequest;
      const recipient_date = new Date(recipient_dateString);

      if (donation_date <= recipient_date) {
        console.log(donation_date, recipient_date)
        row.push(Infinity);
        continue; // Skip to the next request
      }

      // Calculate portion cost
      const portionCost =
        donation.quantity >= request.familySize
          ? donation.quantity / request.familySize
          : request.familySize / donation.quantity;
      cost += portionCost;

      // Calculate distance cost
      const distance = calculateDistance(
        donation.pickUpAddress,
        request.location
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
  const { donations, requests } = await getUnMatchedData();

  const costMatrix = createCostMatrix(
    donations.slice(0,4),
    requests.slice(0,4)
  );

  const result = munkres(costMatrix);
  console.log(result)

  const matches = [];

  for (const [donorIndex, requestIndex] of result) {
    if (requestIndex < requests.length) {
      const donor = donations[donorIndex];
      const request = requests[requestIndex];
       let match = {
        donorId: donor.donorID,
        foodItem: donor.foodItem,
        quantity: donor.quantity,
        expiryDate: donor.expiryDate,
        dietaryRestrictions: donor.dietaryRestrictions,
        isPerishable: donor.isPerishable,
        pickUpAddress: donor.pickUpAddress,
        recipientId: request.recipientId,
        familySize: request.familySize,
        canCook: request.canCook,
        canReheat: request.canReheat,
        hasFridge: request.hasFridge,
        deliveryAddress: request.location,
        status: "Match Successful"
      };

      matches.push(match);
      storeMatchData(match);
      // updateIsMatched(donor.id, "donations", donor);
      // updateIsMatched(request.id, "foodRequests", request);
    }
  }

  console.log("Matches", matches);

  return matches
}
