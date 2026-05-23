let currentLanguage = 'pl'; 

function renderLanguageSelector() {
    const selector = document.querySelector('.lang-selector');
    if (!selector) return;
    selector.innerHTML = '';
    Object.keys(i18n).forEach(lang => {
        const span = document.createElement('span');
        span.className = `lang-flag${lang === currentLanguage ? ' active' : ''}`;
        span.id = `flag-${lang}`;
        span.onclick = () => setLanguage(lang);
        span.innerText = i18n[lang]._flag || '🌐';
        span.title = i18n[lang]._name || lang;
        selector.appendChild(span);
    });
}

function setLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('.lang-flag').forEach(el => el.classList.remove('active'));
    const activeFlag = document.getElementById('flag-' + lang);
    if (activeFlag) activeFlag.classList.add('active');
    updateLanguageUI();
}

function showModal(message, isConfirm = false, onConfirm = null) {
    const modal = document.getElementById('customModal');
    document.getElementById('customModalMessage').innerText = message;
    const btnContainer = document.getElementById('customModalButtons');
    btnContainer.innerHTML = '';
    
    if (isConfirm) {
        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn-secondary';
        btnCancel.innerText = i18n[currentLanguage].btnCancel;
        btnCancel.onclick = () => { modal.classList.remove('active'); };
        
        const btnOk = document.createElement('button');
        btnOk.className = 'btn-primary btn-danger';
        btnOk.innerText = i18n[currentLanguage].btnYes;
        btnOk.onclick = () => { modal.classList.remove('active'); if(onConfirm) onConfirm(); };
        
        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnOk);
    } else {
        const btnOk = document.createElement('button');
        btnOk.className = 'btn-primary';
        btnOk.innerText = i18n[currentLanguage].btnOk;
        btnOk.onclick = () => { modal.classList.remove('active'); };
        btnContainer.appendChild(btnOk);
    }
    modal.classList.add('active');
}

function toggleConfig() {
    const content = document.getElementById('configContent');
    const icon = document.getElementById('configToggleIcon');
    content.classList.toggle('collapsed');
    icon.style.transform = content.classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)';
}

function updateLanguageUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLanguage][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.hasAttribute('placeholder')) el.placeholder = i18n[currentLanguage][key];
                if (el.type === 'text' && el.id.startsWith('cat-in-')) {
                    const catNum = el.id.split('-')[2];
                    const catKey = 'cat' + catNum;
                    const isDefaultValue = Object.keys(i18n).some(lang => el.value === i18n[lang][catKey]);
                    if (isDefaultValue || !el.value) {
                        el.value = i18n[currentLanguage][catKey];
                    }
                }
            } else if (el.tagName === 'OPTION') {
                el.innerText = i18n[currentLanguage][key];
                const valKey = el.getAttribute('data-i18n-val');
                if (valKey && i18n[currentLanguage][valKey]) {
                    el.value = i18n[currentLanguage][valKey];
                }
            } else {
                el.innerText = i18n[currentLanguage][key];
            }
        }
    });
    updateProviderUI(); 
    updateCatBtns(); 
    renderPlayers(); 
    if(!timerRunning) document.getElementById('timerBtn').innerText = i18n[currentLanguage].timerStart;
    updateLogUI();
}

const PROVIDERS = {
    openrouter: { 
        url: "https://openrouter.ai/api/v1", 
        needsKey: true,
        defaultModels: ["google/gemini-3.5-flash"]
    },
    openai: { 
        url: "https://api.openai.com/v1", 
        needsKey: true,
        defaultModels: []
    },
    lmstudio: { 
        url: "http://localhost:1234/v1", 
        needsKey: false,
        defaultModels: []
    },
    ollama: { 
        url: "http://localhost:11434/v1", 
        needsKey: false,
        defaultModels: []
    },
    custom: { 
        url: "", 
        needsKey: false,
        defaultModels: []
    }
};

