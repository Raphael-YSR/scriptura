// script.js
document.addEventListener('DOMContentLoaded', async () => {
    const chapterTitleEl = document.getElementById('chapterTitle');
    const chapterContentEl = document.getElementById('chapter-content');
    const chapterListEl = document.getElementById('chapterList');
    const verseToggle = document.getElementById('verseToggle');
    const continuousToggle = document.getElementById('continuousToggle'); 
    const versionSelect = document.getElementById('versionSelect'); 
    const prevChapterBtn = document.getElementById('prevChapterBtn');
    const nextChapterBtn = document.getElementById('nextChapterBtn');

    const leftSidebar = document.getElementById('leftSidebar');
    const rightSidebar = document.getElementById('rightSidebar');
    // Removed rightMenuBtn and rightMenuBtnInHeader as they are no longer needed for hover functionality

    const singleChapterView = document.getElementById('singleChapterView');
    const splitChapterView2 = document.getElementById('splitChapterView2');
    const splitChapterView3 = document.getElementById('splitChapterView3');
    const mainContent = document.getElementById('mainContent');
    const mainContentWrapper = document.getElementById('mainContentWrapper'); // Get the wrapper
    const versionSelectsSplit = document.querySelectorAll('#splitScreenOptions .versionSelectSplit');
    const minimizeVersionNamesToggle = document.getElementById('minimizeVersionNamesToggle');

    const toggleView2 = document.getElementById('toggleView2');
    const toggleView3 = document.getElementById('toggleView3');
    const versionSelectView1 = document.getElementById('versionSelectView1');
    const versionSelectView2 = document.getElementById('versionSelectView2');
    const versionSelectView3 = document.getElementById('versionSelectView3');

    const singleViewVersionNameEl = document.getElementById('singleViewVersionName');
    const splitView2VersionNameEl = document.getElementById('splitView2VersionName');
    const splitView3VersionNameEl = document.getElementById('splitView3VersionName');
    
    const shutdownServerBtn = document.getElementById('shutdownServerBtn');

    let currentTranslationId;
    let currentBookAbbr;
    let currentChapterNum;
    let currentVersionAbbr;
    let totalChaptersInBook;
    let availableTranslations = []; 
    
    // --- Start: Data copied from server.js for client-side use (Corrected based on db.md) ---
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

    function getBookNameFromAbbreviation(abbr) {
        const bookNames = {
            "GEN": "Genesis", 
            "EXO": "Exodus", 
            "LEV": "Leviticus", 
            "NUM": "Numbers", 
            "DEU": "Deuteronomy",
            "JOS": "Joshua", 
            "JDG": "Judges", 
            "RUT": "Ruth", 
            "1SA": "1 Samuel", 
            "2SA": "2 Samuel",
            "1KI": "1 Kings", 
            "2KI": "2 Kings", 
            "1CH": "1 Chronicles", 
            "2CH": "2 Chronicles",
            "EZR": "Ezra", 
            "NEH": "Nehemiah", 
            "EST": "Esther", 
            "JOB": "Job", 
            "PSA": "Psalms",
            "PRO": "Proverbs", 
            "ECC": "Ecclesiastes", 
            "SNG": "Song of Songs", 
            "ISA": "Isaiah",
            "JER": "Jeremiah", 
            "LAM": "Lamentations", 
            "EZE": "Ezekiel", 
            "DAN": "Daniel",
            "HOS": "Hosea", 
            "JOL": "Joel", 
            "AMO": "Amos", 
            "OBA": "Obadiah", 
            "JON": "Jonah",
            "MIC": "Micah", 
            "NAH": "Nahum", 
            "HAB": "Habakkuk", 
            "ZEP": "Zephaniah", 
            "HAG": "Haggai",
            "ZEC": "Zechariah", 
            "MAL": "Malachi", 
            "MAT": "Matthew", 
            "MAR": "Mark", 
            "LUK": "Luke",
            "JHN": "John", 
            "ACT": "Acts", 
            "ROM": "Romans", 
            "1CO": "1 Corinthians", 
            "2CO": "2 Corinthians",
            "GAL": "Galatians", 
            "EPH": "Ephesians", 
            "PHP": "Philippians", 
            "COL": "Colossians",
            "1TH": "1 Thessalonians", 
            "2TH": "2 Thessalonians", 
            "1TI": "1 Timothy", 
            "2TI": "2 Timothy",
            "TIT": "Titus", 
            "PHM": "Philemon", 
            "HEB": "Hebrews", 
            "JAM": "James", 
            "1PE": "1 Peter",
            "2PE": "2 Peter", 
            "1JO": "1 John", 
            "2JO": "2 John", 
            "3JO": "3 John", 
            "JDE": "Jude",
            "REV": "Revelation"
        };
        return bookNames[abbr] || "Unknown Book";
    }
    // --- End: Data copied from server.js ---


    const fetchTranslations = async () => {
        try {
            const response = await fetch('/api/translations');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            availableTranslations = await response.json();
            console.log('[DEBUG] Fetched translations:', availableTranslations); 
            populateVersionDropdowns();
        } catch (error) {
            console.error('[DEBUG] Failed to fetch translations:', error);
        }
    };

    const populateVersionDropdowns = () => {
        const allVersionSelects = [versionSelect, versionSelectView1, versionSelectView2, versionSelectView3];
        const defaultVersionsMap = {
            'versionSelectView1': 'NKJV',
            'versionSelectView2': 'AMP',
            'versionSelectView3': 'TPT'
        };

        allVersionSelects.forEach(selectElement => {
            selectElement.innerHTML = ''; 
            availableTranslations.forEach(translation => {
                const option = document.createElement('option');
                option.value = translation.abbreviation;
                option.dataset.translationId = translation.translationid; 
                option.textContent = translation.name;
                selectElement.appendChild(option);
            });

            if (selectElement.id && defaultVersionsMap[selectElement.id]) {
                selectElement.value = defaultVersionsMap[selectElement.id];
            }
        });

        if (currentVersionAbbr) {
            versionSelect.value = currentVersionAbbr;
        } else {
            const nkjvOption = availableTranslations.find(t => t.abbreviation === 'NKJV');
            if (nkjvOption) {
                versionSelect.value = 'NKJV';
            } else if (availableTranslations.length > 0) {
                versionSelect.value = availableTranslations[0].abbreviation;
            }
            currentVersionAbbr = versionSelect.value; 
        }
        versionSelectView1.value = versionSelect.value;
    };

    const getTranslationIdFromAbbr = (abbr) => {
        const translation = availableTranslations.find(t => t.abbreviation === abbr);
        console.log(`[DEBUG] Getting ID for abbr: ${abbr}, Found translation:`, translation); 
        return translation ? translation.translationid : null;
    };

    const getTranslationNameFromAbbr = (abbr) => {
        const translation = availableTranslations.find(t => t.abbreviation === abbr);
        return translation ? translation.name : abbr; 
    };

    const loadChapter = async (bookAbbr, chapterNum, versionAbbr, targetElement, pushHistory = true) => {
        console.log(`[DEBUG] loadChapter called for: ${bookAbbr}.${chapterNum}.${versionAbbr} in target: ${targetElement.id || targetElement.className}, pushHistory: ${pushHistory}`); 

        const chapterContentTarget = targetElement.id === 'singleChapterView' ? document.getElementById('chapter-content') : targetElement.querySelector('.chapter-content-split');
        const chapterTitleTarget = chapterTitleEl; 
        const versionNameEl = targetElement.querySelector('h3'); 
        
        if (chapterContentTarget) chapterContentTarget.innerHTML = `<p class="text-gray-500">Loading verses...</p>`;
        
        // Chapter title is always displayed and centered via CSS grid
        chapterTitleTarget.textContent = `${getBookNameFromAbbreviation(bookAbbr)} Chapter ${chapterNum}`;
        
        if (versionNameEl) versionNameEl.textContent = `${getTranslationNameFromAbbr(versionAbbr)}`;

        if (minimizeVersionNamesToggle.checked) {
            if (versionNameEl) versionNameEl.style.display = 'none'; 
        } else {
            if (versionNameEl) versionNameEl.style.display = 'block'; 
        }

        if (targetElement === singleChapterView && !isSplitViewActive()) {
            prevChapterBtn.disabled = true;
            nextChapterBtn.disabled = true;
        }

        const translationId = getTranslationIdFromAbbr(versionAbbr);
        console.log(`[DEBUG]   Translation ID for ${versionAbbr}: ${translationId}`); 
        if (!translationId) {
            console.error(`[DEBUG] Error: Translation ID not found for version abbreviation: ${versionAbbr}. Aborting load.`); 
            chapterTitleTarget.textContent = "Error Loading Chapter";
            if (chapterContentTarget) chapterContentTarget.innerHTML = `<p class="text-red-500">Could not load chapter: Invalid Bible version. Please select another.</p>`;
            if (versionNameEl) versionNameEl.textContent = `Error: Invalid Version`;
            if (targetElement === singleChapterView) {
                prevChapterBtn.disabled = true;
                nextChapterBtn.disabled = true;
            }
            return;
        }

        try {
            const response = await fetch(`/api/chapter?translation=${translationId}&book=${bookAbbr}&chapter=${chapterNum}&version=${versionAbbr}`);
            console.log(`[DEBUG]   API response status: ${response.status}`); 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('[DEBUG] Received chapter data:', data); 

            if (targetElement === singleChapterView) {
                currentTranslationId = data.translationId;
                currentBookAbbr = data.bookAbbreviation;
                currentChapterNum = data.chapterNumber;
                currentVersionAbbr = data.versionAbbreviation; 
                totalChaptersInBook = data.totalChapters;

                chapterTitleEl.textContent = `${data.bookName} Chapter ${data.chapterNumber}`;

                versionSelect.value = currentVersionAbbr;
                prevChapterBtn.disabled = currentChapterNum === 1;
                nextChapterBtn.disabled = currentChapterNum >= totalChaptersInBook;

                renderChapterList(currentBookAbbr, totalChaptersInBook, currentChapterNum, currentVersionAbbr);

                localStorage.setItem('lastRead', JSON.stringify({
                    translationId: currentTranslationId,
                    bookAbbr: currentBookAbbr,
                    chapterNum: currentChapterNum,
                    versionAbbr: currentVersionAbbr,
                    bookName: getBookNameFromAbbreviation(currentBookAbbr) 
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
                versesHtml = `<p class="text-gray-500">No verses found for ${getBookNameFromAbbreviation(bookAbbr)} Chapter ${chapterNum} in ${getTranslationNameFromAbbr(versionAbbr)}.</p>`;
            }

            console.log('  [DEBUG] Generated versesHtml (first 100 chars):', versesHtml.substring(0, 100) + '...'); 
            if (chapterContentTarget) {
                chapterContentTarget.innerHTML = versesHtml;
                console.log('  [DEBUG] Verses injected into:', chapterContentTarget.id || chapterContentTarget.className); 
            } else {
                console.error('[DEBUG] chapterContentTarget not found for:', targetElement.id || targetElement.className); 
            }

            if (verseToggle.checked) {
                if (chapterContentTarget) chapterContentTarget.classList.add('hide-verse-numbers');
            } else {
                if (chapterContentTarget) chapterContentTarget.classList.remove('hide-verse-numbers');
            }

            if (versionNameEl) versionNameEl.textContent = `${getTranslationNameFromAbbr(versionAbbr)}`;

        } catch (error) {
            console.error('[DEBUG] Failed to load chapter (catch block):', error); 
            chapterTitleTarget.textContent = "Error Loading Chapter";
            if (chapterContentTarget) chapterContentTarget.innerHTML = `<p class="text-red-500">Could not load chapter: ${error.message}. Please try again or go back to the main page.</p>`;
            if (versionNameEl) versionNameEl.textContent = `Error: ${versionAbbr}`;
            if (targetElement === singleChapterView) {
                prevChapterBtn.disabled = true;
                nextChapterBtn.disabled = true;
            }
        }
    };

    const renderChapterList = (bookAbbr, totalChapters, currentChapter, versionAbbr) => {
        chapterListEl.innerHTML = ''; 

        for (let i = 1; i <= totalChapters; i++) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `/${bookAbbr}.${i}.${versionAbbr}`;
            
            link.classList.add(
                'flex', 'items-center', 'space-x-3', 'p-2', 'rounded-md',
                'hover:bg-gray-200', 'transition-colors', 'duration-200'
            );

            if (i === currentChapter) {
                link.classList.add('active-chapter');
            } else {
                 link.classList.add('text-gray-700'); 
            }

            const circleSpan = document.createElement('span');
            circleSpan.classList.add(
                'w-3', 'h-3', 'rounded-full', 'flex-shrink-0', 'bg-gray-400', 
                'circle-indicator' 
            );
            link.appendChild(circleSpan);

            const textSpan = document.createElement('span');
            textSpan.textContent = `Chapter ${i}`;
            textSpan.classList.add(
                'whitespace-nowrap', 'overflow-hidden', 'text-sm',
                'chapter-text' 
            );
            link.appendChild(textSpan);

            listItem.appendChild(link);
            chapterListEl.appendChild(listItem);
        }
    };

    
    verseToggle.addEventListener('change', () => {
        document.querySelectorAll('.chapter-content, .chapter-content-split, #chapter-content').forEach(contentArea => {
            if (verseToggle.checked) {
                contentArea.classList.add('hide-verse-numbers');
            } else {
                contentArea.classList.remove('hide-verse-numbers');
            }
        });
    });

    versionSelect.addEventListener('change', (event) => {
        const newVersionAbbr = event.target.value;
        currentVersionAbbr = newVersionAbbr; 
        versionSelectView1.value = newVersionAbbr;
        loadChapter(currentBookAbbr, currentChapterNum, newVersionAbbr, singleChapterView);
        if (isSplitViewActive()) {
            updateSplitViews(currentBookAbbr, currentChapterNum);
        }
    });

    versionSelectsSplit.forEach(select => {
        select.addEventListener('change', (event) => {
            const newVersionAbbr = event.target.value;
            const viewNumber = event.target.dataset.view;
            let targetChapterView;

            if (viewNumber === '1') {
                targetChapterView = singleChapterView;
                versionSelect.value = newVersionAbbr;
                currentVersionAbbr = newVersionAbbr;
            } else {
                targetChapterView = document.getElementById(`splitChapterView${viewNumber}`);
            }
            
            if (currentBookAbbr && currentChapterNum && targetChapterView) {
                loadChapter(currentBookAbbr, currentChapterNum, newVersionAbbr, targetChapterView, false); 
            }
        });
    });

    prevChapterBtn.addEventListener('click', () => {
        if (currentChapterNum > 1) {
            const newChapter = currentChapterNum - 1;
            loadChapter(currentBookAbbr, newChapter, versionSelect.value, singleChapterView);
            updateSplitViews(currentBookAbbr, newChapter); 
        }
    });

    nextChapterBtn.addEventListener('click', () => {
        if (currentChapterNum < totalChaptersInBook) {
            const newChapter = currentChapterNum + 1;
            loadChapter(currentBookAbbr, newChapter, versionSelect.value, singleChapterView);
            updateSplitViews(currentBookAbbr, newChapter); 
        }
    });

    const updateSplitViews = (bookAbbr, chapterNum) => {
        // Ensure the main view is also reloaded when split views are updated,
        // so its content aligns with the selected versions.
        loadChapter(bookAbbr, chapterNum, versionSelectView1.value, singleChapterView, false);

        if (toggleView2.checked) {
            loadChapter(bookAbbr, chapterNum, versionSelectView2.value, splitChapterView2, false);
        }
        if (toggleView3.checked) {
            loadChapter(bookAbbr, chapterNum, versionSelectView3.value, splitChapterView3, false);
        }
    };

    // Sidebar hover logic using JavaScript for both left and right sidebars
    leftSidebar.addEventListener('mouseenter', () => {
        mainContentWrapper.style.marginLeft = '16rem'; // w-64
    });

    leftSidebar.addEventListener('mouseleave', () => {
        mainContentWrapper.style.marginLeft = '4rem'; // w-16
    });

    rightSidebar.addEventListener('mouseenter', () => {
        mainContentWrapper.style.marginRight = '16rem'; // w-64
    });

    rightSidebar.addEventListener('mouseleave', () => {
        mainContentWrapper.style.marginRight = '4rem'; // w-16
    });

    // Removed toggleRightSidebar and its event listeners

    const isSplitViewActive = () => {
        return toggleView2.checked || toggleView3.checked;
    };

    const manageSplitViews = () => {
        console.log('[DEBUG] manageSplitViews called. View2 checked:', toggleView2.checked, 'View3 checked:', toggleView3.checked); 

        // Header title always displayed and centered via CSS grid
        chapterTitleEl.style.display = 'block'; 

        if (toggleView2.checked || toggleView3.checked) {
            mainContent.classList.remove('flex-col');
            mainContent.classList.add('flex-row');
            // When in split view, singleChapterView should not be max-width and auto-margin
            singleChapterView.style.maxWidth = 'none';
            singleChapterView.style.margin = '0';
        } else {
            mainContent.classList.remove('flex-row');
            mainContent.classList.add('flex-col');
            // When not in split view, re-apply max-width and auto-margin to singleChapterView
            singleChapterView.style.maxWidth = '800px'; // Re-apply the max-width
            singleChapterView.style.margin = '0 auto';  // Re-apply centering
        }

        // Ensure singleChapterView is always shown and primary
        singleChapterView.classList.add('active-view-single');
        singleChapterView.classList.remove('active-view-split'); 

        // Manage visibility and content for split views
        splitChapterView2.classList.remove('active-view-split'); // Always remove first
        if (toggleView2.checked) {
            console.log('[DEBUG] View 2 toggle checked. Activating splitChapterView2.'); 
            splitChapterView2.classList.add('active-view-split');
            // Ensure content is loaded if view becomes active
            loadChapter(currentBookAbbr, currentChapterNum, versionSelectView2.value, splitChapterView2, false);
        }

        splitChapterView3.classList.remove('active-view-split'); // Always remove first
        if (toggleView3.checked) {
            console.log('[DEBUG] View 3 toggle checked. Activating splitChapterView3.'); 
            // If view 3 is checked, but view 2 is not, activate view 2 as well
            if (!toggleView2.checked) {
                console.log('[DEBUG] Auto-activating View 2 as View 3 is checked.'); 
                toggleView2.checked = true; // Programmatically check the box
                splitChapterView2.classList.add('active-view-split');
                loadChapter(currentBookAbbr, currentChapterNum, versionSelectView2.value, splitChapterView2, false);
            }
            splitChapterView3.classList.add('active-view-split');
            // Ensure content is loaded if view becomes active
            loadChapter(currentBookAbbr, currentChapterNum, versionSelectView3.value, splitChapterView3, false);
        }

        // Always reload the default view to ensure its content is correct after split view changes
        loadChapter(currentBookAbbr, currentChapterNum, versionSelectView1.value, singleChapterView, false);
    };

    toggleView2.addEventListener('change', manageSplitViews);
    toggleView3.addEventListener('change', manageSplitViews);

    const bodyElement = document.body;
    const serverBookAbbr = bodyElement.dataset.bookAbbr;
    const serverChapterNum = parseInt(bodyElement.dataset.chapterNum);
    const serverTranslationId = parseInt(bodyElement.dataset.translationId);
    const serverVersionAbbr = bodyElement.dataset.versionAbbr;
    const serverTotalChapters = parseInt(bodyElement.dataset.totalChapters);

    await fetchTranslations();

    if (serverBookAbbr && !isNaN(serverChapterNum) && !isNaN(serverTranslationId) && serverVersionAbbr && !isNaN(serverTotalChapters)) {
        currentTranslationId = serverTranslationId;
        currentBookAbbr = serverBookAbbr;
        currentChapterNum = serverChapterNum;
        currentVersionAbbr = serverVersionAbbr;
        totalChaptersInBook = serverTotalChapters;

        versionSelect.value = currentVersionAbbr;
        versionSelectView1.value = currentVersionAbbr; 

        prevChapterBtn.disabled = currentChapterNum === 1;
        nextChapterBtn.disabled = currentChapterNum >= totalChaptersInBook;
        renderChapterList(currentBookAbbr, totalChaptersInBook, currentChapterNum, currentVersionAbbr);

        localStorage.setItem('lastRead', JSON.stringify({
            translationId: currentTranslationId,
            bookAbbr: currentBookAbbr,
            chapterNum: currentChapterNum,
            versionAbbr: currentVersionAbbr,
            bookName: getBookNameFromAbbreviation(currentBookAbbr) 
        }));

        // Initial chapter title display (always visible and centered via CSS)
        chapterTitleEl.textContent = `${getBookNameFromAbbreviation(currentBookAbbr)} Chapter ${currentChapterNum}`;

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
            // Correct the redirection to use the simplified URL format
            window.location.replace(`/${initialBookAbbr.toUpperCase()}.${initialChapterNum}.${initialVersionAbbr.toUpperCase()}`);
        } else {
            // Default to Genesis 1 NKJV using simplified URL
            window.location.replace('/GEN.1.NKJV');
        }
    }

    // Custom Modal Functions (re-added for use with shutdown button)
    const showConfirmDialog = (message, onConfirm) => {
        const modalOverlay = document.createElement('div');
        modalOverlay.classList.add('modal-overlay');
        modalOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center;
            align-items: center; z-index: 1000;
        `;
        modalOverlay.innerHTML = `
            <div class="modal-content" style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); text-align: center; max-width: 400px; width: 90%;">
                <p style="margin-bottom: 20px; font-size: 1.1rem;">${message}</p>
                <div class="modal-buttons">
                    <button class="confirm-btn" style="margin: 0 10px; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1rem; background-color: #dc3545; color: white;">Confirm</button>
                    <button class="cancel-btn" style="margin: 0 10px; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1rem; background-color: #6c757d; color: white;">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        modalOverlay.querySelector('.confirm-btn').addEventListener('click', () => {
            onConfirm(true);
            modalOverlay.remove();
        });
        modalOverlay.querySelector('.cancel-btn').addEventListener('click', () => {
            onConfirm(false);
            modalOverlay.remove();
        });
    };

    const showMessageBox = (message) => {
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: white; padding: 20px; border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; z-index: 1000;
        `;
        messageBox.innerHTML = `<p>${message}</p><button onclick="this.parentNode.remove()" style="padding: 8px 15px; background-color: #3B82F6; color: white; border: none; border-radius: 5px; cursor: pointer;">OK</button>`;
        document.body.appendChild(messageBox);
    };

    shutdownServerBtn.addEventListener('click', () => {
        showConfirmDialog("Are you sure you want to shut down the Scriptura server? This will close the application.", (confirmed) => {
            if (confirmed) {
                fetch('/api/shutdown', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        showMessageBox("Server is shutting down. The browser tab will now become unresponsive. You can close this tab.");
                        setTimeout(() => {
                            // window.close(); // Browsers usually block this for security
                        }, 2000);
                    } else {
                        showMessageBox("Failed to send shutdown request. Server might already be down or there was an error.");
                    }
                })
                .catch(error => {
                    console.error('Error sending shutdown request:', error);
                    showMessageBox("Error connecting to server for shutdown. It might already be down.");
                });
            } else {
                showMessageBox("Server shutdown cancelled.");
            }
        });
    });

    minimizeVersionNamesToggle.addEventListener('change', (event) => {
        const isMinimized = event.target.checked;
        const toggleVisibility = (nameEl, showAbbrOnly) => {
            if (nameEl) nameEl.style.display = showAbbrOnly ? 'none' : 'block';
        };

        toggleVisibility(singleViewVersionNameEl, isMinimized); 
        toggleVisibility(splitView2VersionNameEl, isMinimized);
        toggleVisibility(splitView3VersionNameEl, isMinimized);
    });

    manageSplitViews();
});
