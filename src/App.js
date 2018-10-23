import React, {Component} from 'react';
import {BrowserRouter} from "react-router-dom";


import {BaseLayout} from "./components";
import Routes from "./routes";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <BaseLayout>
          <Routes />
        </BaseLayout>
      </BrowserRouter>
    );
  }
}

export default App;
