// Мови і їхні переклади
const translations = {
    ru: {
        title: "\u0412\u0432\u0435\u0434\u0438 \u0441\u0443\u043C\u043C\u0443 \u0438 \u0443\u0437\u043D\u0430\u0439",
        description: "\u0441\u0432\u043E\u0439 \u0431\u043E\u043D\u0443\u0441",
        deposit: "\u0412\u0432\u0435\u0434\u0438 \u0441\u0443\u043C\u043C\u0443",
        minDeposit: "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0434\u0435\u043F\u043E\u0437\u0438\u0442 \u0434\u043B\u044F \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0431\u043E\u043D\u0443\u0441\u0430 \u2013 20 USDT.",
        yourBonus: "\u0412\u0430\u0448 \u0431\u043E\u043D\u0443\u0441",
        bonusButton: "\u0417\u0430\u0431\u0440\u0430\u0442\u044C \u0431\u043E\u043D\u0443\u0441",
        checkbox: "\u0421\u0442\u0430\u0432\u044F \u0433\u0430\u043B\u043E\u0447\u043A\u0443 \u0432 \u044D\u0442\u043E\u043C \u043F\u043E\u043B\u0435 \u0434\u043B\u044F \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435, \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u0442, \u0447\u0442\u043E \u0435\u043C\u0443 \u0431\u043E\u043B\u044C\u0448\u0435 18 \u043B\u0435\u0442, \u0438 \u0447\u0442\u043E \u043E\u043D \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043B, \u043F\u043E\u043D\u044F\u043B \u0438 \u043F\u0440\u0438\u043D\u044F\u043B",
        terms: "\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u0438 \u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u044F",
        modalBtn: "C\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u0430\u0443\u043D\u0442"
    },
    en: {
        title: "Enter the amount and find out",
        description: "your bonus"
    },
    hu: {
        title: "\xcdrd be az \xf6sszeget \xe9s tudd meg",
        description: "a b\xf3nuszodat"
    },
    cz: {
        title: "Zadejte \u010D\xe1stku a zjist\u011Bte",
        description: "sv\u016Fj bonus"
    },
    pt: {
        title: "Digite o valor e descubra",
        description: "seu b\xf4nus"
    },
    tr: {
        title: "Miktar\u0131 girin ve \xf6\u011Frenin",
        description: "bonusunuzu"
    }
};
// Список підтримуваних мов
const supportedLanguages = [
    "ru",
    "en",
    "hu",
    "cz",
    "pt",
    "tr"
];
function getBrowserLanguage() {
    // Отримуємо мову браузера
    const userLang = navigator.language || navigator.userLanguage;
    const language = userLang.split("-")[0].toLowerCase();
    // Перевіряємо, чи підтримується мова
    if (supportedLanguages.includes(language)) return language;
    // Якщо мова не підтримується, використовуємо за замовчуванням "ru"
    return "ru";
}
function changeLanguage(language) {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach((element)=>{
        const key = element.getAttribute("data-translate");
        if (translations[language] && translations[language][key]) element.textContent = translations[language][key];
    });
}
// Зміна мови на основі мови браузера
const browserLanguage = getBrowserLanguage();
changeLanguage(browserLanguage);

//# sourceMappingURL=calculator.49adaddb.js.map
