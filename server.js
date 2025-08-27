// server.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Use promises version of fs
const { Pool } = require('pg'); // Import the Pool from pg

const app = express();
const port = 3000; // Or any port you prefer

// --- PostgreSQL Database Configuration ---
// It's recommended to use environment variables for sensitive data
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',       // e.g., 'postgres'
    host: process.env.DB_HOST || 'localhost',          // e.g., 'localhost' or your DB host
    database: process.env.DB_NAME || 'bible_db',       // e.g., 'bible_db'
    password: process.env.DB_PASSWORD || '12345', // e.g., 'mysecretpassword'
    port: process.env.DB_PORT || 5432,                 // Default PostgreSQL port
});

// Test the database connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release(); // Release the client back to the pool
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Database connected successfully at:', result.rows[0].now);
    });
});

// --- Helper Data and Mappings (Server-side) ---
// Hardcoded mapping from book abbreviation to book ID (Corrected based on db.md)
const bookAbbreviationToIdMap = {
    "GEN": 1, "EXO": 2, "LEV": 3, "NUM": 4, "DEU": 5, "JOS": 6, "JDG": 7, "RUT": 8,
    "1SA": 9, "2SA": 10, "1KI": 11, "2KI": 12, "1CH": 13, "2CH": 14, "EZR": 15, "NEH": 16,
    "EST": 17, "JOB": 18, "PSA": 19, "PRO": 20, "ECC": 21, "SNG": 22, "ISA": 23, "JER": 24,
    "LAM": 25, "EZE": 26, "DAN": 27, "HOS": 28, "JOL": 29, "AMO": 30, "OBA": 31, "JON": 32,
    "MIC": 33, "NAH": 34, "HAB": 35, "ZEP": 36, "HAG": 37, "ZEC": 38, "MAL": 39,
    "MAT": 40, "MAR": 41, "LUK": 42, "JHN": 43, "ACT": 44, "ROM": 45, "1CO": 46, "2CO": 47,
    "GAL": 48, "EPH": 49, "PHP": 50, "COL": 51, "1TH": 52, "2TH": 53, "1TI": 54, "2TI": 55,
    "TIT": 56, "PHM": 57, "HEB": 58, "JAM": 59, "1PE": 60, "2PE": 61, "1JO": 62, "2JO": 63,
    "3JO": 64, "JDE": 65, "REV": 66
};

// Hardcoded mapping from translation abbreviation to translation ID (Corrected based on db.md)
const translationAbbreviationToIdMap = {
    "KJV": 1,
    "NIV": 2,
    "NKJV": 3,
    "AMP": 4,
    "AMPC": 5,
    "TPT": 6,
    "ESV": 7,
    "NLT": 8
};

// Hardcoded mapping from translation ID to abbreviation (Corrected based on db.md)
const translationIdToAbbreviationMap = {
    1: "KJV",
    2: "NIV",
    3: "NKJV",
    4: "AMP",
    5: "AMPC",
    6: "TPT",
    7: "ESV",
    8: "NLT"
};

