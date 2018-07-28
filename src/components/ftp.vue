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
    <div  class="ftp-list-item" v-for="(item) in upLoadAll" @click="downloadFile(item.name)">
      <img :src=item.src class="ftp-list-item-fileImage"/>
      <div class="ftp-list-item-fileDetail">
        <div><span>文件名：</span>{{item.name}}</div>
        <div><span>大小：</span>{{item.size}}</div>
        <div><span>时间：</span>{{item.time}}</div>
      </div>
        <!--<div class="downLoadButton" style="display: inline-block;padding: 5px;background-color:#337ab7;color: white;border-radius: 3px;"><img src="../assets/download.svg" style="width: 18px;vertical-align: middle"/><span style="vertical-align: middle;font-size: 14px">下载</span></div>-->
    </div>
    <nav class="pagination">
      <span style="margin-right: 30px">当前：第 {{pageNow}} 页，总计：{{total}} 页</span>
      <a href="javascript:;"  class="prev"  @click="prev">
        <font-awesome-icon :icon="['fas','angle-left']"/>
      </a>
      <a href="javascript:;" class="next"  @click="next">
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
    var thisVue={};
    export default {
        name: "ftp",
      data(){
          return{
            uploadPercent:0,
            showProgress:false,
            domain:'https://upload-z0.qiniup.com',
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
        if (sessionStorage.getItem('pageNow')) {
          this.pageNow = sessionStorage.getItem('pageNow')
        }
         this.getFileInfo(this.pageNow, this.pageSize);
      },
      beforeCreate(){
          thisVue=this;//获取Vue对象
      },
      methods:{
        //上传至七牛云
        upToQiNiu:function (e) {
          let filesInfo=Array.from(e.target.files) ;
          let config={headers:{'Content-Type': 'multipart/form-data'}};
          filesInfo.forEach(function (file) {
            console.log(file);
            let fileInfo=thisVue.handleFile(file);
            //从后端获取凭证
            thisVue.$axios.get('api/token').then(res=>{
			console.log(res);
            console.log("getToken");
            let formData=new FormData();
            formData.append('file',file);
            formData.append('token',res.data);
            formData.append('key',file.name);
            thisVue.$axios.post(thisVue.domain,formData,config).then(res=>{
              console.log(res);
              if(res.status===200){
                console.log(fileInfo);
                thisVue.saveFileInfo(fileInfo);
                thisVue.getFileInfo(1,thisVue.pageSize);
              }else {
                thisVue.$message({
                  message:'不好意思，上传失败了，请检查一下！',
                  type:'error'
                });
              }
            })
          })
        })
        },
        //存储文件信息
        saveFileInfo:function(fileInfo){
          thisVue.$axios.post('api/saveFileInfo',{name:fileInfo.name,src:fileInfo.src,size:fileInfo.size,time:fileInfo.time},{})
            .then(res=>{
              if(res.status===200){
                thisVue.$message({
                  message:'恭喜你上传成功！',
                  type:'success',
                });

              }else{
                thisVue.$message({
                  message:'不好意思，上传失败了，请检查一下！',
                  type:'error'
                });
              }
            })
        },
        //获取文件信息
        getFileInfo:function(pageNum, pageSize){
              thisVue.$axios.get('api/getFileInfo',
                {
                  params : {pageNum: pageNum, pageSize: pageSize}
                }).then(res=>{
                thisVue.upLoadAll=res.data.dataList;
                thisVue.total=res.data.total;
                thisVue.pageNow=res.data.pageNum;
                for (let i = 1; i <= res.data.total; i++) {
                  thisVue.navArr.push(i);
                  thisVue.navArr = [...new Set(thisVue.navArr)]
                }
                console.log(thisVue.upLoadAll);
              })
        },
        //下载文件
        downloadFile:function(name){
          // thisVue.$axios.get('http://pcgcrg2hl.bkt.clouddn.com/'+name).then(res=>{
          //   console.log(res);
          // })
          window.open('http://ftp.mickey-nbut.cn/'+name+'?attname=');
        },
        //处理文件信息
        handleFile:function (value) {
          let item={};
          item.name=value.name;
          item.time=this.formatTime(value.lastModified);
          item.size=this.bytesToSize(value.size);
          let suffixName=value.name.replace(/.+\./, "");
          console.log(suffixName);
          item.src='http://ftp.mickey-nbut.cn/'
            +(suffixName===('rar')?'zip.svg':
                suffixName===('zip')?'zip.svg':
                  suffixName===('docx')?'docx.svg':
                    suffixName===('doc')?'docx.svg':
                      suffixName==='pdf' ?'pdf.svg':
                        suffixName==='xls'?'excel.svg':
                          suffixName==='xlsx'?'excel.svg':
                          suffixName===('ppt')?'ppt.svg':
                            suffixName===('pptx')?'ppt.svg':
                              suffixName===('mp3')?'mp3.svg':
                                suffixName===('mp4')?'mp4.svg':
                                  suffixName===('txt')?'txt.svg':
                                    suffixName===('rar')?'zip.svg':
                                      suffixName===('html')?'html.svg':
                                        suffixName===('css')?'css3.svg':
                                          suffixName===('js')?'js.svg':
                                            suffixName===('vue')?'vuejs.svg':
                                              suffixName===('cpp')?'cpp.svg':
                                                suffixName==='jpg'?'image.svg':'question.svg'
            );
          return item;
        },
        //格式化时间
        formatTime:function(time){
          let unixTimeStamp=new Date(time);
          let Y=unixTimeStamp.getFullYear();
          let M=(unixTimeStamp.getMonth()+1>10?(unixTimeStamp.getMonth()+1):'0'+(unixTimeStamp.getMonth()+1));
          let D=(unixTimeStamp.getDate()>10?unixTimeStamp.getDate():'0'+unixTimeStamp.getDate());
          let H=(unixTimeStamp.getHours()>10?unixTimeStamp.getHours():'0'+unixTimeStamp.getHours());
          let m=(unixTimeStamp.getMinutes()>10?unixTimeStamp.getMinutes():'0'+unixTimeStamp.getMinutes());
          let s=(unixTimeStamp.getSeconds()>10?unixTimeStamp.getSeconds():'0'+unixTimeStamp.getSeconds());
          let Day=Y+'.'+M+'.'+D+' '+H+' :'+m+' :'+s;
          return Day;
        },
        //格式化大小
        bytesToSize:function (bytes) {
          if (bytes === 0) return '0 B';
          let k = 1024;
          let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
          let i = Math.floor(Math.log(bytes) / Math.log(k));
          return ((bytes / Math.pow(k, i))).toPrecision(3) + ' ' + sizes[i];
          //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
        // //切页
        // changePage:function(e){
        //   sessionStorage.setItem('pageNow',e.target.innerText);
        //   this.getFileInfo(e.target.innerText,this.pageSize);
        // },
        prev:function () {
          this.pageNow--;
          if(this.pageNow<=0){
            this.pageNow=1
          } else{
          sessionStorage.setItem('pageNow',this.pageNow);
          this.getFileInfo(this.pageNow,this.pageSize);
          }
        },
        next:function () {
          this.pageNow++;
          if (this.pageNow > thisVue.total) {
            this.pageNow = thisVue.total;
          }
          else {
            sessionStorage.setItem('pageNow', this.pageNow);
            this.getFileInfo(this.pageNow, this.pageSize);
          }
        }
      },

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
