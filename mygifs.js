getGifFromLocal();

const dropdown = document.querySelector(".dropdown-wrapper");
const myGifBtn = document.querySelector(".my-gif")

myGifBtn.addEventListener("click", ()=>(document.querySelector(".gif-creator").style.display="none"))

dropdown.addEventListener("click", toggleDropdown);

function toggleDropdown(){
    themeButtons.classList.toggle("active");
}

let themeButtons = document.querySelector(".dropdown-menu");
let lightThemeBtn = document.querySelector(".light-theme-btn");
let darkThemeBtn = document.querySelector(".dark-theme-btn");

themeButtons.addEventListener("click", toggleTheme);

if(sessionStorage.getItem("theme") == "dark") {
    toggleTheme();
}

function toggleTheme(){
    document.getElementsByTagName("body")[0].classList.toggle("dark");
    
    if(lightThemeBtn.disabled == true){
        lightThemeBtn.disabled = false,darkThemeBtn.disabled = true;
        document.getElementsByClassName("logo-img")[0].src="./IMAGES/gifOF_logo_dark.png";
        darkThemeBtn.classList.toggle("selected");
        lightThemeBtn.classList.toggle("selected");
        sessionStorage.setItem("theme", "dark");         
        
    }else {
        lightThemeBtn.disabled = true,darkThemeBtn.disabled = false;
        document.getElementsByClassName("logo-img")[0].src="./IMAGES/gifOF_logo.png";
        darkThemeBtn.classList.toggle("selected");
        lightThemeBtn.classList.toggle("selected");
        sessionStorage.setItem("theme", "light");
          
    }
}    
const cancelGifMaker = document.querySelectorAll(".action-btn")[0];
const startGifMaker = document.querySelectorAll(".action-btn")[1];
let gifCreator = document.querySelector(".gif-creator");

let gifRecorder = document.createElement("video");
let buttonWrapper = document.createElement("div");
buttonWrapper.setAttribute("class","btn-wrapper-capture");
let createButton = document.createElement("div");
createButton.setAttribute("class", "capture-btn");
let createCameraButton = document.createElement("div");
createCameraButton.setAttribute("class", "camera-btn");
let cameraIcon = document.createElement("img");
cameraIcon.src = "./IMAGES/camera.svg";
createButton.innerText="Capturar";
let clock = document.createElement("div");
clock.setAttribute("class", "clock");

buttonWrapper.addEventListener("click", startRecord);

function startRecord() {
    createButton.classList.add("recording");
    createCameraButton.classList.add("recording");
    cameraIcon.src = "./IMAGES/recording.svg";
    createButton.innerText = "Listo";
    document.querySelector(".top-bar").innerHTML="Capturando Tu Guifo";
    gifCreator.appendChild(clock);
    captureGif();
    recorder.startRecording();
    buttonWrapper.removeEventListener("click", startRecord);
    buttonWrapper.addEventListener("click", stopRecord);   
    
}

function stopRecord() {
    recorder.stopRecording(function(){
        gifDone = this.getBlob();
        objectUrl = this.toURL();
        preview();
        console.log(gifDone);
        console.log(objectUrl);
        
        

        form.append('file', gifDone, 'myGif.gif');

        console.log(form.get('file'));
        
    })
}
let form = new FormData();
let gifDone;
let objectUrl;


function preview() {
    document.querySelector(".top-bar").innerHTML="Vista Previa";
    gifRecorder.style.display = "none";
    let previewImg = document.createElement("img");
    gifCreator.appendChild(previewImg);
    previewImg.setAttribute("class", "preview-img");
    previewImg.src = objectUrl;
    buttonWrapper.style.display = "none"
    gifCreator.innerHTML += 
    `<div class="button-wrapper">
        <button class="upload-btn">Repetir Captura</button>
        <button class="upload-btn">Subir Guifo</button>
    </div>`
    document.querySelectorAll(".upload-btn")[0].addEventListener("click", ()=> window.location.reload()); 
    document.querySelectorAll(".upload-btn")[1].addEventListener("click", postGif);     
}

function postGif(){
    loadingGif();
    let url = "http://upload.giphy.com/v1/gifs" + "?api_key=" + "I1D4SI355OrWqfIoGxwMcoUw4V85v2Rt";
    fetch(url, {
    method: 'POST',
    body: form
})
.then(response => response.json())
.catch(error => console.error('Error:', error))
.then(response => {
    console.log('Success:', gifObject = response)
    saveGif() 
    finalStep();
})        
}

let gifObject = {};

function saveGif() {
    localStorage.setItem(gifObject.data.id, '')
    console.log(localStorage)
}

