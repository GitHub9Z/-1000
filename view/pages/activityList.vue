<template>
	<view v-if="get_system_info.normal">
		<cu-custom bgColor="bg-red text-white" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">活动</block>
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
			<view class="cu-card dynamic">
				<view class="cu-item" v-for="activity in page_data.activity_list" @click="handleItemClick(activity)">
						<view class="padding-sm solid-bottom bg-red text-white">
					
							<view class="action" v-if="activity.user[0]">
								<text class="cuIcon-title text-white"></text>
								<text>{{activity.activity_name}}</text>
							</view>
						</view>
<!-- 						<view class="padding" style="padding-bottom: 0;" v-if="activity.tag">
							<view class="text-gray text-sm flex flex-wrap">
								<template v-for="(tag, index) in activity.tag">
									<view class='cu-tag' :class="'line-' + page_config.color_config[index]" style="margin: 0 10rpx 10rpx 0">{{tag}}</view>
								</template>
							</view>
						</view> -->
						<view class="text-content" style="padding-top: 20rpx; max-height: none;">
							<text class="text-content text-df">{{activity.introduction}}</text>
						</view>
						<view class="grid flex-sub padding-lr col-1" v-if="activity.imgList">
							<view class="bg-img only-img" :style="'background-image:url(' + activity.imgList[0] + ')'"></view>
						</view>
						<view class="text-gray text-sm padding" style="display: flex; align-items: center; line-height: 20px;">
							<view style="flex: 1; display: flex;">
								<image :src="activity.user[0].avatar_url || 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201912%2F25%2F20191225224833_zloky.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1623481033&t=2492609cde122393a99b4af1a177bf8d'"
								 mode="aspectFill" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 10px;"></image>
								<text style="color: #333333; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; width: 30vw;">{{activity.user[0].user_name}}</text>
								<text style="margin-left: 10px; white-space: nowrap">发布于{{getDateDiff(activity.create_time)}}</text>
							</view>
							<template v-if="activity.num"><text class="cuIcon-myfill margin-lr-xs" ></text>0 / {{activity.num}}</template>
							<template v-if="activity.male_num"><text class="cuIcon-male margin-lr-xs"></text>0 / {{activity.male_num}}</template>
							<template v-if="activity.female_num"><text class="cuIcon-female margin-lr-xs"></text>0 / {{activity.female_num}}</template>
						</view>
				</view>
			</view>
		</template>
		<empty text="暂无活动" v-else></empty>
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
		onLoad() {
			this.fetchData()
		},
		onReady() {},
		methods: {
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/activity/get_activity_list',
					data: {
						from_page: 'activityList'
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
					url: `/view/pages/activityDetail?activity_id=${activity.activity_id}`
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
</style>
