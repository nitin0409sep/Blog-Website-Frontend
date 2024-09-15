export const getUserData = () => {
    return localStorage.getItem('user') ?? null;
}

export const setUserData = (data) => {
    localStorage.setItem('user', data)
}

export const deleteUserData = () => {
    localStorage.clear();
}