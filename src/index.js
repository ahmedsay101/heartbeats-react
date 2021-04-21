import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './store/reducer';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import thunk from 'redux-thunk';

axios.defaults.baseURL = 'https://heartbeatsproject.online/v1/';

axios.interceptors.request.use(config => {
  if (localStorage.getItem("accessToken") !== null) {
    config.headers.Authorization =  localStorage.getItem("accessToken");
  }
  return config;
});

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
