// =================================================================
// 📁 DATEI 1: event-config.js (Root-Verzeichnis)
// 📁 DATEI 2: functions/event-config.js
// =================================================================
// BEIDE Dateien müssen identisch sein!

const eventConfig = {
    // === GRUNDLEGENDE EVENT-DATEN ===
    event: {
        title: "25-jähriges Jubiläum Fun Agility People",
        shortTitle: "25 Jahre FAP",
        jubilee: "25 Jahre",
        description: "Apéro, Spaziergang, Essen und gemütliches Beisammensein"
    },

    // === DATUM UND ZEIT ===
    datetime: {
        date: "Samstag, 18. Oktober 2025",
        shortDate: "18.10.2025", 
        startTime: "14:00 Uhr",
        endTime: "22:00 Uhr",
        // Für .ics Kalender (UTC Format)
        icsStart: "20251018T120000Z", // 14:00 CEST = 12:00 UTC
        icsEnd: "20251018T200000Z"    // 22:00 CEST = 20:00 UTC
    },

    // === LOCATION ===
    location: {
        name: "Schützenhaus Schönenbuch",
        fullName: "Schützenhaus Schönenbuch",
        address: "Schönenbuch",
        googleMapsLink: "https://maps.app.goo.gl/9Txcm6CBV6H1cMkx9",
        coordinates: {
            lat: 47.5255,
            lng: 7.5095
        }
    },

    // === ANMELDUNG ===
    registration: {
        deadline: "Dienstag, 9. September 2025",
        shortDeadline: "09.09.2025",
        // ✅ KORRIGIERT: GitHub Pages URL (deine aktuelle URL)
        url: "https://sphinx64.github.io/Jubifest25FAP",
        password: "Agility",
        // ✅ KORRIGIERT: QR-Code mit GitHub Pages URL
        qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://sphinx64.github.io/Jubifest25FAP/"
    },

    // === PREISE ===
    pricing: {
        members: "kostenlos",
        membersNote: "Mitglieder (Aktiv und Passiv) sind eingeladen",
        adultsPrice: "40 CHF",
        childrenPrice: "15 CHF", 
        childrenAgeLimit: "bis 14 Jahre",
        paymentMethods: "Bar oder Twint vor Ort"
    },

    // === PROGRAMM ===
    program: [
        { time: "14:00 Uhr", activity: "Offizielle Begrüssung und Apéro" },
        { time: "15:00 Uhr", activity: "Gemeinsamer Spaziergang" },
        { time: "17:00 Uhr", activity: "Jubiläums-Quizz" },
        { time: "18:00 Uhr", activity: "Fondue oder Raclette" },
        { time: "Anschliessend", activity: "Dessertbuffet, Drinks und Musik" }
    ],

    // === KONTAKT ===
    contact: {
        name: "Martin Thalmann",
        phone: "+41 78 684 11 17",
        formattedPhone: "(+41 78 684 11 17)"
    },

    // === ORGANISATORISCHES ===
    logistics: {
        parking: "Beim Schiessclub vorhanden",
        notes: [
            "Hunde sind herzlich willkommen!",
            "Bei schlechtem Wetter findet das Event trotzdem statt."
        ]
    },

    // === ABSENDER FÜR E-MAILS ===
    sender: {
        name: "Fun Agility People",
        email: "grafpia@gmail.com",
        signature: "Das OK und der Vorstand"
    },

    // === DESIGN/BRANDING ===
    branding: {
        primaryColor: "#005a6a",
        logoUrl: "logo.png",
        websiteUrl: "https://fun-agility-people.ch"
    }
};

// Export für Node.js (Firebase Functions)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = eventConfig;
}

// Global verfügbar für Browser
if (typeof window !== 'undefined') {
    window.eventConfig = eventConfig;
}