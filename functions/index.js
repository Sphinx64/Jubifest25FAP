const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {google} = require("googleapis");
const sgMail = require('@sendgrid/mail');

// Import central configuration
const eventConfig = require('./event-config');

// Initialize Firebase Admin SDK
admin.initializeApp();

// --- SendGrid Configuration with better error handling ---
try {
    const sendgridConfig = functions.config().sendgrid;
    if (!sendgridConfig || !sendgridConfig.apikey) {
        console.error("❌ SendGrid API key not configured! Run: firebase functions:config:set sendgrid.apikey=\"YOUR_KEY\"");
    } else {
        sgMail.setApiKey(sendgridConfig.apikey);
        console.log("✅ SendGrid API key configured");
    }
} catch (error) {
    console.error("❌ Error configuring SendGrid:", error);
}

// --- Google Sheets Configuration ---
const SPREADSHEET_ID = "1ttmK64mZr1BZbZVrXUX7iztZE7DqZK68C49RoGi5bew";
const SHEET_NAME = "Anmeldungen";

/**
 * Adds or updates data in Google Sheet.
 * @param {object} data The data object to be added/updated.
 * @param {string} docId The ID of the Firestore document.
 * @param {boolean} isUpdate Whether this is an update (default: false)
 */
async function addOrUpdateSheet(data, docId, isUpdate = false) {
    console.log("📊 Processing Google Sheet for:", data.name, isUpdate ? "(UPDATE)" : "(NEW)");
    
    const auth = new google.auth.GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({version: "v4", auth});

    const aenderungslink = `${eventConfig.registration.url}/?id=${docId}`;

    try {
        if (isUpdate) {
            // ✅ UPDATE: Suche nach existierender Zeile und update sie
            await updateExistingRow(sheets, data, docId, aenderungslink);
        } else {
            // ✅ NEW: Füge neue Zeile hinzu
            await appendNewRow(sheets, data, docId, aenderungslink);
        }
    } catch (err) {
        console.error("❌ Error processing Google Sheet:", err.message);
        console.error("Full error:", err);
    }
}

/**
 * Appends a new row to the Google Sheet.
 */
async function appendNewRow(sheets, data, docId, aenderungslink) {
    const timestamp = new Date().toISOString();
    
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

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: SHEET_NAME,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [row],
        },
    });
    
    console.log("✅ Successfully added new row to Google Sheet for:", data.name);
}

/**
 * Updates an existing row in the Google Sheet by finding the docId.
 */
async function updateExistingRow(sheets, data, docId, aenderungslink) {
    console.log("🔍 Searching for existing row with docId:", docId);
    
    // Schritt 1: Alle Daten aus dem Sheet lesen
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: SHEET_NAME,
    });
    
    const rows = response.data.values || [];
    
    // Schritt 2: Zeile mit matching docId finden (Spalte B = Index 1)
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i][1] === docId) { // Spalte B (Index 1) enthält docId
            rowIndex = i + 1; // Google Sheets ist 1-basiert
            break;
        }
    }
    
    if (rowIndex === -1) {
        console.log("⚠️ No existing row found for docId:", docId, "- adding as new row");
        await appendNewRow(sheets, data, docId, aenderungslink);
        return;
    }
    
    console.log("✅ Found existing row at index:", rowIndex);
    
    // Schritt 3: Update der gefundenen Zeile
    const updateTimestamp = new Date().toISOString();
    
    const updatedRow = [
        updateTimestamp, // A: Timestamp (updated)
        docId, // B: docId (unchanged)
        data.name || "", // C: Name
        data.erwachsene || "0", // D: Erwachsene
        data.kinder || "0", // E: Kinder
        data.raclette_erwachsene || "0", // F: Raclette Erwachsene
        data.fondue_erwachsene || "0", // G: Fondue Erwachsene
        data.raclette_kinder || "0", // H: Raclette Kinder
        data.fondue_kinder || "0", // I: Fondue Kinder
        data["dessert-beitrag"] === "ja" ? (data["dessert-was"] || "Ja") : "Nein", // J: Dessert
        data.bemerkungen || "", // K: Bemerkungen
        aenderungslink, // L: Änderungslink
    ];
    
    // Update die spezifische Zeile
    const range = `${SHEET_NAME}!A${rowIndex}:L${rowIndex}`;
    
    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [updatedRow],
        },
    });
    
    console.log("✅ Successfully updated existing row in Google Sheet for:", data.name);
}

/**
 * Marks a registration as cancelled in Google Sheets.
 */
