

const languageToCurrency = {
	pt: "eur",
	cs: "eur",
	hu: "eur",
	tr: "usd",
	ru: "usd",
	"en-CA": "cad", 
	"fr-CA": "cad", 
	en: "usd",
};


	export function getCurrencyCode() {
		const browserLang = navigator.language || navigator.userLanguage;
		const fullCode = browserLang.toLowerCase(); 
		const shortCode = fullCode.split("-")[0];

		const currency =
			languageToCurrency[fullCode] || languageToCurrency[shortCode] || "eur";

		return {
			code: currency,
			icon: `currency_${currency.toLowerCase()}`,
		};
	}


// Отримує актуальний курс обміну
export async function getExchangeRate(currencyCode) {
	try {
		const res = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=${currencyCode}`
		);
		const data = await res.json();
		return data.tether?.[currencyCode] || 1;
	} catch (e) {
		console.error("Помилка завантаження курсу валют", e);
		return 1;
	}
}

