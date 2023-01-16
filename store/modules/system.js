
import Vue from 'vue'
const store = {
    state: {
        'system_info': {
		},
		'global_config': {
			//https://venus-image.oss-cn-beijing.aliyuncs.com/16226056905928i2CSKebZNtMX3Qx
			mode: 'common', // common 公域模式 - private 私域模式 - single 单店模式
			app_logo: '/static/logo.png',
			app_name: '多乐易签',
			region_id: null,
			admin_id: 'bJCDXyEt',
			admin_info: null
		}
    },
    getters: {
        'get_system_info': state => {
            return state.system_info
        },
		'get_global_config': state => {
		    return state.global_config
		}
    },
    mutations: {
        'set_system_info': (state, system_info) => {
            state.system_info = system_info
        },
		'set_global_config_admin_info': (state, admin_info) => {
			if (!admin_info || !admin_info.user_name) return
			state.global_config.admin_info = admin_info
			state.global_config.app_logo = admin_info.avatar_url
			state.global_config.app_name = admin_info.user_name
			state.global_config.region_id = admin_info.region_id
		}
    },
    actions: {
		'GET_ADMIN_INFO': async ({
			commit,
			state
		}) => {
			console.log('fuck', state.global_config)
			if (state.global_config.mode === 'single' && state.global_config.admin_id) await uni.request_sync({
				url: 'https://www.imgker.com/venus/user/get_user_info', //仅为示例，并非真实接口地址。
				data: {
					wanna_user_id: state.global_config.admin_id
				},
				header: {
					'custom-header': 'hello' //自定义请求头信息
				},
				success: (res) => {
					commit('set_global_config_admin_info', res.data)
				}
			})
		},
        'GET_SYSTEM_INFO': async ({ commit }, phone) => {
			let is_normal = 1 || (await uni.request_sync({
				url: 'https://www.imgker.com/venus/system/get_system_info', //仅为示例，并非真实接口地址。
				data: {
				},
				header: {
					'custom-header': 'hello' //自定义请求头信息
				}
			})).data
			console.log(is_normal)
			uni.getSystemInfo({
				success: function(e) {
					console.log('nmsl', e)
					// #ifndef MP
					let status_bar = e.statusBarHeight;
					let custom_bar;
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight || 0 + 50;
						custom_bar = Vue.prototype.CustomBar
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight || 0 + 45;
						custom_bar = Vue.prototype.CustomBar
					};
					// #endif

					// #ifdef MP-WEIXIN
					let status_bar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					let custom_bar = custom.bottom + custom.top - e.statusBarHeight;
					Vue.prototype.StatusBar = status_bar;
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom_bar;
					// #endif		

					// #ifdef MP-ALIPAY
					let status_bar = e.statusBarHeight || 0;
					let custom_bar = e.statusBarHeight || 0 + e.titleBarHeight || 0;
					Vue.prototype.StatusBar = status_bar;
					Vue.prototype.CustomBar = custom_bar;
					// #endif
					commit('set_system_info', { status_bar, custom_bar, normal: is_normal })
					console.log('nmbs', { status_bar, custom_bar })
				}
			})
        }
    }
}
export default store