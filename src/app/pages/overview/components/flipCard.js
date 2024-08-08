import React from "react";
import {
    nextJsIcon,
  nodeJsIcon,
  pythonIcon,
  reactIcon,
  visualStudioIcon,
} from "../../../../../public/icon/icon";

import ReactCardFlip from "react-card-flip";
import Card from "./Card";

export class FlipCard extends React.Component {
  constructor() {
    super();
    this.state = {
      isFlipped: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState((prevState) => ({ isFlipped: !prevState.isFlipped }));
  }

  render() {
    return (
      <ReactCardFlip
        isFlipped={this.state.isFlipped}
        flipDirection="vertical"
        flipSpeedBackToFront={0.2}
        flipSpeedFrontToBack={0.2}
      >
        <Card
          image={this.props.image}
          title={this.props.title}
          onMouseEnter={this.handleClick}
          onMouseLeave={this.handleClick}
        />
        <Card
          onMouseEnter={this.handleClick}
          onMouseLeave={this.handleClick}
          isFront={false}
          list={this.props.list}
        />
      </ReactCardFlip>
    );
  }
}
