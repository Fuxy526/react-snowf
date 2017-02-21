import React from 'react';
import ReactDom from 'react-dom';

import Snowf from './components/snowf.js';

class App extends React.Component {
	render() {
		return (
			<Snowf />
		);
	}
}

ReactDom.render(<App/>, document.getElementById('app'));