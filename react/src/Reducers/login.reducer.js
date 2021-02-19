export default function(token = {}, action) {
    if (action.type === 'login') {
        return action.token;
    } else if (action.type === 'logout') {
        return token = {};
    } else {
        return token;
    }
};