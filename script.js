// script.js
document.addEventListener('DOMContentLoaded', async () => {
    const chapterTitleEl = document.getElementById('chapterTitle');
    const chapterContentEl = document.getElementById('chapter-content');
    // Removed bookNameSubtitleEl as it's no longer in HTML and caused null errors.
    const chapterListEl = document.getElementById('chapterList');
    const verseToggle = document.getElementById('verseToggle');
    const versionSelect = document.getElementById('versionSelect'); // Main Version Select dropdown
    const prevChapterBtn = document.getElementById('prevChapterBtn');
    const nextChapterBtn = document.getElementById('nextChapterBtn');

    // Sidebar and menu button elements
    const leftSidebar = document.getElementById('leftSidebar');
    const rightSidebar = document.getElementById('rightSidebar');
    const leftMenuBtn = document.getElementById('leftMenuBtn');
    const leftMenuBtnInHeader = document.getElementById('leftMenuBtnInHeader');
    const rightMenuBtn = document.getElementById('rightMenuBtn');
    const rightMenuBtnInHeader = document.getElementById('rightMenuBtnInHeader');

    // Split Screen and related elements
    const singleChapterView = document.getElementById('singleChapterView');
    const splitChapterView2 = document.getElementById('splitChapterView2');
    const splitChapterView3 = document.getElementById('splitChapterView3');
    const mainContent = document.getElementById('mainContent');
    // Select all split view selects within the #splitScreenOptions div
    const versionSelectsSplit = document.querySelectorAll('#splitScreenOptions .versionSelectSplit');
    const minimizeVersionNamesToggle = document.getElementById('minimizeVersionNamesToggle');

    // Split screen toggles (checkboxes)
    const toggleView2 = document.getElementById('toggleView2');
    const toggleView3 = document.getElementById('toggleView3');
    const versionSelectView1 = document.getElementById('versionSelectView1');
    const versionSelectView2 = document.getElementById('versionSelectView2');
    const versionSelectView3 = document.getElementById('versionSelectView3');

    // Version Name H3 elements for split views
    const singleViewVersionNameEl = document.getElementById('singleViewVersionName');
    const splitView2VersionNameEl = document.getElementById('splitView2VersionName');
    const splitView3VersionNameEl = document.getElementById('splitView3VersionName');

    // Close Server Button
    const shutdownServerBtn = document.getElementById('shutdownServerBtn');

    let currentTranslationId;
    let currentBookAbbr;
    let currentChapterNum;
    let currentVersionAbbr;
    let totalChaptersInBook;
    let availableTranslations = []; // To store fetched translations

    // --- Start: Data copied from server.js for client-side use ---
    // Hardcoded mapping from book abbreviation to book ID
    const bookAbbreviationToIdMap = {
        "GEN": 1, "EXO": 2, "LEV": 3, "NUM": 4, "DEU": 5, "JOS": 6, "JDG": 7, "RUT": 8,
        "1SA": 9, "2SA": 10, "1KI": 11, "2KI": 12, "1CH": 13, "2CH": 14, "EZR": 15, "NEH": 16,
        "EST": 17, "JOB": 18, "PSA": 150, "PRO": 31, "ECC": 12, "SNG": 8, "ISA": 66, "JER": 52,
        "LAM": 5, "EZE": 48, "DAN": 12, "HOS": 14, "JOL": 3, "AMO": 9, "OBA": 1, "JON": 4,
        "MIC": 7, "NAH": 3, "HAB": 3, "ZEP": 3, "HAG": 2, "ZEC": 14, "MAL": 4, "MAT": 28,
        "MAR": 16, "LUK": 24, "JHN": 21, "ACT": 28, "ROM": 16, "1CO": 16, "2CO": 13, "GAL": 6,
        "EPH": 6, "PHP": 4, "COL": 4, "1TH": 5, "2TH": 3, "1TI": 6, "2TI": 4, "TIT": 3,
        "PHM": 1, "HEB": 13, "JAM": 5, "1PE": 5, "2PE": 3, "1JO": 5, "2JO": 1, "3JO": 1,
        "JDE": 1, "REV": 22
    };

    // Hardcoded chapter counts for each book
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

    // Function to get the full book name from its abbreviation (now client-side)
    function getBookNameFromAbbreviation(abbr) {
        const bookNames = {
            "GEN": "Genesis", "EXO": "Exodus", "LEV": "Leviticus", "NUM": "Numbers", "DEU": "Deuteronomy",
            "JOS": "Joshua", "JDG": "Judges", "RUT": "Ruth", "1SA": "1 Samuel", "2SA": "2 Samuel",
            "1KI": "1 Kings", "2KI": "2 Kings", "1CH": "1 Chronicles", "2CH": "2 Chronicles",
            "EZR": "Ezra", "NEH": "Nehemiah", "EST": "Esther", "JOB": "Job", "PSA": "Psalms",
            "PRO": "Proverbs", "ECC": "Ecclesiastes", "SNG": "Song of Solomon", "ISA": "Isaiah",
            "JER": "Jeremiah", "LAM": "Lamentations", "EZE": "Ezekiel", "DAN": "Daniel",
            "HOS": "Hosea", "JOL": "Joel", "AMO": "Amos", "OBA": "Obadiah", "JON": "Jonah",
            "MIC": "Micah", "NAH": "Nahum", "HAB": "Habakkuk", "ZEP": "Zephaniah", "HAG": "Haggai",
            "ZEC": "Zechariah", "MAL": "Malachi", "MAT": "Matthew", "MAR": "Mark", "LUK": "Luke",
            "JHN": "John", "ACT": "Acts", "ROM": "Romans", "1CO": "1 Corinthians", "2CO": "2 Corinthians",
            "GAL": "Galatians", "EPH": "Ephesians", "PHP": "Philippians", "COL": "Colossians",
            "1TH": "1 Thessalonians", "2TH": "2 Thessalonians", "1TI": "1 Timothy", "2TI": "2 Timothy",
            "TIT": "Titus", "PHM": "Philemon", "HEB": "Hebrews", "JAM": "James", "1PE": "1 Peter",
            "2PE": "2 Peter", "1JO": "1 John", "2JO": "2 John", "3JO": "3 John", "JDE": "Jude",
            "REV": "Revelation"
        };
        return bookNames[abbr] || "Unknown Book";
    }
    // --- End: Data copied from server.js ---


    // Function to fetch available translations from the server
    const fetchTranslations = async () => {
        try {
            const response = await fetch('/api/translations');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            availableTranslations = await response.json();
            console.log('[DEBUG] Fetched translations:', availableTranslations); // DEBUG
            populateVersionDropdowns();
        } catch (error) {
            console.error('[DEBUG] Failed to fetch translations:', error);
            // Optionally, disable version select or show an error
        }
    };

    // Function to populate all version dropdowns (main and split views)
    const populateVersionDropdowns = () => {
        const allVersionSelects = [versionSelect, ...Array.from(versionSelectsSplit)];
        const defaultVersionsMap = {
            'versionSelectView1': 'NKJV',
            'versionSelectView2': 'AMP',
            'versionSelectView3': 'TPT'
        };

        allVersionSelects.forEach(selectElement => {
            selectElement.innerHTML = ''; // Clear existing options
            availableTranslations.forEach(translation => {
                const option = document.createElement('option');
                option.value = translation.abbreviation;
                option.dataset.translationId = translation.translationid; // Store ID for lookup
                option.textContent = translation.name;
                selectElement.appendChild(option);
            });

            // Set default selections for split view dropdowns if they exist
            if (selectElement.id && defaultVersionsMap[selectElement.id]) {
                selectElement.value = defaultVersionsMap[selectElement.id];
            }
        });

        // Set the main version select to current version if known, or NKJV/first available
        if (currentVersionAbbr) {
            versionSelect.value = currentVersionAbbr;
        } else {
            const nkjvOption = availableTranslations.find(t => t.abbreviation === 'NKJV');
            if (nkjvOption) {
                versionSelect.value = 'NKJV';
            } else if (availableTranslations.length > 0) {
                versionSelect.value = availableTranslations[0].abbreviation;
            }
            currentVersionAbbr = versionSelect.value; // Initialize current version abbr
        }
        // Ensure View 1 select matches the main select initially
        versionSelectView1.value = versionSelect.value;
    };

    // Function to get translation ID from abbreviation
    const getTranslationIdFromAbbr = (abbr) => {
        const translation = availableTranslations.find(t => t.abbreviation === abbr);
        console.log(`[DEBUG] Getting ID for abbr: ${abbr}, Found translation:`, translation); // DEBUG
        return translation ? translation.translationid : null;
    };

    // Function to get translation name from abbreviation
    const getTranslationNameFromAbbr = (abbr) => {
        const translation = availableTranslations.find(t => t.abbreviation === abbr);
        return translation ? translation.name : abbr; // Return abbr if name not found
    };

    const loadChapter = async (bookAbbr, chapterNum, versionAbbr, targetElement, pushHistory = true) => {
        console.log(`[DEBUG] loadChapter called for: ${bookAbbr}.${chapterNum}.${versionAbbr} in target: ${targetElement.id || targetElement.className}, pushHistory: ${pushHistory}`); // DEBUG

        // Determine the correct content area within the targetElement
        const chapterContentTarget = targetElement.id === 'singleChapterView' ? document.getElementById('chapter-content') : targetElement.querySelector('.chapter-content-split');
        const chapterTitleTarget = chapterTitleEl; // Reference main chapter title in header
        const versionNameEl = targetElement.querySelector('h3'); // H3 for each split view

        // Set loading state for content area
        if (chapterContentTarget) chapterContentTarget.innerHTML = `<p>Loading verses...</p>`;
        
        // Update main header title only if NOT in split view mode
        if (chapterTitleTarget && !isSplitViewActive()) {
            chapterTitleTarget.textContent = `${getBookNameFromAbbreviation(bookAbbr)} Chapter ${chapterNum} (Loading...)`;
        } else if (chapterTitleTarget) { // If in split view, ensure main title is empty
            chapterTitleTarget.textContent = '';
        }

        // Always update the H3 for split views/View 1, even during loading
        if (versionNameEl) versionNameEl.textContent = `${getTranslationNameFromAbbr(versionAbbr)} (Loading...)`;


        // Only disable main nav buttons for the primary view when it's the sole view
        if (targetElement === singleChapterView && !isSplitViewActive()) {
            prevChapterBtn.disabled = true;
            nextChapterBtn.disabled = true;
        }

        const translationId = getTranslationIdFromAbbr(versionAbbr);
        console.log(`[DEBUG]   Translation ID for ${versionAbbr}: ${translationId}`); // DEBUG
        if (!translationId) {
            console.error(`[DEBUG] Error: Translation ID not found for version abbreviation: ${versionAbbr}. Aborting load.`); // DEBUG
            if (chapterTitleTarget && !isSplitViewActive()) chapterTitleTarget.textContent = "Error Loading Chapter";
            if (chapterContentTarget) chapterContentTarget.innerHTML = `<p>Could not load chapter: Invalid Bible version. Please select another.</p>`;
            if (versionNameEl) versionNameEl.textContent = `Error: Invalid Version`;
            return;
        }

        try {
            const response = await fetch(`/api/chapter?translation=${translationId}&book=${bookAbbr}&chapter=${chapterNum}&version=${versionAbbr}`);
            console.log(`[DEBUG]   API response status: ${response.status}`); // DEBUG
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('[DEBUG] Received chapter data:', data); // DEBUG

            // Update current chapter details only for the main view (singleChapterView)
            if (targetElement === singleChapterView) {
                currentTranslationId = data.translationId;
                currentBookAbbr = data.bookAbbreviation;
                currentChapterNum = data.chapterNumber;
                currentVersionAbbr = data.versionAbbreviation; // Update global current version
                totalChaptersInBook = data.totalChapters;

                // Update main header title only if NOT in split view mode
                if (!isSplitViewActive()) {
                    chapterTitleEl.textContent = `${data.bookName} Chapter ${data.chapterNumber}`;
                } else {
                    chapterTitleEl.textContent = ''; // Clear if hidden
                }

                // Sync main dropdown with current version of View 1
                versionSelect.value = currentVersionAbbr;
                // Update navigation buttons state
                prevChapterBtn.disabled = currentChapterNum === 1;
                nextChapterBtn.disabled = currentChapterNum >= totalChaptersInBook;

                renderChapterList(currentBookAbbr, totalChaptersInBook, currentChapterNum, currentVersionAbbr);

                localStorage.setItem('lastRead', JSON.stringify({
                    translationId: currentTranslationId,
                    bookAbbr: currentBookAbbr,
                    chapterNum: currentChapterNum,
                    versionAbbr: currentVersionAbbr,
                    bookName: data.bookName // Use data.bookName directly
                }));

                if (pushHistory) {
                    history.pushState(null, '', `/${currentBookAbbr}.${currentChapterNum}.${currentVersionAbbr}`);
                }
            }


            let versesHtml = '';
            if (data.verses && data.verses.length > 0) {
                data.verses.forEach(verse => {
                    versesHtml += `<p><span class="verse-number">${verse.verseNumber}</span>${verse.verseText}</p>`;
                });
            } else {
                versesHtml = `<p>No verses found for ${getBookNameFromAbbreviation(bookAbbr)} Chapter ${chapterNum} in ${getTranslationNameFromAbbr(versionAbbr)}.</p>`;
            }

            console.log('  [DEBUG] Generated versesHtml (first 100 chars):', versesHtml.substring(0, 100) + '...'); // DEBUG
            if (chapterContentTarget) {
                chapterContentTarget.innerHTML = versesHtml;
                console.log('  [DEBUG] Verses injected into:', chapterContentTarget.id || chapterContentTarget.className); // DEBUG
            } else {
                console.error('[DEBUG] chapterContentTarget not found for:', targetElement.id || targetElement.className); // DEBUG
            }

            // Apply verse number visibility based on toggle
            if (verseToggle.checked) {
                if (chapterContentTarget) chapterContentTarget.classList.add('hide-verse-numbers');
            } else {
                if (chapterContentTarget) chapterContentTarget.classList.remove('hide-verse-numbers');
            }

            // Update version name display in split view h3 (final name after load)
            if (versionNameEl) versionNameEl.textContent = `${getTranslationNameFromAbbr(versionAbbr)}`;


        } catch (error) {
            console.error('[DEBUG] Failed to load chapter (catch block):', error); // DEBUG
            if (chapterTitleTarget && !isSplitViewActive()) chapterTitleTarget.textContent = "Error Loading Chapter";
            if (chapterContentTarget) chapterContentTarget.innerHTML = `<p>Could not load chapter: ${error.message}. Please try again or go back to the main page.</p>`;
            if (versionNameEl) versionNameEl.textContent = `Error: ${versionAbbr}`;
            if (targetElement === singleChapterView) {
                prevChapterBtn.disabled = true;
                nextChapterBtn.disabled = true;
            }
        }
    };

    const renderChapterList = (bookAbbr, totalChapters, currentChapter, versionAbbr) => {
        chapterListEl.innerHTML = ''; // Clear previous list
        for (let i = 1; i <= totalChapters; i++) {
            const listItem = document.createElement('li');
            // Link to the simplified URL format for chapters in the sidebar
            listItem.innerHTML = `<a href="/${bookAbbr}.${i}.${versionAbbr}" class="${i === currentChapter ? 'active-chapter' : ''}">Chapter ${i}</a>`;
            chapterListEl.appendChild(listItem);
        }
    };


    verseToggle.addEventListener('change', () => {
        // Apply to all visible chapter content areas
        document.querySelectorAll('.chapter-content, .chapter-content-split, #chapter-content').forEach(contentArea => {
            if (verseToggle.checked) {
                contentArea.classList.add('hide-verse-numbers');
            } else {
                contentArea.classList.remove('hide-verse-numbers');
            }
        });
    });

    // Event listener for main version select change
    versionSelect.addEventListener('change', (event) => {
        const newVersionAbbr = event.target.value;
        currentVersionAbbr = newVersionAbbr; // Update global current version abbr
        // Sync versionSelectView1 (View 1) with main version select
        versionSelectView1.value = newVersionAbbr;
        // Load chapter for the single view, which is also View 1 in split mode
        loadChapter(currentBookAbbr, currentChapterNum, newVersionAbbr, singleChapterView);
        // If in split mode, also update other active split views with the new main version
        if (isSplitViewActive()) {
            updateSplitViews(currentBookAbbr, currentChapterNum);
        }
    });

    // Event listeners for split view version selects (versionSelectView1, versionSelectView2, versionSelectView3)
    versionSelectsSplit.forEach(select => {
        select.addEventListener('change', (event) => {
            const newVersionAbbr = event.target.value;
            const viewNumber = event.target.dataset.view;
            let targetChapterView;

            if (viewNumber === '1') {
                targetChapterView = singleChapterView;
                // If view 1 is changed, also update the main version select
                versionSelect.value = newVersionAbbr;
                // Update global currentVersionAbbr as View 1 is the primary one
                currentVersionAbbr = newVersionAbbr;
            } else {
                targetChapterView = document.getElementById(`splitChapterView${viewNumber}`);
            }
            
            if (currentBookAbbr && currentChapterNum && targetChapterView) {
                loadChapter(currentBookAbbr, currentChapterNum, newVersionAbbr, targetChapterView, false); // Don't push history for split views
            }
        });
    });


    // Add basic CSS for active chapter in sidebar if not already present
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        .hide-verse-numbers .verse-number {
            display: none;
        }
        .active-chapter {
            font-weight: bold;
            text-decoration: underline;
        }
        /* Basic styling for sidebar links */
        #chapterList a {
            display: block;
            padding: 5px 0;
        }
        #chapterList li {
            margin-bottom: 5px;
        }
    `;
    document.head.appendChild(styleSheet);


    prevChapterBtn.addEventListener('click', () => {
        if (currentChapterNum > 1) {
            const newChapter = currentChapterNum - 1;
            loadChapter(currentBookAbbr, newChapter, versionSelect.value, singleChapterView);
            updateSplitViews(currentBookAbbr, newChapter); // Update all active split views
        }
    });

    nextChapterBtn.addEventListener('click', () => {
        if (currentChapterNum < totalChaptersInBook) {
            const newChapter = currentChapterNum + 1;
            loadChapter(currentBookAbbr, newChapter, versionSelect.value, singleChapterView);
            updateSplitViews(currentBookAbbr, newChapter); // Update all active split views
        }
    });

    // Function to update all active split views
    const updateSplitViews = (bookAbbr, chapterNum) => {
        // Always load for singleChapterView (View 1) as it's part of the split layout when active
        // This ensures View 1 always gets updated even when it's the "primary" view controlled by main dropdown
        loadChapter(bookAbbr, chapterNum, versionSelectView1.value, singleChapterView, false);

        if (toggleView2.checked) {
            loadChapter(bookAbbr, chapterNum, versionSelectView2.value, splitChapterView2, false);
        }
        if (toggleView3.checked) {
            loadChapter(bookAbbr, chapterNum, versionSelectView3.value, splitChapterView3, false);
        }
    };


    // Toggle Left Sidebar
    const toggleLeftSidebar = () => {
        leftSidebar.classList.toggle('collapsed');
    };
    leftMenuBtn.addEventListener('click', toggleLeftSidebar);
    leftMenuBtnInHeader.addEventListener('click', toggleLeftSidebar);

    // Toggle Right Sidebar
    const toggleRightSidebar = () => {
        rightSidebar.classList.toggle('collapsed');
    };
    rightMenuBtn.addEventListener('click', toggleRightSidebar);
    rightMenuBtnInHeader.addEventListener('click', toggleRightSidebar);

    // Function to check if any split view (View 2 or View 3) is explicitly active via checkbox
    const isSplitViewActive = () => {
        return toggleView2.checked || toggleView3.checked;
    };

    // Function to manage split view display and content loading
    const manageSplitViews = () => {
        console.log('[DEBUG] manageSplitViews called. View2 checked:', toggleView2.checked, 'View3 checked:', toggleView3.checked); // DEBUG

        // Control main header title visibility
        if (isSplitViewActive()) {
            chapterTitleEl.style.display = 'none';
        } else {
            chapterTitleEl.style.display = 'block';
        }

        // Always ensure singleChapterView (View 1) has the base class
        singleChapterView.classList.add('active-view-single');
        singleChapterView.classList.remove('active-view-split'); // Ensure it doesn't have split class initially

        // Reset visibility for other split views
        splitChapterView2.classList.remove('active-view-split');
        splitChapterView3.classList.remove('active-view-split');
        
        // Adjust main content flex direction based on active split views
        if (isSplitViewActive()) {
            mainContent.style.flexDirection = 'row'; // Switch to row for split
            console.log('[DEBUG] Setting mainContent flexDirection to row (split view active).'); // DEBUG
        } else {
            mainContent.style.flexDirection = 'column'; // Default to column for single view
            console.log('[DEBUG] Setting mainContent flexDirection to column (single view active).'); // DEBUG
        }

        // Handle View 2 checkbox
        if (toggleView2.checked) {
            console.log('[DEBUG] View 2 toggle checked. Activating splitChapterView2.'); // DEBUG
            splitChapterView2.classList.add('active-view-split');
            loadChapter(currentBookAbbr, currentChapterNum, versionSelectView2.value, splitChapterView2, false);
        }

        // Handle View 3 checkbox (auto-activates View 2 if View 3 is turned on)
        if (toggleView3.checked) {
            console.log('[DEBUG] View 3 toggle checked. Activating splitChapterView3.'); // DEBUG
            if (!toggleView2.checked) {
                console.log('[DEBUG] Auto-activating View 2 as View 3 is checked.'); // DEBUG
                toggleView2.checked = true; // Auto-activate View 2 checkbox
                splitChapterView2.classList.add('active-view-split');
                // Load View 2 content since it's now active
                loadChapter(currentBookAbbr, currentChapterNum, versionSelectView2.value, splitChapterView2, false);
            }
            splitChapterView3.classList.add('active-view-split');
            loadChapter(currentBookAbbr, currentChapterNum, versionSelectView3.value, splitChapterView3, false);
        }

        // Initial load of View 1 content, always. This ensures it's populated.
        // It's crucial this runs AFTER currentBookAbbr and currentChapterNum are set
        // from the server-injected data or URL parameters.
        loadChapter(currentBookAbbr, currentChapterNum, versionSelectView1.value, singleChapterView, false);
    };


    // Event listeners for new split view checkboxes
    toggleView2.addEventListener('change', manageSplitViews);
    toggleView3.addEventListener('change', manageSplitViews);

    // Initial load logic: check for server-injected data first
    const bodyElement = document.body;
    const serverBookAbbr = bodyElement.dataset.bookAbbr;
    const serverChapterNum = parseInt(bodyElement.dataset.chapterNum);
    const serverTranslationId = parseInt(bodyElement.dataset.translationId);
    const serverVersionAbbr = bodyElement.dataset.versionAbbr;
    const serverTotalChapters = parseInt(bodyElement.dataset.totalChapters);

    // Fetch translations first
    await fetchTranslations();

    // After translations are fetched, initialize chapter data
    if (serverBookAbbr && !isNaN(serverChapterNum) && !isNaN(serverTranslationId) && serverVersionAbbr && !isNaN(serverTotalChapters)) {
        currentTranslationId = serverTranslationId;
        currentBookAbbr = serverBookAbbr;
        currentChapterNum = serverChapterNum;
        currentVersionAbbr = serverVersionAbbr;
        totalChaptersInBook = serverTotalChapters;

        versionSelect.value = currentVersionAbbr;
        versionSelectView1.value = currentVersionAbbr; // Sync View 1 dropdown

        prevChapterBtn.disabled = currentChapterNum === 1;
        nextChapterBtn.disabled = currentChapterNum >= totalChaptersInBook;
        renderChapterList(currentBookAbbr, totalChaptersInBook, currentChapterNum, currentVersionAbbr);

        localStorage.setItem('lastRead', JSON.stringify({
            translationId: currentTranslationId,
            bookAbbr: currentBookAbbr,
            chapterNum: currentChapterNum,
            versionAbbr: currentVersionAbbr,
            bookName: getBookNameFromAbbreviation(currentBookAbbr) // Use the new client-side function
        }));

        if (verseToggle.checked) {
            chapterContentEl.classList.add('hide-verse-numbers');
        } else {
            chapterContentEl.classList.remove('hide-verse-numbers');
        }
        // Initial setup for view 1's title
        singleViewVersionNameEl.textContent = getTranslationNameFromAbbr(versionSelectView1.value);

    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const initialBookAbbr = urlParams.get('book');
        const initialChapterNum = parseInt(urlParams.get('chapter'));
        const initialVersionAbbr = urlParams.get('version') || 'NKJV';

        if (initialBookAbbr && !isNaN(initialChapterNum)) {
            window.location.replace(`/${initialBookAbbr.toUpperCase()}.${initialChapterNum}.${initialVersionAbbr.toUpperCase()}`);
        } else {
            window.location.replace('/GEN.1.NKJV');
        }
    }

    // Close Server Button
    shutdownServerBtn.addEventListener('click', async () => {
        const userConfirmed = confirm("Are you sure you want to shut down the server? This will close the application.");
        if (userConfirmed) {
            try {
                const response = await fetch('/api/shutdown', { method: 'POST' });
                if (response.ok) {
                    console.log('Server shutdown initiated.');
                    alert('Server is shutting down. You can now close this browser tab.');
                } else {
                    console.error('Failed to initiate server shutdown:', await response.text());
                    alert('Failed to shut down server. Check console for details.');
                }
            } catch (error) {
                console.error('Error during server shutdown request:', error);
                alert('Error connecting to server for shutdown. Please ensure the server is running and accessible.');
            }
        }
    });


    // Placeholder for minimize version names toggle functionality
    minimizeVersionNamesToggle.addEventListener('change', (event) => {
        document.querySelectorAll('#splitScreenOptions label').forEach(label => {
            const span = label.querySelector('span');
            const select = label.querySelector('select');
            if (span && select) {
                if (event.target.checked) {
                    span.textContent = `${select.value}: `; // Show only abbreviation
                } else {
                    // Revert to original label text based on data-view attribute
                    const viewNumber = select.dataset.view;
                    let defaultText = '';
                    if (viewNumber === '1') defaultText = 'View 1 (Default): ';
                    else if (viewNumber === '2') defaultText = 'View 2 (AMP by default): ';
                    else if (viewNumber === '3') defaultText = 'View 3 (TPT by default): ';
                    span.textContent = defaultText;
                }
            }
        });

        // Update the h3 titles in the chapter views immediately
        const updateH3Titles = (viewEl, selectEl) => {
            const h3 = viewEl.querySelector('h3');
            if (h3) {
                if (event.target.checked) {
                    h3.textContent = `${selectEl.value}`; // Show only abbreviation
                } else {
                    h3.textContent = `${getTranslationNameFromAbbr(selectEl.value)}`; // Show full name
                }
            }
        };
        
        // Update all visible view titles
        if (singleChapterView.classList.contains('active-view-single')) {
            updateH3Titles(singleChapterView, versionSelectView1);
        }
        if (splitChapterView2.classList.contains('active-view-split')) {
            updateH3Titles(splitChapterView2, versionSelectView2);
        }
        if (splitChapterView3.classList.contains('active-view-split')) {
            updateH3Titles(splitChapterView3, versionSelectView3);
        }
    });

    // Initial call to manageSplitViews to ensure correct layout on load
    // This call should happen after currentBookAbbr etc. are initialized
    // which happens in the if-else block above.
    manageSplitViews();
});
