export default function (articles = [], action) {

if (action.type === 'saveArticles') {
    return action.articles;
} else if (action.type === 'addArticle') {
    let alreadyExist = false;
    const copy = [...articles];

    copy.forEach(article => {
        if (article.title === action.articleLiked.title) {
            alreadyExist = true;
        }
    });
    if (!alreadyExist) {
        copy.push(action.articleLiked);
    }
    return copy;

} else if (action.type === 'deleteArticle') {
    const copy = [...articles];
    const filter = copy.filter(element => element.title !== action.articleLiked.title);
    return filter;
} else {
    return articles;
}
};