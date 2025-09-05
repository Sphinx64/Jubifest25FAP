<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anmeldung zum 25-jährigen Jubiläum | Fun Agility People</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="styles.css">
    
    <!-- Referenz zur Konfigurationsdatei, die vom Workflow erstellt wird -->
    <script src="firebase-config.js"></script>
    
    <style>
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* --- Styles for Multi-Step Form --- */
        .form-step {
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        }
        .form-step.hidden {
            position: absolute;
            opacity: 0;
            transform: translateX(20px);
            pointer-events: none;
        }
        
        /* Progress Bar */
        .progress-step {
            transition: all 0.3s ease;
        }
        .progress-step.active .step-circle {
            background-color: #005a6a;
            border-color: #005a6a;
            color: white;
        }
        .progress-step.active .step-label {
            color: #005a6a;
            font-weight: 600;
        }
        .progress-step.completed .step-circle {
            background-color: #005a6a;
            border-color: #005a6a;
            color: white;
        }
        /* Line between steps */
        .progress-step:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 1rem; /* Adjusted for smaller circle */
            left: 50%;
            height: 2px;
            width: calc(100% - 2rem); 
            background-color: #e5e7eb; /* gray-200 */
            z-index: -1;
            transform: translateX(1rem);
        }
        .progress-step.completed::after {
            background-color: #005a6a;
        }

        /* Helper for showing/hiding sub-sections */
        .sub-section-container {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.3s ease-out;
        }
        .sub-section-container.open {
            grid-template-rows: 1fr;
        }
        .sub-section-content {
            overflow: hidden;
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen p-4 sm:p-6 bg-gray-100">

    <!-- Password Gate (Now with integrated Welcome Message) -->
    <div id="password-gate" class="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div class="fap-teal text-white p-6 text-center">
            <img src="logo.png" alt="Fun Agility People Logo" class="mx-auto h-16 w-auto mb-3">
            <h1 class="text-3xl sm:text-4xl font-bold">Willkommen zur Anmeldung!</h1>
            <p class="mt-2 opacity-90">Wir feiern 25 Jahre – sei dabei!</p>
        </div>
        <div class="p-8 text-center">
            <img src="logo_blau.png" alt="Fun Agility People Logo" class="mx-auto h-16 w-auto mb-6">
            <p class="text-lg text-gray-700 mb-4">Unser Verein wird <strong>stolze 25 Jahre</strong> alt. Das möchten wir gebührend mit euch feiern!</p>
            <p class="text-gray-600 mb-6">Bitte gib das Passwort aus der Einladung ein, um fortzufahren.</p>
            <form id="password-form" class="max-w-xs mx-auto">
                <input type="password" id="password-input" placeholder="Passwort" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 fap-focus-ring mb-4 text-center">
                <button type="submit" class="w-full fap-teal text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">Anmeldung starten</button>
                <p id="password-error" class="text-red-500 text-sm mt-3 h-4"></p>
            </form>
        </div>
    </div>

    <!-- Main Content (Form) -->
    <div id="main-content" class="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden hidden opacity-0">
        <div class="fap-teal text-white p-6 text-center">
            <img src="logo.png" alt="Fun Agility People Logo" class="mx-auto h-16 w-auto mb-3">
            <h1 class="text-3xl sm:text-4xl font-bold">Anmeldung zum Jubiläumsfest</h1>
            <p class="mt-2 opacity-90">Wir feiern 25 Jahre – sei dabei!</p>
        </div>

        <div id="anmeldung-container" class="p-6 sm:p-10">
            <form id="anmelde-formular">
                
                <!-- Progress Bar -->
                <div class="w-full max-w-xl mx-auto mb-8">
                    <div class="flex justify-between items-start">
                        <div class="progress-step text-center relative active" data-progress="1">
                            <div class="step-circle w-8 h-8 mx-auto rounded-full border-2 bg-white border-gray-300 flex items-center justify-center font-bold text-md text-gray-500">1</div>
                            <div class="step-label mt-2 text-xs text-gray-500">Teilnahme</div>
                        </div>
                        <div class="progress-step text-center relative" data-progress="2">
                            <div class="step-circle w-8 h-8 mx-auto rounded-full border-2 bg-white border-gray-300 flex items-center justify-center font-bold text-md text-gray-500">2</div>
                            <div class="step-label mt-2 text-xs text-gray-500">Essen</div>
                        </div>
                        <div class="progress-step text-center relative" data-progress="3">
                            <div class="step-circle w-8 h-8 mx-auto rounded-full border-2 bg-white border-gray-300 flex items-center justify-center font-bold text-md text-gray-500">✓</div>
                            <div class="step-label mt-2 text-xs text-gray-500">Bestätigung</div>
                        </div>
                    </div>
                </div>

                <!-- Form Steps Container -->
                <div class="relative">
                    <!-- Step 1: Participation & Companions -->
                    <div class="form-step" data-step="1">
                        <h3 class="text-2xl font-bold fap-teal-text mb-6 text-center">Deine Anmeldung</h3>
                        <div class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <label for="name" class="block text-lg font-semibold text-gray-700 mb-2">Dein Name</label>
                                    <input type="text" id="name" name="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 fap-focus-ring" placeholder="Max Mustermann">
                                </div>
                                <div>
                                    <label for="email" class="block text-lg font-semibold text-gray-700 mb-2">Deine E-Mail</label>
                                    <input type="email" id="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 fap-focus-ring" placeholder="max.mustermann@mail.com">
                                </div>
                            </div>
                            <div>
                                <fieldset>
                                    <legend class="block text-lg font-semibold text-gray-700 mb-2">Nimmst du teil?</legend>
                                    <div class="flex items-center gap-x-6 h-full">
                                        <label class="flex items-center cursor-pointer"><input type="radio" name="teilnahme" value="ja" required class="h-4 w-4 text-[#005a6a] border-gray-300 focus:ring-[#005a6a]"> <span class="ml-2 text-gray-800">Ja, ich bin dabei!</span></label>
                                        <label class="flex items-center cursor-pointer"><input type="radio" name="teilnahme" value="nein" class="h-4 w-4 text-[#005a6a] border-gray-300 focus:ring-[#005a6a]"> <span class="ml-2 text-gray-800">Nein, leider nicht.</span></label>
                                    </div>
                                </fieldset>
                            </div>
                            <!-- Companions section, shown conditionally -->
                            <div id="companions-container" class="sub-section-container">
                                <div class="sub-section-content">
                                     <div class="pt-2">
                                        <fieldset>
                                            <legend class="block text-lg font-semibold text-gray-700 mb-2">Bringst du Begleitpersonen mit?</legend>
                                            <div class="flex items-center gap-x-6">
                                                <label class="flex items-center cursor-pointer"><input type="radio" name="begleitung" value="ja" class="h-4 w-4 text-[#005a6a] fap-focus-ring"> <span class="ml-2">Ja</span></label>
                                                <label class="flex items-center cursor-pointer"><input type="radio" name="begleitung" value="nein" checked class="h-4 w-4 text-[#005a6a] fap-focus-ring"> <span class="ml-2">Nein</span></label>
                                            </div>
                                        </fieldset>
                                        <div id="begleitung-details" class="hidden mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div><label for="erwachsene" class="block text-sm font-medium">Anzahl zus. Erwachsene</label><input type="number" id="erwachsene" name="erwachsene" min="0" value="0" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg fap-focus-ring"></div>
                                            <div><label for="kinder" class="block text-sm font-medium">Anzahl Kinder (bis 14 J.)</label><input type="number" id="kinder" name="kinder" min="0" value="0" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg fap-focus-ring"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-8 flex justify-end">
                            <button type="button" id="next-to-step-2" class="fap-teal text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors text-lg">Weiter</button>
                        </div>
                    </div>

                    <!-- Step 2: Food & Dessert -->
                    <div class="form-step hidden" data-step="2">
                        <h3 class="text-2xl font-bold fap-teal-text mb-6 text-center">Essen & Dessert</h3>
                        <div class="space-y-6 pb-2">
                           <!-- Dynamic content is injected here -->
                        </div>
                         <div class="mt-8 flex justify-between">
                            <button type="button" id="back-to-step-1" class="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-colors text-lg">Zurück</button>
                            <button type="submit" id="submit-button" class="fap-teal text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors text-lg disabled:opacity-70 disabled:cursor-not-allowed">Anmeldung abschicken</button>
                        </div>
                    </div>
                </div>
                 <div id="validation-error" class="hidden text-center p-3 mt-4 bg-red-100 text-red-800 rounded-lg text-sm"></div>
            </form>
        </div>
        
        <!-- Step 3 / Success Screen -->
        <div id="success-container" class="hidden p-6 sm:p-10 text-center">
            <h2 class="text-3xl font-bold fap-teal-text">Vielen Dank!</h2>
            <p class="text-gray-700 mt-2 text-lg">Deine Anmeldung ist bei uns eingegangen. Du erhältst in Kürze eine Bestätigung per E-Mail.</p>
            
            <div class="mt-8 text-left bg-gray-50 p-6 rounded-lg border max-w-2xl mx-auto">
                <h3 class="font-bold text-xl mb-4 text-gray-800">Zur Erinnerung: Die Eckdaten</h3>
                <div class="space-y-2 text-gray-700">
                    <p><strong>Datum:</strong> Samstag, 18. Oktober 2025</p>
                    <p><strong>Zeit:</strong> ab 14:00 Uhr</p>
                    <p><strong>Ort:</strong> Schützenhaus Schönenbuch</p>
                </div>
            </div>

            <div class="mt-8 text-left bg-gray-100 p-6 rounded-lg border max-w-2xl mx-auto">
                <h3 class="font-bold text-xl mb-4 text-gray-800">Deine Angaben</h3>
                <div id="factsheet-content" class="space-y-2 text-gray-700"></div>
            </div>

            <div class="mt-6">
                <a id="ics-download-link" href="#" class="inline-block bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors">Kalendertermin (.ics) herunterladen</a>
            </div>
        </div>
        
        <!-- Cancellation Screen -->
        <div id="cancellation-container" class="hidden p-6 sm:p-10 text-center">
            <h2 class="text-3xl font-bold fap-teal-text">Abmeldung erhalten</h2>
            <p class="text-gray-700 mt-2 text-lg">Schade, dass du nicht dabei sein kannst!</p>
            <p class="text-sm text-gray-500 mt-2">Wir haben deine Abmeldung gespeichert und dir eine E-Mail gesendet.</p>
        </div>
    </div>

    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, collection, addDoc, onSnapshot, query } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        const CORRECT_PASSWORD = "Agility"; 
        const appId = 'fap-jubilaeum-25';
        const anmeldungenCollectionName = `anmeldungen-${appId}`;
        const dessertsCollectionName = `desserts-${appId}`;

        // DOM Elements
        const passwordGate = document.getElementById('password-gate');
        const mainContent = document.getElementById('main-content');
        const passwordForm = document.getElementById('password-form');
        const anmeldeFormular = document.getElementById('anmelde-formular');
        const anmeldungContainer = document.getElementById('anmeldung-container');
        const successContainer = document.getElementById('success-container');
        const cancellationContainer = document.getElementById('cancellation-container');
        const validationError = document.getElementById('validation-error');
        
        let currentStep = 1;

        // --- PASSWORD & POPUP --- 
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (document.getElementById('password-input').value === CORRECT_PASSWORD) {
                // Fade out password gate
                passwordGate.style.transition = 'opacity 0.5s';
                passwordGate.style.opacity = '0';
                
                setTimeout(() => {
                    passwordGate.classList.add('hidden');
                    // Show main content and fade it in
                    mainContent.classList.remove('hidden');
                    mainContent.style.transition = 'opacity 0.5s';
                    setTimeout(() => mainContent.style.opacity = '1', 20);
                }, 500);
            } else {
                document.getElementById('password-error').textContent = 'Falsches Passwort.';
            }
        });

        // --- MULTI-STEP LOGIC ---
        function goToStep(stepNumber) {
            const steps = document.querySelectorAll('.form-step');
            const progressSteps = document.querySelectorAll('.progress-step');
            
            steps.forEach(step => {
                const stepIsTarget = step.dataset.step == stepNumber;
                step.classList.toggle('hidden', !stepIsTarget);
            });

            progressSteps.forEach((step, index) => {
                const stepIndex = index + 1;
                step.classList.remove('active', 'completed');
                if (stepIndex < stepNumber) {
                    step.classList.add('completed');
                } else if (stepIndex === stepNumber) {
                    step.classList.add('active');
                }
            });

            currentStep = stepNumber;
        }

        document.getElementById('next-to-step-2').addEventListener('click', () => {
            const name = anmeldeFormular.elements.name.value;
            const email = anmeldeFormular.elements.email.value;
            const teilnahme = anmeldeFormular.elements.teilnahme.value;
            
            validationError.classList.add('hidden');
            if (!name || !email || !teilnahme) {
                validationError.textContent = "Bitte fülle alle Felder aus, um fortzufahren.";
                validationError.classList.remove('hidden');
                return;
            }

            if (teilnahme === 'ja') {
                const step2Container = document.querySelector('[data-step="2"] .space-y-6');
                renderStep2Details(step2Container);
                goToStep(2);
            } else {
                submitCancellation(name, email);
            }
        });

        document.getElementById('back-to-step-1').addEventListener('click', () => {
            goToStep(1);
        });

        anmeldeFormular.elements.teilnahme.forEach(radio => {
            radio.addEventListener('change', e => {
                const companionsContainer = document.getElementById('companions-container');
                companionsContainer.classList.toggle('open', e.target.value === 'ja');
            });
        });

        anmeldeFormular.addEventListener('change', e => {
            if (e.target.name === 'begleitung') {
                document.getElementById('begleitung-details').classList.toggle('hidden', e.target.value !== 'ja');
            }
        });

        function renderStep2Details(container) {
            container.innerHTML = `
                <div class="p-4 bg-gray-50 rounded-lg border">
                    <p class="block text-md font-semibold text-gray-700 mb-2">Was möchtet ihr essen?</p>
                    <p class="text-sm text-gray-500 mb-3">Bitte Gesamtzahl der Personen pro Gericht eintragen (inkl. dir und Begleitpersonen).</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label for="raclette_erwachsene" class="block text-sm font-medium">Anzahl Erw. für Raclette</label><input type="number" id="raclette_erwachsene" name="raclette_erwachsene" min="0" value="0" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg fap-focus-ring"></div>
                        <div><label for="fondue_erwachsene" class="block text-sm font-medium">Anzahl Erw. für Fondue</label><input type="number" id="fondue_erwachsene" name="fondue_erwachsene" min="0" value="0" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg fap-focus-ring"></div>
                    </div>
                    <div id="kinder-essen-details" class="hidden mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div><label for="raclette_kinder" class="block text-sm font-medium">Anzahl Kinder für Raclette</label><input type="number" id="raclette_kinder" name="raclette_kinder" min="0" value="0" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg fap-focus-ring"></div>
                         <div><label for="fondue_kinder" class="block text-sm font-medium">Anzahl Kinder für Fondue</label><input type="number" id="fondue_kinder" name="fondue_kinder" min="0" value="0" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg fap-focus-ring"></div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="p-4 bg-gray-50 rounded-lg border">
                        <fieldset>
                            <legend class="block text-md font-semibold text-gray-700 mb-2">Dessertbuffet-Beitrag</legend>
                            <div class="flex items-center gap-x-6">
                                <label class="flex items-center cursor-pointer"><input type="radio" name="dessert-beitrag" value="ja" checked class="h-4 w-4 text-[#005a6a] fap-focus-ring"> <span class="ml-2">Ja, gerne!</span></label>
                                <label class="flex items-center cursor-pointer"><input type="radio" name="dessert-beitrag" value="nein" class="h-4 w-4 text-[#005a6a] fap-focus-ring"> <span class="ml-2">Nein, danke.</span></label>
                            </div>
                        </fieldset>
                        <div id="dessert-details" class="mt-4"><label for="dessert-was" class="block text-sm font-medium">Was bringst du mit?</label><input type="text" id="dessert-was" name="dessert-was" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg fap-focus-ring" placeholder="z.B. Schokokuchen"></div>
                    </div>
                    <div class="bg-gray-50 rounded-lg border p-4"><h3 class="text-md font-semibold text-center mb-3">Live Dessert-Liste</h3><div id="dessert-liste" class="space-y-2 max-h-48 overflow-y-auto pr-2"></div></div>
                </div>
                 <div class="p-4 bg-gray-50 rounded-lg border">
                    <label for="bemerkungen" class="block text-md font-semibold text-gray-700 mb-2">Bemerkungen</label>
                    <textarea id="bemerkungen" name="bemerkungen" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg fap-focus-ring" placeholder="Allergien, besondere Wünsche, etc."></textarea>
                </div>
            `;
            attachStep2EventListeners();
        }

        function attachStep2EventListeners() {
            const kinderCount = parseInt(anmeldeFormular.elements.kinder.value, 10) || 0;
            document.getElementById('kinder-essen-details').classList.toggle('hidden', kinderCount <= 0);

            anmeldeFormular.elements['dessert-beitrag'].forEach(radio => {
                radio.addEventListener('change', e => document.getElementById('dessert-details').classList.toggle('hidden', e.target.value !== 'ja'));
            });
        }
        
        let db, auth;

        // --- FIREBASE & SUBMISSION ---
        function initializeAppLogic(firebaseApp) {
            db = getFirestore(firebaseApp);
            const dessertsRef = collection(db, dessertsCollectionName);

            onSnapshot(query(dessertsRef), (snapshot) => {
                const dessertListe = document.getElementById('dessert-liste');
                if (!dessertListe) return;
                dessertListe.innerHTML = snapshot.empty ? '<p class="text-xs text-gray-500 text-center">Sei der/die Erste!</p>' : '';
                snapshot.forEach(doc => {
                    dessertListe.innerHTML += `<div class="text-sm flex justify-between items-center bg-white p-2 rounded-md"><span class="font-medium text-gray-800">${doc.data().dessert}</span><span class="text-xs text-gray-500">${doc.data().name}</span></div>`;
                });
            });

            anmeldeFormular.addEventListener('submit', handleFormSubmit);
        }
        
        async function submitCancellation(name, email) {
            const submitButton = document.getElementById('next-to-step-2');
            submitButton.disabled = true;
            submitButton.textContent = 'Wird gesendet...';
            try {
                const anmeldungenRef = collection(db, anmeldungenCollectionName);
                await addDoc(anmeldungenRef, { name, email, teilnahme: 'nein', timestamp: new Date() });
                
                anmeldungContainer.classList.add('hidden');
                cancellationContainer.classList.remove('hidden');
            } catch (error) {
                validationError.textContent = 'Fehler: ' + error.message;
                validationError.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = 'Weiter';
            }
        }

        async function handleFormSubmit(e) {
            e.preventDefault();
            const submitButton = document.getElementById('submit-button');
            validationError.classList.add('hidden');
            submitButton.disabled = true;
            submitButton.textContent = 'Wird gesendet...';

            const formData = new FormData(anmeldeFormular);
            const data = Object.fromEntries(formData.entries());

            try {
                const teilnehmer = 1 + (parseInt(data.erwachsene) || 0);
                const kinder = (parseInt(data.kinder) || 0);
                const essenErwachsene = (parseInt(data.raclette_erwachsene) || 0) + (parseInt(data.fondue_erwachsene) || 0);
                const essenKinder = (parseInt(data.raclette_kinder) || 0) + (parseInt(data.fondue_kinder) || 0);

                if (teilnehmer !== essenErwachsene) throw new Error(`Anzahl Erwachsene (${teilnehmer}) stimmt nicht mit Essensbestellungen (${essenErwachsene}) überein.`);
                if (kinder !== essenKinder) throw new Error(`Anzahl Kinder (${kinder}) stimmt nicht mit Essensbestellungen (${essenKinder}) überein.`);
                if (data['dessert-beitrag'] === 'ja' && !data['dessert-was']) throw new Error('Bitte gib an, welches Dessert du mitbringst.');

                const anmeldungenRef = collection(db, anmeldungenCollectionName);
                const dessertsRef = collection(db, dessertsCollectionName);

                const docRef = await addDoc(anmeldungenRef, { ...data, timestamp: new Date() });
                if (data['dessert-beitrag'] === 'ja' && data['dessert-was']) {
                    await addDoc(dessertsRef, { name: data.name, dessert: data['dessert-was'], anmeldungId: docRef.id });
                }

                showSuccessScreen(data);

            } catch (error) {
                validationError.textContent = 'Fehler: ' + error.message;
                validationError.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = 'Anmeldung abschicken';
            }
        }

        function showSuccessScreen(data) {
            const essenItems = [];
            if (parseInt(data.raclette_erwachsene) > 0) essenItems.push(`${data.raclette_erwachsene}x Raclette Erw.`);
            if (parseInt(data.fondue_erwachsene) > 0) essenItems.push(`${data.fondue_erwachsene}x Fondue Erw.`);
            if (parseInt(data.raclette_kinder) > 0) essenItems.push(`${data.raclette_kinder}x Raclette Kind`);
            if (parseInt(data.fondue_kinder) > 0) essenItems.push(`${data.fondue_kinder}x Fondue Kind`);
            const essenText = essenItems.length > 0 ? essenItems.join(', ') : 'Keine Auswahl';

             let factsheetHTML = `
                <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
                <p><strong>E-Mail:</strong> ${data.email || 'N/A'}</p>
                <p><strong>Teilnahme:</strong> Ja</p>
                <p><strong>Begleitung:</strong> ${parseInt(data.erwachsene) || 0} Erw., ${parseInt(data.kinder) || 0} Kind(er)</p>
                <p><strong>Essen:</strong> ${essenText}</p>
                <p><strong>Dessert:</strong> ${data['dessert-beitrag'] === 'ja' ? (data['dessert-was'] || 'Ja') : 'Nein'}</p>
            `;
            if (data.bemerkungen) {
                factsheetHTML += `<p><strong>Bemerkungen:</strong> ${data.bemerkungen}</p>`;
            }
            document.getElementById('factsheet-content').innerHTML = factsheetHTML;
            document.getElementById('ics-download-link').href = generateICS();
            anmeldungContainer.classList.add('hidden');
            successContainer.classList.remove('hidden');
            goToStep(3); // Update progress bar to final step
        }

        function generateICS() {
            const event = {
                title: "Jubiläumsfest Fun Agility People",
                description: "25 Jahre FAP! Apéro, Spaziergang, Essen und gemütliches Beisammensein.",
                location: "Schützenhaus Schönenbuch",
                startTime: "20251018T120000Z", // 14:00 in CEST (UTC+2)
                endTime: "20251018T200000Z",   // 22:00 in CEST (UTC+2)
            };
            const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//FunAgilityPeople//NONSGML v1.0//EN\nBEGIN:VEVENT\nUID:${Date.now()}@fun-agility-people.ch\nDTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}\nDTSTART:${event.startTime}\nDTEND:${event.endTime}\nSUMMARY:${event.title}\nDESCRIPTION:${event.description}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;
            return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
        }

        // --- APP INITIALIZATION ---
        try {
            if (typeof firebaseConfig === 'undefined' || !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('__')) {
                 throw new Error("Firebase config is not correctly loaded.");
            }
            const app = initializeApp(firebaseConfig); 
            auth = getAuth(app);
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    initializeAppLogic(app);
                } else {
                    signInAnonymously(auth).catch((error) => {
                        console.error("Anonymous sign-in failed:", error);
                        document.body.innerHTML = '<div class="text-center p-8">Authentifizierung fehlgeschlagen. Bitte laden Sie die Seite neu.</div>';
                    });
                }
            });
        } catch (e) {
            console.error("Firebase initialization failed:", e);
            document.body.innerHTML = `<div class="text-center p-8">${e.message}</div>`;
        }
    </script>
</body>
</html>

