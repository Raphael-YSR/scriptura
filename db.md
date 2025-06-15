bible_db=# \d books
                                            Table "public.books"
        Column        |         Type          | Collation | Nullable |                Default
----------------------+-----------------------+-----------+----------+---------------------------------------
 bookid               | integer               |           | not null | nextval('books_bookid_seq'::regclass)
 testamentid          | integer               |           | not null |
 name                 | character varying(50) |           | not null |
 abbreviation         | text                  |           | not null |
 chapters             | integer               |           | not null |
 author               | character varying(50) |           |          |
 estimatedwritingdate | text                  |           |          |
 genre                | character varying(30) |           |          |
 keythemes            | text                  |           |          |
Indexes:
    "books_pkey" PRIMARY KEY, btree (bookid)
    "books_abbreviation_key" UNIQUE CONSTRAINT, btree (abbreviation)
    "books_name_key" UNIQUE CONSTRAINT, btree (name)
    "idx_books_testament" btree (testamentid)
Check constraints:
    "books_chapters_check" CHECK (chapters > 0)
Foreign-key constraints:
    "books_testamentid_fkey" FOREIGN KEY (testamentid) REFERENCES testaments(testamentid) ON DELETE RESTRICT
Referenced by:
    TABLE "verses" CONSTRAINT "verses_bookid_fkey" FOREIGN KEY (bookid) REFERENCES books(bookid) ON DELETE RESTRICT


bible_db=# \d verses
                                               Table "public.verses"
       Column        |            Type             | Collation | Nullable |                 Default
---------------------+-----------------------------+-----------+----------+-----------------------------------------
 verseid             | bigint                      |           | not null | nextval('verses_verseid_seq'::regclass)
 translationid       | integer                     |           | not null |
 bookid              | integer                     |           | not null |
 chapternumber       | smallint                    |           | not null |
 versenumber         | smallint                    |           | not null |
 versetext           | text                        |           | not null |
 versetextsearchable | tsvector                    |           |          |
 hasfootnotes        | boolean                     |           |          | false
 createdat           | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 updatedat           | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 wordcount           | integer                     |           |          |
Indexes:
    "verses_pkey" PRIMARY KEY, btree (verseid)
    "idx_verses_book_chapter" btree (bookid, chapternumber)
    "idx_verses_lookup" btree (translationid, bookid, chapternumber, versenumber)
    "idx_verses_search" gin (versetextsearchable)
    "idx_verses_translation" btree (translationid)
    "verses_translationid_bookid_chapternumber_versenumber_key" UNIQUE CONSTRAINT, btree (translationid, bookid, chapternumber, versenumber)
Check constraints:
    "verses_chapternumber_check" CHECK (chapternumber > 0)
    "verses_versenumber_check" CHECK (versenumber > 0)
Foreign-key constraints:
    "verses_bookid_fkey" FOREIGN KEY (bookid) REFERENCES books(bookid) ON DELETE RESTRICT
    "verses_translationid_fkey" FOREIGN KEY (translationid) REFERENCES translations(translationid) ON DELETE CASCADE
Triggers:
    trigger_update_verse_metadata BEFORE INSERT OR UPDATE ON verses FOR EACH ROW EXECUTE FUNCTION update_verse_metadata()


bible_db=# \d testaments
                                           Table "public.testaments"
    Column    |         Type          | Collation | Nullable |                     Default
--------------+-----------------------+-----------+----------+-------------------------------------------------
 testamentid  | integer               |           | not null | nextval('testaments_testamentid_seq'::regclass)
 name         | character varying(20) |           | not null |
 abbreviation | character varying(5)  |           | not null |
 description  | text                  |           |          |
Indexes:
    "testaments_pkey" PRIMARY KEY, btree (testamentid)
    "testaments_abbreviation_key" UNIQUE CONSTRAINT, btree (abbreviation)
    "testaments_name_key" UNIQUE CONSTRAINT, btree (name)
