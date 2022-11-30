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
      src: "https://stream.nixcdn.com/NhacCuaTui1011/31072-DuonggNauWn-6937818.mp3",
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
      {
        nameSong: "Nỗi Nhớ Mang Tên Mình",
        singer: "Nguyễn Minh Cường",
        src:"https://aredir.nixcdn.com/NhacCuaTui2028/NoiNhoMangTenMinhAcousticVersion-HoaiLam-7970231.mp3",
        img: "https://yt3.ggpht.com/ytc/AMLnZu8Ql8GBvQa0TDIBdhNQJP7-7Z2HwFuWl2N-NpZw=s176-c-k-c0x00ffffff-no-rj"
      },
      {
        nameSong: "Đế Vương",
        singer: "Đình Dũng",
        src:"https://aredir.nixcdn.com/NhacCuaTui1024/DeVuong-DinhDungACV-7121634.mp3",
        img: "https://yt3.ggpht.com/uIcXYeNqzZ3sA9wxLXcfMiW5Zc25BIIYqXBIiEMQgl2SuANBsHjiXBka2CQIo4d4pCuJYUcNeg=s176-c-k-c0x00ffffff-no-rj"
      },
      {
        nameSong: "Suýt nữa thì",
        singer: "Andiez",
        src:"https://aredir.nixcdn.com/NhacCuaTui966/SuytNuaThiChuyenDiCuaThanhXuanOST-Andiez-5524811.mp3",
        img: "https://avatar-ex-swe.nixcdn.com/song/2018/07/19/6/0/9/e/1532010326915_500.jpg"
      },
      {
        nameSong: "Breakfast",
        singer: "Gducky",
        src:"https://aredir.nixcdn.com/NhacCuaTui1006/Breakfast-DHGDuckyMinh-6809090.mp3",
        img: "https://event.mediacdn.vn/2020/11/16/gducky-c-16055271501151778107040.png"
      },
      {
        nameSong: "Phép màu",
        singer: "Bray",
        src:"https://aredir.nixcdn.com/NhacCuaTui954/PhepMau-BRay-5289793.mp3",
        img: "https://avatar-ex-swe.nixcdn.com/singer/avatar/2020/05/27/6/9/5/0/1590562104987_600.jpg"
      },
      {
        nameSong: "Con trai cưng",
        singer: "Bray",
        src:"https://aredir.nixcdn.com/NhacCuaTui970/ConTraiCung-BRayMasew-5731758.mp3",
        img: "https://avatar-ex-swe.nixcdn.com/singer/avatar/2020/05/27/6/9/5/0/1590562104987_600.jpg"
      },
      {
        nameSong: "Người đi bao",
        singer: "Low G",
        src:"https://aredir.nixcdn.com/NhacCuaTui2022/NguoiDiBao-TlinhLowG-7370316.mp3",
        img: "https://avatar-ex-swe.nixcdn.com/singer/avatar/2022/05/12/e/c/0/f/1652339314580_600.jpg"
      },
      {
        nameSong: "Em đau rồi đấy",
        singer: "Dương Yến Phi",
        src:"https://aredir.nixcdn.com/NhacCuaTui2024/EmDauRoiDayLofiVersion-DuongYenPhiCoinKak-7609779.mp3",
        img: "https://avatar-ex-swe.nixcdn.com/singer/avatar/2021/02/24/e/b/9/a/1614131115016_600.jpg"
      },
      {
        nameSong: "Waiting For You",
        singer: "MONO",
        src:"https://stream.nixcdn.com/NhacCuaTui2026/WaitingForYou-MONOOnionn-7733882.mp3",
        img: "https://avatar-ex-swe.nixcdn.com/singer/avatar/2022/08/08/c/6/c/1/1659932203225_600.jpg"
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
var bits = 90;
var speed = 33;
var bangs = 7;
var colours = new Array("#03f", "#f03", "#fff", "#f7efa1", "#0cf", "#f93", "#f0c", "#fff");
var bangheight = new Array();
var intensity = new Array();
var colour = new Array();
var Xpos = new Array();
var Ypos = new Array();
var dX = new Array();
var dY = new Array();
var stars = new Array();
var decay = new Array();
var swide = 800;
var shigh = 600;
var boddie;
window.onload = function() {
    if (document.getElementById) {
        var i;
        boddie = document.createElement("div");
        boddie.style.position = "fixed";
        boddie.style.top = "0px";
        boddie.style.left = "0px";
        boddie.style.overflow = "visible";
        boddie.style.width = "1px";
        boddie.style.height = "1px";
        boddie.style.backgroundColor = "transparent";
        document.body.appendChild(boddie);
        set_width();
        for (i = 0; i < bangs; i++) {
            write_fire(i);
            launch(i);
            setInterval('stepthrough(' + i + ')', speed);
        }
    }
}
function write_fire(N) {
    var i, rlef, rdow;
    stars[N + 'r'] = createDiv('|', 12);
    boddie.appendChild(stars[N + 'r']);
    for (i = bits * N; i < bits + bits * N; i++) {
        stars[i] = createDiv('*', 13);
        boddie.appendChild(stars[i]);
    }
}
function createDiv(char, size) {
    var div = document.createElement("div");
    div.style.font = size + "px monospace";
    div.style.position = "absolute";
    div.style.backgroundColor = "transparent";
    div.appendChild(document.createTextNode(char));
    return (div);
}
function launch(N) {
    colour[N] = Math.floor(Math.random() * colours.length);
    Xpos[N + "r"] = swide * 0.5;
    Ypos[N + "r"] = shigh - 5;
    bangheight[N] = Math.round((0.5 + Math.random()) * shigh * 0.4);
    dX[N + "r"] = (Math.random() - 0.5) * swide / bangheight[N];
    if (dX[N + "r"] > 1.25) stars[N + "r"].firstChild.nodeValue = "/";
    else if (dX[N + "r"] < -1.25) stars[N + "r"].firstChild.nodeValue = "\\";
    else stars[N + "r"].firstChild.nodeValue = "|";
    stars[N + "r"].style.color = colours[colour[N]];
}
function bang(N) {
    var i, Z, A = 0;
    for (i = bits * N; i < bits + bits * N; i++) {
        Z = stars[i].style;
        Z.left = Xpos[i] + "px";
        Z.top = Ypos[i] + "px";
        if (decay[i]) decay[i]--;
        else A++;
        if (decay[i] == 15) Z.fontSize = "10px";
        else if (decay[i] == 7) Z.fontSize = "2px";
        else if (decay[i] == 1) Z.visibility = "hidden";
        Xpos[i] += dX[i];
        Ypos[i] += (dY[i] += 1.25 / intensity[N]);
    }
    if (A != bits) setTimeout("bang(" + N + ")", speed);
}
function stepthrough(N) {
    var i, M, Z;
    var oldx = Xpos[N + "r"];
    var oldy = Ypos[N + "r"];
    Xpos[N + "r"] += dX[N + "r"];
    Ypos[N + "r"] -= 4;
    if (Ypos[N + "r"] < bangheight[N]) {
        M = Math.floor(Math.random() * 3 * colours.length);
        intensity[N] = 5 + Math.random() * 4;
        for (i = N * bits; i < bits + bits * N; i++) {
            Xpos[i] = Xpos[N + "r"];
            Ypos[i] = Ypos[N + "r"];
            dY[i] = (Math.random() - 0.5) * intensity[N];
            dX[i] = (Math.random() - 0.5) * (intensity[N] - Math.abs(dY[i])) * 1.25;
            decay[i] = 25 + Math.floor(Math.random() * 25);
            Z = stars[i];
            if (M < colours.length) Z.style.color = colours[i % 2 ? colour[N] : M];
            else if (M < 2 * colours.length) Z.style.color = colours[colour[N]];
            else Z.style.color = colours[i % colours.length];
            Z.style.fontSize = "20px";
            Z.style.visibility = "visible";
        }
        bang(N);
        launch(N);
    }
    stars[N + "r"].style.left = oldx + "px";
    stars[N + "r"].style.top = oldy + "px";
}
window.onresize = set_width;
function set_width() {
    var sw_min = 999999;
    var sh_min = 999999;
    if (document.documentElement && document.documentElement.clientWidth) {
        if (document.documentElement.clientWidth > 0) sw_min = document.documentElement.clientWidth;
        if (document.documentElement.clientHeight > 0) sh_min = document.documentElement.clientHeight;
    }
    if (typeof(self.innerWidth) != "undefined" && self.innerWidth) {
        if (self.innerWidth > 0 && self.innerWidth < sw_min) sw_min = self.innerWidth;
        if (self.innerHeight > 0 && self.innerHeight < sh_min) sh_min = self.innerHeight;
    }
    if (document.body.clientWidth) {
        if (document.body.clientWidth > 0 && document.body.clientWidth < sw_min) sw_min = document.body.clientWidth;
        if (document.body.clientHeight > 0 && document.body.clientHeight < sh_min) sh_min = document.body.clientHeight;
    }
    if (sw_min == 999999 || sh_min == 999999) {
        sw_min = 800;
        sh_min = 600;
    }
    swide = sw_min;
    shigh = sh_min;
}


 
    // random link mp3
//    function random() {
    
//     var ran = Math.floor(Math.random() * 3);
//     var src = playList[ran]
//     console.log(src)
//     audio.src= src;
//    }