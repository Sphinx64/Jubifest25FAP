const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {google} = require("googleapis");

// Initialize Firebase Admin SDK
admin.initializeApp();

// --- Google Sheets Configuration ---
const SPREADSHEET_ID = "1ttmK64mZr1BZbZVrXUX7iztZE7DqZK68C49RoGi5bew";
const SERVICE_ACCOUNT_PATH = "./service-account.json";
const SHEET_NAME = "Anmeldungen"; // Name of the tab in your Google Sheet

/**
 * Appends data to a Google Sheet.
 * @param {object} data The data object to be added.
 * @param {string} docId The ID of the Firestore document.
 */
async function appendToSheet(data, docId) {
    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({version: "v4", auth});

    // Create the row data in the correct order
    const timestamp = new Date().toISOString();
    const aenderungslink = `https://fap-jubilaeum-25.web.app/index.html?id=${docId}`;

    // Map form data to sheet columns
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
            range: `${SHEET_NAME}!A1`, // Append after the last row in the sheet
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [row],
            },
        });
        console.log("Successfully appended data to Google Sheet.");
    } catch (err) {
        console.error("Error appending data to Google Sheet:", err);
        // We log the error but don't re-throw it to not block other operations
    }
}


/**
 * Triggered when a new registration is created in Firestore.
 * It now also appends the registration data to a Google Sheet.
 */
exports.handleNewRegistration = functions.firestore
    .document("anmeldungen-fap-jubilaeum-25/{docId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const docId = context.params.docId;

        // Only proceed for "yes" responses
        if (data.teilnahme === "ja") {
            try {
                await appendToSheet(data, docId);
            } catch (error) {
                // The error is already logged in appendToSheet
                // We can add more handling here if needed
            }
        }
        // Note: The email sending logic is removed as per the previous request.
        // If you need it back, the code can be re-inserted here.
        return null;
    });

/**
 * HTTP-triggered function to export all registrations as JSON.
 * Protect with a secret query parameter.
 */
exports.exportAnmeldungen = functions.https.onRequest(async (req, res) => {
    const SECRET = "bitte-aendern"; // Change this to a secure secret!

    if (req.query.secret !== SECRET) {
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