function updateProviderUI() {
    const provider = document.getElementById('providerSelect').value;
    const config = PROVIDERS[provider];
    const baseUrlContainer = document.getElementById('baseUrlContainer');
    const baseUrlInput = document.getElementById('baseUrlInput');
    const keyOptionalLabel = document.getElementById('keyOptionalLabel');

    if (provider === 'custom' || provider === 'lmstudio' || provider === 'ollama') {
        baseUrlContainer.style.display = 'block';
        if(config.url) baseUrlInput.value = config.url;
    } else baseUrlContainer.style.display = 'none';
    keyOptionalLabel.innerText = config.needsKey ? i18n[currentLanguage].keyRequired : i18n[currentLanguage].keyOptional;
}

function getApiConfig() {
    const provider = document.getElementById('providerSelect').value;
    let baseUrl = PROVIDERS[provider].url;
    if (provider === 'custom' || provider === 'lmstudio' || provider === 'ollama') baseUrl = document.getElementById('baseUrlInput').value.trim();
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    let key = document.getElementById('apiKeyInput').value.trim();
    if (!key && !PROVIDERS[provider].needsKey) key = "lm-studio"; 
    return { baseUrl, key };
}

window.addEventListener('DOMContentLoaded', () => {
    renderLanguageSelector();
    setLanguage('pl'); 
    initPlayers();
    updateTimerDisplay();
});

// --- ASYSTENT GRY (SIDEBAR) ---
let players = [];
let gameSettings = { mode: 'colors', targetScore: 10 };

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebarOverlay').classList.toggle('active');
}

function changeGameMode(newMode) {
    gameSettings.mode = newMode;
    const targetInput = document.getElementById('targetScoreInput');
    if (newMode === 'colors') targetInput.style.display = 'none';
    else {
        targetInput.style.display = 'block';
        if(newMode === 'countdown') targetInput.value = 10;
        if(newMode === 'points') targetInput.value = 50;
        gameSettings.targetScore = parseInt(targetInput.value);
    }
    players.forEach(p => { p.wedges = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }; p.score = (newMode === 'countdown') ? gameSettings.targetScore : 0; });
    renderPlayers();
}

function changeTargetScore(val) {
    gameSettings.targetScore = parseInt(val) || 0;
    if(gameSettings.mode === 'countdown') { players.forEach(p => p.score = gameSettings.targetScore); renderPlayers(); }
}

let timerInterval;
let timerTime = 30;
let timerRunning = false;

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateTimerDisplay() {
    document.getElementById('timerDisplay').innerText = formatTime(timerTime);
}

function adjTimer(secs) {
    if (!timerRunning) {
        timerTime = Math.max(5, timerTime + secs);
        updateTimerDisplay();
    }
}

function toggleTimer() {
    const btn = document.getElementById('timerBtn');
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        btn.innerText = i18n[currentLanguage].timerStart;
        btn.classList.replace('btn-secondary', 'btn-primary');
    } else {
        if (timerTime <= 0) timerTime = 30; // reset default if starting from 0
        timerRunning = true;
        btn.innerText = i18n[currentLanguage].timerPause;
        btn.classList.replace('btn-primary', 'btn-secondary');
        
        timerInterval = setInterval(() => {
            timerTime--;
            updateTimerDisplay();
            if (timerTime <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                btn.innerText = i18n[currentLanguage].timerStart;
                btn.classList.replace('btn-secondary', 'btn-primary');
                showModal(i18n[currentLanguage].timerTimeUp);
            }
        }, 1000);
    }
}

function rollDice() {
    const resultEl = document.getElementById('diceResult');
    const categories = [1, 2, 3, 4, 5, 6];
    let rolls = 0;
    resultEl.style.background = '#111827';
    
    const interval = setInterval(() => {
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        const catName = document.getElementById(`cat-in-${randomCat}`).value;
        resultEl.innerHTML = `<div class="dice-color-box w-cat${randomCat}"></div> <span>${catName}</span>`;
        rolls++;
        if(rolls > 15) {
            clearInterval(interval);
            const finalCat = categories[Math.floor(Math.random() * categories.length)];
            const finalName = document.getElementById(`cat-in-${finalCat}`).value;
            resultEl.innerHTML = `<div class="dice-color-box w-cat${finalCat}"></div> <span style="font-weight:900;">${finalName}</span>`;
            resultEl.style.background = '#374151'; 
            const btn = document.getElementById(`btn-cat${finalCat}`);
            btn.style.transform = 'scale(1.05)';
            setTimeout(() => btn.style.transform = 'none', 600);
        }
    }, 50);
}

