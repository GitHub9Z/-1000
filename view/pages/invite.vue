<template>
	<view class="content" v-if="get_system_info.normal">
		<!-- 		<cu-custom class="content-title" bgColor="text-white bg-blue" :isBack="true">
		</cu-custom> -->
		<view class="content-back bg-red">
			<image class="content-back-logo" :src="get_global_config.app_logo" mode="aspectFill"></image>
		</view>
		<view class="content-main">
			<view class="content-main-title">请输入邀请码</view>
			<view class="cu-form-group">
				<view class="title"><text class="lg text-gray cuIcon-mail"></text></view>
				<input placeholder="邀请码" name="input" v-model="page_status.invite_id"></input>
				<button class='cu-btn bg-red' @click="hanldeNoInviteClick">没有邀请码</button>
			</view>
			<view class="content-main-btn"><button class="cu-btn bg-red margin-tb-sm lg round" style="width: 100%;" :disabled="!page_status.invite_id"
				 @click="hanldeConfirmClick">确认</button></view>
			<view class="content-main-tip"><text class="lg text-gray cuIcon-questionfill" style="margin-right: 3px;"></text>{{get_global_config.app_name}}采用1对1私人服务模式，您将拥有一个专属单身俱乐部。
			<text class="lg text-red" style="margin-right: 3px;" @click="hanldeConfirmAdminClick">我想成立一个俱乐部</text></view>
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
					invite_id: ''
				}
			}
		},
		async onLoad() {
			if (this.get_global_config.mode === 'single' && this.get_global_config.admin_info) {
				this.page_status.invite_id = this.get_global_config.admin_info.invite_id
				this.hanldeConfirmClick()
			}
		},
		async onShow() {},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info', 'get_global_config'])
		},
		methods: {
			hanldeConfirmClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/bind_admin', //仅为示例，并非真实接口地址。
					data: {
						invite_id: this.page_status.invite_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						uni.showToast({
							title: '绑定成功',
							duration: 2000
						})
						uni.redirectTo({
							url: './home'
						})
					}
				})
			},
			hanldeConfirmAdminClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/i_am_admin', //仅为示例，并非真实接口地址。
					data: {
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						uni.redirectTo({
							url: './home'
						})
					}
				})
			},
			hanldeNoInviteClick() {
				uni.redirectTo({
					url: './adminList'
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
				bottom: -40px;
			}
		}
	}
</style>
