/**
 * WICHTIG: Dieser Code läuft auf den Google-Servern, nicht im Browser.
 * Er wird automatisch ausgeführt, wenn eine neue Anmeldung in die Datenbank geschrieben wird.
 */

// Benötigte Pakete importieren
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Firebase Admin initialisieren, um auf die Datenbank zugreifen zu können
admin.initializeApp();

// E-Mail-Versand konfigurieren (hier mit Gmail)
// HINWEIS: Für eine echte Anwendung einen professionellen Dienst wie SendGrid verwenden!
// Die Zugangsdaten werden sicher in der Umgebung gespeichert (siehe Anleitung).
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().nodemailer.user,
    pass: functions.config().nodemailer.pass,
  },
});

// Diese Funktion wird bei JEDER NEUEN Anmeldung ausgeführt
exports.sendConfirmationEmail = functions.firestore
  .document("anmeldungen/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const email = data.email;
    const name = data.name;

    // E-Mail-Inhalt und Betreff vorbereiten
    let subject = "";
    let htmlBody = "";
    const editUrl = `https://DEINE-GITHUB-PAGES-URL.github.io/DEIN-REPO/?edit=${data.registrationId}`;

    // Unterschiedliche E-Mail für Zu- und Absagen
    if (data.teilnahme === "ja") {
      subject = "Bestätigung deiner Anmeldung zum Jubiläumsfest!";
      const kosten = (parseInt(data.erwachsene) || 0) * 40 + (parseInt(data.kinder) || 0) * 15;

      htmlBody = `
        <h1>Hallo ${name},</h1>
        <p>vielen Dank für deine Anmeldung zu unserem Jubiläumsfest! Wir freuen uns sehr, dich dabei zu haben.</p>
        
        <h3>Deine Angaben (Factsheet)</h3>
        <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Teilnahme:</strong> Ja</li>
            <li><strong>Begleitpersonen:</strong> ${parseInt(data.erwachsene) || 0} Erw., ${parseInt(data.kinder) || 0} Kind(er)</li>
            <li><strong>Kosten für Gäste:</strong> ${kosten} CHF</li>
            <li><strong>Dessertbeitrag:</strong> ${data["dessert-beitrag"] === "ja" ? `Ja (${data["dessert-was"] || "Noch offen"})` : "Nein"}</li>
        </ul>
        
        <p>Falls du deine Angaben ändern möchtest, kannst du das über diesen Link tun:</p>
        <a href="${editUrl}">${editUrl}</a>
        
        <p>Herzliche Grüsse,<br>Das OK Jubiläumsfest</p>
      `;
    } else {
      subject = "Bestätigung deiner Abmeldung";
      htmlBody = `
        <h1>Hallo ${name},</h1>
        <p>wir haben deine Abmeldung für das Jubiläumsfest erhalten. Schade, dass du nicht dabei sein kannst!</p>
        <p>Falls du es dir anders überlegst, kannst du deine Antwort jederzeit über den folgenden Link ändern:</p>
        <a href="${editUrl}">${editUrl}</a>
        
        <p>Herzliche Grüsse,<br>Das OK Jubiläumsfest</p>
      `;
    }

    // E-Mail-Optionen
    const mailOptions = {
      from: `OK Jubiläumsfest <${functions.config().nodemailer.user}>`,
      to: email,
      subject: subject,
      html: htmlBody,
    };

    // E-Mail senden und auf Erfolg oder Fehler warten
    try {
      await transporter.sendMail(mailOptions);
      console.log(`E-Mail erfolgreich an ${email} gesendet.`);
      return null;
    } catch (error) {
      console.error("Fehler beim Senden der E-Mail:", error);
      return null;
    }
  });

  