async function markAsCancelled(sheets, data, docId) {
    console.log("❌ Marking registration as cancelled for:", data.name);
    
    // Suche nach existierender Zeile
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: SHEET_NAME,
    });
    
    const rows = response.data.values || [];
    let rowIndex = -1;
    
    for (let i = 0; i < rows.length; i++) {
        if (rows[i][1] === docId) {
            rowIndex = i + 1;
            break;
        }
    }
    
    if (rowIndex !== -1) {
        // Update nur Name und Timestamp, markiere als abgemeldet
        const cancelTimestamp = new Date().toISOString();
        
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A${rowIndex}:C${rowIndex}`,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[
                    cancelTimestamp,
                    docId,
                    `[ABGEMELDET] ${data.name}`
                ]],
            },
        });
        
        console.log("✅ Successfully marked as cancelled in Google Sheet");
    } else {
        console.log("⚠️ No existing registration found to cancel");
    }
}

/**
 * Sends a confirmation email using SendGrid with enhanced debugging.
 * @param {object} data The registration data
 * @param {string} docId The document ID for edit links
 */
async function sendConfirmationEmail(data, docId) {
    console.log("📧 Starting email send process for:", data.email);
    
    // Check if SendGrid is configured
    const sendgridConfig = functions.config().sendgrid;
    if (!sendgridConfig || !sendgridConfig.apikey) {
        console.error("❌ SendGrid not configured, skipping email send");
        return;
    }

    const editLink = `${eventConfig.registration.url}/?id=${docId}`;
    
    // Prepare food summary
    const essenItems = [];
    if (parseInt(data.raclette_erwachsene) > 0) essenItems.push(`${data.raclette_erwachsene}x Raclette (Erwachsene)`);
    if (parseInt(data.fondue_erwachsene) > 0) essenItems.push(`${data.fondue_erwachsene}x Fondue (Erwachsene)`);
    if (parseInt(data.raclette_kinder) > 0) essenItems.push(`${data.raclette_kinder}x Raclette (Kinder)`);
    if (parseInt(data.fondue_kinder) > 0) essenItems.push(`${data.fondue_kinder}x Fondue (Kinder)`);
    const essenText = essenItems.length > 0 ? essenItems.join('<br>') : 'Keine Auswahl';
    
    const begleitungText = `${parseInt(data.erwachsene) || 0} Erwachsene, ${parseInt(data.kinder) || 0} Kinder`;
    const dessertText = data['dessert-beitrag'] === 'ja' ? (data['dessert-was'] || 'Ja, Details folgen') : 'Nein';

    // Email template using central configuration
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Anmeldebestätigung - ${eventConfig.event.title}</title>
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background-color: ${eventConfig.branding.primaryColor}; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 18px; margin-bottom: 20px; color: #333; }
            .event-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${eventConfig.branding.primaryColor}; }
            .event-details h3 { margin: 0 0 15px 0; color: ${eventConfig.branding.primaryColor}; font-size: 20px; }
            .event-details p { margin: 5px 0; color: #555; }
            .registration-summary { background-color: #f1f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .registration-summary h3 { margin: 0 0 15px 0; color: ${eventConfig.branding.primaryColor}; }
            .registration-summary p { margin: 8px 0; color: #333; }
            .registration-summary strong { color: ${eventConfig.branding.primaryColor}; }
            .edit-section { background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7; }
            .edit-section h3 { margin: 0 0 10px 0; color: #856404; }
            .edit-button { display: inline-block; background-color: ${eventConfig.branding.primaryColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
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
                <p>${eventConfig.event.jubilee} ${eventConfig.sender.name}</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hallo ${data.name || 'Liebe/r Teilnehmer/in'},
                </div>
                
                <p>vielen Dank für deine Anmeldung zu unserem Jubiläumsfest! Wir freuen uns riesig, dass du dabei bist. 🎊</p>
                
                <div class="event-details">
                    <h3>📅 Die Eckdaten im Überblick</h3>
                    <p><strong>Datum:</strong> ${eventConfig.datetime.date}</p>
                    <p><strong>Zeit:</strong> ab ${eventConfig.datetime.startTime}</p>
                    <p><strong>Ort:</strong> ${eventConfig.location.name}</p>
                    <p><strong>Programm:</strong> ${eventConfig.event.description}</p>
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
                    <p><strong>${eventConfig.sender.signature}</strong> 🐕</p>
                </div>
            </div>
            
            <div class="footer">
                <p>${eventConfig.sender.name} • ${eventConfig.event.jubilee} Hundesport mit Herz</p>
                <p>Diese E-Mail wurde automatisch generiert.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const msg = {
        to: data.email,
        from: {
            email: eventConfig.sender.email,
            name: eventConfig.sender.name
        },
        replyTo: eventConfig.sender.email, // Allow replies
        subject: `Anmeldebestätigung - ${eventConfig.event.shortTitle} Jubiläumsfest`,
        html: emailHtml,
        // Anti-spam headers
        headers: {
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'Normal'
        },
        // Text version for better deliverability
        text: `
Hallo ${data.name || 'Liebe/r Teilnehmer/in'},

vielen Dank für deine Anmeldung zu unserem Jubiläumsfest! Wir freuen uns riesig, dass du dabei bist.

ECKDATEN:
Datum: ${eventConfig.datetime.date}
Zeit: ab ${eventConfig.datetime.startTime}
Ort: ${eventConfig.location.name}

DEINE ANMELDEDATEN:
Name: ${data.name || 'N/A'}
E-Mail: ${data.email || 'N/A'}
Begleitung: ${begleitungText}
Essen: ${essenText.replace(/<br>/g, ', ')}
Dessert-Beitrag: ${dessertText}${data.bemerkungen ? `
Bemerkungen: ${data.bemerkungen}` : ''}

ÄNDERUNGEN MÖGLICH:
Falls du deine Angaben noch anpassen möchtest: ${editLink}

Bis dahin freuen wir uns auf einen unvergesslichen Tag mit dir!

${eventConfig.sender.signature}
${eventConfig.sender.name} • ${eventConfig.event.jubilee} Hundesport mit Herz
        `
    };

    console.log("📧 Email message prepared:");
    console.log("  To:", msg.to);
    console.log("  From:", msg.from.email);
    console.log("  Subject:", msg.subject);

    try {
        const response = await sgMail.send(msg);
        console.log("✅ Confirmation email sent successfully to:", data.email);
        console.log("📧 SendGrid response status:", response[0].statusCode);
    } catch (error) {
        console.error("❌ Error sending confirmation email:", error.message);
        
        if (error.response) {
            console.error("❌ SendGrid response status:", error.response.status);
            console.error("❌ SendGrid response body:", JSON.stringify(error.response.body, null, 2));
        }
        
        // Don't throw the error - we don't want email failures to break the registration
        console.log("⚠️ Registration will continue despite email failure");
    }
}

/**
 * Sends a cancellation email using SendGrid.
 * @param {object} data The registration data
 */
async function sendCancellationEmail(data) {
    console.log("📧 Sending cancellation email to:", data.email);
    
    // Check if SendGrid is configured
    const sendgridConfig = functions.config().sendgrid;
    if (!sendgridConfig || !sendgridConfig.apikey) {
        console.error("❌ SendGrid not configured, skipping cancellation email");
        return;
    }

    const emailHtml = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Abmeldung erhalten - ${eventConfig.sender.name}</title>
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background-color: ${eventConfig.branding.primaryColor}; color: white; padding: 30px 20px; text-align: center; }
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
                
                <p>schade, dass du nicht an unserem ${eventConfig.event.jubilee} Jubiläumsfest teilnehmen kannst. Wir haben deine Abmeldung erhalten und zur Kenntnis genommen.</p>
                
                <p>Falls sich doch noch etwas ändert und du teilnehmen möchtest, kannst du dich jederzeit wieder anmelden.</p>
                
                <div class="signature">
                    <p>Wir wünschen dir alles Gute!</p>
                    <p><strong>${eventConfig.sender.signature}</strong> 🐕</p>
                </div>
            </div>
            
            <div class="footer">
                <p>${eventConfig.sender.name} • ${eventConfig.event.jubilee} Hundesport mit Herz</p>
                <p>Diese E-Mail wurde automatisch generiert.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const msg = {
        to: data.email,
        from: {
            email: eventConfig.sender.email,
            name: eventConfig.sender.name
        },
        subject: `Abmeldung erhalten - ${eventConfig.event.shortTitle} Jubiläumsfest`,
        html: emailHtml,
    };

    try {
        await sgMail.send(msg);
        console.log("✅ Cancellation email sent successfully to:", data.email);
    } catch (error) {
        console.error("❌ Error sending cancellation email:", error.message);
        if (error.response) {
            console.error("❌ SendGrid response body:", JSON.stringify(error.response.body, null, 2));
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

        console.log("🎯 New registration created:", {
            docId: docId,
            name: data.name,
            email: data.email,
            teilnahme: data.teilnahme
        });

        if (data.teilnahme === "ja") {
            console.log("✅ Processing positive registration");
            // Handle positive registration
            await addOrUpdateSheet(data, docId, false); // false = new registration
            await sendConfirmationEmail(data, docId);
        } else {
            console.log("❌ Processing cancellation");
            // Handle cancellation
            await sendCancellationEmail(data);
        }
        
        console.log("🏁 Registration processing completed for:", data.name);
        return null;
    });

/**
 * Triggered when a registration is updated in Firestore.
 */
exports.handleUpdatedRegistration = functions.firestore
    .document("anmeldungen-fap-jubilaeum-25/{docId}")
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();
        const docId = context.params.docId;

        console.log("🔄 Registration updated:", {
            docId: docId,
            name: newData.name,
            email: newData.email,
            teilnahme: newData.teilnahme,
            hasLastModified: !!newData.lastModified
        });

        // Only process updates with lastModified (real user updates, not initial creation)
        if (newData.lastModified) {
            
            if (newData.teilnahme === "ja") {
                console.log("✅ Processing positive update");
                // Update existing row in Google Sheets
                await addOrUpdateSheet(newData, docId, true); // true = update
                await sendConfirmationEmail(newData, docId);
                console.log("✅ Update confirmation email sent for registration:", docId);
            } else {
                console.log("❌ Processing cancellation update");
                // Mark as cancelled in Google Sheets
                const auth = new google.auth.GoogleAuth({
                    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
                });
                const sheets = google.sheets({version: "v4", auth});
                await markAsCancelled(sheets, newData, docId);
                await sendCancellationEmail(newData);
                console.log("❌ Update cancellation email sent for registration:", docId);
            }
        } else {
            console.log("⏭️ Skipping processing for initial registration (no lastModified field)");
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