<template>
	<view class="content" v-if="page_data">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="true">
			<block slot="backText" @click="handleBackClick">返回</block>
			<block slot="content">{{page_data.user_info.user_name}}</block>
		</cu-custom>
		<view class="content-main">
			<view v-if="page_data.user_info.imgList">
				<swiper class="card-swiper round-dot" indicator-dots="true" circular="true" autoplay="true" interval="5000"
				 duration="500" indicator-color="#8799a3" indicator-active-color="#0081ff" @change="handleSwiper">
					<swiper-item :class="page_status.current_swiper === index ? 'cur' : ''" v-for="(img, index) in page_data.user_info.imgList"
					 @tap="ViewImage(img)">
						<view class="swiper-item">
							<image :src="img" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="padding-lr" v-if="page_data.user_info.admin">
				<navigator hover-class='none' style="width: 100%;" :url="'/view/pages/find?invite_id=' + page_data.user_info.admin.invite_id"
				 navigateTo>
					<view class="padding-sm radius shadow-blur cu-list menu-avatar">
						<view class="radius padding flex align-center" style="background-color: #e54d42;">
							<view class="cu-avatar round lg margin-right" :style="'background-image:url(' + page_data.user_info.admin.avatar_url + ')'"></view>
							<view class="content flex-sub ">
								<view class="text-white">{{page_data.user_info.admin.user_name}}<text class="cuIcon-mobilefill text-white"></text>{{page_data.user_info.admin.user_phone}}</view>
								<view class="text-white text-sm flex justify-between">
									{{location}}
								</view>
							</view>
						</view>
					</view>
				</navigator>
			</view>
			<view class="cu-list menu sm-border margin-top">
				<view class="cu-item">
					<view>
						<view class="content">
							<text class="cuIcon-titles text-green"></text>
							<text class="text-grey">自我介绍</text>
						</view>
						<view class="content padding-tb padding-lr-sm">
							<text class="text-grey">{{page_data.user_info.introduction}}</text>
						</view>
					</view>
				</view>
				<view class="cu-item" v-if="page_data.user_info.hobby && page_data.user_info.hobby.length > 0">
					<view>
						<view class="content padding-top">
							<text class="cuIcon-titles text-green"></text>
							<text class="text-grey">兴趣标签</text>
						</view>
						<view class="padding-tb padding-lr-sm">
							<view class='cu-tag' :class="'line-' + page_config.color_config[index]" v-for="(tag, index) in page_data.user_info.hobby">{{tag}}</view>
						</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">性别</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.gender_array[page_data.user_info.gender] || '未填写'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">身高</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_data.user_info.stature > -1 ? page_data.user_info.stature + 130 + 'cm' : '未填写'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">生日</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_data.user_info.date || '未填写'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">职业</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_data.user_info.job || '未填写'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">户籍地</text>
					</view>
					<view class="action">
						<text class="text-black">{{born}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">居住地</text>
					</view>
					<view class="action">
						<text class="text-black">{{live}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">学历</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.education_array[page_data.user_info.education] || '未填写'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">婚姻状况</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.marriage_array[page_data.user_info.marriage] || '未填写'}}</text>
					</view>
				</view>
			</view>
			<view class="cu-list menu sm-border margin-top">
				<view class="cu-item">
					<view>
						<view class="content">
							<text class="cuIcon-titles text-green"></text>
							<text class="text-grey">择偶条件</text>
						</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">性别</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.gender_array[page_data.user_require.genderIndex - 1] || '不限'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">身高</text>
					</view>
					<view class="action">
						<text class="text-black">{{stature}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">年龄</text>
					</view>
					<view class="action">
						<text class="text-black">{{age}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">户籍地</text>
					</view>
					<view class="action">
						<text class="text-black" v-if="page_data.user_require && page_data.user_require.bornPool">{{(page_data.user_require.bornPool.length <= 0) ? '不限' : `已选${page_data.user_require.bornPool.length}个`}}</text>
						<text class="text-black" v-else>不限</text>
					</view>
				</view>
				<view class="cu-form-group" v-if="page_data.user_require && page_data.user_require.bornPool && page_data.user_require.bornPool.length > 0">
					<view class="padding-bottom-sm">
						<view class='cu-tag line-red margin-top-sm margin-lr-xs' v-for="(item, index) in page_data.user_require.bornPool">{{areaJson[item[0]].name}}{{areaJson[item[0]].city[item[1]] ? ` - ${areaJson[item[0]].city[item[1]].name}` : ''}}{{areaJson[item[0]].city[item[1]].area[item[2]] ? ` - ${areaJson[item[0]].city[item[1]].area[item[2]]}` : ''}}</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">居住地</text>
					</view>
					<view class="action">
						<text class="text-black" v-if="page_data.user_require && page_data.user_require.livePool">{{(page_data.user_require.livePool.length <= 0) ? '不限' : `已选${page_data.user_require.livePool.length}个`}}</text>
						<text class="text-black" v-else>不限</text>
					</view>
				</view>
				<view class="cu-form-group" v-if="page_data.user_require && page_data.user_require.livePool && page_data.user_require.livePool.length > 0">
					<view class="padding-bottom-sm">
						<view class='cu-tag line-red margin-top-sm margin-lr-xs' v-for="(item, index) in page_data.user_require.livePool">{{areaJson[item[0]].name}}{{areaJson[item[0]].city[item[1]] ? ` - ${areaJson[item[0]].city[item[1]].name}` : ''}}{{areaJson[item[0]].city[item[1]].area[item[2]] ? ` - ${areaJson[item[0]].city[item[1]].area[item[2]]}` : ''}}</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">学历</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.education_array[page_data.user_require.educationIndex - 1] || '不限'}}</text>
					</view>
				</view>
				<view class="cu-item" style="margin-bottom: 50px;">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">婚姻状况</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.marriage_array[page_data.user_require.marriageIndex - 1] || '不限'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="box">
			<view class="cu-bar bg-white tabbar border shop" v-if="get_user_info.user_id !== page_config.current_user_id">
				<button class="action" @click="handleRecommendClick" v-if="get_user_info.user_type === 0">
					<view class="cuIcon-pullup text-green">
						<!-- <view class="cu-tag badge">5</view> -->
					</view> 自荐
				</button>
				<view class="action" v-if="page_data.user_info.is_collect" @click="handleUnCollectClick">
					<view class="cuIcon-favorfill text-yellow">
					</view>
					取消关注
				</view>
				<view class="action" v-else @click="handleCollectClick">
					<view class="cuIcon-favor">
					</view>
					关注
				</view>
				<button class="action" :open-type="get_user_info.user_type === 0 ? 'share' : ''" @click="handleShareClick">
					<view class="cuIcon-share text-red">
						<!-- <view class="cu-tag badge">5</view> -->
					</view> 分享
				</button>
				<view class="diy-btn-group" >
					<template v-if="get_user_info.user_type === 0">
					<view class="diy-btn-group-btn" v-if="page_data.user_info.yh">
						<button class="cu-btn bg-gray" disabled style="border-radius: 0; height: 100%;">{{page_config.date_status_config[page_data.user_info.yh.status]}}</button>
					</view>
					<view class="diy-btn-group-btn" v-else-if="!page_data.user_info.callable" @click="handleContactClick">
						<button class="cu-btn bg-orange" style="border-radius: 0; height: 100%;">约会</button>
					</view>
					</template>
					<template v-if="page_data.user_info.callable">
						<view class="diy-btn-group-btn">
							<button class="cu-btn bg-orange" @click="handleAdminContactClick" style="border-radius: 0; height: 100%;"><text class="cuIcon-mobilefill text-white"></text>电话</button>
						</view>
					</template>
				</view>
			</view>
		</view>
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
		components: {
			Empty
		},
		data() {
			return {
				areaJson,
				page_config: {
					current_user_id: null,
					color_config: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown',
						'grey', 'gray'
					],
					gender_array: ['男', '女'],
					education_array: ['小学', '初中', '中专/高中', '专科 ', '本科', '硕士', '博士'],
					marriage_array: ['未婚', '离异', '丧偶'],
					date_status_config: ['申请中', '约会中', '恋爱中', '已订婚', '已结婚'],
					ageMultiArray: [
						['不限', ...Array.from(Array(43)).map((e, i) => 18 + i + '岁')],
						['不限', ...Array.from(Array(43)).map((e, i) => 18 + i + '岁')],
					],
					statureMultiArray: [
						['不限', ...Array.from(Array(81)).map((e, i) => 130 + i + 'cm')],
						['不限', ...Array.from(Array(81)).map((e, i) => 130 + i + 'cm')]
					],
				},
				page_data: {
					user_info: {},
					user_require: {}
				},
				page_status: {
					current_swiper: 0,
					single: false
				}
			};
		},
		onLoad: function({
			user_id,
			single
		}) {
			this.page_config.current_user_id = user_id
			if (single) this.page_status.single = true
			this.fetchData()
		},
		onShow() {
			if (this.page_config.current_user_id) this.fetchData()
		},
		onShareAppMessage() {
			let shareObj = {
				title: "欢迎体验INLAY婚恋服务", // 默认是小程序的名称(可以写slogan等)
				path: `/view/pages/detail?user_id=${this.page_config.current_user_id}&&single=1`,
				imageUrl: this.page_data.user_info.imgList[0] || '/static/venus.png'
			}
			return shareObj
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info']),
			born() {
				if (!this.page_data.user_info) return null
				if (!this.page_data.user_info.bornMultiIndex) return '未填写'
				let [province_index, city_index, area_index] = this.page_data.user_info.bornMultiIndex
				return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name} ${areaJson[province_index].city[city_index].area[area_index]}`
			},
			live() {
				if (!this.page_data.user_info) return null
				if (!this.page_data.user_info.liveMultiIndex) return '未填写'
				let [province_index, city_index, area_index] = this.page_data.user_info.liveMultiIndex
				return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name} ${areaJson[province_index].city[city_index].area[area_index]}`
			},
			location() {
				if (!this.page_data.user_info) return ''
				if (!this.page_data.user_info.admin) return ''
				let location = JSON.parse(this.page_data.user_info.admin.location || '[]')
				return location.map(_i => {
					let [province_index, city_index, area_index] = _i
					if (province_index >= 0 && city_index >= 0 && area_index >= 0) return `${areaJson[province_index].name}-${areaJson[province_index].city[city_index].name}-${areaJson[province_index].city[city_index].area[area_index]}`
					else if (province_index >= 0 && city_index >= 0) return `${areaJson[province_index].name}-${areaJson[province_index].city[city_index].name}`
					else if (province_index >= 0) return `${areaJson[province_index].name}`
					else return ''
				}).join('/')
			},
			stature() {
				if (!this.page_data.user_require) return '不限'
				if (!this.page_data.user_require.statureMultiIndex) return '不限'
				let statureMultiIndex = this.page_data.user_require.statureMultiIndex
				let statureMultiArray = this.page_config.statureMultiArray
				if (statureMultiIndex[0] === 0 && statureMultiIndex[1] === 0) return '不限'
				else if (statureMultiIndex[1] === 1) return `${statureMultiArray[1][statureMultiIndex[1]]}`
				else if (statureMultiIndex[0] === 0 && statureMultiIndex[1] > 0) return `${statureMultiArray[1][statureMultiIndex[1]]}以下`
				else if (statureMultiIndex[0] > 0 && statureMultiIndex[1] === 0) return `${statureMultiArray[0][statureMultiIndex[0]]}以上`
				else return `${statureMultiArray[0][statureMultiIndex[0]]} - ${statureMultiArray[1][statureMultiIndex[1]]}`
			},
			age() {
				if (!this.page_data.user_require) return '不限'
				if (!this.page_data.user_require.ageMultiIndex) return '不限'
				let ageMultiIndex = this.page_data.user_require.ageMultiIndex
				let ageMultiArray = this.page_config.ageMultiArray
				if (ageMultiIndex[0] === 0 && ageMultiIndex[1] === 0) return '不限'
				else if (ageMultiIndex[1] === 1) return `${ageMultiArray[1][ageMultiIndex[1]]}`
				else if (ageMultiIndex[0] === 0 && ageMultiIndex[1] > 0) return `${ageMultiArray[1][ageMultiIndex[1]]}以下`
				else if (ageMultiIndex[0] > 0 && ageMultiIndex[1] === 0) return `${ageMultiArray[0][ageMultiIndex[0]]}以上`
				else return `${ageMultiArray[0][ageMultiIndex[0]]} - ${ageMultiArray[1][ageMultiIndex[1]]}`
			}
		},
		methods: {
			handleBackClick() {
				if (this.page_status.single) uni.redirectTo({
					url: './home'
				})
			},
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/get_user_info',
					data: {
						wanna_user_id: this.page_config.current_user_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.page_data.user_info = JSON.parse(res.data.user_info || '{}')
						this.page_data.user_info.stature = typeof(this.page_data.user_info.stature) === 'number' ? this.page_data.user_info.stature : -1
						this.page_data.user_info.is_collect = res.data.is_collect
						this.page_data.user_info.invite_id = res.data.invite_id
						this.page_data.user_info.yh = res.data.date
						this.page_data.user_info.admin = res.data.admin
						this.page_data.user_info.user_name = res.data.user_name
						this.page_data.user_info.user_phone = res.data.user_phone
						this.page_data.user_info.callable = res.data.callable
						this.page_data.user_require = JSON.parse(res.data.user_require || '{}')
					}
				})
			},
			ViewImage(url) {
				uni.previewImage({
					urls: this.page_data.user_info.imgList,
					current: url
				});
			},
			handleRecommendClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/recommend/recommend',
					data: {
						user_id: this.get_user_info.user_id,
						recommended_user_id: this.get_user_info.user_id,
						recommended_to_user_id: this.page_config.current_user_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						// this.fetchData()
					}
				})
			},
			handleShareClick() {
				if (this.get_user_info.user_type === 0) return
				uni.navigateTo({
					url: `./userList?share_user_id=${this.page_config.current_user_id}&&image=${this.page_data.user_info.imgList[0] || '/static/venus.png'}`
				})
			},
			handleCollectClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/collect/collect',
					data: {
						collected_user_id: this.page_config.current_user_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.fetchData()
					}
				})
			},
			handleUnCollectClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/collect/uncollect',
					data: {
						collected_user_id: this.page_config.current_user_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.fetchData()
					}
				})
			},
			handleContactClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/date/apply',
					data: {
						to_user_id: this.page_config.current_user_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.fetchData()
					}
				})
			},
			handleAdminContactClick() {
				uni.makePhoneCall({
					phoneNumber: this.page_data.user_info.user_phone,
					fail(e) {
						console.log(e)
					}
				})
			},
			handleSwiper(e) {
				this.page_status.current_swiper = e.detail.current
			},
		}
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

		.content-main {
			background-color: white;
		}

		.content-mine {
			.content-mine-title {
				background: white;
				color: gray;
				font-size: 12px;
				padding: 3px 10px 5px 10px;
				border-bottom: 1px solid rgba(0, 0, 0, 0.05);
			}

			.content-mine-item_red {
				&::before {
					content: ' ';
					display: inline-block;
					position: absolute;
					left: 10px;
					top: 0px;
					bottom: 0px;
					margin: auto;
					width: 6px;
					height: 6px;
					background: #F56C6C !important;
					border-radius: 50%;
				}
			}

			.content-mine-item {
				background: white;
				position: relative;
				border-bottom: 1px solid rgba(0, 0, 0, 0.05);
				padding: 10px 25px;

				&::before {
					content: ' ';
					display: inline-block;
					position: absolute;
					left: 10px;
					top: 0px;
					bottom: 0px;
					margin: auto;
					width: 6px;
					height: 6px;
					background: #409EFF;
					border-radius: 50%;
				}

				.content-mine-item-id {
					margin-bottom: 5px;
					font-size: 16px;
					font-weight: bold;
					display: flex;
					align-items: center;
				}

				.content-mine-item-key {
					font-size: 12px;
					color: gray;
				}

				.content-mine-item-action {
					font-size: 18px;
					height: 20px;
					position: absolute;
					right: 10px;
					top: 0px;
					bottom: 0px;
					margin: auto;
				}
			}
		}
	}
</style>
