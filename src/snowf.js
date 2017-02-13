import React from 'react';

const {string, number, bool} = React.PropTypes;
const STYLE = {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	pointerEvents: 'none'
};

class Snowf extends React.Component {

	static propTypes = {
		amount: number,
		size: number,
		speed: number,
		wind: number,
		color: string,
		opacity: number,
		swing: bool,
		swingOffset: number,
		image: string,
		zIndex: number
	};

	static defaultProps = {
		amount: 50,
		size: 5,
		speed: 1.5,
		wind: 0,
		color: '#fff',
		opacity: 0.8,
		swing: true,
		swingOffset: 1,
		image: '',
		zIndex: 0
	};

	componentDidMount() {

		const PROPS = this.props;
		const HEIGHT = this.refs.snowf.offsetHeight;
		const WIDTH = this.refs.snowf.offsetWidth;
		const CONTEXT = this.refs.snowf.getContext('2d');
		var flakes = [];

		this.refs.snowf.height = HEIGHT;
		this.refs.snowf.width = WIDTH;

		function init() {
			for (var i = 0; i < PROPS.amount; i++) {
				flakes.push({
					x: random(0, WIDTH),
					y: random(0, HEIGHT),
					r: random(PROPS.size, PROPS.size * 2) / 2,
					velX: 0,
					velY: random(PROPS.speed, PROPS.speed * 2),
					swing: random(0, 2*Math.PI),
					opacity: random(0, PROPS.opacity)
				});
			}
			snow();
		}

		function snow() {
			var img;
			CONTEXT.clearRect(0, 0, WIDTH, HEIGHT);
			for (var i = 0; i < PROPS.amount; i++) {
				var flake = flakes[i];

				if (!PROPS.image) {
					CONTEXT.beginPath();
					CONTEXT.fillStyle = 'rgba(' + getRgb(PROPS.color) + ',' + flake.opacity + ')';
					CONTEXT.arc(flake.x, flake.y, flake.r, 2*Math.PI, false);
					CONTEXT.fill();
					CONTEXT.closePath();
				}
				else {
					if (!img) {
						img = new Image();
						img.src = PROPS.image;
					}
					CONTEXT.drawImage(img, flake.x - flake.r, flake.y - flake.r, 2 * flake.r, 2 * flake.r);
				}

				flake.velX = Math.abs(flake.velX) < Math.abs(PROPS.wind) ? flake.velX + PROPS.wind / 20 : PROPS.wind;
				flake.y = flake.y + flake.velY * 0.5;
				flake.x = flake.x + (PROPS.swing ? 0.4 * Math.cos(flake.swing += 0.03) * flake.opacity * PROPS.swingOffset : 0) + flake.velX * 0.5;
				if (flake.x > WIDTH + flake.r || flake.x < -flake.r || flake.y > HEIGHT + flake.r || flake.y < -flake.r) {
					reset(flake);
				}
			}
			requestAnimationFrame(snow);
		}

		function reset(flake) {
			var prevR = flake.r;
			flake.r = random(PROPS.size, PROPS.size * 2) / 2;
			if (flake.x > WIDTH + prevR) {
				flake.x = -flake.r;
				flake.y = random(0, HEIGHT);
			}
			else if (flake.x < -prevR) {
				flake.x = WIDTH + flake.r;
				flake.y = random(0, HEIGHT);
			}
			else {
				flake.x = random(0, WIDTH);
				flake.y = -flake.r;
			}
			flake.velX = 0;
			flake.velY = random(PROPS.speed, PROPS.speed * 2);
			flake.swing = random(0, 2*Math.PI);
			flake.opacity = random(0, PROPS.opacity);
		}

		init();
	}

	render() {
		return (
			<canvas
				className="snowf-canvas"
				ref="snowf"
				style={ STYLE }
			>
			</canvas>
		);
	}
}

function random(min, max) {
	var delta = max - min;
	return max === min ? min : Math.random() * delta + min;
}

function getRgb(str) {
	var rgb = '';
	if (str.indexOf('#') === 0) {
		rgb = str.length === 4 ? str.substr(1).split('').map(function(n) {return parseInt(n.concat(n), 16);}).join(',') :
					str.length === 7 ? [str.substr(1,2), str.substr(3,2), str.substr(5,2)].map(function(n) {return parseInt(n, 16);}).join(',') :
					'255,255,255';
	}
	else if (str.indexOf('rgb(') === 0) {
		rgb = str.substring(4, str.length - 1);
	}
	else {
		rgb = '255,255,255';
	}
	return rgb;
}

export default Snowf;