<template>
	<view class="content" v-if="get_system_info.normal">
		<cu-custom :isBack="true" bgColor="bg-red text-white">
			<block slot="backText">返回</block>
			<block slot="content">我的</block>
		</cu-custom>
		<view class="content-main">
			<view class="content-main-user" @click="handleLoginClick">
				<view class="content-main-user-head">
					<image :src="get_user_info.avatar_url || get_global_config.app_logo" mode="aspectFill"></image>
				</view>
				<view class="content-main-user-info">
					<view class="content-main-user-info-name">{{get_user_info.user_name || '立即登录'}}
					</view>
					<view class="content-main-user-info-intro" v-if="get_user_info.user_type === 0">{{get_global_config.app_name}} -
						您最具想象力的爱情订制管家
					</view>
					<view class="content-main-user-info-intro" v-if="get_user_info.user_type === 1">
						<text class="cuIcon-location text-gray"></text>{{get_user_info.address}}
					</view>
					<!-- <view class="content-main-user-info-intro" v-if="get_user_info.user_type === 1" style="display: flex; align-items: center;">
						<button class="cu-btn round lines-gray line-gray sm margin-top-xs sm-border" @click="handleCopyClick">复制邀请码</button>
					</view> -->
				</view>
			</view>
			<view class="content-main-info" v-if="get_user_info.user_type === 0">
				<navigator class="content-main-info-attention" hover-class='none' style="width: 100%;" url="/view/pages/collect"
				 navigateTo>
					<view class="content-main-info-attention-label">
						关注
					</view>
					<view class="content-main-info-attention-number">
						{{get_user_info.collect_num || 0}}
					</view>
				</navigator>
				<navigator class="content-main-info-subscribe" hover-class='none' style="width: 100%;" url="/view/pages/date"
				 navigateTo>
					<view class="content-main-info-subscribe-label">
						约会
					</view>
					<view class="content-main-info-subscribe-number">
						{{get_user_info.date_num || 0}}
					</view>
				</navigator>
				<navigator class="content-main-info-matchmaker" v-if="get_user_info.admin" hover-class='none' style="width: 100%;" :url="get_user_info.admin.invite_id ? ('/view/pages/find?invite_id=' + get_user_info.admin.invite_id) : '/view/pages/adminList'"
				 navigateTo>
					<view class="content-main-info-matchmaker-label">
						单身俱乐部
					</view>
					<view class="content-main-info-matchmaker-name">
						{{get_user_info.admin.user_name || '申请中'}}
					</view>
				</navigator>
				<navigator class="content-main-info-matchmaker" v-else hover-class='none' style="width: 100%;" url="/view/pages/adminList"
				 navigateTo>
					<view class="content-main-info-matchmaker-label">
						单身俱乐部
					</view>
					<view class="content-main-info-matchmaker-name">
						去加入
					</view>
				</navigator>
			</view>
			<view class="content-main-info" v-if="get_user_info.user_type === 1">
				<navigator class="content-main-info-attention" hover-class='none' style="width: 100%;" url="/view/pages/userList"
				 navigateTo>
					<view class="content-main-info-attention-label">
						用户
					</view>
					<view class="content-main-info-attention-number">
						{{get_user_info.user_num || 0}}
					</view>
				</navigator>
				<navigator class="content-main-info-attention" hover-class='none' style="width: 100%;" url="/view/pages/collect"
				 navigateTo>
					<view class="content-main-info-attention-label">
						关注
					</view>
					<view class="content-main-info-attention-number">
						{{get_user_info.collect_num || 0}}
					</view>
				</navigator>
				<navigator class="content-main-info-subscribe" hover-class='none' style="width: 100%;" url="/view/pages/date?mode=manage"
				 navigateTo>
					<view class="content-main-info-subscribe-label">
						约会
					</view>
					<view class="content-main-info-subscribe-number">
						{{get_user_info.date_num || 0}}
					</view>
				</navigator>
				<navigator class="content-main-info-apply" hover-class='none' style="width: 100%;" url="/view/pages/date?mode=apply"
				 navigateTo>
					<view class="content-main-info-apply-label">
						申请
					</view>
					<view class="content-main-info-apply-number">
						{{get_user_info.apply_num || 0}}
					</view>
				</navigator>
			</view>
			<view class="cu-list menu sm-border margin-top">
				<template v-if="get_user_info.user_phone === '13906860505'">
					<view class="cu-item arrow" @click="handleUrlGo('/view/pages/adminConsole')">
						<view class="content" style="width: 100%;">
							<text class="cuIcon-circlefill text-yellow"></text>
							<text class="text-grey">控制台</text>
						</view>
					</view>
				</template>
				<template v-if="get_user_info.user_type === 0">
					<view class="cu-item" @click="handleUrlGo('/view/pages/detailedit')">
						<view class="content">
							<text class="cuIcon-btn text-green"></text>
							<text class="text-grey">我的资料</text>
						</view>
						<view class="action">
							<button class="cu-btn sm bg-red" style="border-radius: 2px;">完善资料</button>
						</view>
					</view>
					<view class="cu-item arrow" @click="handleUrlGo('/view/pages/requireedit')">
						<view class="content" style="width: 100%;">
							<text class="cuIcon-circlefill text-yellow"></text>
							<text class="text-grey">择偶标准</text>
						</view>
					</view>
				</template>
				<template v-if="get_user_info.user_type === 1">
					<!-- dfsdsadasdasdsad -->
					<view class="cu-item" @click="handleTocashClick">
						<view class="content">
							<text class="cuIcon-btn text-green"></text>
							<text class="text-grey">我的钱包: {{get_user_info.assets}}.00元</text>
						</view>
						<view class="action" v-if="get_user_info.assets > 0">
							<button class="cu-btn sm bg-red" style="border-radius: 2px;" v-if="!get_user_info.is_tocashing">去提现</button>
							<button class="cu-btn sm bg-gray" style="border-radius: 2px;" v-else>提现中</button>
						</view>
					</view>
					<view class="cu-item arrow" @click="handleUrlGo('/view/pages/userList')">
						<view class="content" style="width: 100%;">
							<text class="cuIcon-circlefill text-yellow"></text>
							<text class="text-grey">用户管理</text>
						</view>
					</view>
					<!-- 				<view class="cu-item arrow">
					<navigator hover-class='none' style="width: 100%;" url="/view/pages/requireedit" navigateTo>
						<view class="content" style="width: 100%;">
							<text class="cuIcon-circlefill text-yellow"></text>
							<text class="text-grey">分组管理</text>
						</view>
					</navigator>
				</view> -->
					<view class="cu-item arrow" @click="handleUrlGo('/view/pages/levalmanage')">
						<view class="content" style="width: 100%;">
							<text class="cuIcon-tagfill text-blue"></text>
							<text class="text-grey">等级管理</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="handleUrlGo('/view/pages/date?mode=apply')">
						<view class="content" style="width: 100%;">
							<text class="cuIcon-timefill text-cyan"></text>
							<text class="text-grey">申请管理</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="handleUrlGo('/view/pages/date?mode=manage')">
						<view class="content" style="width: 100%;">
							<text class="cuIcon-likefill text-pink"></text>
							<text class="text-grey">约会管理</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="handleUrlGo('/view/pages/activityAdminList')">
						<view class="content" style="width: 100%;">
							<text class="cuIcon-discoverfill text-red"></text>
							<text class="text-grey">活动管理</text>
						</view>
					</view>
				</template>
				<view class="cu-item arrow" @click="handleUrlGo('/view/pages/qrcode')">
					<button class="cu-btn content">
						<text class="cuIcon-qrcode text-gray"></text>
						<text class="text-grey">我的二维码</text>
					</button>
				</view>
				<view class="cu-item arrow" @click="handleUrlGo('/view/pages/basicinfo')">
					<view class="content" style="width: 100%;">
						<text class="cuIcon-card text-olive"></text>
						<text class="text-grey">账号管理</text>
					</view>
				</view>
				<view class="cu-item arrow">
					<button class="cu-btn content" open-type="contact">
						<text class="cuIcon-questionfill text-yellow"></text>
						<text class="text-grey">联系客服</text>
					</button>
				</view>

				<view class="cu-item arrow margin-top" @click="handleLogOutClick" v-if="get_user_info.user_name">
					<view class="content">
						<text class="cuIcon-settingsfill text-grey"></text>
						<text class="text-grey">退出登录</text>
					</view>
				</view>
			</view>
		</view>
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
					inspect_modal_visible: false,
					recharge_modal_visible: false,
					input_id: '',
					input_recharge_sum: ''
				},
				page_data: {
					coin_detail: null
				}
			};
		},
		onLoad: function() {},
		async onShow() {
			if (uni.getStorageSync('token')) await this.fetchUserData()
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info', 'get_global_config'])
		},
		methods: {
			...mapActions(['GET_USER_INFO']),
			async fetchUserData() {
				await this.GET_USER_INFO()
			},
			handleUrlGo(url) {
				uni.navigateTo({
					url
				})
			},
			handleLoginClick() {
				if (!this.get_user_info.user_name) uni.redirectTo({
					url: './login'
				})
			},
			handleLogOutClick() {
				uni.clearStorageSync()
				uni.redirectTo({
					url: './login'
				})
			},
			handlRechargeClick() {
				this.page_status.recharge_modal_visible = true
			},
			handlRechargeConfirmClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/recharge',
					data: {
						sum: this.page_status.input_recharge_sum
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						uni.showToast({
							title: res.data === 'success' ? '充值成功' : res.data,
							duration: 2000
						})
						this.page_status.recharge_modal_visible = false
						this.fetchUserData()
					}
				})
			},
			handleTocashClick() {
				if (this.get_user_info.assets <= 0) return
				if (this.get_user_info.is_tocashing) {
					uni.showModal({
						title: '提示',
						content: '正在提现中，预计在3个工作日内到账。',
						cancelText: "取消", // 取消按钮的文字  
						confirmText: "确认", // 确认按钮文字  
						showCancel: true, // 是否显示取消按钮，默认为 true
						confirmColor: '#f55850',
						cancelColor: '#39B54A'
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '暂时只支持一次性提现全部余额（3个工作日内到账）',
						cancelText: "取消", // 取消按钮的文字  
						confirmText: "确认", // 确认按钮文字  
						showCancel: true, // 是否显示取消按钮，默认为 true
						confirmColor: '#f55850',
						cancelColor: '#39B54A',
						success: (res) => {
							if (res.confirm) {
								uni.request({
									url: 'https://www.imgker.com/venus/tocash/apply',
									data: {},
									header: {
										'custom-header': 'hello' //自定义请求头信息
									},
									success: (res) => {
										this.fetchUserData()
									}
								})
							} else {}
						}
					})
				}
			},
			handlInspectClick() {
				this.page_status.inspect_modal_visible = true
			},
			handlScanClick() {
				uni.scanCode({
					success: res => {
						this.page_status.input_id = res.result
						console.log(this.page_status.input_id)
					},
					fail: function(res) {
						console.log('失败：', res);
					}
				})
			},
			handlInspectConfirmClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/msg/luck_apply',
					data: {
						specie_id: this.page_status.input_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						uni.showToast({
							title: res.data === 'success' ? '申请成功' : res.data,
							duration: 2000
						})
						this.page_status.inspect_modal_visible = false
						this.fetchUserData()
					}
				})
			},
			handleCopyClick() {
				uni.setClipboardData({
					//准备复制的数据
					data: this.get_user_info.invite_id,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
						});
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	@keyframes glow {
		0% {
			box-shadow: 0 0 5px rgba(0, 0, 0, .2), inset 0 0 5px rgba(0, 0, 0, .1), 0 1px 0 #393;
		}

		100% {
			box-shadow: 0 0 20px rgba(0, 0, 0, .6), inset 0 0 10px rgba(0, 0, 0, .4), 0 1px 0 #6f6;
		}
	}

	@keyframes show {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	.content {
		.content-main {

			//animation: show 2800ms ease-out;
			.content-main-user {
				background-color: white;
				display: flex;
				align-items: center;
				padding: 20px;

				//box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
				.content-main-user-head {
					margin-right: 15px;

					image {
						max-height: 50px;
						height: 50px;
						max-width: 50px;
						width: 50px;
						border-radius: 50%;
					}
				}

				.content-main-user-info {
					.content-main-user-info-name {
						font-size: 24px;
						font-weight: bold;
						color: #303133;
					}

					.content-main-user-info-intro {
						font-size: 16px;
						color: #909399;
					}
				}
			}

			.content-main-info {
				display: flex;
				padding: 10px 0;
				background: white;
				border-top: 1px solid #ebebeb;

				.content-main-info-attention {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					color: gray;
					border-right: 1px solid #ebebeb;

					.content-main-info-attention-number {
						font-size: 16px;
						font-weight: bold;
						margin-top: 3px;
						color: #303133;
					}
				}

				.content-main-info-subscribe {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					border-right: 1px solid #ebebeb;
					color: gray;

					.content-main-info-subscribe-number {
						font-size: 16px;
						font-weight: bold;
						margin-top: 3px;
						color: #303133;
					}
				}

				.content-main-info-apply {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					border-right: 1px solid #ebebeb;
					color: gray;

					.content-main-info-apply-number {
						font-size: 16px;
						font-weight: bold;
						margin-top: 3px;
						color: #303133;
					}
				}

				.content-main-info-matchmaker {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					color: gray;

					.content-main-info-matchmaker-name {
						font-size: 14px;
						margin-top: 3px;
						color: red;
						padding: 0 10px;
					}
				}
			}
		}
	}
</style>
