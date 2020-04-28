import React, { Fragment } from 'react';

import Header from '../../../components/common/Header/Header'
import Footer from '../../../components/common/Footer/Footer'
import AppRouter from '../../../routes/Router';

import './App.scss';

const App = () => {

  return (
    <Fragment>
      <Header />
      <AppRouter />
      <Footer />
    </Fragment>
  );
}

export default App;
