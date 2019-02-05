import React from "react";
import { Route, withRouter } from "react-router-dom";
import { Root } from "@vkontakte/vkui";
import MoviesView from "../components/MoviesView";
import AddMovieView from "../components/AddMovieView";
import EditMovieView from "../components/EditMovieView";

@withRouter
class Routes extends React.Component {
  render() {
    const activeView = this.props.location.pathname.slice(1);

    return (
      <Root activeView={activeView}>
        <Route id="" component={MoviesView} />
        <Route id="MoviesView" component={MoviesView} />
        <Route id="AddMovieView" component={AddMovieView} />
        <Route id="EditMovieView" component={EditMovieView} />
      </Root>
    );
  }
}

export default Routes;
