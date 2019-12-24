import React from 'react';
import PropTypes from 'prop-types';
const {string, number, bool} = PropTypes;

class Snowf extends React.Component {

    mounted = false;
    inited = false;
    context = null;
    flakes = [];
    canvasWidth = 0;
    canvasHeight = 0;
    img = null;

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

    init = (props=this.props) => {
        this.flakes = [];
        for (var i = 0; i < props.amount; i++) {
            this.flakes.push({
                x: random(0, this.canvasWidth),
                y: random(0, this.canvasHeight),
                r: random(props.size, props.size * 2) / 2,
                velX: 0,
                velY: random(props.speed, props.speed * 2),
                swing: random(0, 2*Math.PI),
                opacity: random(0, props.opacity)
            });
        }
        if(!this.inited){
            this.inited = true;
            this.snow();
        }
    }

    snow = () => {
        if(!this.mounted) return;
        if(!this.context || !this.context.clearRect) this.context = this.refs.canvas.getContext('2d');
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        for (var i = 0; i < this.flakes.length; i++) {
            var flake = this.flakes[i];

            if (!this.props.image) {
                this.context.beginPath();
                this.context.fillStyle = 'rgba(' + getRgb(this.props.color) + ',' + flake.opacity + ')';
                this.context.arc(flake.x, flake.y, flake.r, 2*Math.PI, false);
                this.context.fill();
                this.context.closePath();
            }
            else {
                this.context.drawImage(this.img, flake.x - flake.r, flake.y - flake.r, 2 * flake.r, 2 * flake.r);
            }

            flake.velX = Math.abs(flake.velX) < Math.abs(this.props.wind) ? flake.velX + this.props.wind / 20 : this.props.wind;
            flake.y = flake.y + flake.velY * 0.5;
            flake.x = flake.x + (this.props.swing ? 0.4 * Math.cos(flake.swing += 0.03) * flake.opacity * this.props.swing : 0) + flake.velX * 0.5;
            if (flake.x > this.canvasWidth + flake.r || flake.x < -flake.r || flake.y > this.canvasHeight + flake.r || flake.y < -flake.r) {
                this.reset(flake);
            }
        }
        if(this.mounted) requestAnimationFrame(this.snow);
    }

    reset = (flake) => {
        var prevR = flake.r;
        flake.r = random(this.props.size, this.props.size * 2) / 2;
        if (flake.x > this.canvasWidth + prevR) {
            flake.x = -flake.r;
            flake.y = random(0, this.canvasHeight);
        }
        else if (flake.x < -prevR) {
            flake.x = this.canvasWidth + flake.r;
            flake.y = random(0, this.canvasHeight);
        }
        else {
            flake.x = random(0, this.canvasWidth);
            flake.y = -flake.r;
        }
        flake.velX = 0;
        flake.velY = random(this.props.speed, this.props.speed * 2);
        flake.swing = random(0, 2*Math.PI);
        flake.opacity = random(0, this.props.opacity);
    }

    componentDidMount() {

        this.mounted = true;
        this.context = this.refs.canvas.getContext('2d');
        this.canvasHeight = this.refs.canvas.offsetHeight;
        this.canvasWidth = this.refs.canvas.offsetWidth;

        this.refs.canvas.height = this.canvasHeight;
        this.refs.canvas.width = this.canvasWidth;

        this.update();
    }

    componentWillReceiveProps(props){
        if(JSON.stringify(this.props) === JSON.stringify(props)) return;
        this.update(props);
    }

    update(props = this.props){
        if(props.image){
            this.img = new Image();
            this.img.onload = () => this.init(props);
            this.img.src = props.image;
        } else {
            this.init(props);
        }

        window.removeEventListener('resize', this.handleResize);
        if (this.props.resize) {
            window.addEventListener('resize', this.handleResize);
            window.setTimeout(this.handleResize, 250);
        }
    }

    handleResize = () => {
        if(!this.inited) return;
        var H0 = this.refs.canvas.height,
        W0 = this.refs.canvas.width,
        H1 = this.refs.canvas.offsetHeight,
        W1 = this.refs.canvas.offsetWidth;

        this.refs.canvas.height = this.canvasHeight = H1;
        this.refs.canvas.width = this.canvasWidth = W1;
        for (var i = 0; i < this.flakes.length; i++) {
            var flake = this.flakes[i];
            flake.x = flake.x / W0 * W1;
            flake.y = flake.y / H0 * H1;
        }
    }

    componentWillUnmount(){
        this.mounted = false;
        if (this.props.resize) {
            window.removeEventListener('resize', this.handleResize);
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
