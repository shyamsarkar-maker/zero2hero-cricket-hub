// =========================
// Local Storage Database
// =========================

// All users data
let users = JSON.parse(localStorage.getItem("users") || "{}");

// All matches added by admin
let matches = JSON.parse(localStorage.getItem("matches") || "[]");

// Live TV link
let liveTV = localStorage.getItem("liveTV") || "";

// Active logged in user
let activeUser = localStorage.getItem("activeUser") || "";


// =========================
// PAGE ELEMENTS
// =========================

const authBox = document.getElementById("auth-container");
const gameBox = document.getElementById("game-container");

const userMobileDisplay = document.getElementById("user-mobile");
const userCoinsDisplay = document.getElementById("user-coins");

const matchListBox = document.getElementById("matches-list");
const myGuessList = document.getElementById("my-guesses-list");

const liveTVFrame = document.getElementById("live-tv-frame");
const liveTVEmpty = document.getElementById("live-tv-empty");


// =========================
// REGISTER / LOGIN
// =========================

document.getElementById("btn-register").onclick = () => {

    let mobile = document.getElementById("mobile").value.trim();
    let otp = document.getElementById("otp").value.trim();
    let pass = document.getElementById("password").value.trim();

    if (mobile.length !== 10) {
        alert("Enter valid 10 digit mobile number");
        return;
    }

    if (otp !== "1234") {
        alert("OTP wrong (Demo OTP is 1234)");
        return;
    }

    if (pass.length < 3) {
        alert("Password must be 3+ characters");
        return;
    }

    // If new user, create user entry
    if (!users[mobile]) {
        users[mobile] = {
            password: pass,
            coins: 0,
            guesses: []
        };
    }

    // Save password every login
    users[mobile].password = pass;

    activeUser = mobile;

    // Save database
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("activeUser", activeUser);

    loadGame();
};


// =========================
// LOGOUT
// =========================

document.getElementById("btn-logout").onclick = () => {
    localStorage.removeItem("activeUser");
    location.reload();
};


// =========================
// LOAD GAME PAGE
// =========================

function loadGame() {

    authBox.classList.add("hidden");
    gameBox.classList.remove("hidden");

    userMobileDisplay.textContent = "Mobile: " + activeUser;
    userCoinsDisplay.textContent = "Coins: " + users[activeUser].coins;

    loadLiveTV();
    loadMatches();
    loadGuesses();
}

// If user already logged in earlier
if (activeUser) loadGame();


// =========================
// LIVE TV LOAD
// =========================

function loadLiveTV() {

    if (!liveTV || liveTV === "") {
        liveTVEmpty.style.display = "block";
        liveTVFrame.style.display = "none";
        return;
    }

    liveTVEmpty.style.display = "none";
    liveTVFrame.style.display = "block";
    liveTVFrame.src = liveTV;
}


// =========================
// MATCHES LOAD
// =========================

function loadMatches() {
    matchListBox.innerHTML = "";

    matches.forEach((m, index) => {
        let div = document.createElement("div");
        div.className = "match-card";

        div.innerHTML = `
            <h3>${m.title}</h3>
            <p>Time: ${m.time}</p>

            <label>Select Team to Guess:</label>
            <select id="guess-${index}">
                <option value="${m.team1}">${m.team1}</option>
                <option value="${m.team2}">${m.team2}</option>
            </select>

            <button onclick="saveGuess(${index})" class="btn-save-guess">
                Save Guess (1 Coin)
            </button>
        `;

        matchListBox.appendChild(div);
    });
}


// =========================
// SAVE GUESS
// =========================

function saveGuess(i) {

    if (users[activeUser].coins <= 0) {
        alert("Not enough coins!");
        return;
    }

    let guessTeam = document.getElementById("guess-" + i).value;

    // Deduct 1 coin
    users[activeUser].coins -= 1;

    // Store guess
    users[activeUser].guesses.push({
        match: matches[i].title,
        team: guessTeam,
        time: new Date().toLocaleString()
    });

    // Save all data
    localStorage.setItem("users", JSON.stringify(users));

    // Refresh display
    userCoinsDisplay.textContent = "Coins: " + users[activeUser].coins;

    loadGuesses();

    alert("Guess Saved!");
}


// =========================
// LOAD USER GUESSES
// =========================

function loadGuesses() {

    myGuessList.innerHTML = "";

    users[activeUser].guesses.forEach(g => {
        let li = document.createElement("li");
        li.textContent = `${g.match} → ${g.team} (${g.time})`;
        myGuessList.appendChild(li);
    });
}