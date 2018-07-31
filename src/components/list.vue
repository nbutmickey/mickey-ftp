<template>
  <div class="ftp">
    <el-button :plain="true" style="display: none"></el-button>
    <header class="ftp-header">
      <img src="../assets/files.svg"><span>FTP文件上传/下载</span>
    </header>
    <div class="ftp-list-container">
      <div class="ftp-list-head">文件列表</div>
      <div v-if="upLoadAll">
      <div  class="ftp-list-item" v-for="(item) in listShow">
        <img :src=item.src class="ftp-list-item-fileImage"/>
        <div class="ftp-list-item-fileDetail">
          <div>文件名：{{item.key}}</div>
          <div>大小：{{item.fsize}}</div>
          <div>上传时间：{{item.putTime}}</div>
        </div>
        <button type="button" class="ftp-list-item-downLoadButton" @click="downLoad(item.key)"><img src="../assets/download.svg" style="width: 18px;vertical-align: middle"/><span style="vertical-align: middle;font-size: 14px;margin-left: 2px;letter-spacing: 2px">下载</span></button>
      </div>
      </div>
        <div v-else style="text-align: center;color: red">
          空空如也~
        </div>
      <nav class="pagination">
        <span style="margin-right: 30px">当前：第 {{pageNow}} 页，总计：{{total}} 页</span>
        <a href="javascript:;"  class="prev" @click="prev">
          <font-awesome-icon :icon="['fas','angle-left']"/>
        </a>
        <a href="javascript:;" class="next" @click="next" >
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
    name: "list",
    data() {
      return {
        upLoadAll: [],
        listShow:[],
        pageNow: 1,
        pageSize: 10,
        total: 0,
      }
    },
    beforeCreate() {
      thisVue = this;//获取Vue对象
    },
    mounted() {
      if (sessionStorage.getItem('pageNow')) {
        this.pageNow = sessionStorage.getItem('pageNow')
      }
      this.getPageCurData(this.upLoadAll, this.pageSize, this.pageNow);
    },
    created() {
      thisVue.fetchAllList();
      sessionStorage.setItem('pageNow', '1');
    },
    methods: {
      fetchAllList: function () {
        let ac = getToken('/list?bucket=mickey', '');
        thisVue.$axios.get('fetchAll/list?bucket=mickey', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'QBox ' + 'LzbIfbmRnl29eb3Ic24VZTT7zBde4ZGcxpU24Pcq:' + ac,
          }
        }).then(res => {
          thisVue.upLoadAll= res.data.items;
          thisVue.total = Math.ceil(thisVue.upLoadAll.length / thisVue.pageSize);
          for (let i = 0; i <thisVue.upLoadAll.length; i++) {
            thisVue.upLoadAll[i].src = thisVue.imgHandler(thisVue.upLoadAll[i].key);
            thisVue.upLoadAll[i].putTime=thisVue.formatTime(thisVue.upLoadAll[i].putTime);
            thisVue.upLoadAll[i].fsize=thisVue.bytesToSize(thisVue.upLoadAll[i].fsize);
          }
          thisVue.listShow= thisVue.getPageCurData(this.upLoadAll, thisVue.pageSize, thisVue.pageNow);
          console.log(thisVue.listShow);
        })
      },
      getPageCurData: function (data, pageSize, pageNo) {
        let Pedata = [], idx = 0;
        for (let i = 0; i < pageSize; i++) {
          idx = pageSize * pageNo - pageSize + i;
          if (idx < data.length) {
            Pedata.push(data[idx]);
          }
        }
        return Pedata;
      },
    prev: function () {
      this.pageNow--;
      if (this.pageNow <= 0) {
        this.pageNow = 1
      } else {
        sessionStorage.setItem('pageNow', this.pageNow);
        thisVue.listShow= thisVue.getPageCurData(this.upLoadAll, thisVue.pageSize, thisVue.pageNow);
      }
    },
    next: function () {
      this.pageNow++;
      if (this.pageNow > thisVue.total) {
        this.pageNow = thisVue.total;
      }
      else {
        sessionStorage.setItem('pageNow', this.pageNow);
        thisVue.listShow= thisVue.getPageCurData(this.upLoadAll, thisVue.pageSize, thisVue.pageNow);
      }
    },
      formatTime:function(time){;
        let unixTimeStamp=new Date(time/10000);
        let Y=unixTimeStamp.getFullYear();
        let M=(unixTimeStamp.getMonth()+1>10?(unixTimeStamp.getMonth()+1):'0'+(unixTimeStamp.getMonth()+1));
        let D=(unixTimeStamp.getDate()>10?unixTimeStamp.getDate():'0'+unixTimeStamp.getDate());
        let H=(unixTimeStamp.getHours()>10?unixTimeStamp.getHours():'0'+unixTimeStamp.getHours());
        let m=(unixTimeStamp.getMinutes()>10?unixTimeStamp.getMinutes():'0'+unixTimeStamp.getMinutes());
        let s=(unixTimeStamp.getSeconds()>10?unixTimeStamp.getSeconds():'0'+unixTimeStamp.getSeconds());
        let Day=Y+'.'+M+'.'+D+'  '+H+':'+m+':'+s;
        return Day;
      },
      bytesToSize:function (bytes) {
        if (bytes === 0) return '0 B';
        let k = 1024;
        let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        return ((bytes / Math.pow(k, i))).toPrecision(3) + ' ' + sizes[i];
        //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
      },
      imgHandler:function (name) {
        let suffixName=name.replace(/.+\./, "");
        let src='http://pcpno7ndd.bkt.clouddn.com/'
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
                                              suffixName===('svg')?'image.svg':
                                              suffixName==='jpg'?'image.svg':'question.svg');
      return src;
      },
      downLoad:function (name) {
        window.open('http://ftp.mickey-nbut.cn/'+name+'?attname=');
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
    height: 800px;
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
    margin-left: 10px;
    line-height: 20px;
    height: 60px;
    vertical-align: middle
  }
  .ftp-list-item-downLoadButton{
    display: inline-block;
    float: right;
    margin-top: 10px;
    margin-right: 10px;
    border: 1px solid #dcdfe6;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
    padding: 10px 16px;
    background-color:#409eff;
    color: #fff;
    border-radius: 3px;
    text-align: right
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
    .ftp-list-container{
      width: 95%;
    }
    .ftp-list-item-fileDetail  div{
      width:200px;
      overflow: hidden;
      white-space: nowrap; //使其不换行
      text-overflow:ellipsis;
    }
    .ftp-list-item-downLoadButton{
      padding: 5px;
    }
  }
</style>
