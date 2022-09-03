/*
 * @Author: holakk
 * @Date: 2021-09-14 21:44:51
 * @LastEditors: holakk
 * @LastEditTime: 2022-01-02 23:24:27
 * @Description: file content
 */
import { RecoilRoot } from 'recoil';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import MainPanel from './component/MainPanel';
import './App.css';

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route exact path="/" component={Login} />
          <Route path="/mainPanel" component={MainPanel} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}