Referenced by:
    TABLE "books" CONSTRAINT "books_testamentid_fkey" FOREIGN KEY (testamentid) REFERENCES testaments(testamentid) ON DELETE RESTRICT


bible_db=# \d translations
                                                Table "public.translations"
     Column     |            Type             | Collation | Nullable |                       Default
----------------+-----------------------------+-----------+----------+-----------------------------------------------------
 translationid  | integer                     |           | not null | nextval('translations_translationid_seq'::regclass)
 abbreviation   | character varying(10)       |           | not null |
 name           | character varying(100)      |           | not null |
 language       | character varying(20)       |           | not null | 'English'::character varying
 publisher      | character varying(100)      |           |          |
 year           | integer                     |           |          |
 copyrightinfo  | text                        |           |          |
 description    | text                        |           |          |
 ispublicdomain | boolean                     |           |          | false
 createdat      | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 updatedat      | timestamp without time zone |           |          | CURRENT_TIMESTAMP
Indexes:
    "translations_pkey" PRIMARY KEY, btree (translationid)
    "translations_abbreviation_key" UNIQUE CONSTRAINT, btree (abbreviation)
Check constraints:
    "translations_year_check" CHECK (year > 0 AND year::numeric <= EXTRACT(year FROM CURRENT_DATE))
Referenced by:
    TABLE "verses" CONSTRAINT "verses_translationid_fkey" FOREIGN KEY (translationid) REFERENCES translations(translationid) ON DELETE CASCADE

-------------------------------------------------------------------------------------------------------------------

"translationid","abbreviation","name","language","publisher","year","copyrightinfo","description","ispublicdomain","createdat","updatedat"
1,"KJV","King James Version","English","Various Publishers",1611,NULL,"Classic English translation completed in 1611",True,"2025-06-10 12:23:03.730343","2025-06-10 12:23:03.730343"
2,"NIV","New International Version","English","Biblica",2011,NULL,"Modern English translation focused on accuracy and readability",False,"2025-06-10 12:23:03.730343","2025-06-10 12:23:03.730343"
3,"NKJV","New King James Version","English","Thomas Nelson",1982,"Copyright © 1982 by Thomas Nelson. All rights reserved.","Modern update of the KJV",False,"2025-06-10 12:31:43.880563","2025-06-10 12:31:43.880563"
4,"AMP","Amplified Bible","English","The Lockman Foundation",2015,"Scripture taken from the Amplified® Bible, Copyright © 2015 by The Lockman Foundation. Used by permission. www.Lockman.org","Amplified Bible (AMP) copyright © 2015 by The Lockman Foundation, La Habra, CA 90631. All rights reserved.",False,"2025-06-10 12:31:43.880563","2025-06-10 12:31:43.880563"
5,"AMPC","Amplified Bible, Classic Edition","English","The Lockman Foundation",1965,"Amplified Bible, Classic Edition (AMPC) copyright © 1965, 1987 by The Lockman Foundation. Used by permission. www.Lockman.org","Amplified Bible, Classic Edition (AMPC) copyright © 1965, 1987 by The Lockman Foundation, La Habra, CA 90631. All rights reserved.",False,"2025-06-10 12:31:43.880563","2025-06-10 12:31:43.880563"
6,"TPT","The Passion Translation","English","BroadStreet Publishing",2017,"The Passion Translation®. Copyright © 2017 by BroadStreet Publishing®. Used by permission. All rights reserved. thepassiontranslation.com","Dynamic-equivalence translation focusing on the heart of God.",False,"2025-06-10 12:31:43.880563","2025-06-10 12:31:43.880563"
7,"ESV","English Standard Version","English","Crossway",2001,"The Holy Bible, English Standard Version® (ESV®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.","Essentially literal translation.",False,"2025-06-10 12:31:43.880563","2025-06-10 12:31:43.880563"

---------------------------------------------------------------------------------------------------------------------

"testamentid","name","abbreviation","description"
1,"Old Testament","OT","The first part of the Christian Bible, consisting of 39 books"
2,"New Testament","NT","The second part of the Christian Bible, consisting of 27 books"

