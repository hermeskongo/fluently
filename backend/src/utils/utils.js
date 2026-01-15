export function getUserWithoutPassword(user) {
    const {password, ...rest} = user
    return rest
}