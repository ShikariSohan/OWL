setTimeout(function(){
   document.getElementById('dhet').style.display="none";
   document.getElementById('final').style.display="block";}, 3000);
const welcome =  document.getElementById('welcome');
welcome.addEventListener('mouseover',()=>{
    welcome.classList.add('glow');
  });
welcome.addEventListener('mouseout',()=>{
  welcome.classList.remove('glow');
});
const time = document.querySelector(".box");
var d = new Date();
time.innerHTML=d.toDateString()+'<br>'+d.toLocaleTimeString();
setInterval(mytime,1000);
function mytime(){
 d = new Date();
time.innerHTML=d.toDateString()+'<br>'+d.toLocaleTimeString();
}
const ask= document.getElementById('ask');
ask.addEventListener('click',()=>{
 document.getElementById('fn').style.display = "block";
});
const post = document.getElementById('post')
post.addEventListener('click',()=>{
  const input = document.getElementById('input');
  if(input.value.length==0)
  {
    alert("The input field is empty!");
  }
  else{
 document.getElementById('fn').style.display ="none";
 document.getElementById('myQ').innerHTML+='<br>'+input.value;
   input.value="";
}
});