// Function to get the full book name from its abbreviation (Corrected based on db.md)
function getBookNameFromAbbreviation(abbr) {
    const bookNames = {
        "GEN": "Genesis", "EXO": "Exodus", "LEV": "Leviticus", "NUM": "Numbers", "DEU": "Deuteronomy",
        "JOS": "Joshua", "JDG": "Judges", "RUT": "Ruth", "1SA": "1 Samuel", "2SA": "2 Samuel",
        "1KI": "1 Kings", "2KI": "2 Kings", "1CH": "1 Chronicles", "2CH": "2 Chronicles",
        "EZR": "Ezra", "NEH": "Nehemiah", "EST": "Esther", "JOB": "Job", "PSA": "Psalms",
        "PRO": "Proverbs", "ECC": "Ecclesiastes", "SNG": "Song of Songs", "ISA": "Isaiah", // Corrected SNG
        "JER": "Jeremiah", "LAM": "Lamentations", "EZE": "Ezekiel", "DAN": "Daniel",
        "HOS": "Hosea", "JOL": "Joel", "AMO": "Amos", "OBA": "Obadiah", "JON": "Jonah",
        "MIC": "Micah", "NAH": "Nahum", "HAB": "Habakkuk", "ZEP": "Zephaniah", "HAG": "Haggai",
        "ZEC": "Zechariah", "MAL": "Malachi", "MAT": "Matthew", "MAR": "Mark", "LUK": "Luke",
        "JHN": "John", "ACT": "Acts", "ROM": "Romans", "1CO": "1 Corinthians", "2CO": "2 Corinthians",
        "GAL": "Galatians", "EPH": "Ephesians", "PHP": "Philippians", "COL": "Colossians",
        "1TH": "1 Thessalonians", "2TH": "2 Thessalonians", "1TI": "1 Timothy", "2TI": "2 Timothy",
        "TIT": "Titus", "PHM": "Philemon", "HEB": "Hebrews", "JAM": "James", "1PE": "1 Peter",
        "2PE": "2 Peter", "1JO": "1 John", "2JO": "2 John", "3JO": "3 John", // Corrected PHM, HEB, JAM, 1PE, 2PE, 1JO, 2JO, 3JO
        "JDE": "Jude", "REV": "Revelation" // Corrected JDE, REV
    };
    return bookNames[abbr] || "Unknown Book";
}

// Hardcoded chapter counts for each book (Corrected based on db.md)
const bookChapterCounts = {
    "GEN": 50, "EXO": 40, "LEV": 27, "NUM": 36, "DEU": 34, "JOS": 24, "JDG": 21, "RUT": 4,
    "1SA": 31, "2SA": 24, "1KI": 22, "2KI": 25, "1CH": 29, "2CH": 36, "EZR": 10, "NEH": 13,
    "EST": 10, "JOB": 42, "PSA": 150, "PRO": 31, "ECC": 12, "SNG": 8, "ISA": 66, "JER": 52,
    "LAM": 5, "EZE": 48, "DAN": 12, "HOS": 14, "JOL": 3, "AMO": 9, "OBA": 1, "JON": 4,
    "MIC": 7, "NAH": 3, "HAB": 3, "ZEP": 3, "HAG": 2, "ZEC": 14, "MAL": 4, "MAT": 28,
    "MAR": 16, "LUK": 24, "JHN": 21, "ACT": 28, "ROM": 16, "1CO": 16, "2CO": 13, "GAL": 6,
    "EPH": 6, "PHP": 4, "COL": 4, "1TH": 5, "2TH": 3, "1TI": 6, "2TI": 4, "TIT": 3,
    "PHM": 1, "HEB": 13, "JAM": 5, "1PE": 5, "2PE": 3, "1JO": 5, "2JO": 1, "3JO": 1,
    "JDE": 1, "REV": 22
};

