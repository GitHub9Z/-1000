<template>
	<view class="content" v-if="page_data && get_system_info.normal">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="this.page_status.single ? false : true">
			<block slot="backText" @click="handleBackClick">返回</block>
			<block slot="content">活动</block>
		</cu-custom>
		<template v-if="page_data.activity_info">
		<view class="content-main">
			<view v-if="page_data.activity_info.imgList">
<!-- 				<swiper class="screen-swiper round-dot" indicator-dots="true" circular="true" autoplay="true" interval="5000"
				 duration="500" indicator-color="#8799a3" indicator-active-color="#0081ff" @change="handleSwiper">
					<swiper-item :class="page_status.current_swiper === index ? 'cur' : ''" v-for="(img, index) in page_data.activity_info.imgList"
					 @tap="ViewImage(img)">
						<view class="swiper-item">
							<image :src="img" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper> -->
				<swiper class="screen-swiper round-dot" indicator-dots="true" circular="true" autoplay="true" interval="5000" duration="500">
				  <swiper-item v-for="(img, index) in page_data.activity_info.imgList">
				    <image :src="img" mode="aspectFill"></image>
				  </swiper-item>
				</swiper>
			</view>
			<view class="content-main-title padding-lr text-bold text-xl" style="background-color: #e54d42; color: white;padding-top: 20px">活动名称: {{page_data.activity_info.activity_name}}</view>
			<view class="content-main-date padding-lr padding-top-sm text-sm" style="background-color: #e54d42; color: white"><text class="cuIcon-timefill text-white margin-right-xs"></text>{{page_data.activity_info.start_time}} - {{page_data.activity_info.end_time}}</view>
			<view class="content-main-address padding-lr padding-tb-sm text-sm" style="background-color: #e54d42; color: white"><text class="cuIcon-locationfill text-white margin-right-xs"></text>{{page_data.activity_info.address}}</view>
			<view class="content-main-progress padding-lr" style="white-space: nowrap;background-color: #e54d42; color: white;padding-bottom: 20px" v-if="!page_status.dos">
				<view class="flex align-center">
					<view style="margin-right: 10px;">报名人数</view>
					<view class="cu-progress round striped active">
						<view class="bg-pink" :style="[{ width: Math.floor(page_data.activity_info.join_female_num * 100 / (page_data.activity_info.num || page_data.activity_info.join_num)) + '%' }]"></view>
						<view class="bg-blue" :style="[{ width: Math.floor(page_data.activity_info.join_male_num * 100 / (page_data.activity_info.num || page_data.activity_info.join_num)) + '%' }]"></view>
					</view>
					<text class="margin-left">{{page_data.activity_info.join_num}} / {{page_data.activity_info.num || '不限'}}</text>
				</view>
			</view>
			<view class="content-main-progress padding-lr" style="white-space: nowrap;background-color: #e54d42; color: white;padding-bottom: 20px" v-else>
				<view class="flex align-center">
					<view style="margin-right: 10px;">男生</view>
					<view class="cu-progress round">
						<view class="bg-blue" :style="[{ width: Math.floor(page_data.activity_info.join_male_num * 100 / (page_data.activity_info.male_num || page_data.activity_info.join_male_num)) + '%' }]"></view>
					</view>
					<text class="margin-left">{{page_data.activity_info.join_male_num}} / {{page_data.activity_info.male_num || '不限'}}</text>
				</view>
				<view class="flex align-center margin-top">
					<view style="margin-right: 10px;">女生</view>
					<view class="cu-progress round">
						<view class="bg-pink" :style="[{ width: Math.floor(page_data.activity_info.join_female_num * 100 / (page_data.activity_info.female_num || page_data.activity_info.join_female_num)) + '%' }]"></view>
					</view>
					<text class="margin-left">{{page_data.activity_info.join_female_num}} / {{page_data.activity_info.female_num || '不限'}}</text>
				</view>
			</view>
			<view class="padding-lr" v-if="page_data.activity_info.user ">
				<navigator v-if="page_data.activity_info.user && page_data.activity_info.user.user_name" hover-class='none' style="width: 100%;" :url="'/view/pages/find?invite_id=' + page_data.activity_info.user.invite_id"
				 navigateTo>
					<view class="cu-card case shadow">
						<view class="cu-item shadow" style="margin: 20rpx">
							<view class="flex padding align-center" style="background-color: rgb(254, 240, 240);">
									<view class="cu-avatar round lg margin-right" :style="'background-image:url(' + page_data.activity_info.user.avatar_url + ')'"></view>
									<view class="content flex-sub ">
										<view class="text-grey margin-bottom-xs" >{{page_data.activity_info.user.user_name}}
										</view>
										<view class="text-gray text-sm margin-bottom-xs">
											TEL:{{page_data.activity_info.user.user_phone}}
										</view>
										<view class="text-gray text-sm" v-if="page_data.activity_info.user.address">
											门店地址:{{page_data.activity_info.user.address}}
										</view>
									</view>
							</view>
						</view>
					</view>
				</navigator>
			</view>
			<view class="cu-list menu sm-border margin-top" style="padding-bottom: 55px">
				<view class="cu-item">
					<view>
						<view class="content">
							<text class="cuIcon-titles text-red"></text>
							<text class="text-grey">活动介绍</text>
						</view>
						<view class="content padding-tb padding-lr-sm">
							<text class="text-grey">{{page_data.activity_info.introduction}}</text>
						</view>
					</view>
				</view>
