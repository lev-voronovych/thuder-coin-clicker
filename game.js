let coins = 0;
let clickPower = 1;
let upgradeCost = 100;
let currentCharacter = 0;
let ownedCharacters = [0];  // Початковий персонаж є купленим за замовчуванням

const characters = [
    { name: "Character 1", img: "./photo/a8bbf7fc-3591-4cbe-960f-efd348858748.png", cost: 0, power: 1 },
    { name: "Character 2", img: "./photo/OIG1.png", cost: 200, power: 5 },
    { name: "Character 3", img: "./photo/OI1.png.jpg", cost: 500, power: 10 },
    { name: "Character 4", img: "./photo/1223.png", cost: 1000, power: 20 },
    { name: "Character 5", img: "./photo/11111.png", cost: 2000, power: 50 },
    { name: "Character 6", img: "./photo/12321`2.png", cost: 5000, power: 100 },
    { name: "Character 7", img: "./photo/123123214342343242343423.png", cost: 10000, power: 200 },
    { name: "Character 8", img: "./photo/1111111111111111111111111111111111111111111111111111111111.png", cost: 50000, power: 500 },
];

// Ініціалізація магазину персонажів
function initCharacterShop() {
    const shop = document.getElementById('characterShop');
    characters.forEach((character, index) => {
        const characterItem = document.createElement('div');
        characterItem.classList.add('characterItem');
        characterItem.innerHTML = `
            <img src="${character.img}" alt="${character.name}">
            <p>${character.name}</p>
            <p>Cost: ${character.cost} Coins</p>
        `;
        characterItem.onclick = () => buyCharacter(index);
        shop.appendChild(characterItem);
    });
}

function updateOwnedCharacters() {
    const ownedContainer = document.getElementById('ownedCharacters');
    ownedContainer.innerHTML = '';  // Очищаємо попередні кнопки
    ownedCharacters.forEach(index => {
        const character = characters[index];
        const characterButton = document.createElement('button');
        characterButton.innerText = character.name;
        characterButton.onclick = () => selectCharacter(index);
        ownedContainer.appendChild(characterButton);
    });
}

function addCoins() {
    coins += clickPower;
    document.getElementById('coinCount').innerText = coins;
    showCoinGain();
}

function upgradeClicks() {
    if (coins >= upgradeCost) {
        coins -= upgradeCost;
        clickPower += 1;
        upgradeCost *= 2;
        document.getElementById('coinCount').innerText = coins;
        document.getElementById('clickPower').innerText = clickPower;
        document.querySelector('button').innerText = `Upgrade Clicks (Cost: ${upgradeCost} Coins)`;
    } else {
        alert("Not enough coins!");
    }
}

function showCoinGain() {
    const coinGain = document.createElement('div');
    coinGain.id = 'coinGain';
    coinGain.innerText = `+${clickPower}`;
    document.body.appendChild(coinGain);

    // Позиціюємо анімацію над персонажем
    const character = document.getElementById('character');
    const rect = character.getBoundingClientRect();
    coinGain.style.left = `${rect.left + rect.width / 2}px`;
    coinGain.style.top = `${rect.top}px`;

    // Видаляємо анімацію після завершення
    setTimeout(() => {
        document.body.removeChild(coinGain);
    }, 500);
}

function buyCharacter(index) {
    const character = characters[index];
    if (coins >= character.cost && !ownedCharacters.includes(index)) {
        coins -= character.cost;
        ownedCharacters.push(index);  // Додаємо персонажа до списку куплених
        selectCharacter(index);  // Автоматично вибираємо купленого персонажа
        updateOwnedCharacters();  // Оновлюємо список куплених персонажів
        document.getElementById('coinCount').innerText = coins;
    } else if (coins < character.cost) {
        alert("Not enough coins!");
    } else if (ownedCharacters.includes(index)) {
        alert("You already own this character! Select it from the owned characters.");
    }
}

function selectCharacter(index) {
    const character = characters[index];
    clickPower = character.power;
    currentCharacter = index;
    document.getElementById('character').src = character.img;
    document.getElementById('clickPower').innerText = clickPower;
}

// Ініціалізація магазину після завантаження сторінки
document.addEventListener('DOMContentLoaded', (event) => {
    initCharacterShop();
    updateOwnedCharacters();  // Оновлюємо список персонажів на початку гри
});