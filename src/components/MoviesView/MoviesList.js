import React from "react";
import { List, Div } from "@vkontakte/vkui";
import MoviesCell from "./MoviesCell";
import loc from "../../loc";

class MoviesList extends React.Component {
  render() {
    const { history, listId, movies } = this.props;
    const activeMovies = movies.filter(movie =>
      movie.lists.some(list => list === listId)
    );

    return (
      <div>
        {(activeMovies.length && (
          <List>
            {activeMovies.map((movie, i) => (
              <MoviesCell
                key={i}
                listId={listId}
                movie={movie}
                history={history}
              />
            ))}
          </List>
        )) || <Div align="center">{loc.emptyText}</Div>}
      </div>
    );
  }
}

export default MoviesList;
