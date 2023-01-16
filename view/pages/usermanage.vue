<template>
	<view class="content" v-if="get_system_info.normal">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">用户管理</block>
		</cu-custom>
		<view class="content-main">
			<view class="cu-list menu sm-border ">
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">会员类型</text>
					</view>
					<view class="action">
						<picker @change="handleLevalPickerChange" :value="leval_index" :range="leval_array">
							<view class="picker">
								{{ leval_array[leval_index] || '选择' }}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">到期时间</text>
					</view>
					<view class="action">
						<picker mode="date" :disabled="leval_index == 0" :value="page_data.end_time" :start="page_config.start_time"
						 @change="handleDatePickerChange">
							<view class="picker">
								{{end_time}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item">
					<view style="width: 100%;">
						<view class="content padding-top">
							<text class="cuIcon-titles text-green"></text>
							<text class="text-grey">红娘寄语</text>
						</view>
						<view class="content padding-tb padding-lr-sm">
							<textarea maxlength="140" placeholder="多行文本输入框" v-model="page_data.user_info.tips"></textarea>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content-save">
			<view class="cu-bar bg-white tabbar border flex">
				<button class="cu-btn bg-red lg" style="flex: 100" @click="handleSaveClick">保存</button>
				<button class="action" @click="handleDeleteClick">
					<view class="cuIcon-deletefill text-gray">
						<!-- <view class="cu-tag badge">5</view> -->
					</view> 删除
				</button>
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
		components: {},
		data() {
			return {
				page_config: {
					start_time: new Date().format("yyyy-MM-dd")
				},
				page_data: {
					end_time: 0,
					leval_id: 0,
					user_info: {}
				},
				page_status: {

				}
			};
		},
		onLoad: function({
			user_id,
			leval_id,
			end_time
		}) {
			this.page_data.current_user_id = user_id
			this.page_data.leval_id = leval_id || 0
			this.page_data.end_time = end_time && end_time != 0 ? new Date(end_time).format("yyyy-MM-dd") : 0
		},
		onShow() {
			this.fetchData()
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info']),
			leval_array() {
				let leval_manage = JSON.parse(this.get_user_info.leval_manage)
				return leval_manage.map(_i => _i.leval_name)
			},
			leval_index() {
				let leval_manage = JSON.parse(this.get_user_info.leval_manage)
				let leval = leval_manage.find(_i => _i.leval_id == this.page_data.leval_id)
				return leval_manage.indexOf(leval)
			},
			end_time() {
				return this.page_data.end_time && this.page_data.end_time != 0 ? this.page_data.end_time : '永久'
			}
		},
		methods: {
			...mapActions(['GET_USER_INFO', 'UPLOAD_FILE']),
			async fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/get_user_info',
					data: {
						wanna_user_id: this.page_data.current_user_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.page_data.user_info = JSON.parse(res.data.user_info || '{}')
						this.page_data.vip_info = res.data.vip
					}
				})
			},
			handleLevalPickerChange(e) {
				this.page_data.leval_id = JSON.parse(this.get_user_info.leval_manage)[e.detail.value].leval_id
				console.log(this.page_data.leval_id)
				console.log(this.leval_array)
				console.log(this.leval_index)
			},
			handleDatePickerChange(e) {
				this.page_data.end_time = e.detail.value
			},
			handleDeleteClick() {
				uni.showModal({
					title: '提示',
					content: '是否将该用户移出您的会员',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: 'https://www.imgker.com/venus/user/unbind_admin', //仅为示例，并非真实接口地址。
								data: {
									unbind_user_id: this.page_data.current_user_id
								},
								header: {
									'custom-header': 'hello' //自定义请求头信息
								},
								success: (res) => {
									uni.showToast({
										title: '移除成功',
										duration: 2000
									})
									uni.navigateBack()
								}
							})
						} else {}
					}
				})
			},
			handleSaveClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/vip/set_vip_info', //仅为示例，并非真实接口地址。
					data: {
						update_user_id: this.page_data.current_user_id,
						leval_id: this.page_data.leval_id,
						end_time: this.page_data.end_time
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						if (res.data === 'success') {
							uni.request({
								url: 'https://www.imgker.com/venus/user/admin_update_user_info', //仅为示例，并非真实接口地址。
								data: {
									update_user_id: this.page_data.current_user_id,
									user_info: JSON.stringify(this.page_data.user_info)
								},
								header: {
									'custom-header': 'hello' //自定义请求头信息
								},
								success: (res) => {
									if (res.data === 'success') {
										uni.showToast({
											title: '保存成功',
											duration: 2000
										})
										uni.navigateBack()
									} else {
										uni.showToast({
											title: res.data,
											duration: 2000
										})
									}
								}
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
		},
	}
</script>

<style lang="less" scoped>
	.box {
		width: 100%;
		position: fixed;
		bottom: 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
	}

	.diy-btn-group {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		height: 100%;

		.diy-btn-group-btn {
			//margin-right: 10px;
		}
	}

	.content {
		image {
			max-height: 50px;
			height: 50px;
			max-width: 50px;
			width: 50px;
			border-radius: 50%;
			margin: 10px;
		}

		.content-main {
			background-color: white;
		}

		.content-save {
			background-color: white;
			position: fixed;
			bottom: 0;
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 10px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		}
	}
</style>
