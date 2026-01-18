export function getFullName(user) {
    return `${user.firstname} ${user.lastname}`
}

/**
 * 
 * @param {string} str 
 */
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);