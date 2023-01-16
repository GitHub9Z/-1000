import Vue from 'vue'
import App from './App'
import store_instance from './store'

import cuCustom from './colorui/components/cu-custom.vue'
import drawQrcode from './utils/weapp.qrcode.js'
import areaJson from './utils/area.js'
import md5 from './utils/md5.js'
Vue.component('cu-custom', cuCustom)


Vue.config.productionTip = false
Vue.prototype.$drawQrcode = drawQrcode
Vue.prototype.$md5 = md5
Vue.prototype.$appId = 'wxed3e74d2adf64438'
Vue.prototype.$mchKey = 'sdwa87d2rf23hg8t7r13gr712g41278g'

App.mpType = 'app'
Date.prototype.format = function formatDate(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt
}

Vue.prototype.randomString = len => {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	var maxPos = $chars.length;
	var pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

Vue.prototype.getLocation = index => {
	console.log(index)
	let [province_index, city_index, area_index] = index
	let province = areaJson[province_index]
	if (!province) return ''
	let province_name = province.name
	let city = province.city[city_index]
	if (!city) return province_name
	let city_name = city.name
	let area = city.area[area_index]
	if (!area) return `${province_name} ${city_name}`
	let area_name = area
	return `${province_name} ${city_name} ${area_name}`
}


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
		if (res.data.status === 301) {
			uni.showModal({
				title: '提示',
				content: res.data.message,
				cancelText: "取消", // 取消按钮的文字  
				confirmText: "确认", // 确认按钮文字  
				showCancel: true, // 是否显示取消按钮，默认为 true
				confirmColor: '#f55850',
				cancelColor: '#39B54A',
				success: (r) => {
					if (r.confirm) {
					} else {}
				}
			})
		}
		if (res.data.status === 333) {
			uni.showModal({
				title: '提示',
				content: res.data.message,
				cancelText: "取消", // 取消按钮的文字  
				confirmText: "确认", // 确认按钮文字  
				showCancel: true, // 是否显示取消按钮，默认为 true
				confirmColor: '#f55850',
				cancelColor: '#39B54A',
				success: (r) => {
					if (r.confirm) {
						uni.navigateTo({
							url: res.data.url
						})
					} else {}
				}
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
		if (res.data.status === 301) {
			uni.showModal({
				title: '提示',
				content: res.data.message,
				cancelText: "取消", // 取消按钮的文字  
				confirmText: "确认", // 确认按钮文字  
				showCancel: true, // 是否显示取消按钮，默认为 true
				confirmColor: '#f55850',
				cancelColor: '#39B54A',
				success: (r) => {
					if (r.confirm) {
					} else {}
				}
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

const app = new Vue({
	...App,
	store: store_instance
})
app.$mount()