// script.js
document.addEventListener('DOMContentLoaded', async () => {
    const chapterTitleEl = document.getElementById('chapterTitle');
    const chapterContentEl = document.getElementById('chapter-content');
    const bookNameSubtitleEl = document.getElementById('bookNameSubtitle');
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
    const splitScreenBtn = document.getElementById('splitScreenBtn');
    const splitScreenOptions = document.getElementById('splitScreenOptions');
    const singleChapterView = document.getElementById('singleChapterView');
    const splitChapterView2 = document.getElementById('splitChapterView2');
    const splitChapterView3 = document.getElementById('splitChapterView3');
    const mainContent = document.getElementById('mainContent');
    const versionSelectsSplit = document.querySelectorAll('.versionSelectSplit'); // All split view selects
    const minimizeVersionNamesToggle = document.getElementById('minimizeVersionNamesToggle');

    // Close Server Button
    const shutdownServerBtn = document.getElementById('shutdownServerBtn');

    let currentTranslationId;
    let currentBookAbbr;
    let currentChapterNum;
    let currentVersionAbbr;
    let totalChaptersInBook;
    let availableTranslations = []; // To store fetched translations

    // Hardcoded mapping from book abbreviation to book ID (same as in server.js)
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

    // Helper to get total chapters in a book (must match server.js or fetched from DB)
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

    // Function to fetch available translations from the server
    const fetchTranslations = async () => {
        try {
            const response = await fetch('/api/translations');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            availableTranslations = await response.json();
            populateVersionDropdowns(); // Populate all version dropdowns
        } catch (error) {
            console.error('Failed to fetch translations:', error);
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
    };

    // Function to get translation ID from abbreviation
    const getTranslationIdFromAbbr = (abbr) => {
        const translation = availableTranslations.find(t => t.abbreviation === abbr);
        return translation ? translation.translationid : null;
    };

    const loadChapter = async (bookAbbr, chapterNum, versionAbbr, targetElement, pushHistory = true) => {
        // Use targetElement for loading messages and content
        const chapterContentTarget = targetElement.querySelector('.chapter-content') || targetElement.querySelector('#chapter-content');
        const chapterTitleTarget = targetElement === singleChapterView ? chapterTitleEl : null;
        const bookNameSubtitleTarget = targetElement === singleChapterView ? bookNameSubtitleEl : null;

        if (chapterContentTarget) chapterContentTarget.innerHTML = `<p>Loading verses...</p>`;
        if (chapterTitleTarget) chapterTitleTarget.textContent = `Loading...`;
        if (bookNameSubtitleTarget) bookNameSubtitleTarget.textContent = ``;
        
        // Only disable main nav buttons for the primary view
        if (targetElement === singleChapterView) {
            prevChapterBtn.disabled = true;
            nextChapterBtn.disabled = true;
        }

        const translationId = getTranslationIdFromAbbr(versionAbbr);
        if (!translationId) {
            console.error(`Error: Translation ID not found for version abbreviation: ${versionAbbr}`);
            if (chapterTitleTarget) chapterTitleTarget.textContent = "Error Loading Chapter";
            if (chapterContentTarget) chapterContentTarget.innerHTML = `<p>Could not load chapter: Invalid Bible version. Please select another.</p>`;
            return; // Exit if translation ID is not found
        }

        try {
            const response = await fetch(`/api/chapter?translation=${translationId}&book=${bookAbbr}&chapter=${chapterNum}&version=${versionAbbr}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Update current chapter details only for the main view
            if (targetElement === singleChapterView) {
                currentTranslationId = data.translationId;
                currentBookAbbr = data.bookAbbreviation;
                currentChapterNum = data.chapterNumber;
                currentVersionAbbr = data.versionAbbreviation;
                totalChaptersInBook = data.totalChapters;

                chapterTitleEl.textContent = `${data.bookName} Chapter ${data.chapterNumber}`;
                bookNameSubtitleEl.textContent = `${data.bookName} (${data.versionAbbreviation})`;

                // Set the main dropdown to the currently loaded version
                versionSelect.value = currentVersionAbbr;

                // Update navigation buttons state
                prevChapterBtn.disabled = currentChapterNum === 1;
                nextChapterBtn.disabled = currentChapterNum >= totalChaptersInBook;

                // Populate chapter list in the sidebar (for the current book)
                renderChapterList(currentBookAbbr, totalChaptersInBook, currentChapterNum, currentVersionAbbr);

                // Store last read chapter in local storage
                localStorage.setItem('lastRead', JSON.stringify({
                    translationId: currentTranslationId, // Store ID for consistency, though abbr is used in URL
                    bookAbbr: currentBookAbbr,
                    chapterNum: currentChapterNum,
                    versionAbbr: currentVersionAbbr,
                    bookName: data.bookName
                }));

                // Update URL only if requested (not for initial server-rendered load)
                if (pushHistory) {
                    history.pushState(null, '', `/${currentBookAbbr}.${currentChapterNum}.${currentVersionAbbr}`);
                }
            }


            let versesHtml = '';
            data.verses.forEach(verse => {
                versesHtml += `<p><span class="verse-number">${verse.verseNumber}</span>${verse.verseText}</p>`;
            });
            if (chapterContentTarget) chapterContentTarget.innerHTML = versesHtml;

            // Apply verse number visibility based on toggle
            if (verseToggle.checked) {
                if (chapterContentTarget) chapterContentTarget.classList.add('hide-verse-numbers');
            } else {
                if (chapterContentTarget) chapterContentTarget.classList.remove('hide-verse-numbers');
            }

        } catch (error) {
            console.error('Failed to load chapter:', error);
            if (chapterTitleTarget) chapterTitleTarget.textContent = "Error Loading Chapter";
            if (chapterContentTarget) chapterContentTarget.innerHTML = `<p>Could not load chapter: ${error.message}. Please try again or go back to the main page.</p>`;
            if (bookNameSubtitleTarget) bookNameSubtitleTarget.textContent = "Error";
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
        document.querySelectorAll('.chapter-content, #chapter-content').forEach(contentArea => {
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
        if (currentBookAbbr && currentChapterNum) {
            loadChapter(currentBookAbbr, currentChapterNum, newVersionAbbr, singleChapterView);
        }
    });

    // Event listeners for split view version selects
    versionSelectsSplit.forEach(select => {
        select.addEventListener('change', (event) => {
            const newVersionAbbr = event.target.value;
            const viewNumber = event.target.dataset.view;
            const targetChapterView = document.getElementById(`splitChapterView${viewNumber}`);
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
            loadChapter(currentBookAbbr, newChapter, currentVersionAbbr, singleChapterView);
            // Also update split views if active
            if (splitScreenOptions.style.display === 'block') {
                document.getElementById('versionSelectView2').dispatchEvent(new Event('change'));
                document.getElementById('versionSelectView3').dispatchEvent(new Event('change'));
            }
        }
    });

    nextChapterBtn.addEventListener('click', () => {
        if (currentChapterNum < totalChaptersInBook) {
            const newChapter = currentChapterNum + 1;
            loadChapter(currentBookAbbr, newChapter, currentVersionAbbr, singleChapterView);
            // Also update split views if active
            if (splitScreenOptions.style.display === 'block') {
                document.getElementById('versionSelectView2').dispatchEvent(new Event('change'));
                document.getElementById('versionSelectView3').dispatchEvent(new Event('change'));
            }
        }
    });

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
    rightMenuBtnInHeader.addEventListener('click', toggleRightBtnInHeader); // Corrected ID

    // Function to handle right menu button in header
    function toggleRightBtnInHeader() {
        rightSidebar.classList.toggle('collapsed');
    }

    // Split Screen Button functionality
    splitScreenBtn.addEventListener('click', () => {
        const isSplitActive = splitScreenOptions.style.display === 'block';
        splitScreenOptions.style.display = isSplitActive ? 'none' : 'block';

        if (isSplitActive) {
            // Revert to single view
            mainContent.style.flexDirection = 'column';
            singleChapterView.style.display = 'block';
            splitChapterView2.style.display = 'none';
            splitChapterView3.style.display = 'none';
            mainContent.classList.remove('split-active');
            // Restore main view content
            loadChapter(currentBookAbbr, currentChapterNum, currentVersionAbbr, singleChapterView, false);
        } else {
            // Activate split view (e.g., 3 columns)
            mainContent.style.flexDirection = 'row';
            singleChapterView.style.display = 'none';
            splitChapterView2.style.display = 'block';
            splitChapterView3.style.display = 'block';
            mainContent.classList.add('split-active');
            // Load content for split views
            loadChapter(currentBookAbbr, currentChapterNum, document.getElementById('versionSelectView1').value, document.getElementById('splitChapterView1'), false);
            loadChapter(currentBookAbbr, currentChapterNum, document.getElementById('versionSelectView2').value, splitChapterView2, false);
            loadChapter(currentBookAbbr, currentChapterNum, document.getElementById('versionSelectView3').value, splitChapterView3, false);
        }
    });

    // Close Server Button (Placeholder for functionality)
    shutdownServerBtn.addEventListener('click', () => {
        console.log('Close Server button clicked. (Server shutdown functionality would be handled by backend.)');
        if (confirm("Are you sure you want to shut down the server?")) {
             console.log("Server shutdown confirmed by user.");
             // Add actual server shutdown logic here (e.g., fetch request to backend)
        } else {
             console.log("Server shutdown cancelled by user.");
        }
    });

    // Placeholder for minimize version names toggle functionality
    minimizeVersionNamesToggle.addEventListener('change', (event) => {
        const labels = document.querySelectorAll('#splitScreenOptions label');
        if (event.target.checked) {
            labels.forEach(label => {
                const select = label.querySelector('select');
                if (select) {
                    label.firstChild.textContent = `${select.value}: `; // Show only abbreviation
                }
            });
        } else {
            labels.forEach(label => {
                const select = label.querySelector('select');
                if (select) {
                    // Revert to original label text based on data-view attribute
                    const viewNumber = select.dataset.view;
                    let defaultText = '';
                    if (viewNumber === '1') defaultText = 'View 1 (NKJV): ';
                    else if (viewNumber === '2') defaultText = 'View 2 (AMP): ';
                    else if (viewNumber === '3') defaultText = 'View 3 (TPT): ';
                    label.firstChild.textContent = defaultText;
                }
            });
        }
    });

    // Initial load logic: check for server-injected data first
    const bodyElement = document.body;
    const serverBookAbbr = bodyElement.dataset.bookAbbr;
    const serverChapterNum = parseInt(bodyElement.dataset.chapterNum);
    const serverTranslationId = parseInt(bodyElement.dataset.translationId);
    const serverVersionAbbr = bodyElement.dataset.versionAbbr;
    const serverTotalChapters = parseInt(bodyElement.dataset.totalChapters);

    // Fetch translations first
    await fetchTranslations();

    if (serverBookAbbr && !isNaN(serverChapterNum) && !isNaN(serverTranslationId) && serverVersionAbbr && !isNaN(serverTotalChapters)) {
        currentTranslationId = serverTranslationId;
        currentBookAbbr = serverBookAbbr;
        currentChapterNum = serverChapterNum;
        currentVersionAbbr = serverVersionAbbr;
        totalChaptersInBook = serverTotalChapters;

        versionSelect.value = currentVersionAbbr;

        prevChapterBtn.disabled = currentChapterNum === 1;
        nextChapterBtn.disabled = currentChapterNum >= totalChaptersInBook;
        renderChapterList(currentBookAbbr, totalChaptersInBook, currentChapterNum, currentVersionAbbr);

        localStorage.setItem('lastRead', JSON.stringify({
            translationId: currentTranslationId,
            bookAbbr: currentBookAbbr,
            chapterNum: currentChapterNum,
            versionAbbr: currentVersionAbbr,
            bookName: chapterTitleEl.textContent.split(' Chapter ')[0]
        }));

        if (verseToggle.checked) {
            chapterContentEl.classList.add('hide-verse-numbers');
        } else {
            chapterContentEl.classList.remove('hide-verse-numbers');
        }

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
});
