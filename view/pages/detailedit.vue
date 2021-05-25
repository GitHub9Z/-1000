<template>
	<view class="content">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">编辑资料</block>
		</cu-custom>
		<view class="content-main">
			<view class="cu-list menu sm-border ">
				<view class="cu-item" >
					<view style="width: 100%;">
						<view class="content">
							<text class="cuIcon-titles text-green"></text>
							<text class="text-grey">个人照片</text>
						</view>
						<view class="content padding-tb padding-lr-sm">
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item,index) in page_data.user_info.imgList" :key="index" @tap="ViewImage" :data-url="page_data.user_info.imgList[index]">
									<image :src="page_data.user_info.imgList[index]" mode="aspectFill"></image>
									<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
										<text class='cuIcon-close'></text>
									</view>
								</view>
								<view class="solids" @tap="ChooseImage" v-if="page_data.user_info.imgList.length<4">
									<text class='cuIcon-cameraadd'></text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-item" >
					<view style="width: 100%;">
						<view class="content padding-top">
							<text class="cuIcon-titles text-green"></text>
							<text class="text-grey">自我介绍</text>
						</view>
						<view class="content padding-tb padding-lr-sm">
							<textarea maxlength="-1" placeholder="多行文本输入框" v-model="page_data.user_info.introduction"></textarea>
						</view>
					</view>
				</view>
				<view class="cu-item" >
					<view style="width: 100%;">
						<view class="content padding-top">
							<text class="cuIcon-titles text-green"></text>
							<text class="text-grey">兴趣标签</text>
						</view>
						<view class="padding-tb padding-lr-sm">
							<view class='cu-tag' :class="'line-' + page_config.color_config[index]" v-for="(item, index) in page_data.user_info.hobby" @click="handleHobbyDelete(index)">{{item}}</view>
							<view class='cu-tag line-grey' @click="handleHobbyAdd">添加 +</view>
						</view>
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">性别</text>
					</view>
					<view class="action">
						<picker @change="handleGenderPickerChange" :value="page_data.user_info.gender" :range="page_config.gender_array">
							<view class="picker">
								{{ page_config.gender_array[page_data.user_info.gender] || '选择性别' }}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">身高</text>
					</view>
					<view class="action">
						<picker @change="handleStaturePickerChange" :value="page_data.user_info.stature" :range="page_config.stature_array">
							<view class="picker">
								{{ page_config.stature_array[page_data.user_info.stature] || '选择身高' }}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">生日</text>
					</view>
					<view class="action">
						<picker mode="date" :value="page_data.user_info.date" start="1930-01-01" @change="handleDatePickerChange">
							<view class="picker">
								{{page_data.user_info.date || '选择日期'}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">职业</text>
					</view>
					<view class="action">
						<input placeholder="请输入职业"
							 v-model="page_data.user_info.job" name="input" style="width: 100%; text-align: right;"></input>
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">户籍地</text>
					</view>
					<view class="action">
						<picker mode="multiSelector" @change="handleBornMultiChange" @columnchange="handleBornMultiColumnChange" :value="bornMultiIndex"
						 :range="page_config.bornMultiArray">
							<view class="picker">
								{{born}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">居住地</text>
					</view>
					<view class="action">
						<picker mode="multiSelector" @change="handleLiveMultiChange" @columnchange="handleLiveMultiColumnChange" :value="page_data.user_info.liveMultiIndex"
						 :range="page_config.liveMultiArray">
							<view class="picker">
								{{live}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" >
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">学历</text>
					</view>
					<view class="action">
						<picker @change="handleEducationPickerChange" :value="page_data.user_info.education" :range="page_config.education_array">
							<view class="picker">
								{{ page_config.education_array[page_data.user_info.education] || '选择学历' }}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" style="margin-bottom: 50px;">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">婚姻状况</text>
					</view>
					<view class="action">
						<picker @change="handleMarriagePickerChange" :value="page_data.user_info.marriage" :range="page_config.marriage_array">
							<view class="picker">
								{{ page_config.marriage_array[page_data.user_info.marriage] || '选择' }}
							</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<view class="content-save">
			<button class="cu-btn bg-red lg" @click="handleSaveClick">保存</button>
		</view>
		<view class="cu-modal" :class="page_status.hobby_modal_visible ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content" style="padding-bottom: 0;">添加兴趣标签</view>
					<view class="action" @tap="page_status.hobby_modal_visible = false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view style="background-color: white; margin-bottom: 20px; padding: 5px; border-radius: 5px;"><input placeholder="请输入标签内容"
						 v-model="page_status.input_hobby" name="input" style="width: 100%;"></input></view>
					<view><button class="cu-btn block bg-red margin-tb-sm lg" style="width: 100%;" :disabled="!page_status.input_hobby"
						 @click="handleAddHobbyConfirm">确定</button></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import areaJson from '../../utils/area.js'
	import {
		mapState,
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex'
	import Empty from '../component/empty.vue'
	export default {
		components: {
			Empty
		},
		data() {
			return {
				page_config: {
					color_config: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown', 'grey', 'gray'],
					gender_array: ['男', '女'],
					stature_array: Array.from(Array(81)).map((e, i) => 130 + i + 'cm'),
					education_array: ['小学', '初中', '中专/高中', '专科 ', '本科', '硕士', '博士'],
					marriage_array: ['未婚', '离异', '丧偶'],
					liveMultiArray: [
						areaJson.map(_i => _i.name),
						areaJson[0].city.map(_i => _i.name),
						areaJson[0].city[0].area
					],
					bornMultiArray: [
						areaJson.map(_i => _i.name),
						areaJson[0].city.map(_i => _i.name),
						areaJson[0].city[0].area
					]
				},
				page_data: {
					user_info: {
						imgList: [],
						introduction: '',
						gender: null,
						stature: null,
						education: '',
						marriage: '',
						hobby: [],
						date: '',
						job: '程序员',
						bornMultiIndex: null,
						liveMultiIndex: null,
					},
				},
				page_status: {
					hobby_modal_visible: false,
					input_hobby: '',
					bornChoosingIndex: [0, 0, 0],
					liveChoosingIndex: [0, 0, 0],
				}
			};
		},
		onLoad: function({
			coin_id
		}) {
			this.page_data.current_coin_id = coin_id
			this.fetchData()
		},
		onShow() {
			//this.fetchData()
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info']),
			born() {
				if (!this.page_data.user_info.bornMultiIndex) return '请选择'
				let [province_index, city_index, area_index] = this.page_data.user_info.bornMultiIndex
				// if (!province_index && !city_index && !area_index) return '请选择'
				// if (!city_index && !area_index) return areaJson[province_index].name
				// if (!area_index) return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name}`
				return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name} ${areaJson[province_index].city[city_index].area[area_index]}`
			},
			live() {
				if (!this.page_data.user_info.liveMultiIndex) return '请选择'
				let [province_index, city_index, area_index] = this.page_data.user_info.liveMultiIndex
				// if (!province_index && !city_index && !area_index) return '请选择'
				// if (!city_index && !area_index) return areaJson[province_index].name
				// if (!area_index) return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name}`
				return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name} ${areaJson[province_index].city[city_index].area[area_index]}`
			},
			modified_user_info() {
				return JSON.stringify(this.page_data.user_info)
			}
		},
		methods: {
			...mapActions(['GET_USER_INFO', 'UPLOAD_FILE']),
			async fetchData() {
				await this.GET_USER_INFO()
				if (this.get_user_info.user_info) this.page_data.user_info = JSON.parse(this.get_user_info.user_info)
			},
			handleHobbyAdd() {
				this.page_status.hobby_modal_visible = true
			},
			handleAddHobbyConfirm() {
				this.page_data.user_info.hobby.push(this.page_status.input_hobby)
				this.page_status.input_hobby = ''
				this.page_status.hobby_modal_visible = false
			},
			handleHobbyDelete(index) {
				uni.showModal({
					title: '提示',
					content: '是否删除该标签',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							this.page_data.user_info.hobby.splice(index, 1)
						} else {}
					}
				})
			},
			handleGenderPickerChange(e) {
				this.$set(this.page_data.user_info, 'gender', e.detail.value)
			},
			handleStaturePickerChange(e) {
				this.$set(this.page_data.user_info, 'stature', e.detail.value)
			},
			handleEducationPickerChange(e) {
				this.$set(this.page_data.user_info, 'education', e.detail.value)
			},
			handleMarriagePickerChange(e) {
				this.$set(this.page_data.user_info, 'marriage', e.detail.value)
			},
			handleDatePickerChange(e) {
				this.$set(this.page_data.user_info, 'date', e.detail.value)
			},
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: async (res) => {
						uni.showLoading({
							title: '上传中',
							mask: true
						})
						let pool = res.tempFilePaths.map(_i => this.UPLOAD_FILE(_i))
						let upload_res = await Promise.all(pool)
						uni.hideLoading()
						uni.hidden
						if (this.page_data.user_info.imgList.length != 0) {
							this.page_data.user_info.imgList = this.page_data.user_info.imgList.concat(upload_res)
						} else {
							this.page_data.user_info.imgList = upload_res
						}
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.page_data.user_info.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '亲爱的用户',
					content: '确定删除这张照片？',
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							this.page_data.user_info.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			handleBornMultiChange(e) {
				this.page_data.user_info.bornMultiIndex = e.detail.value
				this.$forceUpdate()
			},
			handleBornMultiColumnChange(e) {
				this.page_status.bornChoosingIndex[e.detail.column] = e.detail.value
				if (e.detail.column === 0) {
					this.page_config.bornMultiArray[1] = areaJson[e.detail.value].city.map(_i => _i.name)
					if (!areaJson[e.detail.value].city[this.page_status.bornChoosingIndex[1]]) {
						this.page_status.bornChoosingIndex[1] = areaJson[e.detail.value].city.length - 1
					}
					this.page_config.bornMultiArray[2] = areaJson[e.detail.value].city[this.page_status.bornChoosingIndex[1]].area
				}
				if (e.detail.column === 1) {
					this.page_config.bornMultiArray[2] = areaJson[this.page_status.bornChoosingIndex[0]].city[e.detail.value].area
				}
				this.$forceUpdate()
			},
			handleLiveMultiChange(e) {
				this.page_data.user_info.liveMultiIndex = e.detail.value
				this.$forceUpdate()
			},
			handleLiveMultiColumnChange(e) {
				this.page_status.liveChoosingIndex[e.detail.column] = e.detail.value
				if (e.detail.column === 0) {
					this.page_config.liveMultiArray[1] = areaJson[e.detail.value].city.map(_i => _i.name)
					if (!areaJson[e.detail.value].city[this.page_status.liveChoosingIndex[1]]) {
						this.page_status.liveChoosingIndex[1] = areaJson[e.detail.value].city.length - 1
					}
					this.page_config.liveMultiArray[2] = areaJson[e.detail.value].city[this.page_status.liveChoosingIndex[1]].area
				}
				if (e.detail.column === 1) {
					this.page_config.liveMultiArray[2] = areaJson[this.page_status.liveChoosingIndex[0]].city[e.detail.value].area
				}
				this.$forceUpdate()
			},
			handleSaveClick() {
				console.log(this.page_data.user_info)
				uni.request({
					url: 'https://www.imgker.com/venus/user/update_user_info', //仅为示例，并非真实接口地址。
					data: {
						user_info: this.modified_user_info
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

		.content-main {
			background-color: white;
			padding: 20px 0;
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
