'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import '../css/index.less';

class Home extends React.Component{
  constructor(){
    super();
  }

  render(){
    return <div className="title">我是首页 </div>
  }
}
 
ReactDOM.render(
  <Home />,
  document.getElementById('root')
)
