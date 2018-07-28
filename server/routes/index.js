let express = require('express');
let mysql =require('mysql');
let $sql=require('../sql/sqlMap');
let sqlConfig=require('../utils/db');
let router = express.Router();
//引入七牛云配置
let qnconfig=require('../utils/config');
/* GET home page. */
router.get('/token', function(req, res, next) {
  console.log(qnconfig.upLoadToken);
  res.status(200).send(qnconfig.upLoadToken);
});

//连接数据库
let conn=mysql.createConnection(sqlConfig.mysql);
conn.connect();

//封装返回数据
let jsonBack=function(res,ret){
  if(typeof ret ==='undefined'){
    res.json({
        code:'1',
        message:'操作失败'
    });
  }else{
    res.json(ret);
  }
};

router.post('/saveFileInfo',(req,res) =>{
  let sql=$sql.file.saveFileInfo;
  let params=req.body;
  console.log(params);
  conn.query(sql,[params.name,params.src,params.size,params.time],(err,result) =>{
        if(err){
          console.log(err);
        }else if(result){
           jsonBack(res,result);
        }
  })
});


router.get('/getFileInfo',(req,res)=>{
    let params=req.query;
    let total=0;
    let pageSize =parseInt(params.pageSize) ;
    let pageNum = parseInt(params.pageNum) ;
    console.log(pageSize);
    let sql=$sql.file.getFileInfo;
    let dataList=[];
  conn.query(sql,(err,result)=>{
    total=result.length;
    dataList=result.reverse().slice(pageSize*(pageNum-1),pageSize+pageSize*(pageNum-1));
    let resData={
        total:Math.ceil(total/pageSize),
        pageNum:pageNum,
        pageSize:pageSize,
        dataList:dataList
    };
    if(err){
      console.log(err)
    }
    if(resData){
        console.log(resData);
        jsonBack(res,resData);
    }
  })
});



module.exports = router;
