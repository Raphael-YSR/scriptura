// script.js
document.addEventListener('DOMContentLoaded', async () => {
    const chapterTitleEl = document.getElementById('chapterTitle');
    const chapterContentEl = document.getElementById('chapter-content');
    const chapterListEl = document.getElementById('chapterList');
    const verseToggle = document.getElementById('verseToggle');
    const continuousVersesToggle = document.getElementById('continuousVersesToggle'); // New
    const continuousChaptersToggle = document.getElementById('continuousChaptersToggle'); // New
    const versionSelect = document.getElementById('versionSelect');
    const prevChapterBtn = document.getElementById('prevChapterBtn');
    const nextChapterBtn = document.getElementById('nextChapterBtn');

    const leftSidebar = document.getElementById('leftSidebar');
    const rightSidebar = document.getElementById('rightSidebar');

    const singleChapterView = document.getElementById('singleChapterView');
    const splitChapterView2 = document.getElementById('splitChapterView2');
    const splitChapterView3 = document.getElementById('splitChapterView3');
    const mainContent = document.getElementById('mainContent');
    const mainContentWrapper = document.getElementById('mainContentWrapper');
    const versionSelectsSplit = document.querySelectorAll('#splitScreenOptions .versionSelectSplit');
    const minimizeVersionNamesToggle = document.getElementById('minimizeVersionNamesToggle');
    const sideBySideVersesToggle = document.getElementById('sideBySideVersesToggle'); // New

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

    // Store loaded chapters for continuous chapter reading
    let loadedChapters = {}; // Stores content by book.chapter.version format

    // Flags to prevent multiple simultaneous loads
    let isLoadingPrevChapter = false;
    let isLoadingNextChapter = false;

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

    /**
     * Generates HTML for verses based on display settings.
     * @param {Array} verses - Array of verse objects {verseNumber, verseText}.
     * @param {boolean} isContinuousVerses - True if verses should flow continuously.
     * @param {boolean} isSideBySide - True if verses should align side-by-side (using grid for numbering).
     * @returns {string} HTML string of verses.
     */
    const generateVersesHtml = (verses, isContinuousVerses, isSideBySide) => {
        let versesHtml = '';
        if (!verses || verses.length === 0) {
            return `<p class="text-gray-500">No verses found.</p>`;
        }

        // When sideBySide is active, we apply grid to the parent chapter-content-block
        // and each verse's number and text become grid items.
        // The structure for side-by-side is simpler here because the CSS grid handles the layout.
        // We ensure a <p> tag always wraps the content for semantic purposes.
        verses.forEach(verse => {
            versesHtml += `
                <p>
                    <span class="verse-number">${verse.verseNumber}</span>
                    <span class="verse-text-wrapper">${verse.verseText}</span>
                </p>
            `;
        });
        
        return versesHtml;
    };


    const loadChapter = async (bookAbbr, chapterNum, versionAbbr, targetElement, pushHistory = true, append = false, prepend = false) => {
        console.log(`[DEBUG] loadChapter called for: ${bookAbbr}.${chapterNum}.${versionAbbr} in target: ${targetElement.id || targetElement.className}, pushHistory: ${pushHistory}, append: ${append}, prepend: ${prepend}`);

        const chapterContentTarget = targetElement.id === 'singleChapterView' ? document.getElementById('chapter-content') : targetElement.querySelector('.chapter-content-split');
        const chapterTitleTarget = chapterTitleEl;
        const versionNameEl = targetElement.querySelector('h3');

        // Show loading indicator only if not appending/prepending
        if (!append && !prepend) {
            if (chapterContentTarget) chapterContentTarget.innerHTML = `<p class="text-gray-500">Loading verses...</p>`;
        }

        // Chapter title is always displayed and centered via CSS grid
        // Only update if it's the main view, or if continuous chapters is active and it's the current chapter being displayed
        if (targetElement === singleChapterView && !continuousChaptersToggle.checked) {
            chapterTitleTarget.textContent = `${getBookNameFromAbbreviation(bookAbbr)} Chapter ${chapterNum}`;
        }


        if (versionNameEl) versionNameEl.textContent = `${getTranslationNameFromAbbr(versionAbbr)}`;

        if (minimizeVersionNamesToggle.checked) {
            if (versionNameEl) versionNameEl.style.display = 'none';
        } else {
            if (versionNameEl) versionNameEl.style.display = 'block';
        }

        // Disable nav buttons only if it's the main single view and not in continuous chapters mode
        if (targetElement === singleChapterView && !isSplitViewActive() && !continuousChaptersToggle.checked) {
            prevChapterBtn.disabled = true;
            nextChapterBtn.disabled = true;
        }

        const translationId = getTranslationIdFromAbbr(versionAbbr);
        console.log(`[DEBUG]   Translation ID for ${versionAbbr}: ${translationId}`);
        if (!translationId) {
            console.error(`[DEBUG] Error: Translation ID not found for version abbreviation: ${versionAbbr}. Aborting load.`);
            if (targetElement === singleChapterView && !continuousChaptersToggle.checked) {
                chapterTitleTarget.textContent = "Error Loading Chapter";
            }
            if (chapterContentTarget) chapterContentTarget.innerHTML = `<p class="text-red-500">Could not load chapter: Invalid Bible version. Please select another.</p>`;
            if (versionNameEl) versionNameEl.textContent = `Error: Invalid Version`;
            if (targetElement === singleChapterView && !continuousChaptersToggle.checked) {
                prevChapterBtn.disabled = true;
                nextChapterBtn.disabled = true;
            }
            return;
        }

        const chapterKey = `${bookAbbr}.${chapterNum}.${versionAbbr}`;
        if (loadedChapters[chapterKey]) {
            console.log(`[DEBUG] Chapter ${chapterKey} already loaded from cache.`);
            const data = loadedChapters[chapterKey];
            renderChapterContent(data, targetElement, pushHistory, append, prepend);
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

            loadedChapters[chapterKey] = data; // Cache the loaded chapter

            renderChapterContent(data, targetElement, pushHistory, append, prepend);

        } catch (error) {
            console.error('[DEBUG] Failed to load chapter (catch block):', error);
            if (targetElement === singleChapterView && !continuousChaptersToggle.checked) {
                chapterTitleTarget.textContent = "Error Loading Chapter";
            }
            if (chapterContentTarget) chapterContentTarget.innerHTML = `<p class="text-red-500">Could not load chapter: ${error.message}. Please try again or go back to the main page.</p>`;
            if (versionNameEl) versionNameEl.textContent = `Error: ${versionAbbr}`;
            if (targetElement === singleChapterView && !continuousChaptersToggle.checked) {
                prevChapterBtn.disabled = true;
                nextChapterBtn.disabled = true;
            }
        } finally {
            if (prepend) isLoadingPrevChapter = false;
            if (append) isLoadingNextChapter = false;
        }
    };

    // Helper function to render chapter content based on display settings
    const renderChapterContent = (data, targetElement, pushHistory, append, prepend) => {
        const chapterContentTarget = targetElement.id === 'singleChapterView' ? document.getElementById('chapter-content') : targetElement.querySelector('.chapter-content-split');

        if (targetElement === singleChapterView && !isSplitViewActive() && !continuousChaptersToggle.checked) {
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

        let chapterContentHtml = '';
        if (data.verses && data.verses.length > 0) {
            // Apply side-by-side class at the chapter-content-block level
            const sideBySideClass = sideBySideVersesToggle.checked ? 'side-by-side-verses-active' : '';
            chapterContentHtml = `<div class="chapter-content-block ${sideBySideClass}" data-book="${data.bookAbbreviation}" data-chapter="${data.chapterNumber}" data-version="${data.versionAbbreviation}">`;
            if (continuousChaptersToggle.checked && (append || prepend)) {
                // Add a chapter heading for continuous chapters if appending/prepending
                chapterContentHtml += `<h4 class="text-xl font-semibold text-gray-800 my-4">${data.bookName} Chapter ${data.chapterNumber}</h4>`;
            }
            // `generateVersesHtml` is now simpler because CSS handles the side-by-side layout via grid
            chapterContentHtml += generateVersesHtml(data.verses, continuousVersesToggle.checked, sideBySideVersesToggle.checked);
            chapterContentHtml += `</div>`;
        } else {
            chapterContentHtml = `<p class="text-gray-500">No verses found for ${getBookNameFromAbbreviation(data.bookAbbreviation)} Chapter ${data.chapterNumber} in ${getTranslationNameFromAbbr(data.versionAbbreviation)}.</p>`;
        }

        if (chapterContentTarget) {
            if (append) {
                chapterContentTarget.insertAdjacentHTML('beforeend', chapterContentHtml);
                console.log('  [DEBUG] Appended verses to:', chapterContentTarget.id || chapterContentTarget.className);
            } else if (prepend) {
                chapterContentTarget.insertAdjacentHTML('afterbegin', chapterContentHtml);
                console.log('  [DEBUG] Prepended verses to:', chapterContentTarget.id || chapterContentTarget.className);
            } else {
                chapterContentTarget.innerHTML = chapterContentHtml;
                console.log('  [DEBUG] Verses injected into:', chapterContentTarget.id || chapterContentTarget.className);
            }

            // Apply display settings (hiding verse numbers, continuous verses)
            applyDisplaySettings(chapterContentTarget);
            applySplitViewClasses(); // Re-apply classes for split view layout
        } else {
            console.error('[DEBUG] chapterContentTarget not found for:', targetElement.id || targetElement.className);
        }

        if (!continuousChaptersToggle.checked) {
            // Only update currentChapterNum and related UI if not in continuous chapter mode
            // This prevents chapter numbers from "jumping" as adjacent chapters load.
            currentChapterNum = data.chapterNumber;
            currentBookAbbr = data.bookAbbreviation;
            currentVersionAbbr = data.versionAbbreviation;
            totalChaptersInBook = data.totalChapters;

            prevChapterBtn.disabled = currentChapterNum === 1;
            nextChapterBtn.disabled = currentChapterNum >= totalChaptersInBook;
            renderChapterList(currentBookAbbr, totalChaptersInBook, currentChapterNum, currentVersionAbbr);
            chapterTitleEl.textContent = `${data.bookName} Chapter ${data.chapterNumber}`;
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

    /**
     * Applies 'hide-verse-numbers', 'continuous-verses', and 'side-by-side-verses-active' classes
     * to the given content area based on toggle states.
     * @param {HTMLElement} contentArea - The div element containing the chapter content.
     */
    const applyDisplaySettings = (contentArea) => {
        // Apply hide-verse-numbers class
        if (verseToggle.checked) {
            contentArea.classList.add('hide-verse-numbers');
        } else {
            contentArea.classList.remove('hide-verse-numbers');
        }

        // Apply continuous-verses class
        if (continuousVersesToggle.checked) {
            contentArea.classList.add('continuous-verses');
        } else {
            contentArea.classList.remove('continuous-verses');
        }

        // Apply side-by-side-verses-active class to chapter-content-block children
        // when sideBySideVersesToggle is checked and it's a split view (or single, if desired)
        const chapterContentBlocks = contentArea.querySelectorAll('.chapter-content-block');
        chapterContentBlocks.forEach(block => {
            if (sideBySideVersesToggle.checked) {
                block.classList.add('side-by-side-verses-active');
            } else {
                block.classList.remove('side-by-side-verses-active');
            }
        });
    };

    verseToggle.addEventListener('change', () => {
        document.querySelectorAll('.chapter-content, .chapter-content-split, #chapter-content').forEach(applyDisplaySettings);
    });

    continuousVersesToggle.addEventListener('change', () => {
        document.querySelectorAll('.chapter-content, .chapter-content-split, #chapter-content').forEach(applyDisplaySettings);
        // If continuous verses is enabled, ensure side-by-side is disabled
        if (continuousVersesToggle.checked && sideBySideVersesToggle.checked) {
            sideBySideVersesToggle.checked = false;
            // The sideBySideVersesToggle change listener will trigger updateAllViewsContent
            // so we don't need to call it twice here.
        }
        updateAllViewsContent(); // Re-render content with new setting
    });

    sideBySideVersesToggle.addEventListener('change', () => {
        // If side-by-side is enabled, ensure continuous verses is disabled
        if (sideBySideVersesToggle.checked && continuousVersesToggle.checked) {
            continuousVersesToggle.checked = false;
        }
        // Reload content in all active views to apply the new rendering logic
        updateAllViewsContent();
    });

    continuousChaptersToggle.addEventListener('change', () => {
        if (continuousChaptersToggle.checked) {
            // When continuous chapters is enabled, hide default nav buttons
            prevChapterBtn.style.display = 'none';
            nextChapterBtn.style.display = 'none';
            chapterTitleEl.style.display = 'none'; // Hide chapter title as it will be in the content
            // Load current chapter and surrounding chapters for continuous scroll
            // This now needs to call loadFullContinuousView for all active views
            const activeViews = document.querySelectorAll('.chapter-view.active-view-single, .chapter-view.active-view-split');
            activeViews.forEach(view => {
                const versionToLoad = view.id === 'singleChapterView' ? versionSelectView1.value : 
                                     (view.id === 'splitChapterView2' ? versionSelectView2.value : versionSelectView3.value);
                loadFullContinuousView(currentBookAbbr, currentChapterNum, versionToLoad, view);
            });
            mainContent.addEventListener('scroll', handleContinuousScroll);
        } else {
            // When continuous chapters is disabled, show default nav buttons
            prevChapterBtn.style.display = 'flex';
            nextChapterBtn.style.display = 'flex';
            chapterTitleEl.style.display = 'block'; // Show chapter title again
            mainContent.removeEventListener('scroll', handleContinuousScroll);
            // Reload only the current chapter for each active view
            loadedChapters = {}; // Clear cached chapters for regular mode
            const activeViews = document.querySelectorAll('.chapter-view.active-view-single, .chapter-view.active-view-split');
            activeViews.forEach(view => {
                const versionToLoad = view.id === 'singleChapterView' ? versionSelectView1.value : 
                                     (view.id === 'splitChapterView2' ? versionSelectView2.value : versionSelectView3.value);
                loadChapter(currentBookAbbr, currentChapterNum, versionToLoad, view);
            });
        }
    });


    versionSelect.addEventListener('change', (event) => {
        const newVersionAbbr = event.target.value;
        currentVersionAbbr = newVersionAbbr;
        versionSelectView1.value = newVersionAbbr;
        // The `updateAllViewsContent` function will handle reloading all active views
        updateAllViewsContent();
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
                if (continuousChaptersToggle.checked) {
                     loadFullContinuousView(currentBookAbbr, currentChapterNum, newVersionAbbr, targetChapterView);
                } else {
                    loadChapter(currentBookAbbr, currentChapterNum, newVersionAbbr, targetChapterView, false);
                }
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

    /**
     * Reloads content in all currently active views, preserving their current book/chapter/version
     * to apply new display settings (like side-by-side or continuous verses).
     */
    const updateAllViewsContent = () => {
        console.log("[DEBUG] updateAllViewsContent called to re-render all active views.");
        const allViews = [
            { el: singleChapterView, versionSelectEl: versionSelectView1 },
            { el: splitChapterView2, versionSelectEl: versionSelectView2 },
            { el: splitChapterView3, versionSelectEl: versionSelectView3 }
        ];

        allViews.forEach(view => {
            const chapterContentTarget = view.el.id === 'singleChapterView' ? document.getElementById('chapter-content') : view.el.querySelector('.chapter-content-split');
            
            // Only re-render if the view is active (single view is always active, others are toggled)
            if (view.el.classList.contains('active-view-single') || view.el.classList.contains('active-view-split')) {
                // Determine the book, chapter, and version for this specific view to reload
                // For continuous chapters, we need to consider the currently "focused" chapter in that view
                let bookToLoad = currentBookAbbr;
                let chapterToLoad = currentChapterNum;
                let versionToLoad = view.versionSelectEl.value;

                // Clear existing content before re-rendering
                if (chapterContentTarget) chapterContentTarget.innerHTML = '';
                
                if (continuousChaptersToggle.checked) {
                    loadFullContinuousView(bookToLoad, chapterToLoad, versionToLoad, view.el);
                } else {
                    loadChapter(bookToLoad, chapterToLoad, versionToLoad, view.el, false);
                }
            }
        });
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

    const isSplitViewActive = () => {
        return toggleView2.checked || toggleView3.checked;
    };

    const applySplitViewClasses = () => {
        // Remove existing width classes
        mainContent.classList.remove('grid-cols-1', 'grid-cols-2', 'grid-cols-3');
        mainContent.style.gridTemplateColumns = ''; // Clear custom grid template

        const activeViewsCount = document.querySelectorAll('.chapter-view.active-view-single, .chapter-view.active-view-split').length;

        if (activeViewsCount === 1) {
            mainContent.classList.add('flex-col');
            mainContent.classList.remove('flex-row');
            singleChapterView.style.maxWidth = '800px';
            singleChapterView.style.margin = '0 auto';
            singleChapterView.style.borderLeft = '1px solid #e0e0e0';
            singleChapterView.style.borderRight = '1px solid #e0e0e0';

            // Ensure other views have no borders if they are hidden
            splitChapterView2.style.borderRight = 'none';
            splitChapterView3.style.borderRight = 'none';

        } else {
            mainContent.classList.remove('flex-col');
            mainContent.classList.add('flex-row');
            mainContent.style.display = 'grid'; // Use grid for even columns
            mainContent.style.gridTemplateColumns = `repeat(${activeViewsCount}, minmax(0, 1fr))`;

            // Reset max-width and margin for singleChapterView when in split mode
            singleChapterView.style.maxWidth = 'none';
            singleChapterView.style.margin = '0';
            singleChapterView.style.borderLeft = 'none'; // No border on the first view when it's part of a grid

            // Apply/remove borders between split views
            const views = [singleChapterView, splitChapterView2, splitChapterView3];
            let activeViews = views.filter(view => view.classList.contains('active-view-single') || view.classList.contains('active-view-split'));

            activeViews.forEach((view, index) => {
                if (index < activeViews.length - 1) {
                    view.style.borderRight = '1px solid #e5e7eb';
                } else {
                    view.style.borderRight = 'none'; // Last active view has no right border
                }
            });
        }
    };


    const manageSplitViews = () => {
        console.log('[DEBUG] manageSplitViews called. View2 checked:', toggleView2.checked, 'View3 checked:', toggleView3.checked);

        chapterTitleEl.style.display = 'block'; // Ensure chapter title is visible by default

        // Ensure singleChapterView is always shown and primary (default view)
        singleChapterView.classList.add('active-view-single');
        singleChapterView.classList.remove('active-view-split');

        // Manage visibility and content for split views
        splitChapterView2.classList.remove('active-view-split'); // Always remove first
        if (toggleView2.checked) {
            console.log('[DEBUG] View 2 toggle checked. Activating splitChapterView2.');
            splitChapterView2.classList.add('active-view-split');
            // Ensure content is loaded if view becomes active
            if (!continuousChaptersToggle.checked) {
                loadChapter(currentBookAbbr, currentChapterNum, versionSelectView2.value, splitChapterView2, false);
            } else {
                loadFullContinuousView(currentBookAbbr, currentChapterNum, versionSelectView2.value, splitChapterView2);
            }
        }

        splitChapterView3.classList.remove('active-view-split'); // Always remove first
        if (toggleView3.checked) {
            console.log('[DEBUG] View 3 toggle checked. Activating splitChapterView3.');
            // If view 3 is checked, but view 2 is not, auto-activate view 2
            if (!toggleView2.checked) {
                console.log('[DEBUG] Auto-activating View 2 as View 3 is checked.');
                toggleView2.checked = true; // Programmatically check the box
                splitChapterView2.classList.add('active-view-split');
                if (!continuousChaptersToggle.checked) {
                    loadChapter(currentBookAbbr, currentChapterNum, versionSelectView2.value, splitChapterView2, false);
                } else {
                    loadFullContinuousView(currentBookAbbr, currentChapterNum, versionSelectView2.value, splitChapterView2);
                }
            }
            splitChapterView3.classList.add('active-view-split');
            // Ensure content is loaded if view becomes active
            if (!continuousChaptersToggle.checked) {
                loadChapter(currentBookAbbr, currentChapterNum, versionSelectView3.value, splitChapterView3, false);
            } else {
                loadFullContinuousView(currentBookAbbr, currentChapterNum, versionSelectView3.value, splitChapterView3);
            }
        }

        // Apply grid classes for even split views
        applySplitViewClasses();

        // Always reload the default view to ensure its content is correct after split view changes
        if (!continuousChaptersToggle.checked) {
            loadChapter(currentBookAbbr, currentChapterNum, versionSelectView1.value, singleChapterView, false);
        } else {
            loadFullContinuousView(currentBookAbbr, currentChapterNum, versionSelectView1.value, singleChapterView);
        }
    };

    toggleView2.addEventListener('change', manageSplitViews);
    toggleView3.addEventListener('change', manageSplitViews);

    const loadFullContinuousView = async (bookAbbr, chapterNum, versionAbbr, targetElement = singleChapterView) => {
        const chapterContentTarget = targetElement.id === 'singleChapterView' ? document.getElementById('chapter-content') : targetElement.querySelector('.chapter-content-split');
        if (chapterContentTarget) chapterContentTarget.innerHTML = `<p class="text-gray-500">Loading continuous chapters...</p>`;

        // Clear loadedChapters cache only for the target view if it's currently holding continuous content
        const currentViewId = targetElement.id;
        Object.keys(loadedChapters).forEach(key => {
            const [b, c, v] = key.split('.');
            if (v === versionAbbr && (targetElement.id === 'singleChapterView' || key.includes(targetElement.id.replace('splitChapterView', '')))) {
                // If the key contains the view's version and is associated with this view (can refine if needed)
                // This is a rough heuristic; a more robust solution might tie loadedChapters directly to views.
                delete loadedChapters[key];
            }
        });


        const chaptersToLoad = [];
        const currentBookTotalChapters = bookChapterCounts[bookAbbr];

        // Load current chapter
        chaptersToLoad.push({ bookAbbr, chapterNum });
        // Load 2 chapters before (if available)
        for (let i = 1; i <= 2; i++) {
            const prevChapterNum = chapterNum - i;
            if (prevChapterNum >= 1) {
                chaptersToLoad.unshift({ bookAbbr, chapterNum: prevChapterNum });
            } else {
                // If we reach the beginning of the book, try loading the last chapter of the previous book
                const prevBookIndex = Object.keys(bookAbbreviationToIdMap).indexOf(bookAbbr) - 1;
                if (prevBookIndex >= 0) {
                    const prevBookAbbr = Object.keys(bookAbbreviationToIdMap)[prevBookIndex];
                    const prevBookLastChapter = bookChapterCounts[prevBookAbbr];
                    chaptersToLoad.unshift({ bookAbbr: prevBookAbbr, chapterNum: prevBookLastChapter });
                }
            }
        }
        // Load 2 chapters after (if available)
        for (let i = 1; i <= 2; i++) {
            const nextChapterNum = chapterNum + i;
            if (nextChapterNum <= currentBookTotalChapters) {
                chaptersToLoad.push({ bookAbbr, chapterNum: nextChapterNum });
            } else {
                // If we reach the end of the book, try loading the first chapter of the next book
                const nextBookIndex = Object.keys(bookAbbreviationToIdMap).indexOf(bookAbbr) + 1;
                if (nextBookIndex < Object.keys(bookAbbreviationToIdMap).length) {
                    const nextBookAbbr = Object.keys(bookAbbreviationToIdMap)[nextBookIndex];
                    chaptersToLoad.push({ bookAbbr: nextBookAbbr, chapterNum: 1 });
                }
            }
        }

        // Use a temporary array to build HTML to minimize DOM manipulation
        let fullContentHtml = '';
        for (const chapter of chaptersToLoad) {
            const chapterKey = `${chapter.bookAbbr}.${chapter.chapterNum}.${versionAbbr}`;
            // Fetch and render each chapter, ensuring they are appended in order
            await loadChapter(chapter.bookAbbr, chapter.chapterNum, versionAbbr, targetElement, false, true, false);
            // After loading, the data should be in loadedChapters cache, retrieve it
            const chapterData = loadedChapters[chapterKey];
            if (chapterData) {
                // Apply side-by-side class at the chapter-content-block level
                const sideBySideClass = sideBySideVersesToggle.checked ? 'side-by-side-verses-active' : '';
                fullContentHtml += `<div class="chapter-content-block ${sideBySideClass}" data-book="${chapterData.bookAbbreviation}" data-chapter="${chapterData.chapterNumber}" data-version="${chapterData.versionAbbreviation}">`;
                fullContentHtml += `<h4 class="text-xl font-semibold text-gray-800 my-4">${chapterData.bookName} Chapter ${chapterData.chapterNumber}</h4>`;
                fullContentHtml += generateVersesHtml(chapterData.verses, continuousVersesToggle.checked, sideBySideVersesToggle.checked);
                fullContentHtml += `</div>`;
            }
        }
        if (chapterContentTarget) {
             chapterContentTarget.innerHTML = fullContentHtml;
             // Ensure display settings are applied after all content is loaded
             applyDisplaySettings(chapterContentTarget);
        }

        // Scroll to the current chapter
        const currentChapterBlock = chapterContentTarget.querySelector(`.chapter-content-block[data-book="${bookAbbr}"][data-chapter="${chapterNum}"][data-version="${versionAbbr}"]`);
        if (currentChapterBlock) {
            currentChapterBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };


    const handleContinuousScroll = async () => {
        const scrollThreshold = 200; // Pixels from top/bottom to trigger load
        // This function will need to manage scrolling for ALL active views, not just singleChapterView
        // For simplicity, for now, it'll still drive based on the primary singleChapterView's scroll
        // as managing multiple independent continuous scrolls and their synchronization is complex.
        const contentArea = singleChapterView.id === 'singleChapterView' ? document.getElementById('chapter-content') : singleChapterView.querySelector('.chapter-content-split');

        if (!contentArea) return; // Exit if content area not found

        // Get all active chapter content blocks for the current view
        const chapterBlocks = contentArea.querySelectorAll('.chapter-content-block');
        if (chapterBlocks.length === 0) return;

        // Determine the book and chapter of the currently visible (or most prominent) chapter
        let visibleChapterBlock = null;
        for (let i = 0; i < chapterBlocks.length; i++) {
            const rect = chapterBlocks[i].getBoundingClientRect();
            // If the top of the block is within the viewport or just above
            if (rect.top >= 0 && rect.top <= window.innerHeight || rect.bottom > 0 && rect.top < window.innerHeight) {
                visibleChapterBlock = chapterBlocks[i];
                break;
            }
        }
        if (!visibleChapterBlock) {
            // Fallback: if no block is clearly visible, assume the first or last
            visibleChapterBlock = chapterBlocks[0];
            const lastBlockRect = chapterBlocks[chapterBlocks.length - 1].getBoundingClientRect();
            if (lastBlockRect.bottom <= window.innerHeight && lastBlockRect.top >= 0) {
                visibleChapterBlock = chapterBlocks[chapterBlocks.length - 1];
            }
        }


        if (visibleChapterBlock) {
            currentBookAbbr = visibleChapterBlock.dataset.book;
            currentChapterNum = parseInt(visibleChapterBlock.dataset.chapter);
            currentVersionAbbr = visibleChapterBlock.dataset.version;
            totalChaptersInBook = bookChapterCounts[currentBookAbbr]; // Update total chapters for current book

            // Update chapter title in header to reflect the currently viewed chapter (if not split view)
            if (!isSplitViewActive()) {
                chapterTitleEl.textContent = `${getBookNameFromAbbreviation(currentBookAbbr)} Chapter ${currentChapterNum}`;
                versionSelect.value = currentVersionAbbr;
            }
            renderChapterList(currentBookAbbr, totalChaptersInBook, currentChapterNum, currentVersionAbbr);

            // Fetch previous chapter if scrolling near top
            if (contentArea.scrollTop < scrollThreshold && !isLoadingPrevChapter) {
                console.log("[DEBUG] Scrolling near top, trying to load previous chapter...");
                isLoadingPrevChapter = true;
                const prevChapterNum = currentChapterNum - 1;
                if (prevChapterNum >= 1) {
                    await loadChapter(currentBookAbbr, prevChapterNum, currentVersionAbbr, singleChapterView, false, false, true);
                } else {
                    const prevBookIndex = Object.keys(bookAbbreviationToIdMap).indexOf(currentBookAbbr) - 1;
                    if (prevBookIndex >= 0) {
                        const prevBookAbbr = Object.keys(bookAbbreviationToIdMap)[prevBookIndex];
                        const prevBookLastChapter = bookChapterCounts[prevBookAbbr];
                        await loadChapter(prevBookAbbr, prevBookLastChapter, currentVersionAbbr, singleChapterView, false, false, true);
                    }
                }
            }

            // Fetch next chapter if scrolling near bottom
            if (contentArea.scrollHeight - contentArea.scrollTop - contentArea.clientHeight < scrollThreshold && !isLoadingNextChapter) {
                console.log("[DEBUG] Scrolling near bottom, trying to load next chapter...");
                isLoadingNextChapter = true;
                const nextChapterNum = currentChapterNum + 1;
                if (nextChapterNum <= totalChaptersInBook) {
                    await loadChapter(currentBookAbbr, nextChapterNum, currentVersionAbbr, singleChapterView, false, true, false);
                } else {
                    const nextBookIndex = Object.keys(bookAbbreviationToIdMap).indexOf(currentBookAbbr) + 1;
                    if (nextBookIndex < Object.keys(bookAbbreviationToIdMap).length) {
                        const nextBookAbbr = Object.keys(bookAbbreviationToIdMap)[nextBookIndex];
                        await loadChapter(nextBookAbbr, 1, currentVersionAbbr, singleChapterView, false, true, false);
                    }
                }
            }
        }
    };


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

        // Apply initial verse, continuous, and side-by-side settings for the single view
        applyDisplaySettings(chapterContentEl); 
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