function initPlayers() { if(players.length === 0) addPlayer(); }

function addPlayer() {
    const initialScore = (gameSettings.mode === 'countdown') ? gameSettings.targetScore : 0;
    const newPlayer = {
        id: Date.now(), name: `${i18n[currentLanguage].playerDefault} ${players.length + 1}`,
        score: initialScore, wedges: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }
    };
    players.push(newPlayer);
    renderPlayers();
}

function removePlayer(id) { players = players.filter(p => p.id !== id); renderPlayers(); }
function updatePlayerName(id, newName) { const player = players.find(p => p.id === id); if(player) player.name = newName; }

function toggleWedge(playerId, catId) {
    const player = players.find(p => p.id === playerId);
    if(player) {
        player.wedges[catId] = !player.wedges[catId];
        renderPlayers();
        checkWinCondition(player);
    }
}

function changeScore(playerId, delta) {
    const player = players.find(p => p.id === playerId);
    if(player) {
        player.score += delta;
        renderPlayers();
        checkWinCondition(player);
    }
}

function checkWinCondition(player) {
    let won = false;
    if (gameSettings.mode === 'colors') won = Object.values(player.wedges).every(v => v === true);
    else if (gameSettings.mode === 'countdown') won = player.score <= 0;
    else if (gameSettings.mode === 'points') won = player.score >= gameSettings.targetScore;

    if (won) setTimeout(() => { showModal(`🎉 ${player.name} ${i18n[currentLanguage].winMessage}`); }, 100);
}

