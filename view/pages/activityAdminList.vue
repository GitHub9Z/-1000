<template>
	<view class="content" v-if="get_system_info.normal">
		<cu-custom bgColor="bg-red text-white" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">活动管理</block>
		</cu-custom>
<!-- 		<view class="bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
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
		</view> -->
		<template v-if="page_data.activity_list.length > 0">
			<view class="cu-list menu sm-border">
				<view class="cu-item arrow" v-for="activity in page_data.activity_list" @click="handleItemClick(activity)">
					<view class="content">{{activity.activity_name}}</view>
				</view>
			</view>
		</template>
		<empty text="暂无活动" v-else></empty>
		<view class="content-create">
			<button class="cu-btn bg-red lg" @click="handleCreateClick">发起活动</button>
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
					activity_list: []
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
			...mapGetters(['get_system_info', 'get_user_info', 'get_global_config']),
			loc() {
				if (!this.page_status.locIndex) return '请选择'
				let [province_index, city_index, area_index] = this.page_status.locIndex
				// if (!province_index && !city_index && !area_index) return '请选择'
				// if (!city_index && !area_index) return areaJson[province_index].name
				// if (!area_index) return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name}`
				return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name} ${areaJson[province_index].city[city_index].area[area_index]}`
			},
		},
		onShow() {
			this.fetchData()
		},
		onReady() {},
		methods: {
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/activity/get_activity_list',
					data: {
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						res.data.forEach(_i => {
							_i.tag = JSON.parse(_i.tag)
							_i.imgList = JSON.parse(_i.imgList)
						})
						this.page_data.activity_list = res.data
					}
				})
			},
			handleItemClick(activity) {
				uni.navigateTo({
					url: `/view/pages/activityedit?activity_id=${activity.activity_id}`
				})
			},
			handleCreateClick() {
				uni.navigateTo({
					url: '/view/pages/activityedit'
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

<style lang="less">
	page {
		.content {
			.content-create {
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
	}
</style>
