<template>
	<view class="content" v-if="get_system_info.normal">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{page_status.mode === 'create' ? '新建等级' : '编辑等级'}}</block>
		</cu-custom>
		<view class="content-main">
			<form class=" sm-border">
				<view class="cu-form-group">
					<view class="content">
						<view class="title">等级名称</view>
					</view>
					<view class="action" v-if="!['非会员', '普通会员'].includes(page_data.current_leval.leval_name)">
						<input placeholder="请输入等级名称" name="input" style="width: 100%; text-align: right;" v-model="page_data.current_leval.leval_name"></input>
					</view>
					<view class="action" v-else>
						{{page_data.current_leval.leval_name}}
					</view>
				</view>
				<view class="padding-lr-sm" style="padding-top: 3px; padding-bottom: 3px;">
					<text class="text-sm text-gray margin-lr-xs">权限管理</text>
				</view>
				<checkbox-group class="block" @change="handleCheckChange">
				<view class="cu-form-group" v-for="power in page_config.power_config">
					<view class="text-grey">{{power.label}}</view>
					<checkbox class="checked round" :checked="page_data.current_leval.power.includes(power.index)" :value="power.index"></checkbox>
				</view>
				</checkbox-group>
				<view class="cu-form-group" style="border-top: 1rpx solid #eee;">
					<view class="content">
						<view class="text-grey">每月免费约会次数</view>
					</view>
					<view class="action">
						<input placeholder="不限" type="number" name="input" style="width: 100%; text-align: right;" v-model="page_data.current_leval.date_time"></input>
					</view>
				</view>
				<view class="cu-form-group" style="border-top: 1rpx solid #eee;">
					<view class="content">
						<view class="text-grey">单次约会收费</view>
					</view>
					<view class="action">
						<input placeholder="禁用" type="number" name="input" style="width: 100%; text-align: right;" v-model="page_data.current_leval.date_price"></input>
					</view>
				</view>
			</form>
		</view>
		<view class="content-save">
			<view class="cu-bar bg-white tabbar border flex">
<!-- 			<button class="cu-btn bg-red lg margin-bottom-sm" v-if="page_data.current_leval.leval_id != 0 && page_status.mode === 'edit'" @click="handleDeleteClick">删除</button>
 -->		<button class="cu-btn bg-red lg" style="flex: 100" @click="handleSaveClick">保存</button>
			<button class="action"  v-if="page_data.current_leval.leval_id != 0 && page_data.current_leval.leval_id != -1 && page_status.mode === 'edit'" @click="handleDeleteClick">
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
	import Empty from '../component/empty.vue'
	import areaJson from '../../utils/area.js'
	export default {
		components: {
			Empty
		},
		data() {
			return {
				page_config: {
					// power_config: [{
					// 	label: '查看圈内用户基本信息',
					// 	index: '0'
					// }, {
					// 	label: '可申请与圈内用户约会',
					// 	index: '1'
					// }]
					power_config: []
				},
				page_data: {
					current_leval: {
						leval_id: null,
						leval_name: '',
						power: [],
						date_time: 0,
						date_price: null
					}
				},
				page_status: {
					mode: 'create'
				}
			};
		},
		onLoad: function({
			leval_id
		}) {
			if (leval_id) {
				this.page_status.mode = 'edit'
				this.page_data.current_leval = JSON.parse(this.get_user_info.leval_manage).find(_i => _i.leval_id == leval_id)
			} else {
				this.page_data.current_leval.leval_id = new Date().valueOf()
				this.page_status.mode = 'create'
			}
		},
		onShow() {},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info']),
		},
		methods: {
			...mapActions(['GET_USER_INFO', 'UPLOAD_FILE']),
			handleDeleteClick() {
				let leval_manage = JSON.parse(this.get_user_info.leval_manage || '[]')
				let old_index = leval_manage.indexOf(_i => _i.leval_id === this.page_data.current_leval.leval_id)
				if (old_index) {
					leval_manage.splice(old_index, 1)
				}
				uni.request({
					url: 'https://www.imgker.com/venus/user/update_leval_manage', //仅为示例，并非真实接口地址。
					data: {
						leval_manage: JSON.stringify(leval_manage)
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						if (res.data === 'success') {
							uni.showToast({
								title: '删除成功',
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
			},
			handleSaveClick() {
				let leval_manage = JSON.parse(this.get_user_info.leval_manage || '[]') 
				let old = leval_manage.find(_i => _i.leval_id === this.page_data.current_leval.leval_id)
				if (!old) leval_manage.push(this.page_data.current_leval)
				else {
					old.leval_name = this.page_data.current_leval.leval_name
					old.power = this.page_data.current_leval.power
					old.date_time = this.page_data.current_leval.date_time
					old.date_price = this.page_data.current_leval.date_price
				}
				uni.request({
					url: 'https://www.imgker.com/venus/user/update_leval_manage', //仅为示例，并非真实接口地址。
					data: {
						leval_manage: JSON.stringify(leval_manage)
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
			},
			handleCheckChange(e) {
				console.log(e.detail.value)
				this.page_data.current_leval.power = e.detail.value
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
		}

		.content-save {
			background-color: white;
			position: fixed;
			bottom: 0;
			width: 100%;
			padding: 4px 10px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		}
	}
</style>