function renderPlayers() {
    const list = document.getElementById('playersList');
    list.innerHTML = '';
    
    players.forEach(player => {
        const div = document.createElement('div');
        div.className = 'player-card';
        let controlsHTML = '';

        if (gameSettings.mode === 'colors') {
            let wedgesHTML = '';
            for(let i = 1; i <= 6; i++) {
                const isActive = player.wedges[i] ? 'active' : '';
                wedgesHTML += `<div class="wedge w-cat${i} ${isActive}" onclick="toggleWedge(${player.id}, ${i})" title="${document.getElementById(`cat-in-${i}`).value}"></div>`;
            }
            controlsHTML = `<div class="wedges-container">${wedgesHTML}</div>`;
        } else {
            controlsHTML = `
                <div class="counter-container">
                    <button class="btn-count" onclick="changeScore(${player.id}, -1)">−</button>
                    <span class="score-display">${player.score}</span>
                    <button class="btn-count" onclick="changeScore(${player.id}, 1)">+</button>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="player-header">
                <input type="text" class="player-name" value="${player.name}" onchange="updatePlayerName(${player.id}, this.value)">
                <button class="player-delete" onclick="removePlayer(${player.id})" title="Usuń">✖</button>
            </div>
            ${controlsHTML}
        `;
        list.appendChild(div);
    });
}

window.debugData = { blueprint: {}, question: {} };
let memoryApiKey = "";
const MEMORY_KEY = 'trivial_llm_history';
const BLUEPRINT_CACHE_KEY = 'trivial_llm_blueprints';
let historyMemory = {}; let blueprintCache = {};
let gameLog = [];
let currentQuestionLogId = null;

try {
    const storedHistory = localStorage.getItem(MEMORY_KEY); if (storedHistory) historyMemory = JSON.parse(storedHistory);
    const storedCache = localStorage.getItem(BLUEPRINT_CACHE_KEY); if (storedCache) blueprintCache = JSON.parse(storedCache);
    const storedLog = localStorage.getItem('trivia_game_log'); if (storedLog) gameLog = JSON.parse(storedLog);
    currentQuestionLogId = localStorage.getItem('trivia_current_question_id') || null;
} catch (e) { 
    historyMemory = {}; 
    blueprintCache = {}; 
    gameLog = [];
    currentQuestionLogId = null;
}

function saveGameLog() {
    try {
        localStorage.setItem('trivia_game_log', JSON.stringify(gameLog));
        if (currentQuestionLogId) {
            localStorage.setItem('trivia_current_question_id', currentQuestionLogId);
        } else {
            localStorage.removeItem('trivia_current_question_id');
        }
    } catch (e) {
        console.error("Failed to save game log:", e);
    }
}

function saveBlueprintCache() { localStorage.setItem(BLUEPRINT_CACHE_KEY, JSON.stringify(blueprintCache)); }

function updateMemoryStats() {
    const totalUsed = Object.values(historyMemory).reduce((sum, arr) => sum + arr.length, 0);
    document.getElementById('memoryStats').innerText = totalUsed;
    let totalCached = 0;
    for (const cat in blueprintCache) totalCached += blueprintCache[cat].filter(t => !historyMemory[cat]?.includes(t.target_answer)).length;
    const cacheEl = document.getElementById('cacheStats');
    if(cacheEl) cacheEl.innerText = totalCached;
}

function saveToMemory(category, targetAnswer) {
    if (!historyMemory[category]) historyMemory[category] = [];
    if (!historyMemory[category].includes(targetAnswer)) historyMemory[category].push(targetAnswer);
    if (historyMemory[category].length > 500) historyMemory[category] = historyMemory[category].slice(-500);
    localStorage.setItem(MEMORY_KEY, JSON.stringify(historyMemory));
    updateMemoryStats();
}

function clearMemory(e) {
    e.preventDefault();
    showModal(i18n[currentLanguage].alertClearMemory, true, () => {
        historyMemory = {}; blueprintCache = {};
        localStorage.removeItem(MEMORY_KEY); localStorage.removeItem(BLUEPRINT_CACHE_KEY);
        updateMemoryStats();
        showModal(i18n[currentLanguage].memoryCleared);
    });
}
updateMemoryStats();

const BLUEPRINT_SCHEMA = { name: "blueprint", strict: true, schema: { type: "object", properties: { topics: { type: "array", items: { type: "object", properties: { subcategory: { type: "string" }, modifier: { type: "string" }, target_answer: { type: "string" } }, required: ["subcategory", "modifier", "target_answer"], additionalProperties: false } } }, required: ["topics"], additionalProperties: false } };
const QUESTION_SCHEMA = { name: "trivia_question", strict: true, schema: { type: "object", properties: { question: { type: "string" }, options: { type: "array", items: { type: "string" }, description: "Exactly 4 options" }, answer: { type: "string" }, explanation_correct: { type: "string" }, explanation_incorrect: { type: "string" } }, required: ["question", "options", "answer", "explanation_correct", "explanation_incorrect"], additionalProperties: false } };

function updateCatBtns() { for(let i=1; i<=6; i++) { document.getElementById(`btn-cat${i}`).innerText = document.getElementById(`cat-in-${i}`).value || i18n[currentLanguage].categoryPlaceholder; } }
updateCatBtns();

function updateDebugUI() {
    document.getElementById('debug-bp-payload').textContent = JSON.stringify(window.debugData.blueprint.payload || {}, null, 2);
    document.getElementById('debug-bp-response').textContent = window.debugData.blueprint.response || '';
    document.getElementById('debug-q-payload').textContent = JSON.stringify(window.debugData.question.payload || {}, null, 2);
    document.getElementById('debug-q-response').textContent = window.debugData.question.response || '';
}

function toggleDebug() { const panel = document.getElementById('debug-panel'); panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none'; }
function clearDebug() { window.debugData = { blueprint: {}, question: {} }; updateDebugUI(); }

function parseLLMResponse(text) {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try { return JSON.parse(cleanText); } catch (e) {
        try {
            const match = cleanText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (!match) throw new Error(i18n[currentLanguage].errorNoJsonStructure);
            return JSON.parse(match[0]);
        } catch (e2) { throw new Error(i18n[currentLanguage].errorInvalidJson); }
    }
}

async function fetchModels() {
    const { baseUrl, key } = getApiConfig();
    const provider = document.getElementById('providerSelect').value;
    
    if (!baseUrl) return showModal(i18n[currentLanguage].alertNoUrl);
    if (PROVIDERS[provider].needsKey && !key) return showModal(i18n[currentLanguage].alertNoKey);
    
    const btn = document.getElementById('fetchModelsBtn');
    const select = document.getElementById('modelSelect');
    const status = document.getElementById('status');
    
    btn.disabled = true; btn.innerText = i18n[currentLanguage].fetchingModels; status.innerText = i18n[currentLanguage].statusConnecting;

    try {
        const res = await fetch(`${baseUrl}/models`, { method: 'GET', headers: { "Authorization": `Bearer ${key}` } });
        if (!res.ok) throw new Error(i18n[currentLanguage].errorApi.replace('{status}', res.status));
        const data = await res.json();
        select.innerHTML = "";
        const models = data.data || data; 
        if (!Array.isArray(models)) throw new Error(i18n[currentLanguage].errorUnknownModelsFormat);

        const defaults = PROVIDERS[provider].defaultModels || [];
        let selectedAny = false;

        models.sort((a,b) => (a.name || a.id).localeCompare(b.name || b.id)).forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id; opt.innerText = (m.name || m.id) + (m.name ? ` (${m.id})` : "");
            if (defaults.includes(m.id)) {
                opt.selected = true;
                selectedAny = true;
            }
            select.appendChild(opt);
        });

        if (!selectedAny && select.options.length > 0) {
            select.selectedIndex = 0;
        }
        status.innerText = i18n[currentLanguage].statusModelsFetched; status.style.color = "#4ade80";
    } catch (err) {
        showModal(err.message); status.innerText = i18n[currentLanguage].statusFetchError; status.style.color = "#f87171";
    } finally { btn.disabled = false; btn.innerText = i18n[currentLanguage].fetchModels; }
}

