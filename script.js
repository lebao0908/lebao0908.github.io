const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);



(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

// Terrain stuff.
var background = document.getElementById("bgCanvas"),
    bgCtx = background.getContext("2d"),
    width = window.innerWidth,
    height = document.body.offsetHeight;

(height < 400) ? height = 400 : height;

background.width = width;
background.height = height;

function Terrain(options) {
    options = options || {};
    this.terrain = document.createElement("canvas");
    this.terCtx = this.terrain.getContext("2d");
    this.scrollDelay = options.scrollDelay || 90;
    this.lastScroll = new Date().getTime();

    this.terrain.width = width;
    this.terrain.height = height;
    this.fillStyle = options.fillStyle || "#191D4C";
    this.mHeight = options.mHeight || height;

    // generate
    this.points = [];

    var displacement = options.displacement || 140,
        power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

    // set the start height and end height for the terrain
    this.points[0] = this.mHeight;//(this.mHeight - (Math.random() * this.mHeight / 2)) - displacement;
    this.points[power] = this.points[0];

    // create the rest of the points
    for (var i = 1; i < power; i *= 2) {
        for (var j = (power / i) / 2; j < power; j += power / i) {
            this.points[j] = ((this.points[j - (power / i) / 2] + this.points[j + (power / i) / 2]) / 2) + Math.floor(Math.random() * -displacement + displacement);
        }
        displacement *= 0.6;
    }

    document.body.appendChild(this.terrain);
}

Terrain.prototype.update = function () {
    // draw the terrain
    this.terCtx.clearRect(0, 0, width, height);
    this.terCtx.fillStyle = this.fillStyle;
    
    if (new Date().getTime() > this.lastScroll + this.scrollDelay) {
        this.lastScroll = new Date().getTime();
        this.points.push(this.points.shift());
    }

    this.terCtx.beginPath();
    for (var i = 0; i <= width; i++) {
        if (i === 0) {
            this.terCtx.moveTo(0, this.points[0]);
        } else if (this.points[i] !== undefined) {
            this.terCtx.lineTo(i, this.points[i]);
        }
    }

    this.terCtx.lineTo(width, this.terrain.height);
    this.terCtx.lineTo(0, this.terrain.height);
    this.terCtx.lineTo(0, this.points[0]);
    this.terCtx.fill();
}


// Second canvas used for the stars
bgCtx.fillStyle = '#05004c';
bgCtx.fillRect(0, 0, width, height);

// stars
function Star(options) {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = options.x;
    this.y = options.y;
}

Star.prototype.reset = function () {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = width;
    this.y = Math.random() * height;
}

Star.prototype.update = function () {
    this.x -= this.speed;
    if (this.x < 0) {
        this.reset();
    } else {
        bgCtx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function ShootingStar() {
    this.reset();
}

ShootingStar.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = 0;
    this.len = (Math.random() * 80) + 10;
    this.speed = (Math.random() * 10) + 6;
    this.size = (Math.random() * 1) + 0.1;
    // this is used so the shooting stars arent constant
    this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
    this.active = false;
}

ShootingStar.prototype.update = function () {
    if (this.active) {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.x < 0 || this.y >= height) {
            this.reset();
        } else {
            bgCtx.lineWidth = this.size;
            bgCtx.beginPath();
            bgCtx.moveTo(this.x, this.y);
            bgCtx.lineTo(this.x + this.len, this.y - this.len);
            bgCtx.stroke();
        }
    } else {
        if (this.waitTime < new Date().getTime()) {
            this.active = true;
        }
    }
}

var entities = [];

// init the stars
for (var i = 0; i < height; i++) {
    entities.push(new Star({
        x: Math.random() * width,
        y: Math.random() * height
    }));
}

// Add 2 shooting stars that just cycle.
entities.push(new ShootingStar());
entities.push(new ShootingStar());
entities.push(new Terrain({mHeight : (height/2)-120}));
entities.push(new Terrain({displacement : 120, scrollDelay : 50, fillStyle : "rgb(17,20,40)", mHeight : (height/2)-60}));
entities.push(new Terrain({displacement : 100, scrollDelay : 20, fillStyle : "rgb(10,10,5)", mHeight : height/2}));

//animate background
function animate() {
    bgCtx.fillStyle = '#110E19';
    bgCtx.fillRect(0, 0, width, height);
    bgCtx.fillStyle = '#ffffff';
    bgCtx.strokeStyle = '#ffffff';

    var entLen = entities.length;

    while (entLen--) {
        entities[entLen].update();
    }
    requestAnimationFrame(animate);
}
animate();



//MUSIC

// khai báo hằng, mảng mp3
const audio = $('#audio')
const back = $("#back-btn")
const play = $('#play-btn')
const pause = $('#pause-btn')
const next = $("#next-btn")
const nameSong = $$(".name-music")
const nameSingle = $(".single-name")
const photo = $("#img")
const playList = [
     {
      nameSong: "3107-1",
      singer: "W/n x Duongg x Nâu",
      src: "https://stream.nixcdn.com/NhacCuaTui996/3107-WnDuonggNau-6099150.mp3?st=vL4Ce_WKpVpBwXwoOtlJSQ&e=1665418721",
      img: "https://lyricvn.com/wp-content/uploads/2020/03/61b35411029c6156973232016738c1b7.jpg"
    },
    {
      nameSong: "3107-2",
      singer: "W/n x Duongg x Nâu",
      src: "https://stream.nixcdn.com/NhacCuaTui1011/31072-DuonggNauWn-6937818.mp3?st=GR5gmDC3S2QwXPcKD7fZrg&e=1665419556&download=true",
      img: "https://avatar-ex-swe.nixcdn.com/song/2021/06/15/5/1/b/4/1623768316831_640.jpg"
    },
    {
      nameSong: "3107-3",
      singer: "Nâu, Duongg, Titie",
      src: "https://stream.nixcdn.com/NhacCuaTui2027/31073-WnDuongGNauTitie-7058449.mp3?st=3TcwJA_C5A9K5fTVLQu9RA&e=1665418911",
      img: "https://avatar-ex-swe.nixcdn.com/song/2021/08/02/5/0/1/7/1627860417460_640.jpg"
    },
    {
      nameSong: "3107-4",
      singer: "W/n, ERIK, Nâu",
      src: "https://stream.nixcdn.com/NhacCuaTui2026/31074-WnERIKNau-7663728.mp3?st=YesI_y9SvK9opQDBP0syGA&e=1665419827&download=true",
      img: "https://cdns-images.dzcdn.net/images/cover/1b6bce058de157f89a0a6eae2ff5c40c/264x264.jpg"
    },
    {
      nameSong: "Chẳng Thể Tìm Được Em",
      singer: "PhucXp ft. Freak D",
      src: "https://stream.nixcdn.com/Believe_Audio17/ChangTheTimDuocEmBalladVersion-PhucXP-6887501.mp3?st=UcFxkmgSa4BBSE6FzXv5gw&e=1665419221",
      img: "https://i1.sndcdn.com/artworks-yukyFaBjTlbbBrn6-yjfdgg-t500x500.jpg"
    },
  {
        nameSong: "Ôm em lần cuối - lofi",
        singer: "Nit ft. Sing x Freak D",
        src:"https://stream.nixcdn.com/NhacCuaTui1023/OmEmLanCuoiLofiVersion-FreakDNITSing-7099594.mp3?st=3sdNeQMwUVHtbjqlKJi6rQ&e=1665410513",
        img: "https://i.scdn.co/image/ab67616d0000b2737dc7c048785d6ab347328274"
      },
      {
        nameSong: "Bước Qua Nhau",
        singer: "Vũ",
        src:"https://stream.nixcdn.com/Warner_Audio86/BuocQuaNhau-Vu-7847964.mp3?st=02MW0qikRmfV6ZMAierjoQ&e=1665410812",
        img: "https://avatar-ex-swe.nixcdn.com/song/share/2021/11/19/b/e/5/0/1637317185220.jpg"
      },
      {
        nameSong: "Bước Qua Mùa Cô Đơn",
        singer: "Vũ",
        src:"https://stream.nixcdn.com/Warner_Audio86/BuocQuaMuaCoDon-Vu-7847965.mp3?st=7bWSXaSY6mM0cFyBiHugUg&e=1665410914",
        img: "https://avatar-ex-swe.nixcdn.com/song/2020/12/11/4/0/f/e/1607643612541_640.jpg"
      },
]

const textclip = $(".text-box")
//buton play pause
play.onclick = function () {
    audio.play();
    play.style.display = 'none'
    pause.style.display = 'block'
    textclip.classList.add("move")

  }

pause.onclick = function () {
    audio.pause();
    pause.style.display = 'none'
    play.style.display = 'block'
    textclip.classList.remove("move")

  };


// xử lí next / back mp3
var i = 0;
    audio.src = playList[i].src
    nameSingle.textContent = playList[i].singer
    for( let j = 0 ; j < nameSong.length; j++){
        nameSong[j].textContent = playList[i].nameSong
    }
    photo.src = playList[i].img
    

next.onclick = function(){
    i++;
    if( i >= playList.length ){
        i = 0;
    } 
    audio.src = playList[i].src
    nameSingle.textContent = playList[i].singer
    for( let j = 0 ; j < nameSong.length; j++){
        nameSong[j].textContent = playList[i].nameSong
    }
    photo.src = playList[i].img
    textclip.classList.add("move")

      // nut play  
    audio.play()
    play.style.display = 'none'
    pause.style.display = 'block'
    }

back.onclick = function(){
    i--;
    if( i < 0 ){
        i = playList.length -1 ;
    }
    audio.src = playList[i].src
    nameSingle.textContent = playList[i].singer
    for( let j = 0 ; j < nameSong.length; j++){
        nameSong[j].textContent = playList[i].nameSong
    }
    photo.src = playList[i].img
    textclip.classList.add("move")

      // nut play  
    audio.play()
    play.style.display = 'none'
    pause.style.display = 'block'
    }

// next khi kết thúc  mp3
audio.onended = function(){
    next.click();
}


 
    // random link mp3
//    function random() {
    
//     var ran = Math.floor(Math.random() * 3);
//     var src = playList[ran]
//     console.log(src)
//     audio.src= src;
//    }