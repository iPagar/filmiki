import React from "react";
import PropTypes from "prop-types";
import { Cell } from "@vkontakte/vkui";
import { deleteMovie } from "../../services";
import loc from "../../loc";
import { setEditMovie } from "../../services";

class MoviesCell extends React.Component {
  deleteMovie = async () => {
    const { movie } = this.props;

    await deleteMovie(movie);

    this.props.update();
  };

  editButton() {
    const { movie } = this.props;
    setEditMovie(movie);

    return (
      <div data-to="editMovieView" onClick={this.props.go}>
        {loc.editText}
      </div>
    );
  }

  render() {
    const { movie, id } = this.props;

    return (
      <Cell
        id={id}
        onRemove={this.deleteMovie}
        asideContent={this.editButton()}
        removable
      >
        {movie.title}
      </Cell>
    );
  }
}

MoviesCell.propTypes = {
  movie: PropTypes.object.isRequired
};

export default MoviesCell;