// Middleware to serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Route for the main landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Route for the simplified URL format (e.g., /GEN.1.KJV)
// This route will perform server-side rendering
app.get('/:bookAbbr.:chapterNum.:versionAbbr', async (req, res) => {
    const { bookAbbr, chapterNum, versionAbbr } = req.params;

    const bookId = bookAbbreviationToIdMap[bookAbbr.toUpperCase()];
    const translationId = translationAbbreviationToIdMap[versionAbbr.toUpperCase()];
    const parsedChapterNum = parseInt(chapterNum);

    // Basic validation for URL parameters
    if (!bookId || isNaN(parsedChapterNum) || !translationId) {
        // Render a generic error page or redirect to main
        return res.status(400).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Error</title></head>
            <body>
                <h1>Invalid URL</h1>
                <p>The requested book, chapter, or version is invalid. Please check the URL format (e.g., /GEN.1.NKJV).</p>
                <a href="/">Back to Main Page</a>
            </body>
            </html>
        `);
    }

    try {
        // 1. Fetch chapter data from the database
        const query = `
            SELECT versenumber, versetext
            FROM verses
            WHERE bookid = $1 AND chapternumber = $2 AND translationid = $3
            ORDER BY versenumber;
        `;
        const result = await pool.query(query, [bookId, parsedChapterNum, translationId]);

        const verses = result.rows.map(row => ({
            verseNumber: row.versenumber,
            verseText: row.versetext
        }));

        const fullBookName = getBookNameFromAbbreviation(bookAbbr.toUpperCase());
        const totalChapters = bookChapterCounts[bookAbbr.toUpperCase()];
        const versionAbbrCaps = versionAbbr.toUpperCase(); // Capitalize for consistency

        // Prepare HTML for verses
        let versesHtml = '<p>Loading verses...</p>'; // Default loading message
        if (verses.length > 0) {
            versesHtml = verses.map(verse => `<p><span class="verse-number">${verse.verseNumber}</span>${verse.verseText}</p>`).join('');
        } else {
            versesHtml = `<p>No verses found for ${fullBookName} Chapter ${parsedChapterNum} in ${versionAbbrCaps}.</p>`;
        }


        // 2. Read the chapter.html file
        let chapterHtmlContent = await fs.readFile(path.join(__dirname, 'chapter.html'), 'utf8');

        // 3. Inject the fetched data into the HTML
        // Update document title
        chapterHtmlContent = chapterHtmlContent.replace(
            '<title>Scriptura</title>', // Original title in chapter.html
            `<title>Scriptura - ${fullBookName} Chapter ${parsedChapterNum} (${versionAbbrCaps})</title>`
        );
        // Update header title (chapterTitleEl on client side)
        chapterHtmlContent = chapterHtmlContent.replace(
            '<h1 id="chapterTitle" class="text-2xl font-bold text-gray-900"></h1>', // This is for client-side update
            `<h1 id="chapterTitle" class="text-2xl font-bold text-gray-900">${fullBookName} Chapter ${parsedChapterNum}</h1>`
        );
        // Update chapter content
        chapterHtmlContent = chapterHtmlContent.replace(
            '<div id="chapter-content"></div>', // Empty div on client side
            `<div id="chapter-content">${versesHtml}</div>`
        );

        // Inject data attributes for client-side script.js
        chapterHtmlContent = chapterHtmlContent.replace(
            '<body data-book-abbr="" data-chapter-num="" data-translation-id="" data-version-abbr="" data-total-chapters="">',
            `<body data-book-abbr="${bookAbbr.toUpperCase()}" data-chapter-num="${parsedChapterNum}" data-translation-id="${translationId}" data-version-abbr="${versionAbbrCaps}" data-total-chapters="${totalChapters}">`
        );


        // 4. Send the modified HTML as the response
        res.send(chapterHtmlContent);

    } catch (err) {
        console.error('Server-side rendering error:', err);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Error</title></head>
            <body>
                <h1>Error Loading Chapter</h1>
                <p>Failed to load ${bookAbbr}.${chapterNum}.${versionAbbr}. Please try again.</p>
                <a href="/">Back to Main Page</a>
            </body>
            </html>
        `);
    }
});

// Route to display a specific chapter page (now redirects to a simplified URL)
app.get('/chapter.html', (req, res) => {
    const { translation, book, chapter, version } = req.query;

    if (translation && book && chapter && version) {
        // Convert to simplified URL format and redirect
        // Prioritize the 'version' query parameter, otherwise use 'translationIdToAbbreviationMap'
        const versionAbbr = version ? version.toUpperCase() : (translationIdToAbbreviationMap[parseInt(translation)] || 'NKJV');
        res.redirect(`/${book.toUpperCase()}.${chapter}.${versionAbbr}`);
    } else {
        // Default redirect if no params provided, default to Genesis 1 NKJV
        res.redirect('/GEN.1.NKJV');
    }
});

