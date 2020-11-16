import { tables } from "./config";
// 连接数据库
const db = wx.cloud.database();

// 数据库添加
const add=(table,data)=>{
  return db.collection(table).add({
      data
  })
}

// 数据库查询
const find = (table,where={})=>{
  return db.collection(table).where(where).get(  )
}
const findOne=(table,_id)=>{
  return db.collection(table)
  .doc(_id)
  .get()
}
const findAll=async (table,where={})=>{
  const MAX_LIMIT = 1
  const countResult = await db.collection(table).where(where).count();
  const total = countResult.total
  if(total==0){
      return {
          data:[]
      }
  }
// 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  let tasks=[];
  for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection(table)
      .where(where)
      .skip(i * MAX_LIMIT).limit(MAX_LIMIT)
      .get()
      tasks.push(promise)
  }
  return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
}
// 数据库删除
const remove=(table,_id)=>{
  return db.collection(table)
  .doc(_id)
  .remove()
}
const update =(table,_id,data)=>{
  return db.collection(table)
  .doc(_id)
  .update({
      data
  })
}
//处理上传
const upload=(fileList,dir="x_caipu")=>{
  let tasks=[];
  fileList.forEach(item=>{
      let ext=item.url.split(".").pop()
      let filename=(new Date).getTime()+Math.random()+"."+ext
      let promise = wx.cloud.uploadFile({
          cloudPath:dir+"/"+filename,
          filePath: item.url,
      })
      tasks.push(promise);
  })
  return Promise.all(tasks)
}
 const _ = db.command

 //封装数据的分页
const findByPage=(table,where={},page=1,limit=10,order={field:'_id',sort:'asc'})=>{
  //偏移量=(页数-1)*每页显示的条数
  let start=(page-1)*limit;
  return  db.collection(table)
  .where(where)
  .skip(start)
  .limit(limit)
  .orderBy(order.field,order.sort)
  .get()
}

const removeByWhere=(table,where={})=>{
  return db.collection(table)
  .where(where)
  .remove()
}
// 导出
export default{
  add,
  find,
  findAll,
  remove,
  update,
  upload,
  findOne,
  findByPage,
  removeByWhere,
  _,
  db
}