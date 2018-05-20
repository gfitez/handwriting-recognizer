var letters=[];
function requestLetterData(i){
  var oReq = new XMLHttpRequest();
  oReq.open("GET", "/getData?d="+i, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function(oEvent) {
    var arrayBuffer = oReq.response;

    // if you want to access the bytes:
    letters[i]= new Uint8Array(arrayBuffer);
    if(i<9){requestLetterData(i+1)}else{

    };
  },
  oReq.send();
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getNthLetter(letter,index){
  var temp=[];
  for(var i=0;i<28;i++){temp.push([])}
  for(var i=0;i<28;i++){
    temp.push([])
    for(var j=28-1;j>=0;j--){
      temp[i][j]=(letters[letter][i*28+index*28*28+j]);
    }
  }

  var arr=[]
  for(var i=0;i<28;i++){arr.push([])}
  for(var i=0;i<28;i++){

    for(var j=0;j<28;j++){
      arr[i][j]=temp[27-j][i] ;
    }
  }

  for(var i=0;i<28;i++){
    for(var j=0;j<14;j++){
      temp1=arr[i][j];
      arr[i][j]=arr[i][28-j-1];
      arr[i][28-j-1]=temp1;
    }
  }

  return arr;
}

function drawArray2d(arr){
  for(var i=0;i<28;i+=1){
    for(var j=0;j<28;j++){

      ctx.fillStyle=rgbToHex(arr[i][j],0,0);

      ctx.fillRect(i*5,j*5,5,5 )
    }
  }
}
function drawArray1d(arr){
  for(var i=0;i<28;i+=1){
    for(var j=0;j<28;j++){
      ctx.fillStyle=rgbToHex(255-arr[i*28+j],255-arr[i*28+j],255-arr[i*28+j]);
      if(arr[i*28+j]>0){
        ctx.fillRect(i*5,j*5,5,5 )
      }

    }
  }


}
function copyCanvas(){
  dataUrl = canvas.toDataURL(),
    imageFoo = document.createElement('img');
  imageFoo.src = dataUrl;

  imageFoo.style.width = '100px';
  imageFoo.style.height = '100px';

  $("#demos")[0].appendChild(imageFoo);
}
function serialize2d(arr){
  temp=[];
  for(var i=0;i<28;i++){
    for(var j=0;j<28;j++){
      temp.push(arr[i][j])
    }
  }
  return temp;
}
function getRandomLetter(){
  var index=Math.floor(Math.random()*10);
  var temp=[0,0,0,0,0,0,0,0,0,0];
  temp[index]=1;
  return {i:temp, letter:serialize2d(getNthLetter(index,Math.floor(Math.random()*1000)))}
}

function getMaxIndex(arr){
  var max=0;
  for(var i=0;i<arr.length;i++){
    if(arr[i]>arr[max])max=i;
  }
  return max;
}
