const time_ago = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');

time_ago.addDefaultLocale(en);
const timeAgo = new time_ago('en-US');

module.exports=timeAgo;