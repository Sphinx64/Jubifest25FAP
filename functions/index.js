const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {google} = require("googleapis");
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin SDK
admin.initializeApp();

// --- SendGrid Configuration ---
// The SendGrid API key will be loaded from Firebase environment variables
sgMail.setApiKey(functions.config().sendgrid.apikey);

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
 * Sends a confirmation email using SendGrid.
 * @param {object} data The registration data
 * @param {string} docId The document ID for edit links
 */
async function sendConfirmationEmail(data, docId) {
    const editLink = `https://fap-jubilaeum-25.web.app/index.html?id=${docId}`;
    
    // Prepare food summary
    const essenItems = [];
    if (parseInt(data.raclette_erwachsene) > 0) essenItems.push(`${data.raclette_erwachsene}x Raclette (Erwachsene)`);
    if (parseInt(data.fondue_erwachsene) > 0) essenItems.push(`${data.fondue_erwachsene}x Fondue (Erwachsene)`);
    if (parseInt(data.raclette_kinder) > 0) essenItems.push(`${data.raclette_kinder}x Raclette (Kinder)`);
    if (parseInt(data.fondue_kinder) > 0) essenItems.push(`${data.fondue_kinder}x Fondue (Kinder)`);
    const essenText = essenItems.length > 0 ? essenItems.join('<br>') : 'Keine Auswahl';
    
    const begleitungText = `${parseInt(data.erwachsene) || 0} Erwachsene, ${parseInt(data.kinder) || 0} Kinder`;
    const dessertText = data['dessert-beitrag'] === 'ja' ? (data['dessert-was'] || 'Ja, Details folgen') : 'Nein';

    // Email template - matching the FAP design
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Anmeldebestätigung - 25 Jahre Fun Agility People</title>
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background-color: #005a6a; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 18px; margin-bottom: 20px; color: #333; }
            .event-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #005a6a; }
            .event-details h3 { margin: 0 0 15px 0; color: #005a6a; font-size: 20px; }
            .event-details p { margin: 5px 0; color: #555; }
            .registration-summary { background-color: #f1f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .registration-summary h3 { margin: 0 0 15px 0; color: #005a6a; }
            .registration-summary p { margin: 8px 0; color: #333; }
            .registration-summary strong { color: #005a6a; }
            .edit-section { background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7; }
            .edit-section h3 { margin: 0 0 10px 0; color: #856404; }
            .edit-button { display: inline-block; background-color: #005a6a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
            .edit-button:hover { background-color: #004850; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
            @media (max-width: 600px) {
                .content { padding: 20px 15px; }
                .header { padding: 20px 15px; }
                .header h1 { font-size: 24px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Anmeldebestätigung</h1>
                <p>25 Jahre Fun Agility People</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hallo ${data.name || 'Liebe/r Teilnehmer/in'},
                </div>
                
                <p>vielen Dank für deine Anmeldung zu unserem Jubiläumsfest! Wir freuen uns riesig, dass du dabei bist. 🎊</p>
                
                <div class="event-details">
                    <h3>📅 Die Eckdaten im Überblick</h3>
                    <p><strong>Datum:</strong> Samstag, 18. Oktober 2025</p>
                    <p><strong>Zeit:</strong> ab 14:00 Uhr</p>
                    <p><strong>Ort:</strong> Schützenhaus Schönenbuch</p>
                    <p><strong>Programm:</strong> Apéro, Spaziergang, Essen und gemütliches Beisammensein</p>
                </div>
                
                <div class="registration-summary">
                    <h3>📝 Deine Anmeldedaten</h3>
                    <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
                    <p><strong>E-Mail:</strong> ${data.email || 'N/A'}</p>
                    <p><strong>Begleitung:</strong> ${begleitungText}</p>
                    <p><strong>Essen:</strong><br>${essenText}</p>
                    <p><strong>Dessert-Beitrag:</strong> ${dessertText}</p>
                    ${data.bemerkungen ? `<p><strong>Bemerkungen:</strong> ${data.bemerkungen}</p>` : ''}
                </div>
                
                <div class="edit-section">
                    <h3>✏️ Änderungen möglich</h3>
                    <p>Falls du deine Angaben noch anpassen möchtest, kannst du das jederzeit über den folgenden Link tun:</p>
                    <a href="${editLink}" class="edit-button">Anmeldung bearbeiten</a>
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        💡 <strong>Tipp:</strong> Speichere diesen Link - so kannst du deine Anmeldung später noch ändern, falls sich etwas ändert.
                    </p>
                </div>
                
                <p>Wir melden uns in den nächsten Wochen noch mit weiteren Details zum Ablauf und eventuellen Mitbring-Infos.</p>
                
                <div class="signature">
                    <p>Bis dahin freuen wir uns auf einen unvergesslichen Tag mit dir!</p>
                    <p><strong>Dein Fun Agility People Team</strong> 🐕</p>
                </div>
            </div>
            
            <div class="footer">
                <p>Fun Agility People • 25 Jahre Hundesport mit Herz</p>
                <p>Diese E-Mail wurde automatisch generiert.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const msg = {
        to: data.email,
        from: {
            email: 'grafpia@gmail.com', // Your verified SendGrid sender email
            name: 'Fun Agility People'
        },
        subject: '🎉 Anmeldebestätigung - 25 Jahre FAP Jubiläumsfest',
        html: emailHtml,
    };

    try {
        await sgMail.send(msg);
        console.log(`Confirmation email sent successfully to ${data.email}`);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        if (error.response) {
            console.error('SendGrid response body:', error.response.body);
        }
    }
}

/**
 * Sends a cancellation email using SendGrid.
 * @param {object} data The registration data
 */
async function sendCancellationEmail(data) {
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Abmeldung erhalten - Fun Agility People</title>
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background-color: #005a6a; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 18px; margin-bottom: 20px; color: #333; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Abmeldung erhalten</h1>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hallo ${data.name || 'Liebe/r Teilnehmer/in'},
                </div>
                
                <p>schade, dass du nicht an unserem 25-jährigen Jubiläumsfest teilnehmen kannst. Wir haben deine Abmeldung erhalten und zur Kenntnis genommen.</p>
                
                <p>Falls sich doch noch etwas ändert und du teilnehmen möchtest, kannst du dich jederzeit wieder anmelden.</p>
                
                <div class="signature">
                    <p>Wir wünschen dir alles Gute!</p>
                    <p><strong>Dein Fun Agility People Team</strong> 🐕</p>
                </div>
            </div>
            
            <div class="footer">
                <p>Fun Agility People • 25 Jahre Hundesport mit Herz</p>
                <p>Diese E-Mail wurde automatisch generiert.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const msg = {
        to: data.email,
        from: {
            email: 'noreply@fun-agility-people.ch', // Replace with your verified SendGrid sender email
            name: 'Fun Agility People'
        },
        subject: 'Abmeldung erhalten - FAP Jubiläumsfest',
        html: emailHtml,
    };

    try {
        await sgMail.send(msg);
        console.log(`Cancellation email sent successfully to ${data.email}`);
    } catch (error) {
        console.error('Error sending cancellation email:', error);
        if (error.response) {
            console.error('SendGrid response body:', error.response.body);
        }
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
            // Handle positive registration
            await appendToSheet(data, docId);
            await sendConfirmationEmail(data, docId);
        } else {
            // Handle cancellation
            await sendCancellationEmail(data);
        }
        return null;
    });

/**
 * Triggered when a registration is updated in Firestore.
 */
exports.handleUpdatedRegistration = functions.firestore
    .document("anmeldungen-fap-jubilaeum-25/{docId}")
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const docId = context.params.docId;

        // Only send email for updates, not initial creation
        if (newData.lastModified) {
            if (newData.teilnahme === "ja") {
                await sendConfirmationEmail(newData, docId);
                console.log(`Update confirmation email sent for registration ${docId}`);
            } else {
                await sendCancellationEmail(newData);
                console.log(`Update cancellation email sent for registration ${docId}`);
            }
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