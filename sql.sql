-- CHAPTERS MISSING NLT 
    SELECT DISTINCT 
    b.bookid,
    b.name AS book_name,
    v.chapternumber
FROM 
    public.verses v
JOIN 
    public.books b 
    ON v.bookid = b.bookid
WHERE 
    v.translationid <> 8  -- chapters from other translations
    AND NOT EXISTS (
        SELECT 1
        FROM public.verses vn
        WHERE vn.translationid = 8
          AND vn.bookid = v.bookid
          AND vn.chapternumber = v.chapternumber
    )
ORDER BY 
    b.bookid,
    v.chapternumber;