<!-- 				<view class="cu-item" v-if="page_data.activity_info.tag && page_data.activity_info.tag.length > 0">
					<view>
						<view class="content padding-top">
							<text class="cuIcon-titles text-red"></text>
							<text class="text-grey">活动标签</text>
						</view>
						<view class="padding-tb padding-lr-sm">
							<view class='cu-tag' :class="'line-' + page_config.color_config[index]" style="margin: 0 10rpx 10rpx 0" v-for="(tag, index) in page_data.activity_info.tag">{{tag}}</view>
						</view>
					</view>
				</view> --><!-- 
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">性别</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.activity_info.a_b.is_gender_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.gender_array[page_data.activity_info.gender] || '未填写'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">身高</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.activity_info.a_b.is_stature_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{(page_data.activity_info.stature && Number(page_data.activity_info.stature) > -1) ? Number(page_data.activity_info.stature) + 130 + 'cm' : '未填写'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">生日</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.activity_info.a_b.is_age_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_data.activity_info.date || '未填写'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">职业</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_data.activity_info.job || '未填写'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">户籍地</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.activity_info.a_b.is_born_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{born}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">居住地</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.activity_info.a_b.is_live_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{live}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">学历</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.activity_info.a_b.is_education_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.education_array[page_data.activity_info.education] || '未填写'}}</text>
					</view>
				</view>
				<view class="cu-item" style="border-bottom: 1px solid #e5e9f5;">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">婚姻状况</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.activity_info.a_b.is_marriage_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.marriage_array[page_data.activity_info.marriage] || '未填写'}}</text>
					</view>
				</view> -->
			</view>
		</view>
		<view class="box">
			<view class="cu-bar bg-white tabbar border shop">
				<view class="action" v-if="page_data.activity_info.is_collect" @click="handleUnCollectClick">
					<view class="cuIcon-favorfill text-yellow">
					</view>
					取消关注
				</view>
				<view class="action" v-else @click="handleCollectClick">
					<view class="cuIcon-favor">
					</view>
					关注
				</view>
				<button class="action" :open-type="get_activity_info.user_type === 0 ? 'share' : ''" @click="handleShareClick">
					<view class="cuIcon-share text-red">
						<!-- <view class="cu-tag badge">5</view> -->
					</view> 分享
				</button>
				<view class="diy-btn-group" v-if="get_user_info.user_type === 0">
					<view class="diy-btn-group-btn" v-if="page_data.activity_info.user_list.includes('#' + get_user_info.user_id + '#')">
						<button class="cu-btn bg-orange" @click="handleCancelApplyClick" style="border-radius: 0; height: 100%;">
							取消报名
						</button>
					</view>
					<view class="diy-btn-group-btn" v-else>
						<button class="cu-btn bg-red" @click="handleApplyClick" style="border-radius: 0; height: 100%;">
							报名
						</button>
					</view>
				</view>
				<view class="diy-btn-group" v-if="get_user_info.user_type === 1 && get_user_info.user_id === page_data.activity_info.user_id">
					<view class="diy-btn-group-btn">
						<button class="cu-btn bg-red" @click="handleEditClick" style="border-radius: 0; height: 100%;">
							编辑
						</button>
					</view>
				</view>
			</view>
		</view>
		</template>
		<empty text="加载中" v-else></empty>
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
		components: {
			Empty
		},
		data() {
			return {
				areaJson,
				page_config: {
					activity_id: null,
					color_config: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown',
						'grey', 'gray'
					]
				},
				page_data: {
					activity_info: null
				},
				page_status: {
					current_swiper: 0,
					dos: false
				}
			};
		},
		onLoad: async function({
			activity_id
		}) {
			this.page_config.activity_id = activity_id
			this.fetchData()
		},
		onShow() {
			if (this.page_config.current_user_id) this.fetchData()
		},
		onShareAppMessage() {
			let shareObj = {
				title: `欢迎体验${this.get_global_config.app_name}婚恋服务`, // 默认是小程序的名称(可以写slogan等)
				path: `/view/pages/detail?user_id=${this.page_config.current_user_id}&&single=1`,
				imageUrl: this.page_data.activity_info.imgList[0] || this.get_global_config.app_logo
			}
			return shareObj
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info', 'get_global_config'])
		},
		methods: {
			...mapActions(['GET_USER_INFO']),
			handleBackClick() {
				if (this.page_status.single) uni.redirectTo({
					url: './home'
				})
			},
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/activity/get_activity_list', //仅为示例，并非真实接口地址。
					data: {
						from_page: 'activityDetail',
						activity_id: this.page_config.activity_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						if (res.data && res.data.length > 0) {
							let activity = res.data[0]
							this.page_data.activity_info = JSON.parse(activity.snapshoot)
							if (activity.female_num || activity.male_num) this.page_status.dos = true
							this.page_data.activity_info.user_list = activity.user_list
							this.page_data.activity_info.num = Number(activity.num)
							this.page_data.activity_info.male_num = Number(activity.male_num)
							this.page_data.activity_info.female_num = Number(activity.female_num)
							this.page_data.activity_info.join_num = JSON.parse(activity.user_list).length
							this.page_data.activity_info.join_female_num = JSON.parse(activity.user_list).filter(_i => _i.includes('[1]')).length
							this.page_data.activity_info.join_male_num = JSON.parse(activity.user_list).filter(_i => _i.includes('[0]')).length
							this.page_data.activity_info.start_time = new Date(activity.start_time).format("yyyy-MM-dd hh:mm")
							this.page_data.activity_info.end_time = new Date(activity.end_time).format("yyyy-MM-dd hh:mm")
							this.page_data.activity_info.address = this.getLocation(this.page_data.activity_info.areaMultiIndex) + (this.getLocation(this.page_data.activity_info.areaMultiIndex) ? ' ' : '') + this.page_data.activity_info.address
						} else {
						}
					}
				})
			},
			ViewImage(url) {
				uni.previewImage({
					urls: this.page_data.activity_info.imgList,
					current: url
				});
			},
			handleRecommendClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/recommend/recommend',
					data: {
						user_id: this.get_activity_info.user_id,
						recommended_user_id: this.get_activity_info.user_id,
						recommended_to_user_id: this.page_config.current_user_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
					}
				})
			},
			handleShareClick() {
				if (this.get_activity_info.user_type === 0) return
				uni.navigateTo({
					url: `./userList?share_user_id=${this.page_config.current_user_id}&&image=${this.page_data.activity_info.imgList[0] || this.get_global_config.app_logo}`
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
			handleApplyClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/activity/apply',
					data: {
						activity_id: this.page_config.activity_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.fetchData()
					}
				})
			},
			handleCancelApplyClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/activity/cancel_apply',
					data: {
						activity_id: this.page_config.activity_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.fetchData()
					}
				})
			},
			handleEditClick() {
				uni.navigateTo({
					url: `./activityedit?activity_id=${this.page_config.activity_id}`
				})
			},
			handleSwiper(e) {
				this.page_status.current_swiper = e.detail.current
			},
			handleAdminManageClick() {
				uni.navigateTo({
					url: `./usermanage?user_id=${this.page_config.current_user_id}&&leval_id=${this.page_data.activity_info.vip.leval_id}&&end_time=${this.page_data.activity_info.vip.end_time}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background-color: #e54d42;
	}
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
