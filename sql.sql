
COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Ephesians6_NKJV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Ephesians6_KJV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Ephesians6_NIV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Ephesians6_ESV.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Ephesians6_AMPC.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Ephesians6_AMP.csv' 
WITH (FORMAT CSV, HEADER true);

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Ephesians6_TPT.csv' 
WITH (FORMAT CSV, HEADER true);