async function callLLM(system, prompt, schemaObj, debugPhaseStr) {
    const model = document.getElementById('modelSelect').value;
    const { baseUrl, key } = getApiConfig();
    const langInstruction = i18n[currentLanguage].langInstruction || "";
    
    const payload = { model: model, messages: [ { role: 'system', content: system + langInstruction }, { role: 'user', content: prompt } ] };
    if (schemaObj) payload.response_format = { type: "json_schema", json_schema: schemaObj };

    window.debugData[debugPhaseStr].payload = payload; window.debugData[debugPhaseStr].response = i18n[currentLanguage].debugSending; updateDebugUI();

    const url = `${baseUrl}/chat/completions`;
    const headers = { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" };
    if (baseUrl.includes("openrouter")) { headers["HTTP-Referer"] = window.location.href; headers["X-Title"] = "Trivial LLM"; }

    let res = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) });

    if (res.status === 400 && schemaObj) {
        payload.response_format = { type: "json_object" };
        res = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) });
        if (res.status === 400) {
            delete payload.response_format;
            res = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) });
        }
    }

    if (!res.ok) throw new Error(i18n[currentLanguage].errorApi.replace('{status}', res.status));
    const data = await res.json();
    const rawText = data.choices[0].message.content || "";
    window.debugData[debugPhaseStr].response = rawText; updateDebugUI();
    return parseLLMResponse(rawText);
}

