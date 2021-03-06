import Db from '../../utils/db'
import {tables} from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMore:true,//用来记录下面有没有数据
    page:1,//记录加载到第几页了
    hotMenu:[],
    cate:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取前三个分类
    this._getCate()
    //获取热门菜谱
    this._getHotMenu(1)
  },
  //进入分类列表
  _goCateList:function(){
    wx.navigateTo({
      url: '../typelist/typelist'
    })
  },
  _goMenuList:function(e){
    let index=e.currentTarget.dataset.index
    let id=this.data.cate[index]._id;
    let cateName =this.data.cate[index].cateName;
    wx.navigateTo({
      url: `../recipelist/recipelist?id=${id}&cateName=${cateName}`,
    })
  },
  //获取前三个分类
  _getCate:async function(){
    let res=await Db.findByPage(tables.cate,{},1,3)
    if(res.data.length!=0){
        this.setData({
            cate:res.data
        })
    }
  },
  //热门的菜谱
  _getHotMenu:async function(p){
    if(!this.data.isMore){
        wx.showToast({
          title: '我们是有底线的',
          icon:'none'
        })
        return
    }
    wx.showLoading({
      title: '加载中',
    })
    let res = await Db.findByPage(tables.menu,{menu_status:1},p,6,{field:"menu_time",sort:"desc"});
    if(res.data.length!=0){
        let tasks=[]
        res.data.forEach(item=>{
            let promise=Db.find(tables.user,{_openid:item._openid})
            tasks.push(promise)
        })
        let result=await Promise.all(tasks)
       
        res.data.forEach((item,index)=>{
            item.userInfo=result[index].data[0].userInfo
        })
        console.log(res)
        wx.hideLoading()

        this.setData({
            hotMenu:this.data.hotMenu.concat(res.data)
        })
    }else{
        wx.hideLoading()
        wx.showToast({
            title: '我们是有底线的',
            icon:'none'
        })
        this.setData({
            isMore:false
        })
    }
  },
  //进入详情页
  _goDetail:function(e){
    let index=e.currentTarget.dataset.index
    let id=this.data.hotMenu[index]._id;
    let menuName=this.data.hotMenu[index].menu_name
    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${id}&menuName=${menuName}`,
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
    this.setData({
        page:this.data.page+1
    })
    this._getHotMenu(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})