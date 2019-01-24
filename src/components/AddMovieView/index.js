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
import { getLists, addMovie } from "../../services";
import loc from "../../loc";

class AddMovieView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      popout: null,
      lists: [],
      movie: {
        title: "",
        lists: []
      }
    };
    this.listsRef = React.createRef();
  }

  componentDidMount() {
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

    const { movie } = this.state;
    await addMovie(movie);

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
    const { lists } = this.state;

    return (
      <FormLayoutGroup className="lists" top="Выбрать список">
        {lists.map((list, i) => {
          let filteredList = null;

          switch (list.type) {
            case "radio":
              filteredList = (
                <Radio name={list.type} key={i} defaultChecked={list.checked}>
                  {list.title}
                </Radio>
              );
              break;
            case "required":
              filteredList = (
                <Checkbox
                  style={{ display: "none" }}
                  name={i}
                  key={i}
                  defaultChecked
                >
                  {list.title}
                </Checkbox>
              );
              break;
            default:
              filteredList = <Checkbox key={i}>{list.title}</Checkbox>;
          }

          return filteredList;
        })}
      </FormLayoutGroup>
    );
  }

  renderMovieInfo() {
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
          required
        />
        {this.renderLists()}
        <Button size="xl">Добавить</Button>
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
      <View popout={popout} activePanel="addMovie">
        <Panel id="addMovie">
          {this.renderPanelHeader()}
          {(isLoading && this.renderSpinner()) || this.renderMovieInfo()}
        </Panel>
      </View>
    );
  }
}

AddMovieView.propTypes = {
  go: PropTypes.func.isRequired
};

export default AddMovieView;
