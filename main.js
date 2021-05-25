import Vue from 'vue'
import App from './App'
import store_instance from './store'

import cuCustom from './colorui/components/cu-custom.vue'
import drawQrcode from './utils/weapp.qrcode.js'
Vue.component('cu-custom', cuCustom)


Vue.config.productionTip = false
Vue.prototype.$drawQrcode = drawQrcode
App.mpType = 'app'
Vue.prototype.getDateDiff = (dateTime) => {
	let dateTimeStamp = new Date(dateTime).valueOf()
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if (diffValue < 0) {
		return;
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	let result
	if (monthC >= 1) {
		result = "" + parseInt(monthC) + "月前";
	} else if (weekC >= 1) {
		result = "" + parseInt(weekC) + "周前";
	} else if (dayC >= 1) {
		result = "" + parseInt(dayC) + "天前";
	} else if (hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前";
	} else if (minC >= 1) {
		result = "" + parseInt(minC) + "分钟前";
	} else
		result = "刚刚";
	return result;
}

const app = new Vue({
	...App,
	store: store_instance
})
app.$mount()
let ori_request = uni.request
uni.request = (params) => {
	uni.showLoading({
		title: '加载中',
		mask: true
	})
	let ori_success = params.success
	params.success = (res) => {
		uni.hideLoading()
		if (res.data.status === 405 || res.data.status === 404) {
			uni.clearStorageSync()
			uni.redirectTo({
				url: './login'
			})
		}
		ori_success(res)
	}
	let api_name = params.url.split('/')[params.url.split('/').length - 1]
	if (/^[A-Z]+$/.test(api_name)) {
		ori_request(params)
	} else {
		ori_request({
			...params,
			header: {
				authorization: uni.getStorageSync('token')
			}
		})
	}
}

uni.request_sync = (params) => new Promise((resolve, reject) => {
	uni.showLoading({
		title: '加载中',
		mask: true
	})
	let ori_success = params.success
	params.success = (res) => {
		uni.hideLoading()
		if (res.data.status === 405 || res.data.status === 404) {
			uni.clearStorageSync()
			uni.redirectTo({
				url: './login'
			})
		}
		if (ori_success) ori_success(res)
		resolve(res)
	}
	let api_name = params.url.split('/')[params.url.split('/').length - 1]
	if (/^[A-Z]+$/.test(api_name)) {
		ori_request(params)
	} else {
		ori_request({
			...params,
			header: {
				authorization: uni.getStorageSync('token')
			}
		})
	}
})
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
				.length)));
		}
	}
	return fmt;
}
