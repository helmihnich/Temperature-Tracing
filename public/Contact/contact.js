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

let contact = document.getElementById('button');
contact.addEventListener("click",(e)=>{
    var email = document.getElementById("email").value
    var text = document.getElementById("text").value
    var regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/

    
    if((!email.match(regx)) || (text === '' || text == null)){
        
        swal({title: "Error !",
        text: "Please check your email or text ",
        button: "ok",
        icon: "warning",});
    } else {
        var tempParams={
            from_name: email,
            message: text
        };
        emailjs.send('service_y76wq7m','template_gsd7mfd',tempParams).then(function(res){
            swal("Email is successfully sent!", "We will try to answer you as soon as possible !", "success");
            setInterval(() => {
                location.reload()
            }, 5000);
            
        })
    }
    
})