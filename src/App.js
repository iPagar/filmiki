import React from "react";
import { HashRouter } from "react-router-dom";
import "@vkontakte/vkui/dist/vkui.css";
import { hot } from "react-hot-loader/root";
import Routes from "./routes";

@hot
class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Routes />
      </HashRouter>
    );
  }
}

export default App;
