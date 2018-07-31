<template>
<div class="ftp">
  <el-button :plain="true" style="display: none"></el-button>
  <header class="ftp-header">
    <img src="../assets/files.svg"><span>FTP文件上传/下载</span>
  </header>
  <div class="ftp-upload">
  <input type="file" multiple id="inputFile" style="display: none">
  <label for="inputFile"><img src="../assets/upload.svg"><span>上传文件</span></label>
  <el-progress :percentage="uploadPercent" v-if="showProgress"></el-progress>
  </div>
  <div class="ftp-list-container">
    <div class="ftp-list-head">文件列表<span style="color: red;font-size: 14px;line-height: 32px">(点击即可实现下载)</span></div>
    <div  class="ftp-list-item" v-for="(item) in upLoadAll">
      <img :src=item.src class="ftp-list-item-fileImage"/>
      <div class="ftp-list-item-fileDetail">
        <div><span>文件名：</span>{{item.key}}</div>
        <div><span>大小：</span>{{item.fsize}}</div>
        <div><span>时间：</span>{{item.putTime}}</div>
      </div>
        <!--<div class="downLoadButton" style="display: inline-block;padding: 5px;background-color:#337ab7;color: white;border-radius: 3px;"><img src="../assets/download.svg" style="width: 18px;vertical-align: middle"/><span style="vertical-align: middle;font-size: 14px">下载</span></div>-->
    </div>
    <nav class="pagination">
      <span style="margin-right: 30px">当前：第 {{pageNow}} 页，总计：{{total}} 页</span>
      <a href="javascript:;"  class="prev" >
        <font-awesome-icon :icon="['fas','angle-left']"/>
      </a>
      <a href="javascript:;" class="next"  >
        <font-awesome-icon :icon="['fas', 'angle-right']" />
      </a>
    </nav>
  </div>
  <footer>
    <span>@2017 - 2018 版权所有 | nbut_mickey</span>
  </footer>
</div>
</template>

<script>
    let thisVue={};
    import getToken from './common'
    export default {
        name: "ftp",
      data(){
          return{
            uploadPercent:0,
            showProgress:false,
            domain:'http://up.qiniu.com',
            qiNiuAddress:'ftp.mickey-nbut.cn',
            upLoadAll:[],
            navArr:[],
            pageNow: 1,
            pageSize: 6,
            total:0,
          }
      },
      mounted(){
        document.getElementById("inputFile").addEventListener('change',this.upToQiNiu,false);
      },
      beforeCreate(){
          thisVue=this;//获取Vue对象
      },
      methods: {
        //上传至七牛云
        upToQiNiu: function (e) {
          let filesInfo = Array.from(e.target.files);
          let config = {headers: {'Content-Type': 'multipart/form-data'}};
          filesInfo.forEach(function (file) {
            console.log(file);
            //从后端获取凭证
            thisVue.$axios.get('api/token').then(res => {
              console.log("getToken");
              let formData = new FormData();
              formData.append('file', file);
              formData.append('token', res.data);
              formData.append('key', file.name);
              thisVue.$axios.post(thisVue.domain, formData, config).then(() => {
                  let ac=getToken('/list?bucket=mickey','');
                  console.log(ac);
                  thisVue.$axios.get('fetchAll/list?bucket=mickey',{
                    headers:{
                      'Content-Type':'application/x-www-form-urlencoded',
                      'Authorization':'QBox '+'LzbIfbmRnl29eb3Ic24VZTT7zBde4ZGcxpU24Pcq:'+ac,
                    }
                  }).then(res=>{
                    thisVue.upLoadAll=res.data.items;
                    console.log(thisVue.upLoadAll);
                  })
                });
                })
            })
        },
      }
    }
</script>

<style scoped>
.ftp-header{
  width: 100%;
  height: 60px;
  margin: 0;
  line-height: 60px;
  background-color: #337ab7;
  text-align: left;
}
.ftp-header img{
  display: inline-block;
  width: 23px;
  margin: 0 10px 0 20px;
  vertical-align: middle;
}
.ftp-header span{
  color: white;
  font-size: 20px;
  letter-spacing: 1px;
  vertical-align: middle;
}
.ftp-upload{
  width: 700px;
  padding: 20px 20px 10px 20px;
  margin: 0 auto;
}
.ftp-upload label{
  text-align: center;
  display: inline-block;
  width: 100%;
  padding: 10px 50px;
  color: white;
  cursor: pointer;
  background-color: #5cb85c;
  border-radius: 5px;
}
.ftp-upload label img{
  width: 30px;
  height: 30px;
  vertical-align: middle;
}
.ftp-upload span{
  vertical-align: middle;
  margin-left: 10px;
  font-size: 20px;
  letter-spacing: 2px;
}
.ftp-list-container{
  position: relative;
  width: 700px;
  margin: 5px auto;
  border-radius: 5px;
  height: 514.8px;
  border: 1px solid #ddd;
}
.ftp-list-head{
  background-color: #eee;
  color: #777;
  cursor: not-allowed;
  padding: 10px;
  font-size: 16px;
}
.ftp-list-item-fileDetail{
  font-size: 12px;
  display: inline-block;
  margin-left: 15px;
  line-height: 20px;
  height: 60px;
  vertical-align: middle
}
.ftp-list-item-fileImage{
  width: 55px;
  height: 55px;
  vertical-align: middle
}
footer{
  position: relative;
  bottom: 0;
  width: 100%;
  color: #999;
  min-width: 350px;
  text-align: center;
}
footer span{
  display: inline-block;
  margin: 20px auto;
}
.ftp-list-item{
  padding: 5px;
  cursor: pointer;
}
.ftp-list-item:hover{
  background-color: rgba(0,0,0,0.3);
}
.pagination{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 5px 10px;
  background-color: #eee;
}
.pagination .prev,
.pagination .next
{
  display: inline-block;
  position: relative;
  font-size: 20px;
  margin: 0 8px;
  padding: 0 5px;
}
  @media screen  and (max-width: 768px) {
    .ftp-upload{
      width: 100%;
    }
    .ftp-list-container{
      width: 95%;
    }
  }
</style>
