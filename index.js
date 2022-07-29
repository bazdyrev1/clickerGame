const formRegistration = document.querySelector("#createForm");
const btnPlay = document.querySelector('#play');
const pictureProlog = document.querySelector('#prolog');
const modalWindowForm = document.querySelector(".modalWindowForm");
const gameZone = document.querySelector('.gameZone');
const preGamePages = document.querySelector('.preGamePages');
const gameLevels = document.querySelector('.gameLevels');
const orcPosition = document.querySelector('.orcPosition');
const levelsWrapper = document.querySelector('.levelsWrapper');
const btnResults = document.querySelector('#results');
const modalWindowMenu = document.querySelector('.modalWindowMenu');
const modalWindowResults = document.querySelector('.modalWindowResults');
const blockBtnResult = document.querySelector('.blockBtnResult');
const infoBattle = document.querySelector('.infoBattle');
const btnBackToMenu = document.querySelector('.btnBackToMenu');
const usersResultList = document.querySelector('.usersResultList');

const orcs = [
    {
        lvl: 1,
        hp: 5,
        time: 0,
        img: 'src="./image/orcLvl1.png"'
    },
    {
        lvl: 2,
        hp: 6,
        time: 0,
        img: 'src=./image/orcLvl2.png'
    },
    {
        lvl: 3,
        hp: 7,
        time: 0,
        img: 'src=./image/orcLvl3.png'
    },
    {
        lvl: 4,
        hp: 8,
        time: 0,
        img: 'src="./image/orcLvl4.png"'
    },
    {
        lvl: 5,
        hp: 10,
        time: 0,
        img: 'src=./image/orcLvl5.png'
    },
];

const users = [];
if (localStorage.getItem('usersGame')) {
    const data = localStorage.getItem('usersGame');
    JSON.parse(data).forEach((data) => {
        users.push(data);
    });
}

let timer = 0;
let timerInterval;
let timeGame = 0;
let startOrcLvl = 0;

const stopTimer = () => {
    clearInterval(timerInterval);
}
const startTimer = () => {
    stopTimer();
    timerInterval = setInterval(function () {
        timer += 1 / 60;
        msVal = Math.floor((timer - Math.floor(timer)) * 100);
        secondVal = Math.floor(timer) - Math.floor(timer / 60) * 60;
        minuteVal = Math.floor(timer / 60);
        timeGame = `${minuteVal} min ${secondVal}sec`
    }, 1000 / 60);
};

const renderPage = (activeWindow,disacrtiveWindow) => {
    disacrtiveWindow.classList.add("disable");
    activeWindow.classList.remove("disable");
}

btnPlay.addEventListener("click", function () {
    const modalWindowMenu = document.querySelector('.modalWindowMenu');
    renderPage(modalWindowForm,modalWindowMenu);
})

const closeModalWindowProlog = () => {
    renderPage(gameZone,preGamePages);
    const text = document.querySelector('#prolog');
    text.innerHTML = `<div class="prologText">
        <span>My lord, our kingdom was attacked by vile orcs! We were able to drive them out of the palace,
         but we need to drive them out for good help us! 
        </span>
        </div>`;
}
const openProlog = () => {
    pictureProlog.classList.remove("disable");
}

const getInformationAboutUser = (event) => {
    event.preventDefault();
    const { userNickName, userName, userEmail } = formRegistration;
    const user = {
        nick: userNickName.value,
        name: userName.value,
        email: userEmail.value,
        coins: 0,
        time: 0,
    }
    users.push(user);
    userNickName.value = "";
    userName.value = "";
    userEmail.value = "";
    closeModalWindowProlog();
    openProlog();
}

formRegistration.addEventListener("submit", getInformationAboutUser);

const getInfoBattle = () => {
    infoBattle.innerHTML = `
    <p class="nickNamePlayer"> ${users[users.length - 1].nick} </p>
    <p class="coinsPlayer"> You coins: ${users[users.length - 1].coins}</p>
    <p class="lvlOrc">Level: ${orcs[startOrcLvl]?.lvl}</p>
    <p class="orcHp"> HP: ${orcs[startOrcLvl]?.hp} </p>
    `;
}

const showOrc = () => {
    let lvl = startOrcLvl;
    if (orcs[lvl].hp > 0) {
        orcs[lvl].hp -= 1;
        users[users.length - 1].coins += 1;
    }
    if (orcs[lvl].hp === 0) {
        ++lvl;
        if (lvl < 5) {
            orcPosition.innerHTML = `<img ${orcs[lvl].img} >`;
        }
        else {
            stopTimer();
            users[users.length - 1].time = timeGame;
            timeGame = 0;
            levelsWrapper.removeChild(orcPosition);
            gameLevels.innerHTML = `
                <div class="salute">
                <img src="./image/salute.gif">
                </div>
                <div class="resultMessage">
                    <span> You Win!</span><br>
                    <span> Your score: ${users[users.length - 1].coins}  </span>
                    <span> Your time: ${users[users.length - 1].time}
                </div>`}
        localStorage.setItem("usersGame", JSON.stringify(users));
    }
    startOrcLvl = lvl;
    getInfoBattle();
}

pictureProlog.addEventListener("click", function () {
    renderPage(gameLevels,pictureProlog);
    getInfoBattle();
    orcPosition.innerHTML = `<img ${orcs[startOrcLvl].img} >`
    startTimer();
})

orcPosition.addEventListener("click", function () {
    showOrc();
    document.querySelector('audio').play();
})

const createResultItem = () => {
    const itemsResult = document.createElement('div');
    itemsResult.classList.toggle('usersResultList');
    users.forEach((item) => {
        const getResult = getResultItem(item);
        const boxItem = document.createElement('div');
        boxItem.classList.toggle('userItem');
        boxItem.innerHTML = getResult;
        itemsResult.appendChild(boxItem);
    });
    return itemsResult;
}

function getResultItem(item) {
    return `
        <p >Nick: ${item.nick} </p>   
        <p>Time: ${item.time} </p>
        <p>Coins: ${item.coins} </p>
      `;
}

const renderListResult = () => {
    modalWindowResults.removeChild(modalWindowResults.firstChild);
    modalWindowResults.insertBefore(createResultItem(), blockBtnResult);
}

btnBackToMenu.addEventListener('click', function () {
    renderPage(modalWindowMenu,modalWindowResults);
})

btnResults.addEventListener('click', function () {
    renderPage(modalWindowResults,modalWindowMenu);
    renderListResult();
})