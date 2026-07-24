import { LANGUAGE_TO_FLAG } from '../constants';

/**
 * Rend le drapeau correspondant a une langue, ou null si elle n'est pas mappee.
 *
 * @param {string} language
 */
export function getLanguageFlag(language) {

    if(!language) return null;

    const lowerLang = language.toLowerCase()
    const countryCode = LANGUAGE_TO_FLAG[lowerLang]

    if(countryCode) {
        return(
            <img
                src={`https://flagcdn.com/24x18/${countryCode}.png`}
                alt={`Drapeau ${lowerLang}`}
                className='h-3 mr-1 inline-block'
            />
        )
    }
    return null;
}
