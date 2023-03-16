//hedhi bch n7elo l menu bar
let btn = document.querySelector("#btn");
let barside = document.querySelector(".sidebar");

btn.onclick = function(){
    barside.classList.toggle("active");
    
}

//hedhi bch nwaro les dashboard fel menu
let arrow =document.querySelector('.arrow');

arrow.addEventListener("click",(e)=>{
let arrowParent = e.target.parentElement.parentElement.parentElement.parentElement;
arrowParent.classList.toggle("showMinu")
console.log(arrowParent);
});

//hedhi bch nwaro l date mte3 lyoum fel chart lkbira
document.getElementById('input').valueAsDate = new Date();

//hedhi bch k nbadlo lparametre de recherche tetbadel m3ena linput
let x = document.getElementById("mySelect")
let w = document.querySelector(".graph-head")
x.addEventListener('click',(e)=>{
    let sel = x.value;
    if (sel == "month"){
        w.classList.toggle("month")
    }else if (sel == "week"){
        w.classList.toggle("week")
    }else if (sel == "day"){
        w.classList.toggle("day")
    }
})

//hedhi bch nab3eth l input mte3 l date lel backend 
document.querySelector(".date").addEventListener("change", function () {
    var day = this.value;
    console.log(day);
    socket.emit("date",{
        text: day
    })
});

//hedhi tab3eth l select lel backend
x.addEventListener('change',(e)=>{
    
    console.log(x.value);
    socket.emit("select_value",{
        text: x.value
    })
})

//hedhi tab3eth l week lel backend
document.querySelector(".weeks").addEventListener("change", function() {
    var week = this.value;
    console.log(week)
    
    socket.emit("week",{
        text:week
    })
});

//hedhi tab3eth l month lel backend 
document.querySelector(".xxxx").addEventListener("change", function() {
    var month = this.value; 
    console.log(month);
    socket.emit("month",{
        text: month
    })
});

var settigs = document.getElementById('button');
settigs.addEventListener("click",(e)=>{
    var limit = document.getElementById("limit").value
    var password = document.getElementById("password").value
    if(password == "inpe"){
        swal("The changement is successfully sent!", "success");
        axios({
            method: 'post',
            url: '/fridge_3',
            data: {
                data: limit,
                text: "sent"

            }
          });
        setInterval(() => {
            location.reload()
        }, 5000);
    }else{
        swal({title: "The password is wrong !",
        text: "Please check the password !",
        button: "ok",
        icon: "warning",});
    }
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

var bzz = document.getElementById('buzzer');
bzz.addEventListener("click",(e)=>{
    swal("Arrêté avec succès", "success");
        axios({
            method: 'post',
            url: '/buzz3',
            data: {
                data: 0,
                text: "bzz"

            }
          });
})

const open = document.getElementById('pp');
const modal = document.getElementById('popup');
const close = document.getElementById('x');

open.addEventListener('click', ()=> {
    modal.classList.add('show');
})

close.addEventListener('click', ()=> {
    modal.classList.remove('show');
}) 