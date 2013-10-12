var WFP = window.WFP = window.WFP || {};

WFP.VERSION = '0.2.0';

if (WFP.bookmarklet && WFP.bookmarklet < 1) {
	console.log('Please update your bookmarklet.');
}

$.easing.easeOutCubic = function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
};