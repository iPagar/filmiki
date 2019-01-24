import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Panel,
  PanelHeader,
  HeaderButton,
  FormLayout,
  Input,
  Button,
  FormLayoutGroup,
  Radio,
  Spinner,
  Checkbox,
  ScreenSpinner
} from "@vkontakte/vkui";
import loc from "../../loc";
import { getLists, getEditMovie, updateMovie } from "../../services";

class EditMovieView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      popout: null,
      lists: [],
      moviePrev: {},
      movie: {
        title: "",
        lists: []
      }
    };
    this.listsRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ movie: getEditMovie(), moviePrev: getEditMovie() });
    this.updateLists();
  }

  movieSubmit = async e => {
    e.persist();
    e.preventDefault();

    await this.setState({
      popout: <ScreenSpinner />
    });

    const lists = [];
    const inputs = this.listsRef
      .getElementsByClassName("lists")[0]
      .getElementsByTagName("Input");

    for (let i = 0; i < inputs.length; i++)
      if (inputs[i].checked) lists.push(i);

    await this.setState(state => ({
      movie: { ...state.movie, lists }
    }));

    const { movie, moviePrev } = this.state;

    await updateMovie(movie, moviePrev);

    await this.setState({
      popout: null
    });

    e.currentTarget = e.target;

    this.props.go(e);
  };

  onChangeTitle = e => {
    const { movie } = this.state;

    this.setState({
      movie: { ...movie, title: e.currentTarget.value }
    });
  };

  onInvalidTitle = e => {
    e.preventDefault();
    e.currentTarget.focus();
  };

  async updateLists() {
    this.setState({ isLoading: true });

    const lists = await getLists();

    this.setState({ lists, isLoading: false });
  }

  renderLists() {
    const {
      movie: { lists }
    } = this.state;
    const { lists: defaultLists } = this.state;

    return (
      <FormLayoutGroup className="lists" top="Выбрать список">
        {defaultLists.map((defaultList, defaultId) => {
          let filteredList = null;

          switch (defaultList.type) {
            case "radio":
              filteredList = (
                <Radio
                  name={defaultList.type}
                  key={defaultId}
                  defaultChecked={lists.some(id => defaultId === id)}
                >
                  {defaultList.title}
                </Radio>
              );
              break;
            case "required":
              filteredList = (
                <Checkbox
                  style={{ display: "none" }}
                  name={defaultId}
                  key={defaultId}
                  defaultChecked
                >
                  {defaultList.title}
                </Checkbox>
              );
              break;
            default:
              filteredList = (
                <Checkbox
                  key={defaultId}
                  defaultChecked={lists.some(id => {
                    return defaultId === id;
                  })}
                >
                  {defaultList.title}
                </Checkbox>
              );
          }

          return filteredList;
        })}
      </FormLayoutGroup>
    );
  }

  renderMovieInfo() {
    const { movie } = this.state;
    return (
      <FormLayout
        getRef={e => {
          this.listsRef = e;
        }}
        onSubmit={this.movieSubmit}
        data-to="moviesView"
      >
        <Input
          type="text"
          top="Название"
          onChange={this.onChangeTitle}
          onInvalid={this.onInvalidTitle}
          defaultValue={movie.title}
          required
        />
        {this.renderLists()}
        <Button size="xl">{loc.editText}</Button>
      </FormLayout>
    );
  }

  renderPanelHeader() {
    const { go } = this.props;

    return (
      <PanelHeader
        left={
          <HeaderButton onClick={go} data-to="moviesView">
            Отменить
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
      <View popout={popout} activePanel="editMovie">
        <Panel id="editMovie">
          {this.renderPanelHeader()}
          {(isLoading && this.renderSpinner()) || this.renderMovieInfo()}
        </Panel>
      </View>
    );
  }
}

EditMovieView.propTypes = {
  go: PropTypes.func.isRequired
};

export default EditMovieView;
