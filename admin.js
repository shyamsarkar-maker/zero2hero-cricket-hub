const ADMIN_PASSWORD = "Naval@123";

// Helpers
function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "{}");
}
function saveUsers(u) {
    localStorage.setItem("users", JSON.stringify(u));
}
function getMatches() {
    return JSON.parse(localStorage.getItem("matches") || "[]");
}
function saveMatches(m) {
    localStorage.setItem("matches", JSON.stringify(m));
}

// Elements
const loginBox = document.getElementById("admin-login-box");
const panelBox = document.getElementById("admin-panel");
const adminPassInput = document.getElementById("admin-password");
const btnAdminLogin = document.getElementById("btn-admin-login");

const adminMobileInput = document.getElementById("admin-mobile");
const adminCoinsInput = document.getElementById("admin-coins");
const btnAddCoins = document.getElementById("btn-add-coins");
const adminMsg = document.getElementById("admin-msg");

const liveUrlInput = document.getElementById("live-url");
const btnSaveLive = document.getElementById("btn-save-live");

const matchIdInput = document.getElementById("match-id");
const matchTitleInput = document.getElementById("match-title");
const matchTimeInput = document.getElementById("match-time");
const matchTeam1Input = document.getElementById("match-team1");
const matchTeam2Input = document.getElementById("match-team2");
const btnSaveMatch = document.getElementById("btn-save-match");
const matchesListAdmin = document.getElementById("matches-list-admin");

const usersList = document.getElementById("users-list");

// Admin login
btnAdminLogin.onclick = () => {
    if (adminPassInput.value === ADMIN_PASSWORD) {
        loginBox.classList.add("hidden");
        panelBox.classList.remove("hidden");
        loadLive();
        loadMatchesAdmin();
        loadUsersList();
    } else {
        alert("Galat admin password");
    }
};

// Add coins
btnAddCoins.onclick = () => {
    const mobile = adminMobileInput.value.trim();
    const coinsToAdd = parseInt(adminCoinsInput.value, 10);

    if (mobile.length !== 10) {
        adminMsg.textContent = "Sahi 10 digit mobile dalo.";
        return;
    }
    if (isNaN(coinsToAdd) || coinsToAdd <= 0) {
        adminMsg.textContent = "Coins positive number hona chahiye.";
        return;
    }

    const users = getUsers();
    if (!users[mobile]) {
        // naya user create kar do (password user login ke time set karega)
        users[mobile] = {
            password: "",
            coins: 0,
            guesses: []
        };
    }

    users[mobile].coins += coinsToAdd;
    saveUsers(users);

    adminMsg.textContent = `Coins added. New balance: ${users[mobile].coins}`;
    adminCoinsInput.value = "";

    loadUsersList();
};

// Save live TV
btnSaveLive.onclick = () => {
    const url = liveUrlInput.value.trim();
    if (!url) {
        alert("URL khali nahi ho sakta");
        return;
    }
    localStorage.setItem("liveTV", url);
    alert("Live TV URL save ho gaya.");
};

// Load live url on admin
function loadLive() {
    const url = localStorage.getItem("liveTV") || "";
    liveUrlInput.value = url;
}

// Save match (add / update)
btnSaveMatch.onclick = () => {
    let matches = getMatches();

    const id = matchIdInput.value.trim();
    const title = matchTitleInput.value.trim();
    const time = matchTimeInput.value.trim();
    const team1 = matchTeam1Input.value.trim();
    const team2 = matchTeam2Input.value.trim();

    if (!title || !team1 || !team2) {
        alert("Title, Team1, Team2 required hai.");
        return;
    }

    if (id) {
        // update
        matches = matches.map(m =>
            m.id === id ? { id, title, time, team1, team2 } : m
        );
    } else {
        // add
        const newId = "m_" + Date.now();
        matches.push({ id: newId, title, time, team1, team2 });
    }

    saveMatches(matches);
    clearMatchForm();
    loadMatchesAdmin();
};

function clearMatchForm() {
    matchIdInput.value = "";
    matchTitleInput.value = "";
    matchTimeInput.value = "";
    matchTeam1Input.value = "";
    matchTeam2Input.value = "";
}

// Load matches list for admin
function loadMatchesAdmin() {
    const matches = getMatches();
    matchesListAdmin.innerHTML = "";

    if (matches.length === 0) {
        matchesListAdmin.innerHTML = "<li>Koi match nahi hai.</li>";
        return;
    }

    matches.forEach(m => {
        const li = document.createElement("li");
        li.textContent = `${m.title} | ${m.time} | ${m.team1} vs ${m.team2}`;

        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Edit";
        btnEdit.className = "inline-btn edit";
        btnEdit.onclick = () => {
            matchIdInput.value = m.id;
            matchTitleInput.value = m.title;
            matchTimeInput.value = m.time;
            matchTeam1Input.value = m.team1;
            matchTeam2Input.value = m.team2;
        };

        const btnDel = document.createElement("button");
        btnDel.textContent = "Delete";
        btnDel.className = "inline-btn delete";
        btnDel.onclick = () => {
            if (!confirm("Match delete kare?")) return;
            const rest = getMatches().filter(x => x.id !== m.id);
            saveMatches(rest);
            loadMatchesAdmin();
        };

        li.appendChild(btnEdit);
        li.appendChild(btnDel);
        matchesListAdmin.appendChild(li);
    });
}

// Load users list
function loadUsersList() {
    const users = getUsers();
    usersList.innerHTML = "";
    const mobiles = Object.keys(users);

    if (mobiles.length === 0) {
        usersList.innerHTML = "<li>Abhi koi user nahi hai.</li>";
        return;
    }

    mobiles.forEach(mobile => {
        const u = users[mobile];
        const li = document.createElement("li");
        li.textContent = `Mobile: ${mobile} → Coins: ${u.coins}`;
        usersList.appendChild(li);
    });
}