let btn = document.querySelector("#btn");
let barside = document.querySelector(".sidebar");

btn.onclick = function(){
    barside.classList.toggle("active");
    
}

let arrow =document.querySelector('.arrow');

arrow.addEventListener("click",(e)=>{
let arrowParent = e.target.parentElement.parentElement.parentElement.parentElement;
arrowParent.classList.toggle("showMinu")
console.log(arrowParent);
});


var  state=false ;
function toggle(){
  if(state){
    document.getElementById("password").setAttribute("type","password");
    document.getElementById("eye").style.color='#7a797e';
    state=false;
  }else{
    document.getElementById("password").setAttribute("type","text");
    document.getElementById("eye").style.color='#5887ef';
    state=true;
  }
}

document.getElementById("mySelect").addEventListener('change',(e)=>{
  var fridge = this.value;
  axios({
    method: 'post',
    url: '/seuil',
    data: {select:fridge}
});
})
