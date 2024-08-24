const { faker } = require('@faker-js/faker');

const admin = require('firebase-admin');

// Initialize Firebase
const serviceAccount = require('./serviceAccountKey.json');

const certificationTypes = [
  'HACCP', 'ISO 22000', 'SQF', 'BRC', 'GMP', 
  'FSSC 22000', 'GlobalGAP', 'Kosher', 'Halal'
];

const restaurantOrHotelNames = [
  "Nando's", "Skyline Restaurant", "Fairprice", 
  "City View Hotel", "Little Farm", "Pizza Hut", 
  "Elegant Suites", "Oceanfront Bistro", "Mountain Lodge", 
  "Marina Bay Sands"
];

const singaporeanNames = [
  "Lee Hock Seng", "Tan Wei Ming", "Ng Siew Ling", 
  "Chua Cheng Kai", "Lim Mei Lin", "Goh Choon Seng", 
  "Wong Ah Mei", "Yeo Jia Hui", "Ong Hui Ling", 
  "Cheong Poh Lay", "Rajesh Kumar", "Priya Sharma", 
  "Sarah Wilson", "David Brown"
];

const foodTypes = [
  'Chicken Rice', 'Laksa', 'Bak Kut Teh', 'Hokkien Mee', 
  'Roti Prata', 'Nasi Lemak', 'Char Kway Teow', 
  'Satay', 'Dim Sum', 'Fishball Noodles', 'Pasta'
];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  
});

const db = admin.firestore(); // Use Firestore

const generateDonors = async () => {
  const donorsRef = db.collection('donors'); // For Firestore

  const donorIds = [];
  
  for (let i = 0; i < restaurantOrHotelNames.length; i++) {
    const donorId = faker.datatype.uuid();
    donorIds.push(donorId);
    
    await donorsRef.add({
      donorId: donorId,
      name: restaurantOrHotelNames[i],
      contactPerson: faker.person.fullName(),
      contactNumber: faker.phone.number(),
      foodSafetyCertification: faker.helpers.arrayElement(certificationTypes)
    });
  }
  return donorIds;
};

const generateRecipients = async () => {
  const recipientsRef = db.collection('recipients'); // For Firestore

  const recipientIds = [];
  
  for (let i = 0; i < singaporeanNames.length; i++) {
    const recipientId = faker.datatype.uuid();
    recipientIds.push(recipientId);
    
    await recipientsRef.add({
      recipientId: recipientId,
      name: singaporeanNames[i],
      contactPerson: faker.person.fullName(),
      contactNumber: faker.phone.number()
    });
  }
  return recipientIds;
};

const generateFoodRequests = async (recipientIds) => {
  const foodRequestsRef = db.collection('foodRequests'); // For Firestore

  for (let i = 0; i < recipientIds.length; i++) {
    await foodRequestsRef.add({
      recipientID: recipientIds[i],
      dateOfRequest: faker.date.past(),
      receivedAt: faker.date.past(),
      familySize: faker.datatype.number({ min: 1, max: 10 }),
      canCook: faker.datatype.boolean(),
      canReheat: faker.datatype.boolean(),
      hasFridge: faker.datatype.boolean(),
      deliveryAddress: {
        lat: parseFloat(faker.address.latitude()),
        long: parseFloat(faker.address.longitude())
      },
      dietaryRestrictions: faker.lorem.words(3).split(' '),
      foodType: faker.helpers.arrayElement(foodTypes)
    });
  }
};

const generateDonations = async (donorIds) => {
  const donationsRef = db.collection('donations'); // For Firestore

  for (let i = 0; i < donorIds.length; i++) {
    await donationsRef.add({
      donorID: donorIds[i],
      foodItem: faker.helpers.arrayElement(foodTypes),
      quantity: faker.datatype.number({ min: 1, max: 100 }),
      expiryDate: faker.date.future(),
      isHalal: faker.datatype.boolean(),
      isPerishable: faker.datatype.boolean(),
      pickUpAddress: {
        lat: parseFloat(faker.address.latitude()),
        long: parseFloat(faker.address.longitude())
      }
    });
  }
};

const populateCollections = async () => {
  const donorIds = await generateDonors();
  const recipientIds = await generateRecipients();
  await generateDonations(donorIds);
  await generateFoodRequests(recipientIds);
  
  console.log('Fake data generated successfully.');
};

populateCollections().catch(console.error);
