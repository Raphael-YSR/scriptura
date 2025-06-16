COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Genesis4_NKJV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Genesis4_KJV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Genesis4_NIV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Genesis4_ESV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Genesis4_TPT.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Genesis4_AMPC.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Genesis4_AMP.csv' 
WITH (FORMAT CSV, HEADER true);


