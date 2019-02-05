import React from "react";
import PropTypes from "prop-types";
import { Cell } from "@vkontakte/vkui";
import { FaHeart, FaEye, FaEyeSlash } from "react-icons/fa";
import loc from "../../loc";
import { setEditMovie } from "../../services";
import Icon16Chevron from "@vkontakte/icons/dist/16/chevron";

class MoviesCell extends React.Component {
  onClick = () => {
    const { movie, history } = this.props;

    setEditMovie(movie);
    history.push("EditMovieView");
  };

  editButton() {
    return (
      <div
        style={{
          display: "flex",
          height: "1em",
          width: "1em",
          justifyContent: "center"
        }}
      >
        <Icon16Chevron />
      </div>
    );
  }

  renderIcons() {
    const {
      movie: { lists },
      listId
    } = this.props;
    const icons = lists
      .filter(list => list !== listId)
      .map(list => {
        switch (list) {
          case 1:
            return (
              <FaEye key={list} style={{ fill: "#5181b8", padding: "2px" }} />
            );
          case 2:
            return (
              <FaEyeSlash
                key={list}
                style={{ fill: "#5181b8", padding: "2px" }}
              />
            );
          case 3:
            return (
              <FaHeart
                key={list}
                style={{ fill: "var(--destructive)", padding: "2px" }}
              />
            );
          default:
            return null;
        }
      })
      .reverse();

    return <div style={{ display: "flex" }}>{icons}</div>;
  }

  render() {
    const { movie } = this.props;

    return (
      <Cell
        asideContent={this.editButton()}
        indicator={this.renderIcons()}
        onClick={this.onClick}
        multiline
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
