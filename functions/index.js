const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {google} = require("googleapis");

// Initialize Firebase Admin SDK
admin.initializeApp();

// --- Google Sheets Configuration ---
const SPREADSHEET_ID = "1ttmK64mZr1BZbZVrXUX7iztZE7DqZK68C49RoGi5bew";
const SHEET_NAME = "Anmeldungen";

/**
 * Appends data to a Google Sheet using Application Default Credentials.
 * @param {object} data The data object to be added.
 * @param {string} docId The ID of the Firestore document.
 */
async function appendToSheet(data, docId) {
    // Create a Google Auth client using Application Default Credentials
    const auth = new google.auth.GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({version: "v4", auth});

    const timestamp = new Date().toISOString();
    const aenderungslink = `https://fap-jubilaeum-25.web.app/index.html?id=${docId}`;

    const row = [
        timestamp,
        docId,
        data.name || "",
        data.erwachsene || "0",
        data.kinder || "0",
        data.raclette_erwachsene || "0",
        data.fondue_erwachsene || "0",
        data.raclette_kinder || "0",
        data.fondue_kinder || "0",
        data["dessert-beitrag"] === "ja" ? (data["dessert-was"] || "Ja") : "Nein",
        data.bemerkungen || "",
        aenderungslink,
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: SHEET_NAME, 
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [row],
            },
        });
        console.log("Successfully appended data to Google Sheet.");
    } catch (err) {
        console.error("Error appending data to Google Sheet:", err.message);
        console.error(err);
    }
}


/**
 * Triggered when a new registration is created in Firestore.
 */
exports.handleNewRegistration = functions.firestore
    .document("anmeldungen-fap-jubilaeum-25/{docId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const docId = context.params.docId;

        if (data.teilnahme === "ja") {
            await appendToSheet(data, docId);
        }
        return null;
    });

/**
 * HTTP-triggered function to export all registrations as JSON.
 * This function is protected by a secret.
 */
exports.exportAnmeldungen = functions
    .runWith({ secrets: ["EXPORT_SECRET"] })
    .https.onRequest(async (req, res) => {

    // Access the secret from the environment variables
    if (req.query.secret !== process.env.EXPORT_SECRET) {
        res.status(403).send("Unauthorized");
        return;
    }

    try {
        const anmeldungenRef = admin.firestore().collection("anmeldungen-fap-jubilaeum-25");
        const snapshot = await anmeldungenRef.orderBy("timestamp", "desc").get();
        
        if (snapshot.empty) {
            res.status(404).send("No registrations found.");
            return;
        }
        
        const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        res.status(200).json(data);

    } catch (error) {
        console.error("Error exporting data:", error);
        res.status(500).send("Error exporting data.");
    }
});
