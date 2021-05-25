<template>
	<view>
		<cu-custom bgColor="bg-red text-white" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">选择红娘</block>
		</cu-custom>
		<view class="bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="cu-list menu  solids-bottom " style="width: 100%;">
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-locationfill text-green"></text>
						<text class="text-grey">所属区域</text>
					</view>
					<view class="action">
						<picker mode="multiSelector" @change="handleLocMultiChange" @columnchange="handleLocMultiColumnChange" :value="page_status.locIndex"
						 :range="page_config.locMultiArray">
							<view class="picker">
								{{loc}}
							</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<template v-if="page_data.admin_list.length > 0">
			<view class="cu-list menu sm-border " style="width: 100%;">
				<view class="cu-item" v-for="admin in page_data.admin_list" @click="handleItemClick(admin)">
					<view class="cu-avatar round lg" style="overflow: hidden; margin: 12px 12px 12px 0;">
						<image style="height: 42px; width: 42px;" :src="admin.avatar_url || '/static/venus.png'" mode="aspectFill"></image>
					</view>
					<view class="content">
						<view class="text-grey">{{admin.user_name}}</view>
						<view class="text-gray text-sm">
							会员人数: {{admin.user_num}}
						</view>
					</view>
				</view>
			</view>
		</template>
		<empty text="暂无该地区的红娘信息" v-else></empty>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex'
	import areaJson from '../../utils/area.js'
	import Empty from '../component/empty.vue'
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				page_config: {
					locMultiArray: [
						areaJson.map(_i => _i.name),
						areaJson[0].city.map(_i => _i.name),
						areaJson[0].city[0].area
					],
				},
				page_data: {
					admin_list: []
				},
				page_status: {
					locChoosingIndex: [0, 0, 0],
					locIndex: [0, 0, 0]
				}
			};
		},
		components: {
			Empty
		},
		computed: {
			...mapGetters(['get_user_info']),
			loc() {
				if (!this.page_status.locIndex) return '请选择'
				let [province_index, city_index, area_index] = this.page_status.locIndex
				// if (!province_index && !city_index && !area_index) return '请选择'
				// if (!city_index && !area_index) return areaJson[province_index].name
				// if (!area_index) return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name}`
				return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name} ${areaJson[province_index].city[city_index].area[area_index]}`
			},
		},
		onLoad() {
			this.fetchData()
		},
		onReady() {},
		methods: {
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/find_admins',
					data: {
						location_index: JSON.stringify(this.page_status.locChoosingIndex)
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.page_data.admin_list = res.data
					}
				})
			},
			handleItemClick(admin) {
				uni.showModal({
					title: '提示',
					content: '绑定红娘后不可自行更换，是否确认？',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: 'https://www.imgker.com/venus/user/bind_admin', //仅为示例，并非真实接口地址。
								data: {
									invite_id: admin.invite_id
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
						} else {
						}
					}
				})
			},
			handleLocMultiChange(e) {
				this.page_status.locIndex = e.detail.value
				this.fetchData()
				this.$forceUpdate()
			},
			handleLocMultiColumnChange(e) {
				this.page_status.locChoosingIndex[e.detail.column] = e.detail.value
				if (e.detail.column === 0) {
					this.page_config.locMultiArray[1] = areaJson[e.detail.value].city.map(_i => _i.name)
					if (!areaJson[e.detail.value].city[this.page_status.locChoosingIndex[1]]) {
						this.page_status.locChoosingIndex[1] = areaJson[e.detail.value].city.length - 1
					}
					this.page_config.locMultiArray[2] = areaJson[e.detail.value].city[this.page_status.locChoosingIndex[1]].area
				}
				if (e.detail.column === 1) {
					this.page_config.locMultiArray[2] = areaJson[this.page_status.locChoosingIndex[0]].city[e.detail.value].area
				}
				this.$forceUpdate()
			},
		}
	}
</script>

<style>
	page {}

	.indexes {
		position: relative;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
</style>
