// pages/pbmenu/pbmenu.js
import {tables,admin} from '../../utils/config'
import Db from '../../utils/db'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cates:[],
    fileList:[]//选择的图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取所有的菜谱的分类
    this._getCates();
  },
  _getCates:async function(){
    wx.showLoading({
      title: '加载中',
    })
    //从数据库查询
    let res=await Db.findAll(tables.cate)
    if(res.data.length!=0){
      this.setData({
        cates:res.data
      })
    }else{
      this.setData({
        cates:[]
      })
    }
    wx.hideLoading()
  },
  //选择图片
  _selectImg:function(e){
    let fileList=e.detail.tempFilePaths.map(item=>{
      return {
        url:item
      }
    })
    this.setData({
      fileList:fileList
    })
  },
  //删除图片
  _deleteImg:function(e){
    this.data.fileList.splice(e.detail.index,1)
  },
  _publishMenu:async function(e){
    let {menu_name,cate_id,menu_info} = e.detail.value
    //检查用户输入的合法性
    if(menu_name==""||menu_info==""||this.data.fileList.length==0){
      wx.showToast({
        title: '请完善菜谱信息',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '发布中',
    })
    //上传图片
    let res = await Db.upload(this.data.fileList)
    if(res.length==0||res.length!=this.data.fileList.length){
      wx.showToast({
        title: '上传失败',
        icon:'none'
      })
      return
    }
    let img=res.map(item=>{
      return item.fileID
    })
    //入库
    res=await Db.add(tables.menu,{
      menu_name,
      cate_id,
      img,
      menu_info,
      collect_num:0,
      view_num:0,
      menu_time:(new Date).getTime(),
      menu_status:1
    })
    wx.hideLoading()
    //跳转
    if(res._id){
      setTimeout(()=>{
        wx.navigateBack()
      },1000)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})