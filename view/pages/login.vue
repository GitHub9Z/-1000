<template>
	<view class="content" v-if="get_system_info.normal">
		<!-- 		<cu-custom class="content-title" bgColor="text-white bg-blue" :isBack="true">
		</cu-custom> -->
		<view class="content-back bg-red">
			<image class="content-back-logo" :src="get_global_config.app_logo" mode="aspectFill"></image>
		</view>
		<view class="content-main">
			<view class="content-main-title">短信快捷登录</view>
			<view class="cu-form-group">
				<view class="title"><text class="lg text-gray cuIcon-mobilefill"></text></view>
				<input placeholder="手机号码" name="input" type="number" v-model="page_status.input_phone"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-red'>
						+86
					</view>
					<view class="cu-tag line-red">
						中国大陆
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title"><text class="lg text-gray cuIcon-mail"></text></view>
				<input placeholder="验证码" name="input" type="number" v-model="page_status.input_sms"></input>
				<button class='cu-btn bg-red' v-if="page_status.status_pool[page_status.input_phone]" disabled>{{page_status.status_pool[page_status.input_phone]}}秒后重新发送</button>
				<button class='cu-btn bg-red' v-else :disabled="!isSmsAbled" @getuserinfo="hanldeSmsClick" open-type="getUserInfo">验证码</button>
			</view>
			<view class="content-main-btn"><button class="cu-btn bg-red margin-tb-sm lg round" style="width: 100%;" :disabled="!isLoginAbled"
				 @click="handleLoginClick">立即登录/注册</button></view>
			<view class="content-main-tip"><text class="lg text-gray cuIcon-questionfill" style="margin-right: 3px;"></text>请您登录之后才能享受{{get_global_config.app_name}}的私人一对一服务哦。</view>
		</view>
		<image src="https://venus-image.oss-cn-beijing.aliyuncs.com/client_step_1.png" v-show="false" mode="widthFix" />
		<image src="https://venus-image.oss-cn-beijing.aliyuncs.com/client_step_2.png" v-show="false" mode="widthFix" />
		<image src="https://venus-image.oss-cn-beijing.aliyuncs.com/client_step_3.png" v-show="false" mode="widthFix" />
		<image src="https://venus-image.oss-cn-beijing.aliyuncs.com/client_step_4.png" v-show="false" mode="widthFix" />
	</view>
	<view v-else>
		<image style="width: 100vw" mode="widthFix" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01f0aa5632bd736ac7259e0fd710d4.jpg%401280w_1l_2o_100sh.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626514551&t=14341f62bcbb3a98a3b03dade4cbafbe"></image>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				page_status: {
					input_phone: '',
					input_sms: '',
					status_pool: {}
				}
			}
		},
		async onLoad() {
			if (uni.getStorageSync('token')) {
				uni.redirectTo({
					url: './home'
				})
			}
		},
		async onShow() {
			this.preLoad()
			if (uni.getStorageSync('token')) {
				uni.redirectTo({
					url: './home'
				})
			}
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info', 'get_global_config']),
			isLoginAbled() {
				return (/^1[3|5|7|8][0-9]\d{8}$/.test(this.page_status.input_phone)) && this.page_status.input_sms.length === 4
			},
			isSmsAbled() {
				return /^1[3|5|7|8][0-9]\d{8}$/.test(this.page_status.input_phone)
			}
		},
		methods: {
			...mapActions(['GET_ADMIN_INFO']),
			preLoad() {
				// let img = new Image()
				// img.src = "https://venus-image.oss-cn-beijing.aliyuncs.com/client_step_1.png"
				// img = new Image()
				// img.src = "https://venus-image.oss-cn-beijing.aliyuncs.com/client_step_2.png"
				// img = new Image()
				// img.src = "https://venus-image.oss-cn-beijing.aliyuncs.com/client_step_3.png"
				// img = new Image()
				// img.src = "https://venus-image.oss-cn-beijing.aliyuncs.com/client_step_4.png"
			},
			async hanldeSmsClick(e) {
				const userInfo = e.detail.userInfo
				console.log(userInfo)
				uni.login({
					success: res => {
						var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + this.$appId + '&secret=' + this.$secret + '&js_code=' +
							res.code + '&grant_type=authorization_code';
userInfo.code = res.code
								uni.request({
									url: 'https://www.imgker.com/venus/user/SMS', //仅为示例，并非真实接口地址。
									data: {
										phone: this.page_status.input_phone,
										user_info: JSON.stringify(userInfo),
									},
									header: {
										'custom-header': 'hello' //自定义请求头信息
									},
									success: (res) => {
										if (res.data === 'success') {
											let phone = this.page_status.input_phone
											this.$set(this.page_status.status_pool, phone, 60)
											console.log(this.page_status.status_pool)
											let _int = setInterval(() => {
												this.page_status.status_pool[phone]--
												if (this.page_status.status_pool[phone] === 0) {
													clearInterval(_int)
												}
											}, 1000)
										} else {
											uni.showToast({
												title: res.data,
												duration: 2000
											})
										}
									}
								})
					},
				})
			},
			async handleLoginClick() {
				uni.clearStorageSync()
				uni.request({
					url: 'https://www.imgker.com/venus/user/LOGIN', //仅为示例，并非真实接口地址。
					data: {
						phone: this.page_status.input_phone,
						sms: this.page_status.input_sms
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						if (res.data.token) {
							uni.setStorageSync('token', res.data.token)
							uni.redirectTo({
								url: './home'
							})
						} else {
							uni.showToast({
								title: res.data,
								duration: 2000
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		height: 100vh;

		.content-back {
			height: 30vh;
			position: relative;

			.content-back-logo {
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				//border: 1px solid white;
				box-shadow: 0px 2px 12px 0px rgba(255, 255, 255, 1);
				height: 70px;
				width: 70px;
				border-radius: 50%;
			}

			&::after {
				content: '';
				width: 140%;
				height: 100px;
				position: absolute;
				left: -20%;
				bottom: -100px;
				z-index: -1;
				border-radius: 0 0 50% 50%;
				background: inherit;
			}
		}


		.content-main {
			width: 90vw;
			position: fixed;
			top: 25vh;
			left: 0;
			right: 0;
			margin: auto;
			background-color: white;
			padding: 20px;
			border-radius: 5px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

			// display: flex;
			// flex-direction: column;
			// align-items: center;
			.content-main-title {
				padding: 0 10px;
				margin-bottom: 10px;
				color: #606266;
				font-size: 16px;
			}

			.content-main-btn {
				margin-top: 20px;
			}

			.content-main-tip {
				font-size: 12px;
				color: gray;
				position: absolute;
				bottom: -35px;
			}
		}
	}
</style>