async function generate(category, colorHex) {
    const model = document.getElementById('modelSelect').value;
    const { baseUrl, key } = getApiConfig();
    if (!model) return showModal(i18n[currentLanguage].alertNoModel);
    if (PROVIDERS[document.getElementById('providerSelect').value].needsKey && !key) return showModal(i18n[currentLanguage].alertNoKey);

    const manualAvoidText = document.getElementById('avoid').value.trim();
    const difficultySelect = document.getElementById('difficultySelect');
    const difficulty = difficultySelect.options[difficultySelect.selectedIndex].value; 

    const status = document.getElementById('status');
    const card = document.getElementById('active-question');

    document.querySelectorAll('.cat-btn').forEach(b => b.disabled = true);
    if (card.style.display === 'block') card.classList.add('loading-state');
    status.style.color = "#fbbf24"; 
    clearDebug();
    
    try {
        if (!blueprintCache[category]) blueprintCache[category] = [];
        let safeTopics = blueprintCache[category].filter(t => !historyMemory[category]?.includes(t.target_answer));
        let randomTopic = null;

        if (safeTopics.length === 0) {
            status.innerText = `${i18n[currentLanguage].generatingPool}${category}...`;
            const autoAvoidText = historyMemory[category] ? historyMemory[category].join(", ") : "";
            const combinedAvoid = [manualAvoidText, autoAvoidText].filter(Boolean).join("\n- ");
            const avoidPrompt = combinedAvoid ? `${PROMPTS[currentLanguage].userBlueprintAvoid}${combinedAvoid}` : "";
            const blueprintPrompt = PROMPTS[currentLanguage].userBlueprintTheme.replace('{cat}', category) + avoidPrompt;
            
            const bpData = await callLLM(PROMPTS[currentLanguage].sysBlueprint, blueprintPrompt, BLUEPRINT_SCHEMA, 'blueprint');
            const topicsList = bpData.topics || [];
            if (!topicsList.length) throw new Error(i18n[currentLanguage].errorNoTopics);

            blueprintCache[category] = topicsList; saveBlueprintCache(); updateMemoryStats(); 
            safeTopics = blueprintCache[category].filter(t => !historyMemory[category]?.includes(t.target_answer));
            randomTopic = safeTopics.length > 0 ? safeTopics[Math.floor(Math.random() * safeTopics.length)] : topicsList[Math.floor(Math.random() * topicsList.length)];
        } else {
            status.innerText = `${i18n[currentLanguage].usingPool}${safeTopics.length}${i18n[currentLanguage].usingPool2}${category})...`;
            randomTopic = safeTopics[Math.floor(Math.random() * safeTopics.length)];
            window.debugData['blueprint'].payload = { info: "Cache hit." };
            window.debugData['blueprint'].response = JSON.stringify(randomTopic, null, 2); updateDebugUI();
            await new Promise(r => setTimeout(r, 600)); 
        }

        status.innerText = `${i18n[currentLanguage].formulatingQ}(${randomTopic.subcategory} / ${randomTopic.modifier})...`;
        
        const qPrompt = PROMPTS[currentLanguage].userQuestion
            .replace('{cat}', category)
            .replace('{subcat}', randomTopic.subcategory)
            .replace('{mod}', randomTopic.modifier)
            .replace('{ans}', randomTopic.target_answer)
            .replace('{diff}', difficulty); 

        const qData = await callLLM(PROMPTS[currentLanguage].sysQuestion, qPrompt, QUESTION_SCHEMA, 'question');

        if(!qData.question || !qData.options || !Array.isArray(qData.options)) throw new Error(i18n[currentLanguage].errorInvalidQuestionStructure);

        const newEntry = {
            id: Date.now().toString(),
            category: category,
            subcategory: randomTopic.subcategory,
            difficulty: difficulty,
            question: qData.question,
            options: qData.options.slice(0, 4),
            correctAnswer: qData.answer,
            explanationCorrect: qData.explanation_correct,
            explanationIncorrect: qData.explanation_incorrect,
            selectedAnswer: null,
            isCorrect: null,
            timestamp: new Date().toISOString()
        };
        gameLog.push(newEntry);
        currentQuestionLogId = newEntry.id;
        saveGameLog();
        updateLogUI();

        document.getElementById('q-color-bar').style.backgroundColor = colorHex;
        document.getElementById('q-color-bar').style.color = (colorHex === 'var(--cat-5)' || colorHex === 'var(--cat-6)') ? '#000' : '#fff';
        document.getElementById('q-color-bar').innerText = `${category} • ${randomTopic.subcategory}`;
        document.getElementById('q-text').innerText = qData.question;
        
        const optsContainer = document.getElementById('q-options');
        const explContainer = document.getElementById('q-explanation');
        optsContainer.className = 'q-options'; optsContainer.innerHTML = ''; explContainer.style.display = 'none';
        
        const letters = ['A', 'B', 'C', 'D'];
        const correctAnswerClean = String(qData.answer).trim().toLowerCase();

        qData.options.slice(0, 4).forEach((optText, index) => {
            const div = document.createElement('div');
            const isCorrect = String(optText).trim().toLowerCase() === correctAnswerClean;
            div.className = 'q-option'; div.dataset.correct = isCorrect; 
            div.innerHTML = `<strong>${letters[index] || '-'}</strong> <span>${optText}</span>`;
            
            div.onclick = function() {
                optsContainer.classList.add('answered');
                document.querySelectorAll('.q-option').forEach(opt => {
                    if (opt.dataset.correct === 'true') opt.classList.add('revealed-correct');
                });
                if (this.dataset.correct !== 'true') this.classList.add('revealed-wrong');
                explContainer.style.display = 'block';

                const entry = gameLog.find(e => e.id === currentQuestionLogId);
                if (entry) {
                    entry.selectedAnswer = optText;
                    entry.isCorrect = isCorrect;
                    saveGameLog();
                    updateLogUI();
                }
            };
            optsContainer.appendChild(div);
        });

        explContainer.innerHTML = `<p>✅ <strong>${i18n[currentLanguage].fact}:</strong> ${qData.explanation_correct || ''}</p><p>❌ <strong>${i18n[currentLanguage].tricks}:</strong> ${qData.explanation_incorrect || ''}</p>`;

        card.style.display = 'block'; card.style.borderColor = colorHex;
        status.innerText = i18n[currentLanguage].ready; status.style.color = "#4ade80"; 
        saveToMemory(category, randomTopic.target_answer);

        // Automatycznie zwiń konfigurację, żeby odsłonić pytanie na małych ekranach (jeśli nie jest już zwinięta)
        const configContent = document.getElementById('configContent');
        if(!configContent.classList.contains('collapsed') && window.innerWidth < 900) {
            toggleConfig();
        }

    } catch (e) {
        console.error(e); status.innerText = `⚠️ ${e.message}`; status.style.color = "#f87171";
    } finally {
        card.classList.remove('loading-state');
        document.querySelectorAll('.cat-btn').forEach(b => b.disabled = false);
    }
}

