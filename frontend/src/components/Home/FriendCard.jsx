import { Link } from 'react-router-dom';
import { LANGUAGE_TO_FLAG } from '../../constants';
import { getFullName } from '../../lib/help';

export const FriendCard = ({friend}) => {
    return (
        <div className="card bg-base-200 hover:shadow-md transition-shadow">
            <div className="card-body p-4">
                {/* USER INFO */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="avatar size-12">
                        <img src={friend?.picture} alt={getFullName(friend)} />
                    </div>
                    <h3 className="font-semibold truncate">{getFullName(friend)}</h3>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                    <span className="badge badge-secondary text-xs">
                        {getLanguageFlag(friend?.nativeLanguage)}
                        Native: {friend?.nativeLanguage}
                    </span>
                    <span className="badge badge-outline text-xs">
                        {getLanguageFlag(friend?.learningLanguage)}
                        Learning: {friend?.learningLanguage}
                    </span>
                </div>

                <Link to={`/chat/${friend?.id}`} className="btn btn-outline w-full">
                    Message
                </Link>
            </div>
        </div>
    )
}

/**
 * 
 * @param {string} language 
 * @returns 
 */
export function getLanguageFlag(language) {

    if(!language) return;

    const lowerLang = language.toLowerCase()
    const countryCode = LANGUAGE_TO_FLAG[lowerLang]

    if(countryCode) {
        return(
            <img 
                src={`https://flagcdn.com/24x18/${countryCode}.png`}
                alt={`${lowerLang} flag`} 
                className='h-3 mr-1 inline-block'
            />
        )
    }
    return null;
    
}