---------------------------------------------------------------------------------------------------------------------

"bookid","testamentid","name","abbreviation","chapters","author","estimatedwritingdate","genre","keythemes"
2,1,"Exodus","Exod",40,"Moses","c. 1440-1400 BC","Law/History","Slavery in Egypt, Exodus, Sinai Covenant, Tabernacle"
3,1,"Leviticus","Lev",27,"Moses","c. 1440-1400 BC","Law/History","Holiness, Atonement, Sacrifices, Priestly Laws"
4,1,"Numbers","Num",36,"Moses","c. 1440-1400 BC","Law/History","Wilderness wanderings, Census, Disobedience, God's faithfulness"
5,1,"Deuteronomy","Deut",34,"Moses","c. 1400 BC","Law/History","Second giving of the Law, Covenant renewal, Preparation for Promised Land"
6,1,"Joshua","Josh",24,"Joshua","c. 1375 BC","History","Conquest of Canaan, Division of the land, God's faithfulness to promises"
7,1,"Judges","Judg",21,"Samuel (Trad.)","c. 1045 BC","History","Cycles of apostasy, oppression, repentance, and deliverance"
8,1,"Ruth","Ruth",4,"Samuel (Trad.)","c. 1000 BC","History","Loyalty, Kinsman-Redeemer, God's providence, Ancestry of David"
9,1,"1 Samuel","1 Sam",31,"Samuel, Nathan, Gad (Trad.)","c. 930 BC","History","Rise of Monarchy, Reign of Saul, Early life of David"
10,1,"2 Samuel","2 Sam",24,"Nathan, Gad (Trad.)","c. 930 BC","History","David's reign as king, Davidic Covenant, David's sins and consequences"
11,1,"1 Kings","1 Kgs",22,"Jeremiah (Trad.)","c. 560-538 BC","History","Reign of Solomon, Division of Kingdom, Early prophets Elijah and Elisha"
12,1,"2 Kings","2 Kgs",25,"Jeremiah (Trad.)","c. 560-538 BC","History","Kings of Judah and Israel, Prophetic ministries, Fall of Israel and Judah"
13,1,"1 Chronicles","1 Chr",29,"Ezra (Trad.)","c. 450-425 BC","History","Genealogies, Reign of David, Temple preparations, God's covenant faithfulness"
14,1,"2 Chronicles","2 Chr",36,"Ezra (Trad.)","c. 450-425 BC","History","Reigns of Judah's kings, Temple, Revival and apostasy, Exile and return"
15,1,"Ezra","Ezra",10,"Ezra","c. 450-425 BC","History","Return from exile, Rebuilding the Temple, Restoration of worship"
16,1,"Nehemiah","Neh",13,"Nehemiah","c. 445-425 BC","History","Rebuilding Jerusalem's walls, Spiritual revival, Social justice"
17,1,"Esther","Esth",10,"Unknown","c. 460-400 BC","History","God's hidden providence, Deliverance of the Jews, Feast of Purim"
22,1,"Song of Songs","Song",8,"Solomon","c. 960 BC","Poetry/Wisdom","Love, Marriage, Romance, Allegory of God's love for His people"
18,1,"Job","Job",42,"Unknown (Moses or later)","c. 2000-1800 BC (or later)","Wisdom Literature","Suffering, God's sovereignty, Justice, Faith, Repentance"
19,1,"Psalms","Ps",150,"David, Asaph, Sons of Korah, Moses, Solomon, etc.","c. 1400-400 BC","Poetry/Wisdom","Praise, Lament, Wisdom, Messianic prophecy, God's character"
20,1,"Proverbs","Prov",31,"Solomon, Agur, Lemuel","c. 950 BC","Wisdom Literature","Wisdom, Folly, Righteous living, Fear of the Lord"
21,1,"Ecclesiastes","Eccl",12,"Solomon (Trad.)","c. 935 BC","Wisdom Literature","Meaning of life, Vanity of earthly pursuits, Fear God and keep His commandments"
23,1,"Isaiah","Isa",66,"Isaiah","c. 740-680 BC","Major Prophet","Judgment and salvation, Messiah, God's sovereignty, Remnant"
24,1,"Jeremiah","Jer",52,"Jeremiah","c. 627-586 BC","Major Prophet","Judgment on Judah, Call to repentance, New Covenant, God's faithfulness"
25,1,"Lamentations","Lam",5,"Jeremiah","c. 586 BC","Poetry/Lament","Grief over Jerusalem's destruction, Hope in God's compassion"
26,1,"Ezekiel","Ezek",48,"Ezekiel","c. 593-571 BC","Major Prophet","God's glory, Judgment on Israel and nations, Restoration, New Temple"
27,1,"Daniel","Dan",12,"Daniel","c. 536 BC","Major Prophet/Apocalyptic","God's sovereignty over kingdoms, Prophecy of future events, Faithfulness in exile"
28,1,"Hosea","Hos",14,"Hosea","c. 750-710 BC","Minor Prophet","God's unfailing love, Israel's unfaithfulness, Restoration"
29,1,"Joel","Joel",3,"Joel","c. 835 BC (or 400s BC)","Minor Prophet","Locust plague, Day of the Lord, Spirit outpouring, Restoration"
30,1,"Amos","Amos",9,"Amos","c. 760-750 BC","Minor Prophet","Social injustice, God's judgment, Righteousness, Remnant"
31,1,"Obadiah","Obad",1,"Obadiah","c. 840 BC (or 586 BC)","Minor Prophet","Judgment on Edom, Vindication of Israel"
32,1,"Jonah","Jonah",4,"Jonah","c. 793-758 BC","Minor Prophet","God's compassion, Repentance, God's universal grace"
33,1,"Micah","Mic",7,"Micah","c. 735-710 BC","Minor Prophet","Injustice, Judgment, Restoration, Messiah's birthplace"
34,1,"Nahum","Nah",3,"Nahum","c. 663-612 BC","Minor Prophet","Judgment on Nineveh, God's vengeance and justice"
35,1,"Habakkuk","Hab",3,"Habakkuk","c. 609-605 BC","Minor Prophet","Faith in the midst of injustice, God's faithfulness, Righteous live by faith"
36,1,"Zephaniah","Zeph",3,"Zephaniah","c. 640-609 BC","Minor Prophet","Day of the Lord, Judgment, Restoration of a pure remnant"
37,1,"Haggai","Hag",2,"Haggai","c. 520 BC","Minor Prophet","Rebuilding the Temple, God's priority, Blessing for obedience"
38,1,"Zechariah","Zech",14,"Zechariah","c. 520-480 BC","Minor Prophet","Visions, Prophecies of Messiah, Temple rebuilding, Future glory"
39,1,"Malachi","Mal",4,"Malachi","c. 430 BC","Minor Prophet","Israel's spiritual apathy, Coming of the Messiah, Day of the Lord"
40,2,"Matthew","Matt",28,"Matthew","c. 60-70 AD","Gospel","Jesus as Messiah, Kingdom of Heaven, Discipleship"
41,2,"Mark","Mark",16,"Mark","c. 50-60 AD","Gospel","Jesus as Servant, Action-oriented, Gospel proclamation"
42,2,"Luke","Luke",24,"Luke","c. 60-62 AD","Gospel","Jesus as Son of Man, Universal salvation, Compassion for marginalized"
43,2,"John","John",21,"John","c. 85-95 AD","Gospel","Jesus as Son of God, Believe and have eternal life, Love, Truth"
44,2,"Acts","Acts",28,"Luke","c. 62-64 AD","History","Early Church, Holy Spirit, Spread of Gospel, Missions"
45,2,"Romans","Rom",16,"Paul","c. 57 AD","Epistle","Righteousness of God, Justification by faith, Sanctification, God's plan for Israel"
46,2,"1 Corinthians","1 Cor",16,"Paul","c. 55 AD","Epistle","Church unity, Sexual immorality, Spiritual gifts, Resurrection"
47,2,"2 Corinthians","2 Cor",13,"Paul","c. 56 AD","Epistle","Paul's apostleship, Suffering, Reconciliation, Giving"
48,2,"Galatians","Gal",6,"Paul","c. 49 AD","Epistle","Justification by faith, Freedom in Christ, Law vs. Grace, Fruit of the Spirit"
49,2,"Ephesians","Eph",6,"Paul","c. 60-62 AD","Epistle","Unity of believers, Church as Body of Christ, Spiritual blessings, Armor of God"
50,2,"Philippians","Phil",4,"Paul","c. 60-62 AD","Epistle","Joy in Christ, Partnership in Gospel, Humility, Contentment"
52,2,"1 Thessalonians","1 Thess",5,"Paul","c. 51 AD","Epistle","Comfort in persecution, Sanctification, Christ's second coming"
53,2,"2 Thessalonians","2 Thess",3,"Paul","c. 51-52 AD","Epistle","Clarification on Christ's return, Perseverance, Dealing with idleness"
54,2,"1 Timothy","1 Tim",6,"Paul","c. 62-64 AD","Pastoral Epistle","Church leadership, Sound doctrine, Godly living"
55,2,"2 Timothy","2 Tim",4,"Paul","c. 64-67 AD","Pastoral Epistle","Endurance in ministry, Faithfulness, Scripture's authority"
56,2,"Titus","Titus",3,"Paul","c. 62-64 AD","Pastoral Epistle","Orderly church life, Godly conduct, Sound doctrine"
57,2,"Philemon","Phlm",1,"Paul","c. 60-62 AD","Epistle","Forgiveness, Reconciliation, Christian brotherhood"
58,2,"Hebrews","Heb",13,"Unknown (Paul, Apollos, Barnabas, etc.)","c. 60s AD","Epistle/Sermon","Supremacy of Christ, Warning against apostasy, Faith, New Covenant"
59,2,"James","Jas",5,"James (Brother of Jesus)","c. 45-49 AD","General Epistle","Faith and works, Wisdom, Control of tongue, Perseverance in trials"
60,2,"1 Peter","1 Pet",5,"Peter","c. 62-64 AD","General Epistle","Suffering for Christ, Hope, Holy living, Submission to authority"
61,2,"2 Peter","2 Pet",3,"Peter","c. 64-67 AD","General Epistle","False teachers, God's judgment, Christ's return, Growth in grace"
62,2,"1 John","1 John",5,"John","c. 90-95 AD","General Epistle","Fellowship with God, Love one another, Assurance of salvation, Truth vs. falsehood"
63,2,"2 John","2 John",1,"John","c. 90-95 AD","General Epistle","Love and truth, Warning against false teachers"
64,2,"3 John","3 John",1,"John","c. 90-95 AD","General Epistle","Hospitality, Support for missionaries, Godly conduct"
65,2,"Jude","Jude",1,"Jude (Brother of Jesus)","c. 65 AD","General Epistle","Contending for the faith, Warning against apostates"
66,2,"Revelation","Rev",22,"John","c. 95 AD","Apocalyptic/Prophecy","Christ's victory, End times, New Heaven and New Earth, Hope"
51,2,"Colossians","Col",4,"Paul","c. 60-62 AD","Epistle","Supremacy of Christ, Christian living, false teaching warnings"
1,1,"Genesis","Gen",50,"Moses","c. 1440-1400 BC","Law/History","Creation, Fall, Flood, Patriarchs, Covenant"


---------------------------------------------------------------------------------------------------------------------

COPY verses (translationid, bookid, chapternumber, versenumber, versetext, versetextsearchable, hasfootnotes, wordcount) 
FROM 'D:\Trading Journal\Analysis\A+ BACKTESTING\verses_Genesis_Ch1_KJV.csv' 
WITH (FORMAT CSV, HEADER true);

---------------------------------------------------------------------------------------------------------------------