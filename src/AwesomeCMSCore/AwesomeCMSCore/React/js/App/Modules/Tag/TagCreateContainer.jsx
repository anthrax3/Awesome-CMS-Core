import React, { Component } from "react";
import { render } from "react-dom";
import toastr from "toastr";

import { Get, PostWithSpinner } from "../../Helper/ajax";
import { isDomExist } from "../../Helper/util";
import TagCreate from "./TagCreate.jsx";
import Spinner from "../../Common/Spinner.jsx";
import env from "./../../Helper/envConfig";
import statusCode from "./../../Helper/StatusCode";

class TagCreateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      options: [],
      value: []
    };
  }

  componentDidMount() {
    Get(env.tag).then(res => {
      this.setState({
        value: res.data.tagOptions ? JSON.parse(res.data.tagOptions) : []
      });
    });
  }

  handleOnChange = value => {
    this.setState({ value });
  };

  handleSubmit = e => {
    e.preventDefault();

    const tagData = JSON.stringify(this.state.value.map(x => x.value));
    const tagOptions = JSON.stringify(this.state.value);

    const tagDataVm = {
      tagData,
      tagOptions
    };

    PostWithSpinner.call(this, env.tagCreate, tagDataVm)
      .then(res => {
        if (res.status === statusCode.Success) toastr.success("Create success");
      })
      .catch(() => {
        toastr.error("Something went wrong.Please try again");
      });
  };

  renderButton() {
    const isDataNotValid = this.state.value.length === 0;

    if (this.state.loading) {
      return <Spinner />;
    } else {
      return (
        <button
          type="submit"
          className="btn btn-primary"
          onClick={this.handleSubmit}
          disabled={isDataNotValid}
        >
          Save
        </button>
      );
    }
  }

  render() {
    const { options, value } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col col-md-12" id="tagContainer">
            <div className="card">
              <div className="card-header">
                Create tag for your post (Simply type in what you want)
              </div>
              <div className="card-body">
                <TagCreate
                  id="tagCreate"
                  {...options}
                  value={value}
                  handleOnChange={this.handleOnChange}
                />
                <br />
                {this.renderButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

if (isDomExist("tagCreationSelect")) {
  render(<TagCreateContainer />, document.getElementById("tagCreationSelect"));
}

TagCreateContainer.propTypes = {};
