let sqlMap={
    file:{
        saveFileInfo:'insert into files (name,src,size,time) values (?,?,?,?)',
        getFileInfo:'select * from files'
    }
};
module.exports=sqlMap;