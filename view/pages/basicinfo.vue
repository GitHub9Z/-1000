<template>
	<view class="content" v-if="get_system_info.normal">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">账号管理</block>
		</cu-custom>
		<view class="content-main">
			<form class=" sm-border ">
				<view class="cu-form-group">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">头像</text>
					</view>
					<view class="action" @click="ChooseImage">
						<image :src="page_data.basic_info.avatar_url || get_global_config.app_logo" mode="aspectFill"></image>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">用户名</text>
					</view>
					<view class="action">
						<input placeholder="请输入用户名" v-model="page_data.basic_info.user_name" name="input" style="width: 100%; text-align: right;"></input>
					</view>
				</view>
				<view class="cu-form-group" v-if="get_user_info.user_type === 1">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey" style="white-space: nowrap;">门店地址</text>
					</view>
					<view class="action" style="width: 100%;">
						<input placeholder="请输入门店地址" v-model="page_data.basic_info.address" name="input" style="width: 100%; text-align: right;"></input>
					</view>
				</view>
				<template v-if="get_global_config.mode !== 'single'">
				<view class="cu-form-group" v-if="get_user_info.user_type === 1">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">私域模式</text>
					</view>
					<view class="action">
						<switch @change="handlePrivateChange" :class="page_data.basic_info.private ? 'checked' : ''" :checked="page_data.basic_info.private?true:false"></switch>
					</view>
				</view>
				<view class="cu-form-group" v-if="get_user_info.user_type === 1 && page_data.basic_info.private">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey" style="white-space: nowrap;">密钥</text>
					</view>
					<view class="action" style="width: 100%;">
						<input placeholder="请输入私域密钥" v-model="page_data.basic_info.region_id" name="input" style="width: 100%; text-align: right;"></input>
					</view>
				</view>
				<view class="cu-form-group" v-if="get_user_info.user_type === 1">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">业务范围</text>
					</view>
					<view class="action">
						<picker mode="multiSelector" @change="handleLocationMultiChange" @columnchange="handleLocationMultiColumnChange"
						 :value="locationMultiIndex" :range="locationMultiArray">
							<view class="picker">
								{{location}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-form-group" v-if="page_data.basic_info.locationPool.length > 0">
					<view class="padding-bottom-sm">
						<view class='cu-tag line-red margin-top-sm margin-lr-xs' v-for="(item, index) in page_data.basic_info.locationPool"
						 @click="handleLocationDelete(index)">{{areaJson[item[0]].name}}{{areaJson[item[0]].city[item[1]] ? ` - ${areaJson[item[0]].city[item[1]].name}` : ''}}{{areaJson[item[0]].city[item[1]].area[item[2]] ? ` - ${areaJson[item[0]].city[item[1]].area[item[2]]}` : ''}}<text class="cuIcon-close text-red margin-left-xs"></text></view>
					</view>
				</view>
				</template>
			</form>
		</view>
		<view class="content-save">
			<button class="cu-btn bg-red lg" @click="handleSaveClick">保存</button>
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
				areaJson,
				locationMultiArray: [
					areaJson.map(_i => _i.name),
					['不限', ...areaJson[0].city.map(_i => _i.name)],
					['不限', ...areaJson[0].city[0].area]
				],
				locationMultiIndex: [0, 0, 0],
				locationChoosingIndex: [0, 0, 0],
				page_config: {},
				page_data: {
					basic_info: {
						locationPool: [],
					}
				},
				page_status: {

				}
			};
		},
		onLoad: function() {
			this.fetchData()
		},
		onShow() {},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info', 'get_global_config']),
			location() {
				return this.page_data.basic_info.locationPool.length <= 0 ? '不限' :
					`已选${this.page_data.basic_info.locationPool.length}个`
			}
		},
		methods: {
			...mapActions(['GET_USER_INFO', 'UPLOAD_FILE']),
			async fetchData() {
				await this.GET_USER_INFO()
				this.page_data.basic_info = {
					avatar_url: this.get_user_info.avatar_url,
					user_name: this.get_user_info.user_name,
					address: this.get_user_info.address,
					locationPool: JSON.parse(this.get_user_info.location || '[]'),
					private: !!this.get_user_info.private,
					region_id: this.get_user_info.region_id
				}
			},
			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: async (res) => {
						uni.showLoading({
							title: '上传中',
							mask: true
						})
						let avatar_url = await this.UPLOAD_FILE(res.tempFilePaths[0])
						uni.hideLoading()
						this.page_data.basic_info.avatar_url = avatar_url
						uni.hidde
					}
				})
			},
			handleLocationDelete(index) {
				uni.showModal({
					title: '提示',
					content: '是否删除该地区',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							this.page_data.basic_info.locationPool.splice(index, 1)
						} else {}
					}
				})
			},
			handleLocationMultiChange(e) {
				this.locationMultiIndex = e.detail.value
				let tmp = JSON.parse(JSON.stringify(e.detail.value))
				if (tmp[1] >= 0) tmp[1]--
				if (tmp[2] >= 0) tmp[2]--
				if (this.page_data.basic_info.locationPool.find(_i => JSON.stringify(_i) === JSON.stringify(tmp))) return
				this.page_data.basic_info.locationPool.push(tmp)
				this.$forceUpdate()
			},
			handleLocationMultiColumnChange(e) {
				this.locationChoosingIndex[e.detail.column] = e.detail.value
				if (e.detail.column === 0) {
					this.locationMultiArray[1] = ['不限', ...areaJson[e.detail.value].city.map(_i => _i.name)]
					if (!areaJson[e.detail.value].city[this.locationChoosingIndex[1]]) {
						this.locationChoosingIndex[1] = areaJson[e.detail.value].city.length - 1
					}
					if (this.locationChoosingIndex[1] > 0) this.locationMultiArray[2] = ['不限', ...areaJson[e.detail.value].city[this.locationChoosingIndex[
						1] - 1].area]
					else this.locationMultiArray[2] = []
				}
				if (e.detail.column === 1) {
					if (e.detail.value > 0) this.locationMultiArray[2] = ['不限', ...areaJson[this.locationChoosingIndex[0]].city[e.detail
						.value - 1].area]
					else this.locationMultiArray[2] = []
				}
				this.$forceUpdate()
			},
			handleSaveClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/update_basic_info', //仅为示例，并非真实接口地址。
					data: {
						basic_info: {
							avatar_url: this.page_data.basic_info.avatar_url,
							user_name: this.page_data.basic_info.user_name,
							address: this.page_data.basic_info.address,
							location: JSON.stringify(this.page_data.basic_info.locationPool || []),
							private: this.page_data.basic_info.private,
							region_id: this.page_data.basic_info.region_id
						}
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
			handlePrivateChange(e) {
				this.page_data.basic_info.private = e.detail.value
				if (this.page_data.basic_info.private) {
					this.page_data.basic_info.region_id = this.randomString(16) + new Date().valueOf()
				} else {
					this.page_data.basic_info.region_id = undefined
				}
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
