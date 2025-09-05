const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get SendGrid API key from Firebase environment configuration
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const SENDER_EMAIL = functions.config().sendgrid.sender;
sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * Triggered when a new registration is created in Firestore.
 * It sends a confirmation or cancellation email.
 */
exports.sendConfirmationEmail = functions.firestore
    .document("anmeldungen-fap-jubilaeum-25/{docId}")
    .onCreate((snap, context) => {
      const data = snap.data();
      const docId = context.params.docId;

      // Email content
      const to = data.email;
      const from = SENDER_EMAIL;
      let subject = "";
      let html = "";

      if (data.teilnahme === "ja") {
        // --- Confirmation Email for Participants ---
        subject = "Bestätigung deiner Anmeldung zum FAP Jubiläumsfest!";

        // Create a clean summary of the food order
        const essenItems = [];
        if (parseInt(data.raclette_erwachsene) > 0) {
          essenItems.push(`${data.raclette_erwachsene}x Raclette Erw.`);
        }
        if (parseInt(data.fondue_erwachsene) > 0) {
          essenItems.push(`${data.fondue_erwachsene}x Fondue Erw.`);
        }
        if (parseInt(data.raclette_kinder) > 0) {
          essenItems.push(`${data.raclette_kinder}x Raclette Kind`);
        }
        if (parseInt(data.fondue_kinder) > 0) {
          essenItems.push(`${data.fondue_kinder}x Fondue Kind`);
        }
        const essenText = essenItems.length > 0 ?
          essenItems.join(", ") : "Keine Auswahl";

        const aenderungslink = `https://fap-jubilaeum-25.web.app/index.html?id=${docId}`;

        // Create iCalendar data
        const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FAP//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${docId}@fap-jubilaeum-25.web.app
DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}Z
DTSTART:20251018T120000Z
DTEND:20251018T220000Z
SUMMARY:FAP Jubiläumsfest
DESCRIPTION:Jubiläumsfest der Fun Agility People. Details siehe unter ${aenderungslink}
LOCATION:Schützenhaus Schönenbuch
END:VEVENT
END:VCALENDAR`;

        const calLink = `data:text/calendar;charset=utf8,${encodeURIComponent(icsData)}`;

        html = `
          <p>Hallo ${data.name},</p>
          <p>vielen Dank für deine Anmeldung zu unserem Jubiläumsfest! 
          Wir freuen uns riesig, mit dir zu feiern.</p>
          <p><strong>Hier sind deine Angaben in der Übersicht:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Begleitung:</strong> ${data.erwachsene || 0} Erw., ${data.kinder || 0} Kind(er)</li>
            <li><strong>Essen:</strong> ${essenText}</li>
            <li><strong>Dessert:</strong> ${data["dessert-beitrag"] === "ja" ? (data["dessert-was"] || "Ja") : "Nein"}</li>
            ${data.bemerkungen ? `<li><strong>Bemerkungen:</strong> ${data.bemerkungen}</li>` : ""}
          </ul>
          <hr>
          <p><strong>Zur Erinnerung die Eckdaten:</strong></p>
          <ul>
            <li><strong>Datum:</strong> Samstag, 18. Oktober 2025</li>
            <li><strong>Zeit:</strong> ab 14:00 Uhr</li>
            <li><strong>Ort:</strong> Schützenhaus Schönenbuch</li>
          </ul>
          <p>
            <a href="${calLink}">Kalendereintrag herunterladen</a> |
            <a href="${aenderungslink}">Anmeldung bearbeiten</a>
          </p>
          <p>Herzliche Grüsse,<br>Das OK und der Vorstand der Fun Agility People</p>
        `;
      } else {
        // --- "Sorry to see you go" Email for Cancellations ---
        subject = "Schade, bist du nicht dabei | FAP Jubiläumsfest";
        html = `
          <p>Hallo ${data.name},</p>
          <p>wir haben deine Abmeldung für unser Jubiläumsfest erhalten. 
          Schade, dass du nicht dabei sein kannst!</p>
          <p>Falls sich deine Pläne ändern, kannst du dich jederzeit 
          einfach erneut über die Webseite anmelden.</p>
          <p>Herzliche Grüsse,<br>Das OK und der Vorstand der Fun Agility People</p>
        `;
      }

      const msg = {to, from, subject, html};

      return sgMail.send(msg)
          .then(() => console.log("Email sent to", to))
          .catch((error) => {
            console.error("Error sending email:", error.toString());
          });
    });
