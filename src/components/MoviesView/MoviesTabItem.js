import React from "react";
import PropTypes from "prop-types";
import { TabsItem } from "@vkontakte/vkui";

const MoviesTabItem = ({ id, list, selected, onClick }) => (
  <TabsItem id={id} selected={selected} onClick={onClick}>
    {list.title}
  </TabsItem>
);

MoviesTabItem.propTypes = {
  id: PropTypes.number.isRequired,
  list: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default MoviesTabItem;
