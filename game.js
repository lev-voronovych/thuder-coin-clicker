let coins = 0;
let clickPower = 1;
let upgradeCost = 100;
let fuelUpgradeCost = 500; // Вартість прокачки швидкості відновлення палива
let currentCharacter = 0;
let ownedCharacters = [0];  // Початковий персонаж є купленим за замовчуванням
let fuel = 100; // Початковий рівень палива
let maxFuel = 100; // Максимальний рівень палива
let fuelRecoveryInterval = 300; // Інтервал відновлення палива в мілісекундах
const characters = [
    { name: "Character 1", img: "./photo/a8bbf7fc-3591-4cbe-960f-efd348858748.png", cost: 0, power: 1, fuelBonus: 0 },
    { name: "Character 2", img: "./photo/OIG1.png", cost: 200, power: 5, fuelBonus: 50 },
    { name: "Character 3", img: "./photo/OI1.png.jpg", cost: 500, power: 10, fuelBonus: 100 },
    { name: "Character 4", img: "./photo/1223.png", cost: 1000, power: 20, fuelBonus: 200 },
    { name: "Character 5", img: "./photo/11111.png", cost: 2000, power: 50, fuelBonus: 300 },
    { name: "Character 6", img: "./photo/12321`2.png", cost: 5000, power: 100, fuelBonus: 500 },
    { name: "Character 7", img: "./photo/123123214342343242343423.png", cost: 10000, power: 200, fuelBonus: 1000 },
    { name: "Character 8", img: "./photo/1111111111111111111111111111111111111111111111111111111111.png", cost: 50000, power: 500, fuelBonus: 2000 },
];

// Функція для визначення типу пристрою
function detectDevice() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const screenWidth = window.innerWidth;

    if (isMobile || screenWidth < 768) {
        return 'mobile';
    } else {
        return 'desktop';
    }
}

// Функція для застосування стилів залежно від пристрою
function applyDeviceStyles() {
    const device = detectDevice();
    if (device === 'mobile') {
        document.body.style.fontSize = '14px';
        document.getElementById('characterShop').style.gridTemplateColumns = 'repeat(2, 1fr)';
        // Інші стилі для мобільних пристроїв
    } else {
        document.body.style.fontSize = '16px';
        document.getElementById('characterShop').style.gridTemplateColumns = 'repeat(4, 1fr)';
        // Інші стилі для комп'ютерів
    }
}

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


const fuelDecreaseRate = 5; // Скільки палива витрачається за один клік
const fuelRecoveryRate = 1; // Скільки палива відновлюється за одиницю часу


function addCoins() {
    if (fuel > 0) {
        coins += clickPower;
        fuel -= fuelDecreaseRate; // Зменшуємо паливо на кожен клік
        if (fuel < 0) fuel = 0; // Не дозволяємо паливу бути меншим за 0
        updateFuelBar(); // Оновлюємо шкалу палива
        document.getElementById('coinCount').innerText = coins;
        showCoinGain();
    } else {
        alert("Out of fuel! Wait for it to refill.");
    }
}

function updateFuelBar() {
    document.getElementById('fuelBar').value = fuel;
}

// Функція для поступового відновлення палива
function recoverFuel() {
    if (fuel < 100) {
        fuel += fuelRecoveryRate;
        if (fuel > 100) fuel = 100; // Не дозволяємо паливу перевищувати 100
        updateFuelBar();
    }
}



// Відновлення палива кожні fuelRecoveryInterval мілісекунд
setInterval(recoverFuel, fuelRecoveryInterval);


// Ініціалізація після завантаження сторінки
document.addEventListener('DOMContentLoaded', (event) => {
    applyDeviceStyles();  // Застосовуємо стилі для відповідного пристрою
    initCharacterShop();
    updateOwnedCharacters();  // Оновлюємо список персонажів на початку гри
});
