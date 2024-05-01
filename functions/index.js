/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");

const admin = require("firebase-admin");
// const { v4: uuidv4 } = require("uuid");

admin.initializeApp();

const db = admin.firestore();

async function updateBanner() {
  try {
    // banners 컬렉션에서 랜덤하게 document 하나를 가져옵니다.
    const snapshot = await db.collection("banners").get();
    const banners = [];
    snapshot.forEach((doc) => {
      banners.push({ id: doc.id, ...doc.data() });
    });

    if (banners.length === 0) {
      console.log("No banners found.");
      return;
    }

    // 랜덤하게 선택된 document를 선택합니다.
    const randomIndex = Math.floor(Math.random() * banners.length);
    const selectedBanner = banners[randomIndex];

    // 선택된 document의 selected 속성을 true로 업데이트합니다.
    await db.collection("banners").doc(selectedBanner.id).update({
      selected: true,
    });

    // 선택된 document 이외의 모든 document를 삭제합니다.
    const batch = db.batch();
    banners.forEach((banner) => {
      if (banner.id !== selectedBanner.id) {
        const docRef = db.collection("banners").doc(banner.id);
        batch.delete(docRef);
      }
    });
    await batch.commit();

    console.log("Selected banner updated and other banners deleted successfully.");
  } catch (error) {
    console.error("Error updating banner:", error);
  }
}

exports.scheduledFunction = functions.pubsub.schedule("every 30 minutes").onRun((context) => {
  console.log("This will be run every hour!");
  updateBanner();
  return null;
});
