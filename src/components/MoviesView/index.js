import React from "react";
import {
  Spinner,
  View,
  Panel,
  FixedLayout,
  PanelHeader,
  Tabs,
  HorizontalScroll,
  HeaderButton,
  ScreenSpinner,
  Gallery,
  Search,
  Alert
} from "@vkontakte/vkui";
import Icon24Add from "@vkontakte/icons/dist/24/add";
import VKConnect from "@vkontakte/vkui-connect";
import loc from "../../loc";
import {
  getMovies,
  getLists,
  setUserId,
  findUser,
  createUser,
  getUserId
} from "../../services";
import MoviesTabItem from "./MoviesTabItem";
import MoviesList from "./MoviesList";

let prevActiveList = 0;

class MoviesView extends React.Component {
  state = {
    isLoading: false,
    popout: null,
    activeList: 0,
    lists: [],
    movies: [],
    search: ""
  };

  componentWillUnmount() {
    prevActiveList = this.state.activeList;
  }

  componentDidMount() {
    this.getUser();
    this.setState({ activeList: prevActiveList });
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

  onSearchChange = search => {
    this.setState({ search });
  };

  get movies() {
    const search = this.state.search.toLowerCase();
    const filteredMovies = this.state.movies.filter(
      movie => movie.title.toLowerCase().indexOf(search) > -1
    );

    return filteredMovies;
  }

  getUser() {
    VKConnect.subscribe(async e => {
      switch (e.detail.type) {
        case "VKWebAppGetUserInfoResult":
          this.setState({ isLoading: true });
          const userId = e.detail.data.id;
          if (!(await findUser(userId))) {
            await this.setState({ popout: <ScreenSpinner /> });
            await createUser(userId);
          }
          setUserId(userId);
          await this.updateLists();
          await this.updateMovies();
          await this.setState({ isLoading: false, popout: null });
          break;
        default:
          if (!getUserId()) this.setState({ popout: <ScreenSpinner /> });
          break;
      }
    });

    VKConnect.send("VKWebAppGetUserInfo", {});
  }

  renderMovies() {
    const { activeList, lists, search } = this.state;
    const { history } = this.props;

    return (
      <div>
        <Search value={search} onChange={this.onSearchChange} />
        <Gallery
          align="center"
          style={{
            height: "100%",
            width: "100%"
          }}
          slideIndex={activeList}
          onChange={slideIndex => this.setState({ activeList: slideIndex })}
        >
          {lists.map((list, i) => (
            <MoviesList
              key={i}
              listId={i}
              movies={this.movies}
              history={history}
            />
          ))}
        </Gallery>
      </div>
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
    const { history } = this.props;

    return (
      <PanelHeader
        left={
          <HeaderButton onClick={() => history.push("AddMovieView")}>
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
          flexDirection: "column"
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
      <View id="moviesView" popout={popout} activePanel="moviesPanel">
        <Panel id="moviesPanel">
          {this.renderPanelHeader()}
          {isLoading && !popout && this.renderSpinner()}
          {!popout && !isLoading && this.renderMoviesLists()}
          <div
            style={{
              marginTop: 48
            }}
          >
            {!popout && !isLoading && this.renderMovies()}
          </div>
        </Panel>
      </View>
    );
  }
}

export default MoviesView;
