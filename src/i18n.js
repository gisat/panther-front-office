import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";

import translationCZ from './locales/cz/translation.json';
import translationEN from './locales/en/translation.json';

// the translations
const resources = {
	cz: {
		translation: translationCZ
	},
	en: {
		translation: translationEN
	}
};

i18n.use(reactI18nextModule)
	.init({
		resources,
		lng: "en",
		fallbackLng: "en", // use en if detected lng is not available
		keySeparator: ".",
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;