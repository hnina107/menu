// pages/pbmenutype/pbmenutype.js
import {tables,admin} from '../../utils/config'
import Db from '../../utils/db'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showAddInput:false,
    showUpdateInput:false,
    cateName:"",
    cates:[],//所有菜谱
    cate:{}//修改的菜谱
  },
  //显示添加
  _showAddBtn:function(){
    this.setData({
      showAddInput:!this.data.showAddInput
    })
  },
  //获取用户输入的名称
  _getCateName:function(e){
    this.setData({
      cateName:e.detail.value
    })
  },
  _addCate:async function(){
    //检查分类名称的合法性
    if(this.data.cateName==""){
      wx.showToast({
        title: '分类名不能为空',
        icon:'none'
      })
      return
    }
    //检查分类是否存在
    let index=this.data.cates.findIndex(item=>{
      return item.cateName==this.data.cateName
    })
    if(index==-1){
      //往cate表中添加一条记录
      let res= await Db.add(tables.cate,{
        cateName:this.data.cateName
      })
      if(res._id){
       
        wx.showToast({
          title: '添加分类成功',
        })
        this._getCates()
      }else{
        wx.showToast({
          title: '添加分类失败',
          icon:'none'
        })
      }
      this._showAddBtn()
    }else{
      wx.showToast({
        title: '分类名称已存在',
        icon:'none'
      })
    }
  },
  //删除分类
  _deleteCate:async function(e){
    let index=e.currentTarget.dataset.index
    //删除数据
    let res=await Db.remove(tables.cate,this.data.cates[index]._id);
    console.log(res);
    if(res.stats.removed){
      wx.showToast({
        title: '删除成功',
      })
      this._getCates();
    }else{
      wx.showToast({
        title: '删除失败',
        icon:'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getCates()
  },
  //获取所有的菜谱
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
  _showUpdateBtn:function(e){
    let index=e.currentTarget.dataset.index
    this.setData({
      cate:this.data.cates[index],
      cateName:this.data.cates[index].cateName
    })
    this.setData({
      showUpdateInput:!this.data.showUpdateInput
    })
  },
  _updateCate:async function(){
    if(this.data.cateName==""){
      wx.showToast({
        title: '分类名不能为空',
        icon:'none'
      })
      return
    }
    //先从数据库中查询有没有该分类
    let res = await Db.find(tables.cate,{cateName:this.data.cateName})
    if(res.data.length!=0){
      wx.showToast({
        title: '该分类已经存在',
        icon:'none'
      })
      return
    }
    //修改数据库
    res=await Db.update(tables.cate,this.data.cate._id,{
      cateName:this.data.cateName
    })
    if(res.stats.updated){
      wx.showToast({
        title: '修改成功',
      })
      this._getCates();
    }else{
      wx.showToast({
        title: '修改失败',
        icon:'none'
      })
    }
    this.setData({
      showUpdateInput:false
    })
   
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