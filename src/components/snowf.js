import React from 'react';

const {string, number, bool} = React.PropTypes;

class Snowf extends React.Component {

	static propTypes = {
		amount: number,
		size: number,
		speed: number,
		wind: number,
		color: string,
		opacity: number,
		swing: number,
		image: string,
		zIndex: number,
		resize: bool
	};

	static defaultProps = {
		amount: 50,
		size: 5,
		speed: 1.5,
		wind: 0,
		color: '#fff',
		opacity: 0.8,
		swing: 1,
		image: null,
		zIndex: null,
		resize: true
	};

	componentDidMount() {

		const PROPS = this.props;
		const CANVAS = this.refs.canvas;
		const CONTEXT = CANVAS.getContext('2d');
		var canvasHeight = CANVAS.offsetHeight;
		var canvasWidth = CANVAS.offsetWidth;
		var flakes = [];

		CANVAS.height = canvasHeight;
		CANVAS.width = canvasWidth;

		function init() {
			for (var i = 0; i < PROPS.amount; i++) {
				flakes.push({
					x: random(0, canvasWidth),
					y: random(0, canvasHeight),
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
			CONTEXT.clearRect(0, 0, canvasWidth, canvasHeight);
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
				flake.x = flake.x + (PROPS.swing ? 0.4 * Math.cos(flake.swing += 0.03) * flake.opacity * PROPS.swing : 0) + flake.velX * 0.5;
				if (flake.x > canvasWidth + flake.r || flake.x < -flake.r || flake.y > canvasHeight + flake.r || flake.y < -flake.r) {
					reset(flake);
				}
			}
			requestAnimationFrame(snow);
		}

		function reset(flake) {
			var prevR = flake.r;
			flake.r = random(PROPS.size, PROPS.size * 2) / 2;
			if (flake.x > canvasWidth + prevR) {
				flake.x = -flake.r;
				flake.y = random(0, canvasHeight);
			}
			else if (flake.x < -prevR) {
				flake.x = canvasWidth + flake.r;
				flake.y = random(0, canvasHeight);
			}
			else {
				flake.x = random(0, canvasWidth);
				flake.y = -flake.r;
			}
			flake.velX = 0;
			flake.velY = random(PROPS.speed, PROPS.speed * 2);
			flake.swing = random(0, 2*Math.PI);
			flake.opacity = random(0, PROPS.opacity);
		}

		init();

		if (PROPS.resize) {
			window.addEventListener('resize', function() {
				var H0 = CANVAS.height,
						W0 = CANVAS.width,
						H1 = CANVAS.offsetHeight,
						W1 = CANVAS.offsetWidth;

				CANVAS.height = canvasHeight = H1;
				CANVAS.width = canvasWidth = W1;
				for (var i = 0; i < PROPS.amount; i++) {
					var flake = flakes[i];
					flake.x = flake.x / W0 * W1;
					flake.y = flake.y / H0 * H1;
				}
			});
		}
	}

	render() {
		
		const STYLE = {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			pointerEvents: 'none',
			zIndex: this.props.zIndex || 'auto'
		};

		return (
			<canvas
				className="snowf-canvas"
				ref="canvas"
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