function loadingGif() {
    gifCreator.innerHTML = 
    `<div class="top-bar">Subiendo Guifo</div>
    <div class="white-background">
        <div class="title-container">
            <img src="./IMAGES/globe_img.png"/>
            <span class="title">Estamos subiendo tu guifo</span>
            <span class="subtitle">Tiempo restante: <del>38 años</del> algunos minutos</span>
        </div>     
    </div>
    <div class="button-wrapper">
    <button class="cancel-btn">Cancelar</button>
    </div>`
    document.querySelector(".cancel-btn").addEventListener("click", ()=> window.location.reload());
};


cancelGifMaker.addEventListener("click", ()=>(document.querySelector(".gif-creator").style.display="none"));
startGifMaker.addEventListener("click", gifMaker);

function gifMaker() {
        if (gifCreator.hasChildNodes()){
            while (gifCreator.childNodes.length >2){
                gifCreator.removeChild(gifCreator.lastChild);
            }
        }
    gifCreator.appendChild(gifRecorder);
    document.querySelector(".top-bar").innerHTML="Un Chequeo Antes de Empezar"
    gifCreator.style.width="860px"
    gifCreator.style.height="548px"
    getMedia();
    gifCreator.appendChild(buttonWrapper);
    buttonWrapper.appendChild(createCameraButton);
    createCameraButton.appendChild(cameraIcon);
    buttonWrapper.appendChild(createButton);

    
}

let stream = null;
async function getMedia(constraints) {
  
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      let video = document.getElementsByTagName("video")[0];
      video.srcObject = stream;
      video.play();
    
    } catch(err) {
        console.log(err);
    }
    
}

function captureGif() {
    recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        
        onGifRecordingStarted: function() {
         console.log('started')
       },
       
    });    
}  

var lastGifApi = {};

async function showGifFromApi() {
    const found = await fetch(`https://api.giphy.com/v1/gifs/${gifObject.data.id}?api_key=I1D4SI355OrWqfIoGxwMcoUw4V85v2Rt`)
    .then(response => response.json())
    .then(data=> lastGifApi = data.data);
    document.querySelector(".miniGif").src = lastGifApi.images.original.url;
    return found;
}; 

function finalStep() {
    gifCreator.style.width = "721px";
    gifCreator.style.height = "391px";
    gifCreator.innerHTML = 
    `<div class="top-bar">Guifo Subido Con Éxito</div>
        <div class="final-container">
            <img class="miniGif" src=""/>
            <span class="title">Guifo creado con éxito</span>
            <button class="final-btn">Copiar Enlace Guifo</button>
            <a href="${objectUrl}" download><button class="final-btn">Descargar Guifo</button></a>
        </div>     
    <div class="button-wrapper">
    <button class="done-btn">Listo</button>
    </div>`  
    showGifFromApi();
    document.querySelector(".gif-grid").innerHTML=""
    getGifFromLocal();
    document.querySelector(".done-btn").addEventListener("click", ()=> gifCreator.style.display="none");
    document.querySelector(".final-btn").addEventListener("click", ()=> { 
        var aux = document.createElement("input");
        aux.setAttribute("value",lastGifApi.url);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        alert("Su enlance fue copiado al portapapeles")
    })

}

function getGifFromLocal() {
    for(let i = 0; i<localStorage.length; i++) {
        found = fetch(`https://api.giphy.com/v1/gifs/${localStorage.key(i)}?api_key=I1D4SI355OrWqfIoGxwMcoUw4V85v2Rt`)
                .then(response => response.json())
                .then(data => {
                    let results = data.data;
                    document.querySelector(".gif-grid").innerHTML += 
                `<div class="gif-container">
                <img class="gif-trending" src="`+results.images.downsized.url+`">
                </div>`;
                                
                }) 
    
    }
}  

// Contador de visitas

function getexpirydate( nodays){

    var UTCstring;
    
    Today = new Date();
    
    nomilli=Date.parse(Today);
    
    Today.setTime(nomilli+nodays*24*60*60*1000);
    
    UTCstring = Today.toUTCString();
    
    return UTCstring;
    
    }
    
    function getcookie(cookiename) {
    
    var cookiestring=""+document.cookie;
    
    var index1=cookiestring.indexOf(cookiename);
    
    if (index1==-1 || cookiename=="") return "";
    
    var index2=cookiestring.indexOf(";",index1);
    
    if (index2==-1) index2=cookiestring.length;
    
    return unescape(cookiestring.substring(index1+cookiename.length+1,index2));
    
    }
    
    /*function setcookie(name,value,duration){
    
    cookiestring=name+"="+escape(value)+";EXPIRES="+getexpirydate(duration);
    
    document.cookie=cookiestring;
    
    if(!getcookie(name)){
    
    return false;
    
    }
    
    else{
    
    return true;
    
    }
    
    }*/
    
    count= getcookie("counter");
    
    document.querySelector(".top-title").innerHTML = `¡Bienvenidos/as a Guifos.com! ——————Donde los gifs están.////// Número de visitas: ${count} `
    
    



