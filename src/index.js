/**
 * Created by qingguo.xu on 12/05/2017.
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getAngle, getStyle, getPointerAngleClass } from './util.js';
import { config } from './const.js';
import './style.scss';

let self = null;
class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 'absolute',
            width: 100,
            height: 100,
            border: '1px solid lightBlue',
            backgroundColor: '#f5f5f5',
            transform: 'rotate(0deg)',
            transformOrigin: '0 0 0',
            left: 200,
            top: 200,
        };
        this.ele = null;
        this.hasMouseDown = false;
        this.mouseDownPosition = {};
        this.key = null;
        self = this;
    }

    mouseDown(e) {
        this.hasMouseDown = true;
        const { clientX, clientY } = e;
        this.mouseDownPosition = {
            x: clientX,
            y: clientY,
        };
        const { top, height, left, width } = this.ele.getBoundingClientRect();
        this.clientRectCenterPosition = {
            centerX: parseFloat(left) + parseFloat(width) / 2,
            centerY: parseFloat(top) + parseFloat(height) / 2,
        };
        this.key = e.target.dataset.key;
        self = this;
        const ownerDocument = this.ele.ownerDocument;
        ownerDocument.addEventListener('mousemove', this.handleMove, true);
        ownerDocument.addEventListener('mouseup', this.handleUp, true);
        e.stopPropagation();
        e.preventDefault();
    }

    handleMove(e) {
        self.mouseMove.call(self, e);
    }

    handleUp(e) {
        self.mouseUp.call(self, e);
    }

    mouseMove(e) {
        if (!this.hasMouseDown) return;
        const { clientX, clientY } = e;
        const { x, y } = this.mouseDownPosition;
        const { centerX, centerY } = this.clientRectCenterPosition;
        this.mouseDownPosition = {
            x: clientX,
            y: clientY,
        };

        this.setState(getStyle(this.state, {
            distanceX: clientX - x,
            distanceY: clientY - y,
            angle: getAngle(centerX, centerY, clientX, clientY),
            key: this.key,
        }));
        e.stopPropagation();
        e.preventDefault();
    }

    mouseUp(e) {
        this.hasMouseDown = false;
        e.currentTarget.removeEventListener('mousemove', this.handleMove, true);
        e.currentTarget.removeEventListener('mouseup', this.mouseUp, true);
        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        const { transform } = this.state;
        const curAngle = (/rotate\((\d+)deg\)/g.exec(transform))[1];
        const angleClass = getPointerAngleClass(curAngle);
        return (
            <div
                style={this.state}
                ref={ref => this.ele = ref}
            >
                <div
                    onMouseDown={e => this.mouseDown(e)}
                >
                    {Object.keys(config).map((key, i) => {
                        return (
                            <span className={'pointer ' + angleClass} data-key={config[key]} key={i}></span>
                        );
                    })}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Test />, document.querySelector('.content'));