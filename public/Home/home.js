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

