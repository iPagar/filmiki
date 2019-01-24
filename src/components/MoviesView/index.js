import React from "react";
import {
  Spinner,
  View,
  Panel,
  FixedLayout,
  PanelHeader,
  Tabs,
  HorizontalScroll,
  Group,
  List,
  HeaderButton,
  Div,
  ScreenSpinner
} from "@vkontakte/vkui";
import Icon24Add from "@vkontakte/icons/dist/24/add";
import VKConnect from "@vkontakte/vkui-connect";
import loc from "../../loc";
import { getMovies, getLists, setUserId } from "../../services";
import MoviesTabItem from "./MoviesTabItem";
import MoviesCell from "./MoviesCell";

class MoviesView extends React.Component {
  state = {
    isLoading: false,
    popout: null,
    lists: [],
    activeList: 0,
    movies: []
  };

  componentDidMount() {
    this.getUser();
  }

  setActiveList = e => {
    this.setState({ activeList: Number(e.currentTarget.getAttribute("id")) });
  };

  updateLists = async () => {
    this.setState({ isLoading: true });

    const lists = await getLists();

    this.setState({ lists, isLoading: false });
  };

  updateMovies = async () => {
    this.setState({ isLoading: true });

    const movies = await getMovies();

    this.setState({ movies, isLoading: false });
  };

  silentUpdateMovies = async () => {
    const movies = await getMovies();

    this.setState({ movies });
  };

  getUser() {
    this.setState({ isLoading: true, popout: <ScreenSpinner /> });

    VKConnect.subscribe(async e => {
      switch (e.detail.type) {
        case "VKWebAppGetUserInfoResult":
          await setUserId(e.detail.data.id);
          await this.updateLists();
          await this.updateMovies();
          await this.setState({ isLoading: false, popout: null });
          break;
        default:
          break;
      }
    });
    VKConnect.send("VKWebAppGetUserInfo", {});
  }

  renderMovies() {
    const { movies, activeList } = this.state;
    const activeMovies = movies.filter(movie =>
      movie.lists.some(list => list === activeList)
    );

    return (
      <React.Fragment>
        {(activeMovies.length && (
          <Group>
            <List>
              {activeMovies.map((movie, i) => (
                <MoviesCell
                  key={i}
                  id={i}
                  movie={movie}
                  update={this.silentUpdateMovies}
                  go={this.props.go}
                />
              ))}
            </List>
          </Group>
        )) || <Div align="center">{loc.emptyText}</Div>}
      </React.Fragment>
    );
  }

  renderMoviesLists() {
    const { lists, activeList } = this.state;

    return (
      <FixedLayout vertical="top">
        <Tabs theme="header" type="buttons">
          <HorizontalScroll>
            {lists.map((list, i) => (
              <MoviesTabItem
                key={i}
                id={i}
                list={list}
                selected={i === activeList}
                onClick={this.setActiveList}
              />
            ))}
          </HorizontalScroll>
        </Tabs>
      </FixedLayout>
    );
  }

  renderPanelHeader() {
    const { go } = this.props;

    return (
      <PanelHeader
        left={
          <HeaderButton onClick={go} data-to="addMovieView">
            <Icon24Add />
          </HeaderButton>
        }
        noShadow
      >
        {loc.appTitle}
      </PanelHeader>
    );
  }

  renderSpinner() {
    const spinner = (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: 60
        }}
      >
        <Spinner size="large" style={{ marginTop: 20 }} />
      </div>
    );

    return spinner;
  }

  render() {
    const { isLoading, popout } = this.state;

    return (
      <View popout={popout} activePanel="movies">
        <Panel id="movies">
          {this.renderPanelHeader()}
          {(isLoading && this.renderSpinner()) || this.renderMoviesLists()}
          <div style={{ marginTop: 60 }}>
            {!isLoading && this.renderMovies()}
          </div>
        </Panel>
      </View>
    );
  }
}

export default MoviesView;
