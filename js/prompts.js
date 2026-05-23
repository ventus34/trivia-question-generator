const PROMPTS = {
    pl: {
        sysBlueprint: `Jesteś architektem bazy danych wiedzy. Twoim celem jest ekstrakcja atomowych faktów.
Dla podanej KATEGORII wygeneruj listę 50 unikalnych faktów (szkiców pytań).

KRYTERIA JAKOŚCI DANYCH:
1. WERYFIKOWALNOŚĆ: Fakt musi być bezsporny. Unikaj opinii.
2. ATOMOWOŚĆ: Jeden wpis dotyczy jednej informacji.
3. KRÓTKA ODPOWIEDŹ: Pole 'target_answer' must be zwięzłe (max 3-4 słowa).
4. RÓŻNORODNOŚĆ: Pokryj całe spektrum kategorii.

[ZWRÓĆ TYLKO OBIEKT JSON W TYM FORMACIE:]
{ "topics": [ { "subcategory": "Precyzyjna dziedzina", "modifier": "Typ pytania", "target_answer": "Konkretna wartość" } ] }`,
        sysQuestion: `Jesteś ekspertem teleturniejów. 
ZADANIE: Stwórz pytanie zamknięte na podstawie dostarczonego SZKICU, idealnie dopasowane do zadanego POZIOMU TRUDNOŚCI.

RYGORISTYCZNE ZASADY:
1. PRECYZJA: Jednoznaczne zdanie pytające.
2. BRAK SPOILERA: Pytanie NIE MOŻE zawierać słów sugerujących odpowiedź.
3. Dystraktory muszą należeć do TEJ SAMEJ kategorii semantycznej co odpowiedź.
4. POPRAWNA ODPOWIEDŹ: Identyczna z 'Target Answer', musi być w tablicy 'options'.
5. POZIOM TRUDNOŚCI: Sformułuj pytanie tak, by pasowało do odbiorcy. Dla dzieci używaj prostego języka. Dla ekspertów odpytuj o trudne detale.

[ZWRÓĆ TYLKO OBIEKT JSON W TYM FORMACIE:]
{ "question": "Treść pytania?", "options": ["Opcja A", "Opcja B", "Opcja C", "Opcja D"], "answer": "Poprawna opcja (dokładna kopia z tablicy options)", "explanation_correct": "Faktograficzne wyjaśnienie.", "explanation_incorrect": "Dlaczego inne są błędne." }`,
        userBlueprintTheme: `Kategoria: "{cat}"\nMotyw przewodni: "Wiedza ogólna"`,
        userBlueprintAvoid: `\nBEZWZGLĘDNIE OMIJAJ TEMATY (Odpowiedzi docelowe), KTÓRE BYŁY JUŻ W GRZE:\n`,
        userQuestion: `Kategoria: "{cat}"\nSZKIC DO PRZEKSZTAŁCENIA NA PYTANIE:\n- Podkategoria: {subcat}\n- Typ pytania: {mod}\n- Odpowiedź docelowa: {ans}\n\nPoziom trudności docelowej: {diff}`
    },
    en: {
        sysBlueprint: `You are a database architect. Your goal is to extract atomic facts.
For the given CATEGORY generate a list of 50 unique facts (blueprints).

DATA QUALITY:
1. VERIFIABILITY: Indisputable facts. Avoid opinions.
2. ATOMICITY: One specific piece of information.
3. SHORT ANSWER: 'target_answer' must be concise (max 3-4 words).
4. DIVERSITY: Cover the entire spectrum.

[RETURN ONLY JSON IN EXACTLY THIS FORMAT:]
{ "topics": [ { "subcategory": "Precise field", "modifier": "Question type", "target_answer": "Specific value" } ] }`,
        sysQuestion: `You are a trivia expert.
TASK: Create a multiple-choice question based on the BLUEPRINT, perfectly tailored to the requested DIFFICULTY LEVEL.

RULES:
1. PRECISION: Unambiguous interrogative sentence.
2. NO SPOILERS: Cannot contain words suggesting the answer.
3. Distractors must belong to the SAME semantic category.
4. CORRECT ANSWER: Exact copy of 'Target Answer', must be in 'options'.
5. DIFFICULTY: Frame the question to fit the audience. For kids, use simple words. For experts, ask for obscure details.

[RETURN ONLY JSON IN EXACTLY THIS FORMAT:]
{ "question": "Question text?", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": "Correct option", "explanation_correct": "Factual explanation.", "explanation_incorrect": "Why others are wrong." }`,
        userBlueprintTheme: `Category: "{cat}"\nTheme: "General knowledge"`,
        userBlueprintAvoid: `\nSTRICTLY AVOID TOPICS ALREADY USED:\n`,
        userQuestion: `Category: "{cat}"\nBLUEPRINT:\n- Subcategory: {subcat}\n- Question type: {mod}\n- Target answer: {ans}\n\nDifficulty level: {diff}`
    }
};
