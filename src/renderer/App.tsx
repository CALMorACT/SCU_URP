/*
 * @Author: holakk
 * @Date: 2021-09-14 21:44:51
 * @LastEditors: holakk
 * @LastEditTime: 2021-09-16 10:26:59
 * @Description: file content
 */
import React from 'react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Login from './component/login';
import MainPanel from './component/mainPanel';
import './App.global.css';

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <Route exact path="/" component={Login} />
        <Route path="/mainPanel" component={MainPanel} />
      </Router>
    </RecoilRoot>
  );
}
