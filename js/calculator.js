import {
	changeLanguage,
	getBrowserLanguage,
	translateText,
} from "./translate.js";
import bonuses from "../bonuses.json";

const refsBonus = {
	depositInput: document.querySelector('[data-ref="deposit"]'),
	bonusOutput: document.querySelector(".calculator-bonus"),
	bonusMessage: document.querySelector('[data-ref="bonusMessage"]'),
	bonusText: document.querySelector(".calculator-text"),
	modalText: document.querySelector(".modal-slot-text"),
	bonusButton: document.querySelector("[data-modal-open]"),
	currencySelect: document.querySelector(".custom-dropdown .selected"),
};



let currencyCode = "USDT"; // Стартова валюта

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
	const lang = getBrowserLanguage();
	changeLanguage(lang);
	refsBonus.depositInput.addEventListener("input", calculateBonus);
	refsBonus.bonusButton.addEventListener("click", () => {
		setTimeout(() => {
			clearBonusInfo();
		}, 1000);
	});

	const dropdown = document.querySelector(".custom-dropdown");
	const options = dropdown ? dropdown.querySelector(".options") : null;
	const currencySelect = refsBonus.currencySelect;
	const optionItems = dropdown ? dropdown.querySelectorAll(".option") : [];

	if (dropdown && options && currencySelect) {
		// Логіка відкриття/закриття дропдауну
		currencySelect.addEventListener("click", (event) => {
			event.stopPropagation();
			options.style.display =
				options.style.display === "block" ? "none" : "block";
		});

		// Закриття дропдауну при натисканні поза його межами
		document.addEventListener("click", (event) => {
			if (!dropdown.contains(event.target)) {
				options.style.display = "none";
			}
		});

		// Обробка кліку по кожній валюті в дропдауні
		optionItems.forEach((option) => {
			option.addEventListener("click", () => {
				const selectedCurrency = option.getAttribute("data-value");
				const selectedImage = option.querySelector("img").src;

				currencySelect.innerHTML = `<img src="${selectedImage}" alt="${selectedCurrency}" width="24" height="24" />`;
				currencyCode = selectedCurrency;
				calculateBonus();
				options.style.display = "none";
			});
		});
	}

	// Викликаємо одразу при завантаженні
	initCurrencyAndCalculateBonus();
});

// Додаємо цю функцію нижче
function initCurrencyAndCalculateBonus() {
	const selectedImg = refsBonus.currencySelect.querySelector("img");

	if (selectedImg && selectedImg.alt) {
		currencyCode = selectedImg.alt;
	} else {
		currencyCode = "USDT"; // значення за замовчуванням
	}

	calculateBonus();
}


/* Розрахунок бонусу */
function calculateBonus() {
	const currentBonuses = bonuses[currencyCode];

	if (!currentBonuses) {
		console.warn("Немає бонусів для валюти:", currencyCode);
		return;
	}

	let deposit = refsBonus.depositInput.value.trim();

	if (deposit === "") {
		clearBonusDisplay();
		refsBonus.bonusMessage.textContent = " ";
		refsBonus.bonusText.textContent = " ";
		disableBonusButton();
		return;
	}

	deposit = parseFloat(deposit);

	if (isNaN(deposit)) {
		clearBonusDisplay();
		refsBonus.bonusMessage.textContent = " ";
		disableBonusButton();
		return;
	}

	const minDeposit = Math.min(
		...currentBonuses.filter((b) => b.depositNum === 1).map((b) => b.min)
	);

	if (deposit < minDeposit) {
		refsBonus.bonusText.setAttribute("data-translate", "minDeposit");
		refsBonus.bonusText.textContent = `${translateText(
			"minDeposit"
		)} ${minDeposit}`;
		refsBonus.bonusMessage.textContent = "";
		clearBonusDisplay();
		disableBonusButton();
		return;
	}

	const applicableBonus = currentBonuses.find(
		(b) => deposit >= b.min && deposit <= b.max
	);

	if (applicableBonus) {
		const bonusAmount = Math.min(
			deposit * applicableBonus.bonus,
			applicableBonus.upto
		);
		const localAmount = Math.round(bonusAmount);
		const freeSpins = applicableBonus.fs;

		const digits = `${localAmount}`.split("");
		const totalSlots = 4;
		const paddedDigits = Array.from(
			{ length: totalSlots },
			(_, i) => digits[i] || ""
		);

		refsBonus.bonusOutput.innerHTML = paddedDigits
			.map((digit) => `<span class="calculator-digit">${digit}</span>`)
			.join("");

		const paddedModalDigits = Array.from(
			{ length: 4 },
			(_, i) => digits[i] || ""
		);

		refsBonus.modalText.innerHTML = paddedModalDigits
			.map((d) => `<span class="modal-digit">${d}</span>`)
			.join("");

		refsBonus.bonusText.setAttribute("data-translate", "yourBonus");
		refsBonus.bonusText.textContent = translateText("yourBonus");
		refsBonus.bonusMessage.textContent = `${localAmount} ${currencyCode} + ${freeSpins} FS`;

		enableBonusButton();
	} else {
		clearBonusDisplay();
		refsBonus.bonusMessage.textContent = "";
		disableBonusButton();
	}
}

function clearBonusDisplay() {
	refsBonus.bonusOutput.textContent = "";
}

function clearBonusInfo() {
	refsBonus.depositInput.value = "";
	clearBonusDisplay();
	refsBonus.bonusMessage.textContent = " ";
	refsBonus.bonusText.textContent = " ";
	disableBonusButton();
}

function disableBonusButton() {
	refsBonus.bonusButton.disabled = true;
	refsBonus.bonusButton.style.cursor = "not-allowed";
	refsBonus.bonusButton.style.background = "rgba(99, 82, 255, 1)";
	refsBonus.bonusButton.style.color = "rgba(198, 195, 205, 1)";
}

function enableBonusButton() {
	refsBonus.bonusButton.disabled = false;
	refsBonus.bonusButton.style.cursor = "pointer";
	refsBonus.bonusButton.style.background = "rgba(79, 65, 202, 1)";
	refsBonus.bonusButton.style.color = "rgba(255, 255, 255, 1)";
}
