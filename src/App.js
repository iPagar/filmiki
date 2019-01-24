import React from "react";
import { BrowserRouter } from "react-router-dom";
import "@vkontakte/vkui/dist/vkui.css";
import { hot } from "react-hot-loader/root";
import routes from "./routes";

@hot
class App extends React.Component {
  render() {
    return <BrowserRouter>{routes}</BrowserRouter>;
  }
}

export default App;
