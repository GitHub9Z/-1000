<template>
	<view class="content" v-if="page_data && get_system_info.normal">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="this.page_status.single ? false : true">
			<block slot="backText" @click="handleBackClick">θΏε</block>
			<block slot="content">{{page_data.user_info ? page_data.user_info.user_name : 'θ΅ζ'}}</block>
		</cu-custom>
		<template v-if="page_data.user_info">
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
			<view class="padding-lr" v-if="page_data.user_info.admin ">
				<!-- 				<navigator hover-class='none' style="width: 100%;" :url="'/view/pages/find?invite_id=' + page_data.user_info.admin.invite_id"
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
				</navigator> -->
				<navigator v-if="page_data.user_info.admin && page_data.user_info.admin.user_name" hover-class='none' style="width: 100%;" :url="'/view/pages/find?invite_id=' + page_data.user_info.admin.invite_id"
				 navigateTo>
					<view class="cu-card case shadow">
						<view class="cu-item shadow" style="margin: 20rpx">
							<view class="padding bg-red" v-if="page_data.user_info.tips">
								<text style="font-size: 14px; letter-spacing: 2px;">ηΊ’ε¨ε―θ―­: {{page_data.user_info.tips}}</text>
							</view>
							<view class="flex padding align-center" style="background-color: rgb(254, 240, 240);">
									<view class="cu-avatar round lg margin-right" :style="'background-image:url(' + page_data.user_info.admin.avatar_url + ')'"></view>
									<view class="content flex-sub ">
										<view class="text-grey margin-bottom-xs" >{{page_data.user_info.admin.user_name}}
										</view>
										<view class="text-gray text-sm margin-bottom-xs">
											TEL:{{page_data.user_info.admin.user_phone}}
										</view>
										<view class="text-gray text-sm" v-if="page_data.user_info.admin.address">
											ι¨εΊε°ε:{{page_data.user_info.admin.address}}
										</view>
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
							<text class="cuIcon-titles text-red"></text>
							<text class="text-grey">θͺζδ»η»</text>
						</view>
						<view class="content padding-tb padding-lr-sm">
							<text class="text-grey">{{page_data.user_info.introduction}}</text>
						</view>
					</view>
				</view>
				<view class="cu-item" v-if="page_data.user_info.hobby && page_data.user_info.hobby.length > 0">
					<view>
						<view class="content padding-top">
							<text class="cuIcon-titles text-red"></text>
							<text class="text-grey">ε΄θΆ£ζ η­Ύ</text>
						</view>
						<view class="padding-tb padding-lr-sm">
							<view class='cu-tag' :class="'line-' + page_config.color_config[index]" style="margin: 0 10rpx 10rpx 0" v-for="(tag, index) in page_data.user_info.hobby">{{tag}}</view>
						</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">ζ§ε«</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.a_b.is_gender_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.gender_array[page_data.user_info.gender] || 'ζͺε‘«ε'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">θΊ«ι«</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.a_b.is_stature_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{(page_data.user_info.stature && Number(page_data.user_info.stature) > -1) ? Number(page_data.user_info.stature) + 130 + 'cm' : 'ζͺε‘«ε'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">ηζ₯</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.a_b.is_age_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_data.user_info.date || 'ζͺε‘«ε'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">θδΈ</text>
					</view>
					<view class="action">
						<text class="text-black">{{page_data.user_info.job || 'ζͺε‘«ε'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">ζ·η±ε°</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.a_b.is_born_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{born}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">ε±δ½ε°</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.a_b.is_live_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{live}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">ε­¦ε</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.a_b.is_education_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.education_array[page_data.user_info.education] || 'ζͺε‘«ε'}}</text>
					</view>
				</view>
				<view class="cu-item" style="border-bottom: 1px solid #e5e9f5;">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">ε©ε§»ηΆε΅</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.a_b.is_marriage_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.marriage_array[page_data.user_info.marriage] || 'ζͺε‘«ε'}}</text>
					</view>
				</view>
			</view>
			<view class="cu-list menu sm-border">
				<view class="cu-item">
					<view>
						<view class="content">
							<text class="cuIcon-titles text-red"></text>
							<text class="text-grey">ζ©εΆζ‘δ»Ά</text>
						</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">ζ§ε«</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.b_a.is_gender_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.gender_array[page_data.user_require.genderIndex - 1] || 'δΈι'}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">θΊ«ι«</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.b_a.is_stature_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{stature}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">εΉ΄ιΎ</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.b_a.is_age_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{age}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">ζ·η±ε°</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.b_a.is_born_match"></text>
					</view>
					<view class="action">
						<text class="text-black" v-if="page_data.user_require && page_data.user_require.bornPool">{{(page_data.user_require.bornPool.length <= 0) ? 'δΈι' : `ε·²ι${page_data.user_require.bornPool.length}δΈͺ`}}</text>
						<text class="text-black" v-else>δΈι</text>
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
						<text class="text-grey">ε±δ½ε°</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.b_a.is_live_match"></text>
					</view>
					<view class="action">
						<text class="text-black" v-if="page_data.user_require && page_data.user_require.livePool">{{(page_data.user_require.livePool.length <= 0) ? 'δΈι' : `ε·²ι${page_data.user_require.livePool.length}δΈͺ`}}</text>
						<text class="text-black" v-else>δΈι</text>
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
						<text class="text-grey">ε­¦ε</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.b_a.is_education_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.education_array[page_data.user_require.educationIndex - 1] || 'δΈι'}}</text>
					</view>
				</view>
				<view class="cu-item" style="margin-bottom: 100px; border-bottom: 1px solid #e5e9f5;">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">ε©ε§»ηΆε΅</text>
						<text class="cuIcon-roundclosefill text-red margin-lr-xs" v-if="!page_data.user_info.b_a.is_marriage_match"></text>
					</view>
					<view class="action">
						<text class="text-black">{{page_config.marriage_array[page_data.user_require.marriageIndex - 1] || 'δΈι'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="box">
			<view class="cu-bar bg-white tabbar border shop" v-if="get_user_info.user_id !== page_config.current_user_id">
				<button class="action" @click="handleRecommendClick" v-if="get_user_info.user_type === 0">
					<view class="cuIcon-pullup text-green">
						<!-- <view class="cu-tag badge">5</view> -->
					</view> θͺθ
				</button>
				<view class="action" v-if="page_data.user_info.is_collect" @click="handleUnCollectClick">
					<view class="cuIcon-favorfill text-yellow">
					</view>
					εζΆε³ζ³¨
				</view>
				<view class="action" v-else @click="handleCollectClick">
					<view class="cuIcon-favor">
					</view>
					ε³ζ³¨
				</view>
				<button class="action" :open-type="get_user_info.user_type === 0 ? 'share' : ''" @click="handleShareClick">
					<view class="cuIcon-share text-red">
						<!-- <view class="cu-tag badge">5</view> -->
					</view> εδΊ«
				</button>
				<view class="diy-btn-group">
					<template v-if="get_user_info.user_type === 0">
						<view class="diy-btn-group-btn" v-if="page_data.user_info.yh">
							<button class="cu-btn bg-gray" disabled style="border-radius: 0; height: 100%;">{{page_config.date_status_config[page_data.user_info.yh.status]}}</button>
						</view>
						<view class="diy-btn-group-btn" v-else-if="!page_data.user_info.callable" @click="handleContactClick">
							<button class="cu-btn bg-orange" style="border-radius: 0; height: 100%;">ηΊ¦δΌ</button>
						</view>
					</template>
					<template v-if="page_data.user_info.callable">
						<view class="diy-btn-group-btn">
							<button class="cu-btn bg-orange" @click="handleAdminContactClick" style="border-radius: 0; height: 100%;"><text
								 class="cuIcon-mobilefill margin-right-xs text-white"></text>η΅θ―</button>
						</view>
					</template>
					<template v-if="page_data.user_info.invite_id === get_user_info.invite_id && get_user_info.user_type === 1">
						<view class="diy-btn-group-btn">
							<button class="cu-btn bg-red" @click="handleAdminManageClick" style="border-radius: 0; height: 100%;"><text
								 class="cuIcon-settingsfill margin-right-xs text-white"></text>η?‘η</button>
						</view>
					</template>
				</view>
			</view>
		</view>
		</template>
		<empty text="ε θ½½δΈ­" v-else></empty>
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
					current_user_id: null,
					color_config: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown',
						'grey', 'gray'
					],
					gender_array: ['η·', 'ε₯³'],
					education_array: ['ε°ε­¦', 'εδΈ­', 'δΈ­δΈ/ι«δΈ­', 'δΈη§ ', 'ζ¬η§', 'η‘ε£«', 'εε£«'],
					marriage_array: ['ζͺε©', 'η¦»εΌ', 'δΈ§εΆ'],
					date_status_config: ['η³θ―·δΈ­', 'ηΊ¦δΌδΈ­', 'ζη±δΈ­', 'ε·²θ?’ε©', 'ε·²η»ε©'],
					ageMultiArray: [
						['δΈι', ...Array.from(Array(43)).map((e, i) => 18 + i + 'ε²')],
						['δΈι', ...Array.from(Array(43)).map((e, i) => 18 + i + 'ε²')],
					],
					statureMultiArray: [
						['δΈι', ...Array.from(Array(81)).map((e, i) => 130 + i + 'cm')],
						['δΈι', ...Array.from(Array(81)).map((e, i) => 130 + i + 'cm')]
					],
				},
				page_data: {
					user_info: null,
					user_require: {},
					my_user_info: {},
					my_user_require: {}
				},
				page_status: {
					current_swiper: 0,
					single: false
				}
			};
		},
		onLoad: async function({
			user_id,
			single
		}) {
			this.page_config.current_user_id = user_id
			if (single) {
				await this.GET_USER_INFO()
				this.page_status.single = true
			}
			this.fetchData()
		},
		onShow() {
			if (this.page_config.current_user_id) this.fetchData()
		},
		onShareAppMessage() {
			let shareObj = {
				title: `ζ¬’θΏδ½ιͺ${this.get_global_config.app_name}ε©ζζε‘`, // ι»θ?€ζ―ε°η¨εΊηεη§°(ε―δ»₯εsloganη­)
				path: `/view/pages/detail?user_id=${this.page_config.current_user_id}&&single=1`,
				imageUrl: this.page_data.user_info.imgList[0] || this.get_global_config.app_logo
			}
			return shareObj
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info', 'get_global_config']),
			born() {
				try {
					if (!this.page_data.user_info) return null
					if (!this.page_data.user_info.bornMultiIndex) return 'ζͺε‘«ε'
					let [province_index, city_index, area_index] = this.page_data.user_info.bornMultiIndex
					return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name} ${areaJson[province_index].city[city_index].area[area_index]}`
				} catch (e) {
					console.log(e)
				}
			},
			live() {
				try {
					if (!this.page_data.user_info) return null
					if (!this.page_data.user_info.liveMultiIndex) return 'ζͺε‘«ε'
					let [province_index, city_index, area_index] = this.page_data.user_info.liveMultiIndex
					return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name} ${areaJson[province_index].city[city_index].area[area_index]}`
				} catch (e) {
					console.log(e)
				}
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
				if (!this.page_data.user_require) return 'δΈι'
				if (!this.page_data.user_require.statureMultiIndex) return 'δΈι'
				let statureMultiIndex = this.page_data.user_require.statureMultiIndex
				let statureMultiArray = this.page_config.statureMultiArray
				if (statureMultiIndex[0] === 0 && statureMultiIndex[1] === 0) return 'δΈι'
				else if (statureMultiIndex[1] === 1) return `${statureMultiArray[1][statureMultiIndex[1]]}`
				else if (statureMultiIndex[0] === 0 && statureMultiIndex[1] > 0) return `${statureMultiArray[1][statureMultiIndex[1]]}δ»₯δΈ`
				else if (statureMultiIndex[0] > 0 && statureMultiIndex[1] === 0) return `${statureMultiArray[0][statureMultiIndex[0]]}δ»₯δΈ`
				else return `${statureMultiArray[0][statureMultiIndex[0]]} - ${statureMultiArray[1][statureMultiIndex[1]]}`
			},
			age() {
				if (!this.page_data.user_require) return 'δΈι'
				if (!this.page_data.user_require.ageMultiIndex) return 'δΈι'
				let ageMultiIndex = this.page_data.user_require.ageMultiIndex
				let ageMultiArray = this.page_config.ageMultiArray
				if (ageMultiIndex[0] === 0 && ageMultiIndex[1] === 0) return 'δΈι'
				else if (ageMultiIndex[1] === 1) return `${ageMultiArray[1][ageMultiIndex[1]]}`
				else if (ageMultiIndex[0] === 0 && ageMultiIndex[1] > 0) return `${ageMultiArray[1][ageMultiIndex[1]]}δ»₯δΈ`
				else if (ageMultiIndex[0] > 0 && ageMultiIndex[1] === 0) return `${ageMultiArray[0][ageMultiIndex[0]]}δ»₯δΈ`
				else return `${ageMultiArray[0][ageMultiIndex[0]]} - ${ageMultiArray[1][ageMultiIndex[1]]}`
			}
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
					url: 'https://www.imgker.com/venus/user/get_user_info',
					data: {
						wanna_user_id: this.page_config.current_user_id
					},
					header: {
						'custom-header': 'hello' //θͺε?δΉθ―·ζ±ε€΄δΏ‘ζ―
					},
					success: (res) => {
						if (!res.data.user_info) {
							this.page_data.user_info = null
							return 
						}
						this.page_data.user_info = JSON.parse(res.data.user_info || '{}')
						// this.page_data.user_info.stature = typeof(this.page_data.user_info.stature) === 'string' ? Number(this.page_data.user_info.stature) : -1
						this.page_data.user_info.is_collect = res.data.is_collect
						this.page_data.user_info.invite_id = res.data.invite_id
						this.page_data.user_info.yh = res.data.date
						this.page_data.user_info.admin = res.data.admin
						this.page_data.user_info.user_name = res.data.user_name
						this.page_data.user_info.user_phone = res.data.user_phone
						this.page_data.user_info.callable = res.data.callable
						this.page_data.user_require = JSON.parse(res.data.user_require || '{}')
						this.page_data.user_info.a_b = res.data.a_b
						this.page_data.user_info.b_a = res.data.b_a
						this.page_data.user_info.vip = res.data.vip || {
							leval_id: 0,
							end_time: 0
						}
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
						'custom-header': 'hello' //θͺε?δΉθ―·ζ±ε€΄δΏ‘ζ―
					},
					success: (res) => {
					}
				})
			},
			handleShareClick() {
				if (this.get_user_info.user_type === 0) return
				uni.navigateTo({
					url: `./userList?share_user_id=${this.page_config.current_user_id}&&image=${this.page_data.user_info.imgList[0] || this.get_global_config.app_logo}`
				})
			},
			handleCollectClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/collect/collect',
					data: {
						collected_user_id: this.page_config.current_user_id
					},
					header: {
						'custom-header': 'hello' //θͺε?δΉθ―·ζ±ε€΄δΏ‘ζ―
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
						'custom-header': 'hello' //θͺε?δΉθ―·ζ±ε€΄δΏ‘ζ―
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
						'custom-header': 'hello' //θͺε?δΉθ―·ζ±ε€΄δΏ‘ζ―
					},
					success: (res) => {
						this.fetchData()
						res = res.data
						if (res.status === 302) {
							uni.showModal({
								title: 'ζη€Ί',
								content: res.message,
								cancelText: "εζΆ", // εζΆζι?ηζε­  
								confirmText: "η‘?θ?€", // η‘?θ?€ζι?ζε­  
								showCancel: true, // ζ―ε¦ζΎη€ΊεζΆζι?οΌι»θ?€δΈΊ true
								confirmColor: '#f55850',
								cancelColor: '#39B54A',
								success: (r) => {
									if (r.confirm) {
										const price = res.data.date_price
										uni.request({
											url: `https://www.imgker.com/venus/date/pay_for_date?openid=${this.get_user_info.open_id}&amount=${price}`,
											success: res => {
												if (res.data.error_code == 0) {
													//ζε
													var _signtext =
														`appId=${this.$appId}&nonceStr=${res.data.result.nonceStr}&package=prepay_id=${res.data.result.package}&signType=MD5&timeStamp=${res.data.result.timeStamp}&key=${this.$mchKey}`; //εζ·keyδΈε?θ¦θ‘₯οΌι‘ΊεΊδΈθ¦ιδΎΏθ°ζ΄
													var paysign = this.$md5.hexMD5(_signtext); //md5ιζ°ε ε―ηζη­Ύε
													console.log(_signtext, paysign)
													//εΌε§θ°θ΅·ζ―δ»
													wx.requestPayment({
														timeStamp: res.data.result.timeStamp + '', //η»δΈδΈεθΏε
														nonceStr: res.data.result.nonceStr, //η»δΈδΈεθΏε
														package: "prepay_id=" + res.data.result.package,
														//δΈε?θ¦εprepay_id=   δΈηΆδΌζ₯total_feeιθ――
														signType: 'MD5', //η­Ύεη?ζ³
														paySign: paysign.toUpperCase(),
														//δΈθ½η¨η»δΈδΈεηη­ΎεοΌιιζ°η­Ύε!!!!
														success: (res) => {
															console.log(res, 'εΎ?δΏ‘ζ―δ»ζεοΌοΌοΌ')
															//δΈͺζ§εδΈε‘ε€η
															uni.request({
																url: 'https://www.imgker.com/venus/date/apply',
																data: {
																	to_user_id: this.page_config.current_user_id,
																	price
																},
																header: {
																	'custom-header': 'hello' //θͺε?δΉθ―·ζ±ε€΄δΏ‘ζ―
																},
																success: () => {
																	this.fetchData()
																}
															})
														}
													})
												} else {
													console.log(res, "ζ―δ»ε€±θ΄₯οΌ" + res.msg);
												}
											}
										})
									} else {}
								}
							})
						}
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
			handleAdminManageClick() {
				uni.navigateTo({
					url: `./usermanage?user_id=${this.page_config.current_user_id}&&leval_id=${this.page_data.user_info.vip.leval_id}&&end_time=${this.page_data.user_info.vip.end_time}`
				})
			}
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
