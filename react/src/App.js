import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import './App.css';

import ScreenHome from './Components/ScreenHome';
import ScreenMyArticles from './Components/ScreenMyArticles';
import ScreenArticlesBySource from './Components/ScreenArticlesBySource';
import ScreenSource from './Components/ScreenSource';

import articles from './Reducers/article.reducer';
import token from './Reducers/login.reducer';
import language from './Reducers/lang.reducer';
const store = createStore(combineReducers({articles, token, language}));

function App() {
  return (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" exact component={ScreenHome} />
        <Route path="/screenmyarticles" exact component={ScreenMyArticles} />
        <Route path="/screenarticlesbysource/:id" exact component={ScreenArticlesBySource} />
        <Route path="/screensource" exact component={ScreenSource} />
      </Switch>
    </Router>
  </Provider>
  );
}

export default App;