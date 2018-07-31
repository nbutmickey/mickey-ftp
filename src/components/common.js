import b64hmacsha1 from 'hmacsha1'

let getToken=function (path,body) {
    let data=path;
    if(body===undefined){
      data=data+'\n'
    }else{
      data=data+'\n'+body
    }
    return qiniuSign('GYdcw8V4Q1K3Us1MBFBbCatiQark9deRmQL0oD02',data)
};


function qiniuSign (key, data) {
  let temp = b64hmacsha1(key, data);
  return urlSafe(temp);
}

function urlSafe (data) {
  return data.replace(/\//g, '_').replace(/\+/g, '-')
}

function base64 (str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1)
  }))
}

function urlsafe_b64encode (data) {
  return urlSafe(base64(data))
}

export default getToken;