// API endpoint to get chapter verses data from the database (still needed for client-side navigation)
app.get('/api/chapter', async (req, res) => {
    const { translation, book, chapter, version } = req.query; // 'version' is now also expected

    const bookAbbr = book.toUpperCase();
    const parsedChapterNum = parseInt(chapter);
    const parsedTranslationId = parseInt(translation); // This comes from client-side script.js

    if (!bookAbbr || isNaN(parsedChapterNum) || isNaN(parsedTranslationId)) {
        return res.status(400).json({ error: 'Missing or invalid parameters for chapter API.' });
    }

    const bookId = bookAbbreviationToIdMap[bookAbbr];
    if (typeof bookId === 'undefined') {
        return res.status(404).json({ error: `Book abbreviation '${bookAbbr}' not found.` });
    }

    try {
        const query = `
            SELECT versenumber, versetext
            FROM verses
            WHERE bookid = $1 AND chapternumber = $2 AND translationid = $3
            ORDER BY versenumber;
        `;
        const result = await pool.query(query, [bookId, parsedChapterNum, parsedTranslationId]);

        const verses = result.rows.map(row => ({
            verseNumber: row.versenumber,
            verseText: row.versetext
        }));

        const fullBookName = getBookNameFromAbbreviation(bookAbbr);
        const totalChapters = bookChapterCounts[bookAbbr];
        // Ensure versionAbbr is correctly derived for the API response
        const versionAbbr = version ? version.toUpperCase() : translationIdToAbbreviationMap[parsedTranslationId];

        res.json({
            translationId: parsedTranslationId,
            bookAbbreviation: bookAbbr,
            bookName: fullBookName,
            chapterNumber: parsedChapterNum,
            versionAbbreviation: versionAbbr,
            verses: verses,
            totalChapters: totalChapters
        });

    } catch (err) {
        console.error('Database query error (API):', err);
        res.status(500).json({ error: 'Failed to retrieve verses from database.', details: err.message });
    }
});

// API endpoint to get all available translations
app.get('/api/translations', async (req, res) => {
    try {
        const result = await pool.query('SELECT translationid, abbreviation, name FROM translations ORDER BY name;');
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error (translations API):', err);
        res.status(500).json({ error: 'Failed to retrieve translations.', details: err.message });
    }
});

// NEW: API endpoint to get all books for a specific testament
app.get('/api/books/:testament', async (req, res) => {
    const { testament } = req.params;
    let testamentId;

    if (testament.toLowerCase() === 'old-testament') {
        testamentId = 1;
    } else if (testament.toLowerCase() === 'new-testament') {
        testamentId = 2;
    } else {
        return res.status(400).json({ error: 'Invalid testament specified. Use "old-testament" or "new-testament".' });
    }

    try {
        const query = `
            SELECT bookid, name, abbreviation, chapters
            FROM books
            WHERE testamentid = $1
            ORDER BY bookid;
        `;
        const result = await pool.query(query, [testamentId]);
        res.json(result.rows);
    } catch (err) {
        console.error(`Database query error (books API for ${testament}):`, err);
        res.status(500).json({ error: `Failed to retrieve books for ${testament}.`, details: err.message });
    }
});


// NEW: Route for Old Testament Books list page
app.get('/old-testament', (req, res) => {
    res.sendFile(path.join(__dirname, 'old_testament.html'));
});

// NEW: Route for New Testament Books list page
app.get('/new-testament', (req, res) => {
    res.sendFile(path.join(__dirname, 'new_testament.html'));
});


// NEW: Shutdown endpoint for local development
app.post('/api/shutdown', (req, res) => {
    console.log('Received shutdown request. Shutting down server...');
    res.status(200).send('Server is shutting down. Please close your browser tab.');

    // This is important: Terminate the Node.js process after a short delay
    // This allows the response to be sent before the server goes down
    setTimeout(() => {
        process.exit(0); // Exit with a success code
    }, 100); // Small delay to ensure response is sent
});


// Basic search API endpoint (conceptual - requires proper database search implementation)
app.get('/api/search', (req, res) => {
    const query = req.query.q;
    console.log(`Search query received: ${query}`);
    res.json({ results: [`Mock search result for "${query}"`] });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Example chapter URL: http://localhost:${port}/GEN.1.KJV`); // Updated default
});
