import React, { Fragment } from 'react';

import Footer from '../../../components/common/Footer/Footer'
import AppRouter from '../../../routes/Router';

import './App.scss';

const App = () => {

  return (
    <Fragment>
      <AppRouter />
      <Footer />
    </Fragment>
  );
}

export default App;
