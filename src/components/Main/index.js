import React from "react";
import { Root } from "@vkontakte/vkui";
import MoviesView from "../MoviesView";
import AddMovieView from "../AddMovieView";
import EditMovieView from "../EditMovieView";

class Main extends React.Component {
  state = {
    activeView: "moviesView"
  };

  changeActiveView = e => {
    this.setState({ activeView: e.currentTarget.dataset.to });
  };

  render() {
    const { activeView } = this.state;

    return (
      <Root activeView={activeView}>
        <MoviesView id="moviesView" go={this.changeActiveView} />
        <AddMovieView id="addMovieView" go={this.changeActiveView} />
        <EditMovieView id="editMovieView" go={this.changeActiveView} />
      </Root>
    );
  }
}

export default Main;