function updateLogUI() {
    const logStatusText = document.getElementById('logStatusText');
    if (!logStatusText) return;
    
    if (gameLog.length === 0) {
        logStatusText.innerText = i18n[currentLanguage].logPlaceholder;
    } else {
        const count = gameLog.length;
        logStatusText.innerText = i18n[currentLanguage].logSavedCount.replace('{count}', count);
    }
}

function generateMarkdownLog(log) {
    const trans = i18n[currentLanguage];
    
    // Calculate statistics
    const total = log.length;
    const answeredCount = log.filter(e => e.selectedAnswer !== null).length;
    const correctCount = log.filter(e => e.isCorrect === true).length;
    const skippedCount = total - answeredCount;
    
    let md = `# ${trans.mdTitle}\n\n`;
    md += `* **${trans.mdDateLabel}:** ${new Date().toLocaleString()}\n`;
    md += `* **${trans.mdTotalQ}:** ${total} (${trans.mdAnswered}: ${answeredCount}, ${trans.mdSkipped}: ${skippedCount})\n`;
    md += `* **${trans.mdCorrectAnswers}:** ${correctCount} / ${answeredCount} (${answeredCount > 0 ? Math.round(correctCount / answeredCount * 100) : 0}%)\n\n`;
    
    md += `## 📊 ${trans.mdPlayerStats}\n\n`;
    if (players.length > 0) {
        players.forEach(p => {
            md += `* **${p.name}**:\n`;
            if (gameSettings.mode === 'colors') {
                const acquiredColors = [];
                for(let i=1; i<=6; i++) {
                    if (p.wedges[i]) {
                        const catName = document.getElementById(`cat-in-${i}`).value;
                        acquiredColors.push(catName);
                    }
                }
                md += `  * ${trans.mdCollectedCategories}: ${acquiredColors.length > 0 ? acquiredColors.join(', ') : trans.mdNone} / 6\n`;
            } else {
                md += `  * ${trans.mdScore}: ${p.score}\n`;
            }
        });
    } else {
        md += `* ${trans.mdNoPlayers}\n`;
    }
    md += `\n---\n\n`;
    
    md += `## 📝 ${trans.mdDetailedLog}\n\n`;
    
    log.forEach((e, idx) => {
        md += `### ${idx + 1}. ${e.question}\n\n`;
        md += `* **${trans.mdCategory}:** ${e.category} • ${e.subcategory}\n`;
        md += `* **${trans.mdDifficulty}:** ${e.difficulty}\n`;
        
        md += `\n**${trans.mdOptions}:**\n`;
        e.options.forEach(opt => {
            const isCorrectOpt = String(opt).trim().toLowerCase() === String(e.correctAnswer).trim().toLowerCase();
            const isSelectedOpt = e.selectedAnswer && String(opt).trim().toLowerCase() === String(e.selectedAnswer).trim().toLowerCase();
            
            let prefix = "[ ]";
            let suffix = "";
            
            if (isCorrectOpt && isSelectedOpt) {
                prefix = "[x]";
                suffix = ` 🟢 *(${trans.mdCorrectAndSelected})*`;
            } else if (isCorrectOpt) {
                prefix = "[ ]";
                suffix = ` 🟢 *(${trans.mdCorrect})*`;
            } else if (isSelectedOpt) {
                prefix = "[x]";
                suffix = ` 🔴 *(${trans.mdSelectedWrong})*`;
            }
            
            md += `* ${prefix} ${opt}${suffix}\n`;
        });
        
        md += `\n`;
        
        if (e.selectedAnswer === null) {
            md += `* **${trans.mdStatus}:** ⚠️ *${trans.mdSkippedNoAnswer}*\n`;
        } else {
            const resultEmoji = e.isCorrect ? "🟢" : "🔴";
            const resultText = e.isCorrect ? trans.mdCorrectUpper : trans.mdWrongUpper;
            md += `* **${trans.mdPlayerAnswer}:** ${resultEmoji} **${e.selectedAnswer}** (${resultText})\n`;
        }
        
        if (e.explanationCorrect) {
            md += `* **${trans.mdExplanationFact}:** ${e.explanationCorrect}\n`;
        }
        if (e.explanationIncorrect) {
            md += `* **${trans.mdExplanationTricks}:** ${e.explanationIncorrect}\n`;
        }
        
        md += `\n---\n\n`;
    });
    
    return md;
}

function exportLog() {
    if (gameLog.length === 0) {
        showModal(i18n[currentLanguage].logPlaceholder);
        return;
    }
    const md = generateMarkdownLog(gameLog);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `trivia-game-log-${new Date().toISOString().slice(0,10)}.md`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showModal(i18n[currentLanguage].logSaved);
}

function copyLogToClipboard() {
    if (gameLog.length === 0) {
        showModal(i18n[currentLanguage].logPlaceholder);
        return;
    }
    const md = generateMarkdownLog(gameLog);
    navigator.clipboard.writeText(md).then(() => {
        showModal(i18n[currentLanguage].exportCopied);
    }).catch(err => {
        showModal(i18n[currentLanguage].errorCopy.replace('{error}', err));
    });
}

function clearLog() {
    if (gameLog.length === 0) return;
    showModal(i18n[currentLanguage].alertClearLog, true, () => {
        gameLog = [];
        currentQuestionLogId = null;
        localStorage.removeItem('trivia_game_log');
        localStorage.removeItem('trivia_current_question_id');
        updateLogUI();
        showModal(i18n[currentLanguage].logCleared);
    });
}
