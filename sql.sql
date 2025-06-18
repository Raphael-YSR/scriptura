COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Mark1_NKJV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Mark1_KJV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Mark1_NIV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Mark1_ESV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Mark1_TPT.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Mark1_AMPC.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Mark1_AMP.csv' 
WITH (FORMAT CSV, HEADER true);


