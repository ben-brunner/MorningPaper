export default function (language = null, action) {
    if(action.type === 'changeLang') {
        return action.language;
    } else {
        return language;
    }
};