// pages/recipeDetail/recipeDetail.js
// pages/typelist/typelist.js
import Db from '../../utils/db'
import {tables} from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFollow:false,
    isLogin:false,
    id:'',
    menu:{},
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置加载项
    this._setOption(options)
    //根据id获取对应的菜谱
    this._getMenuById()
    //获取菜谱测关注状态
    this._getFollow();
    //将浏览量+1
    this._setView();
  },
  _setFollow:async function(){
    if(this.data.isLogin){
      let _openid=wx.getStorageSync('_openid');
      let menu_id=this.data.id
      if(this.data.isFollow){//取消关注
        let res=await Db.removeByWhere(tables.collect,{_openid,menu_id})
        if(res.stats.removed){
          Db.update(tables.menu,this.data.id,{
            collect_num:Db._.inc(-1)
          })
          wx.showToast({
            title:'取消成功',
            success:res=>{
              this.setData({
                isFollow:false
              })
            }
          })   
        }
      }else{//关注
        //往收藏表中添加一条记录
        let res=await Db.add(tables.collect,{
          menu_id:this.data.id
        })
        if(res._id){
           //收藏量+1
           Db.update(tables.menu,this.data.id,{
            collect_num:Db._.inc(1)
          })
           //改变状态
           wx.showToast({
            title:'收藏成功',
            success:res=>{
              this.setData({
                isFollow:true
              })
            }
          })
        }
      }
    }else{
      wx.showToast({
        title: '请先登录',
        icon:'none',
      })
    }
  },
  //设置浏览量
  _setView:function(){
    Db.update(tables.menu,this.data.id,{
      view_num:Db._.inc(1)
    })
  },
  //关注的状态
  _getFollow:async function(){
    let isLogin=wx.getStorageSync('isLogin')||false
    let _openid=wx.getStorageSync('_openid')||""
    if(isLogin && _openid!=""){//登录
      //判断当前登录的用户和访问的菜谱的关系
      this.setData({
        isLogin:true
      })
      let res=await Db.find(tables.collect,{menu_id:this.data.id,_openid});
      if(res.data.length!=0){
        this.setData({
          isFollow:true
        })
      }
    }
  },
  //获取菜谱
  _getMenuById:async function(){
    let res=await Db.findOne(tables.menu,this.data.id)
    this.setData({
      menu:res.data
    })
    //获取用户信信息
    res=await Db.find(tables.user,{_openid:res.data._openid})
    this.setData({
      userInfo:res.data[0].userInfo
    })
    //获取用户对菜谱的状态
  },
  //设置选项
  _setOption:function(option){
    this.setData({
      id:option.id
    })
    wx.setNavigationBarTitle({
      title:option.menuName
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
  onShareAppMessage: function (e) {
    if(e.from=="button"){//分享的是页面
      return {
        title:this.data.menu.menu_name+"的做法",
        path:"/pages/recipeDetail/recipeDetail?id="+this.data.menu._id+"&menuName="+this.data.menu.menu_name,
        imageUrl:this.data.menu.img[0]
      }
    }
    if(e.from=="menu"){//分享的是小程序
      return {
        title:"学做菜，学菜谱，谢霆锋",
        path:"/pages/index/index",
        imageUrl:"cloud://music-dev-wi2lv.6d75-music-dev-wi2lv-1302673657/1.jpg"
      }
    }
  },
  onShareTimeline(){
    return {
      title:"好吃美味的"+this.data.menu.menu_name,
      imageUrl:this.data.menu.img[0]
    }
  }
})