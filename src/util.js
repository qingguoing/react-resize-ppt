/**
 * Created by qingguo.xu on 12/05/2017.
 */
import { config } from './const';
const getStrEndOfPX = (str, num) => {
    const origin = parseFloat(str, 10);
    return `${origin + num}px`;
};

export const getAngle = (x1, y1, x2, y2) => {
    if (x1 === x2 && y1 === y2) return 0;
    if (x1 === x2) {
        return y2 > y1 ? 180 : 0;
    }
    const deltaZ = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    const angle = Math.round(Math.asin((x2 - x1) / deltaZ) * 180 / Math.PI);
    if (y2 > y1) {
        return x2 > x1 ? 180 - angle : Math.abs(angle) + 180;
    }
    return angle > 0 ? angle : 360 + angle;
};

export const getPointerAngleClass = angle => {
    // 每个指针左右各22.5 共 45 度变一次指针的指向
    const val = parseInt((parseInt(angle) + 22.5) / 45);
    return `angle-${val % 8 * 45}`;
};

export const getStyle = (() => {
    let _relativeCenterDistanceX = 0;
    let _relativeCenterDistanceY = 0;
    let _curAngle = 0;
    return (style = {}, resizeInfo = {}) => {
        let { distanceX, distanceY, angle, key } = resizeInfo;
        let { width, height, transform, top, left } = style;
        width = parseFloat(width);
        height = parseFloat(height);
        top = parseFloat(top);
        left = parseFloat(left);
        let curAnglePI = _curAngle * Math.PI / 180;
        let deltaWidth = 0;
        let deltaHeight = 0;
        switch (key) {
            case config.rotate:
                const anglePI = angle * Math.PI / 180;
                const centerAnglePI = Math.atan(height / width);
                const topCenterDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                const relativeCenterDistanceX = topCenterDistance * Math.cos(curAnglePI + centerAnglePI) - topCenterDistance * Math.cos(anglePI + centerAnglePI);
                const relativeCenterDistanceY = topCenterDistance * Math.sin(curAnglePI + centerAnglePI) - topCenterDistance * Math.sin(anglePI + centerAnglePI);
                left = left + relativeCenterDistanceX - _relativeCenterDistanceX;
                top = top + relativeCenterDistanceY - _relativeCenterDistanceY;
                _relativeCenterDistanceX = relativeCenterDistanceX;
                _relativeCenterDistanceY = relativeCenterDistanceY;
                return Object.assign({}, style, {
                    transform: `rotate(${angle}deg)`,
                    left, top
                });
                break;
            case config.tl:
                _curAngle = (/rotate\((\d+)deg\)/g.exec(transform))[1];
                curAnglePI = _curAngle * Math.PI / 180;
                _relativeCenterDistanceX = _relativeCenterDistanceY = 0;
                deltaHeight = distanceX * Math.cos(curAnglePI - Math.PI / 2) + distanceY * Math.sin(curAnglePI - Math.PI / 2);
                deltaWidth = distanceX * Math.cos(curAnglePI + Math.PI) + distanceY * Math.sin(curAnglePI + Math.PI);
                width = getStrEndOfPX(width, deltaWidth);
                height = getStrEndOfPX(height, deltaHeight);
                top = getStrEndOfPX(top, -deltaWidth * Math.sin(curAnglePI) -deltaHeight * Math.cos(curAnglePI));
                left = getStrEndOfPX(left, deltaHeight * Math.sin(curAnglePI) - deltaWidth * Math.cos(curAnglePI));
                if ((parseFloat(width) <= 1 && deltaWidth < 0) || (parseFloat(height) <= 1 && deltaHeight < 0)) {
                    return Object.assign({}, style);
                }
                return Object.assign({}, style, {
                    top, left, width, height,
                });
            case config.tm:
                _curAngle = (/rotate\((\d+)deg\)/g.exec(transform))[1];
                curAnglePI = _curAngle * Math.PI / 180;
                _relativeCenterDistanceX = _relativeCenterDistanceY = 0;
                deltaHeight = distanceX * Math.cos(curAnglePI - Math.PI / 2) + distanceY * Math.sin(curAnglePI - Math.PI / 2);
                height = getStrEndOfPX(height, deltaHeight);
                left = getStrEndOfPX(left, deltaHeight * Math.sin(curAnglePI));
                top = getStrEndOfPX(top, -deltaHeight * Math.cos(curAnglePI));
                if (parseFloat(height) <= 1 && deltaHeight < 0) {
                    return Object.assign({}, style);
                }
                return Object.assign({}, style, {
                    height, top, left
                });
            case config.tr:
                _curAngle = (/rotate\((\d+)deg\)/g.exec(transform))[1];
                curAnglePI = _curAngle * Math.PI / 180;
                _relativeCenterDistanceX = _relativeCenterDistanceY = 0;
                deltaWidth = Math.cos(curAnglePI) * distanceX + Math.sin(curAnglePI) * distanceY;
                deltaHeight = distanceX * Math.cos(curAnglePI - Math.PI / 2) + distanceY * Math.sin(curAnglePI - Math.PI / 2);
                height = getStrEndOfPX(height, deltaHeight);
                width = getStrEndOfPX(width, deltaWidth);
                left = getStrEndOfPX(left, deltaHeight * Math.sin(curAnglePI));
                top = getStrEndOfPX(top, -deltaHeight * Math.cos(curAnglePI));
                if ((parseFloat(width) <= 1 && deltaWidth < 0) || (parseFloat(height) <= 1 && deltaHeight < 0)) {
                    return Object.assign({}, style);
                }
                return Object.assign({}, style, {
                    top, left, height, width
                });
            case config.ml:
                _curAngle = parseFloat((/rotate\((\d+)deg\)/g.exec(transform))[1]);
                curAnglePI = _curAngle * Math.PI / 180;
                _relativeCenterDistanceX = _relativeCenterDistanceY = 0;
                deltaWidth = distanceX * Math.cos(curAnglePI + Math.PI) + distanceY * Math.sin(curAnglePI + Math.PI);
                width = getStrEndOfPX(width, deltaWidth);
                left = getStrEndOfPX(left, -deltaWidth * Math.cos(curAnglePI));
                top = getStrEndOfPX(top, -deltaWidth * Math.sin(curAnglePI));
                if (parseFloat(width) <= 1 && deltaWidth < 0) {
                    return Object.assign({}, style);
                }
                return Object.assign({}, style, {
                    width, top, left
                });
            case config.mr:
                _curAngle = parseFloat((/rotate\((\d+)deg\)/g.exec(transform))[1]);
                curAnglePI = _curAngle * Math.PI / 180;
                _relativeCenterDistanceX = _relativeCenterDistanceY = 0;
                deltaWidth = Math.cos(curAnglePI) * distanceX + Math.sin(curAnglePI) * distanceY;
                width = getStrEndOfPX(width, deltaWidth);
                if (parseFloat(width) < 1) {
                    return Object.assign({}, style, {
                        width: '1px'
                    });
                }
                return Object.assign({}, style, {
                    width
                });
            case config.bl:
                _curAngle = (/rotate\((\d+)deg\)/g.exec(transform))[1];
                curAnglePI = _curAngle * Math.PI / 180;
                _relativeCenterDistanceX = _relativeCenterDistanceY = 0;
                deltaWidth = distanceX * Math.cos(curAnglePI + Math.PI) + distanceY * Math.sin(curAnglePI + Math.PI);
                deltaHeight = distanceX * Math.cos(curAnglePI + Math.PI / 2) + distanceY * Math.sin(curAnglePI + Math.PI / 2);
                width = getStrEndOfPX(width, deltaWidth);
                height = getStrEndOfPX(height, deltaHeight);
                left = getStrEndOfPX(left, -deltaWidth * Math.cos(curAnglePI));
                top = getStrEndOfPX(top, -deltaWidth * Math.sin(curAnglePI));
                if ((parseFloat(width) <= 1 && deltaWidth < 1) || (parseFloat(height) <= 1 && deltaHeight < 1)) {
                    return Object.assign({}, style);
                }
                return Object.assign({}, style, {
                    top, left, width, height
                });
            case config.bm:
                _curAngle = (/rotate\((\d+)deg\)/g.exec(transform))[1];
                curAnglePI = _curAngle * Math.PI / 180;
                _relativeCenterDistanceX = _relativeCenterDistanceY = 0;
                deltaHeight = distanceX * Math.cos(curAnglePI + Math.PI / 2) + distanceY * Math.sin(curAnglePI + Math.PI / 2);
                height = getStrEndOfPX(height, deltaHeight);
                if (parseFloat(height) < 1) {
                    return Object.assign({}, style, {
                        height: '1px'
                    });
                }
                return Object.assign({}, style, {
                    height
                });
            case config.br:
                _curAngle = (/rotate\((\d+)deg\)/g.exec(transform))[1];
                curAnglePI = _curAngle * Math.PI / 180;
                _relativeCenterDistanceX = _relativeCenterDistanceY = 0;
                deltaWidth = distanceX * Math.cos(curAnglePI) + distanceY * Math.sin(curAnglePI);
                deltaHeight = distanceX * Math.cos(curAnglePI + Math.PI / 2) + distanceY * Math.sin(curAnglePI + Math.PI / 2);
                width = getStrEndOfPX(width, deltaWidth);
                height = getStrEndOfPX(height, deltaHeight);
                if ((parseFloat(width) <= 1 && deltaWidth < 1) || (parseFloat(height) <= 1 && deltaHeight < 0)) {
                    return Object.assign({}, style);
                }
                return Object.assign({}, style, {
                    width, height
                });
            default:
                throw new Error('the unknown key of Resize Component');
        }
    }

})();