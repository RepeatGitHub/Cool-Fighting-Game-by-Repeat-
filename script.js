var programCode = function(processingInstance) {
    with (processingInstance) {
      size(max(window.innerWidth-15,400), max(window.innerHeight-25,400)); 
      frameRate(60); //println(`${globall.views}a`);
        
      // Paste code from Khan Academy here:
// Note to self: Ian said I should:
// - Add icons or names for character boxes on select (and maybe stages too?) (done)
// - Add punishment for being off stage above (maybe 1 df (done)
// - Have visual when at high damage (like red flash/particles) (done)
// - Add Shielding (and other variants of moves)
// Note to self: I should probably:
// - Finish Fatal Book (Duck has low hitbox, charge attack is longer but shoots lazers)
// - Make fix for crash when missing textures (done)
// - Add move variations
// - Make the P1 P2 etc. markers colored (done)
// Note to self: Pablo said I should:
// - Make normal move more rewarding (like maybe less vx slowness requirement)
// - Maybe different unique moves (like side specials and down specials instead of just an upwards move) (as described above and below)
// - Aerial moves!!! Maybe some moves are unique when in air, perhaps
// - Balance move attack damages, as well as move animations
// - Literally balance Bounciboi to hell. Also nerf Nidorino's damage output.
// - Make comboes cool!!!
// Note to self: Soren said I should:
// - Add a pogo move for a character (im gonna do it for Fatal Book) so that they bounce when holding down and in air when doing normal attack so if it hits, the character goes flying up too
// - Maybe add down + attack and down + attack + aerial attack for each character, maybe make it unique per character?

var defaultStocks = 3;
var playerCount = 2;


var mous = false;
var keys = [];
var keyNotCode = [];
var mousePresssed = false;
key = 0;
var mode = "play";
var modeStats = {
    winner: "na",
    charSelector: 0,
    gameChars: playerCount,
    colorvar: 0,
    shieldMax: 100,
    shieldMin: -10,
    shieldingAllowed: true,
    smoothVxHitbox: true,
    smoothVyHitbox: true,
    legacyMoveIndicators: false,
    moveIndicatorsVer: 1,
};
var characterData = [ // Default goes to 0 if I forgot to place my data for other characters.
    {
        jumpheight: 4,
        upspecialheight: 8,
        //downslide: 1.05,
        downslide: 1.00,
        knockbackplus: 0,
        downspecialmove: false,
        downspecialmaxdmg: 0.2,
        downspeciallaunch: 1, // How far up an down special sends the opponent. Lower is better, but below 0 does nearly nothing unless set to an extremely low number like -100.
        meleeFox: false, // I mentioned this below, but this feature re-enables the Melee Fox glitch, which I turned into a feature for modders and future me.
        chargeAttackCheese: false, // Pretty much, this makes it so that pressing the charge attack removes any horizontal knockback.
        pogo: false, // Makes the aerial down special do a "pogo" like Fatal Book. Inspired by Hollow Knight.
    },
    {
        jumpheight: 4,
        upspecialheight: 9,
        //downslide: 0.95,
        downslide: 1.05,
        knockbackplus: 0.1,
        downspecialmove: false,
        downspecialmaxdmg: 0.3,
        downspeciallaunch: 1,
        meleeFox: false,
        chargeAttackCheese: false,
        pogo: false,
    },
    {
        jumpheight: 4,
        upspecialheight: 7,
        downslide: 0.90,
        knockbackplus: 0,
        downspecialmove: false,
        downspecialmaxdmg: 0.1,
        downspeciallaunch: 1,
        meleeFox: false,
        chargeAttackCheese: false,
        pogo: false,
    },
    {
        jumpheight: 4,
        upspecialheight: 8,
        //downslide: 1.05,
        downslide: 1.00,
        knockbackplus: 0,
        downspecialmove: true,
        downspecialmaxdmg: 0.2,
        downspeciallaunch: 2,
        meleeFox: false,
        chargeAttackCheese: false,
        pogo: true,
    },
];
var cpu1="cpu1";
var p = [
    {
        x: 80,
        y: 200,
        vx: 0,
        vy: 0,
        char: 1,
        player: 0,
        colorvar: 0,
        frame1: 0,
        frame2: 0,
        hp: 0,
        stock: defaultStocks,
        dir: 1,
        fall: false,
        canjump: true,
        movecool: 0,
        slamdown: 0,
        shieldLeft: modeStats.shieldMax,
        hitbox: {
            x: 200,
            y: 200,
            w: 10,
            h: 10,
        },
        lightflash: {
            time: 0,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            x3: 0,
            y3: 0,
        },
        cpu: {
            right: false,
            left: false,
            up: false,
            down: false,
            at1: false,
            at2: false,
            at3: false,
        },
    },
    {
        x: 270,
        y: 200,
        vx: 0,
        vy: 0,
        char: 2,
        player: 1,
        colorvar: 0,
        frame1: 0,
        frame2: 0,
        hp: 0,
        stock: defaultStocks,
        dir: 1,
        fall: false,
        canjump: true,
        movecool: 0,
        slamdown: 0,
        shieldLeft: modeStats.shieldMax,
        hitbox: {
            x: 200,
            y: 200,
            w: 10,
            h: 10,
        },
        lightflash: {
            time: 0,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            x3: 0,
            y3: 0,
        },
        cpu: {
            right: false,
            left: false,
            up: false,
            down: false,
            at1: false,
            at2: false,
            at3: false,
        },
    },
];
var coll = function(a, b) {
    return a.x + a.w > b.x && a.x < b.x + b.w && a.y + a.h > b.y && a.y < b.y + b.h;
};
var particles = [
    {
        x: -10,
        y: 0,
        vx: 0,
        vy: 0,
        opacity: 255,
        owner: "none",
        colorr: color(200),
        size: 10,
    },
];
var platforms = [
    {
        type: "solid",
        color: color(79, 79, 79),
        x: 60,
        y: 248,
        w: 280,
        h: 60,
    },
    //{
    //    type: "solid",
    //    color: color(79, 79, 79),
    //    x: 60,
    //    y: 188,
    //    w: 20,
    //    h: 60,
    //},
    {
        type: "semisolid",
        color: color(79, 79, 79),
        x: 150,
        y: 188,
        w: 100,
        h: 10,
    },
];
// Stages
// {
var stage = 0;

// }

// Images
//function includeJs(jsFilePath) {
//    var js = document.createElement("script");
//    js.type = "text/javascript";
//    js.src = jsFilePath;
//
//    document.body.appendChild(js);
//}

//includeJs("/module");
//var myImages = myImagees();
//const myModule = require('./module');
//var myImages = myModule.myImagees();
        //var myImages = loadScript("module.js",myImagees);
        //println(globall.myImagees===undefined);
        //println(globall.myImagees);
var myImagees = globall.myImagees;
        //println(myImagees);
        //println("a");
//var myImages = myImagees();
//var myImages = globall.myImages;
        //println(myImages===undefined);
        //println(globall.myImages===undefined);

var bl = color(0, 0, 0);
var wh = color(255, 255, 255);
var rd = color(255, 0, 0);
var bu = color(0, 0, 255);
var wn = color(254, 255, 255);
var g = {
    a: color(175,175,175),
    b: color(200,200,200),
    c: color(220,220,220),
    d: color(235,235,235),
    e: color(245,245,245),
    f: color(250,255,255),
};
var tbl = color(0,127);
var twh = color(255,127);
var repeatsImageGenerator = function(imgg,imgx,imgy,imglength,imgwidth,allfill) {
    noStroke();
    if (imgg===undefined||imgg===-999) {
        fill(255, 0, 0);
        textAlign(LEFT,TOP);
        textSize(max(10,max(abs(imglength),abs(imgwidth))/2));
        text("ERROR: MISSING IMAGE\nUNKNOWN REASON",imgx,imgy);
    } else {
        for (var a=0;a<imgg.length;a++) {
            for (var b=0;b<imgg[a].length;b++) {
                if (imgg[a][b]!=='x') {
                    if (allfill===undefined||allfill===0) {
                        fill(imgg[a][b]);
                    } else if (allfill===1) {
                        if (imgg[a][b]===color(255, 255, 255)) {
                            fill(255, 0, 0);
                        } else if (imgg[a][b]===rd) {
                            fill(155, 0, 155);
                        } else if (imgg[a][b]===bu) {
                            fill(255, 0, 255);
                        } else {
                            fill(imgg[a][b]);
                        }
                    } else if (allfill===2) {
                        if (imgg[a][b]===color(255, 255, 255)) {
                            fill(100, 255, 100);
                        } else if (imgg[a][b]===rd) {
                            fill(0, 150, 0);
                        } else if (imgg[a][b]===bl) {
                            fill(0, 75, 0);
                        } else if (imgg[a][b]===bu) {
                            fill(0, 150, 0);
                        } else {
                            fill(imgg[a][b]);
                        }
                    } else {
                        fill(allfill);
                    }
                    rect(imgx+b*(imgwidth/(imgg[a].length)),imgy+a*(imglength/(imgg.length)),ceil(imgwidth/imgg[a].length),ceil(imglength/imgg.length));
                }
            }
        }
    }
};
var frameSpeed=20;
var avg = function(one,two,three) {
    if (three===undefined) {
        return (one+two)/2;
    } else {
        return (one+two+three)/3;
    }
};
var backgrond = function() {
    noStroke();
    if (mode==="play") {
        if (stage===0) {
            background(255, 255, 255);
        }
        if (stage===1) {
            background(196, 196, 196);
        }
        if (stage===2) {
            background(200, 100, 100);
        }
    } else {
        background(173, 173, 173);
    }
};
var showHitboxes = false;
var platformRender = function() {
if (stage===0) {
    platforms = [
        {
            type: "solid",
            color: color(79, 79, 79),
            x: 60,
            y: 248,
            w: 280,
            h: 60,
        },
    //{
    //    type: "solid",
    //    color: color(79, 79, 79),
    //    x: 60,
    //    y: 188,
    //    w: 20,
    //    h: 60,
    //},
        {
            type: "semisolid",
            color: color(79, 79, 79),
            x: 150,
            y: 188,
            w: 100,
            h: 10,
        },
    ];
}
if (stage===1) {
    platforms = [
        {
            type: "solid",
            color: color(0, 0, 255),
            x: 60,
            y: 248,
            w: 280,
            h: 20,
        },
        {
            type: "solid",
            color: color(0, 0, 0),
            x: 60,
            y: 268,
            w: 280,
            h: 40,
        },
        {
            type: "semisolid",
            color: color(150, 0, 0),
            x: 50,
            y: 188,
            w: 100,
            h: 10,
        },
        {
            type: "semisolid",
            color: color(150, 0, 0),
            x: 250,
            y: 188,
            w: 100,
            h: 10,
        },
    ];
}
if (stage===2) {
    platforms = [
        {
            type: "solid",
            color: color(79, 79, 79),
            x: 60,
            y: 300,
            w: 280,
            h: 60,
        },
        {
            type: "semisolid",
            color: color(79, 79, 79),
            x: 80,
            y: 248,
            w: 60,
            h: 10,
        },
        {
            type: "semisolid",
            color: color(79, 79, 79),
            x: 260,
            y: 248,
            w: 60,
            h: 10,
        },
    ];
}
    //for (var a=0;a<platforms.length;a++) {
    //    fill(platforms[a].color);
    //    rect(platforms[a].x,platforms[a].y,platforms[a].w,platforms[a].h);
    //}
    for (var b=0;b<p.length;b++) {
        p[b].fall=true;
        for (var a=0;a<platforms.length;a++) {
            if (platforms[a].type==="solid") {
                fill(platforms[a].color);
                rect(platforms[a].x,platforms[a].y,platforms[a].w,platforms[a].h);
                if (coll(platforms[a],p[b].hitbox)&&!(p[b].char===3&&p[b].frame1===4)) {
                    //if (p[b].vy<0) {
                        p[b].vy=0;
                        if (abs(platforms[a].y-48-p[b].y)<20) {
                            p[b].y=platforms[a].y-47;
                        } else {
                            p[b].y-=10;
                        }
                    //}
                    /* else
                    if (p[b].vx<0) {
                        p[b].vx=0;
                        p[b].x=platforms[a].x+platforms[a].w;
                    } else
                    if (p[b].vx>0) {
                        p[b].vx=0;
                        p[b].x=platforms[a].x-48;
                    }
                    */
                    //p[b].fall=true;
                    p[b].fall=false;
                    p[b].canjump=true;
                    if (showHitboxes) {
                        fill(255, 0, 0);
                        rect(0,10*p[b].player,10,10);
                    }
                }
            }
            if (platforms[a].type==="semisolid") {
                fill(platforms[a].color);
                quad(platforms[a].x,platforms[a].y,platforms[a].x+platforms[a].w,platforms[a].y,platforms[a].x+platforms[a].w*0.9,platforms[a].y+platforms[a].h,platforms[a].x+platforms[a].w*0.1,platforms[a].y+platforms[a].h);
                if (coll(platforms[a],p[b].hitbox)&&p[b].vy<=0&&(p[b].frame1!==2&&p[b].frame1!==8&&p[b].frame1!==9)) {
                    //if (p[b].vy<0) {
                        p[b].vy=0;
                        if (abs(platforms[a].y-48-p[b].y)<11) {
                            p[b].y=platforms[a].y-47;
                        } else {
                            p[b].y-=10;
                        }
                    //}
                    /* else
                    if (p[b].vx<0) {
                        p[b].vx=0;
                        p[b].x=platforms[a].x+platforms[a].w;
                    } else
                    if (p[b].vx>0) {
                        p[b].vx=0;
                        p[b].x=platforms[a].x-48;
                    }
                    */
                    //p[b].fall=true;
                    p[b].fall=false;
                    p[b].canjump=true;
                    if (showHitboxes) {
                        fill(255, 0, 0);
                        rect(0,10*p[b].player,10,10);
                    }
                }
            }
        }
    }
};
var cpuAct = function(playernum) {
    for (var a=0;a<p.length;a++) {
        if (a!==playernum) {
            if (coll(p[a].hitbox,p[playernum].hitbox)) {
                
            } else {
                if (p[a].y>p[playernum].y) {
                    if (p[playernum].fall) {
                        p[playernum].cpu.at2=true;
                    } else {
                        p[playernum].cpu.at2=false;
                        p[playernum].cpu.down=true;
                    }
                }
                if (p[a].x+p[a].hitbox.w<p[playernum].x) {
                    p[playernum].cpu.left=true;
                    p[playernum].cpu.right=false;
                } else if (p[playernum].x+p[playernum].hitbox.w<p[a].x) {
                    p[playernum].cpu.left=false;
                    p[playernum].cpu.right=true;
                }
            }
        }
    }
};
var draw = function() {
    backgrond();
    if (!mousePresssed) {
        mous=false;
    }
    if (mode==="play") {
        pushMatrix();
        if (width>height) {
            //translate((height-400)/2,0);
            //translate(height/2-100,0);
            translate(width/2-height/2,0);
            scale(height/400);
        } else {
            translate(0,height-width);
            scale(width/400);
        }
        var burger1 = max((height-width)/(width/400),0);
        platformRender();
        var lasthp = [];
        for (var a=0;a<p.length;a++) {
            lasthp[a]=p[a].hp;
        }
        //println(p[1].x+" "+p[0].y);
        if (stage===2) {
            if (frameCount===floor(frameCount/120)*120) {
                particles=append(particles,{
                    x: random(60,340),
                    y: 0,
                    vx: random(-1,1),
                    vy: random(-1,1),
                    opacity: 255,
                    owner: -1,
                    colorr: color(255, 0, 0),
                    size: 10,
                });
            }
        }
        for (var a=0;a<p.length;a++) {
            if (p[a].player==="cpu1") {
                cpuAct(a);
            }
            for (var b=0;b<particles.length;b++) {
                fill(particles[b].colorr);
                rect(particles[b].x-particles[b].size/2,particles[b].y-particles[b].size/2,particles[b].size,particles[b].size);
                particles[b].vy-=0.1;
                particles[b].x+=particles[b].vx;
                particles[b].y-=particles[b].vy;
                if (particles[b].owner!=="none") {
                    for (var c=0;c<p.length;c++) {
                        if (particles[b].owner!==c) {
                            if (coll({x:particles[b].x-particles[b].size/2,y:particles[b].y-particles[b].size/2,w:particles[b].size,h:particles[b].size},p[c].hitbox)) {
                                p[c].hp+=particles[b].size/20;
                                p[c].vx=particles[b].vx*(p[c].hp/100+1);
                            }
                        }
                    }
                    if (particles[b].owner>=0) {
                        if (random(0,10)<1) {
                            particles[b].size-=1;
                        }
                    }
                }
                if (particles[b].x>400+particles[b].size/2||particles[b].size<=0) {
                    var tempvar86 = [];
                    for (var c=0;c<particles.length;c++) {
                        if (c!==b) {
                            tempvar86=append(tempvar86,particles[c]);
                        }
                    }
                    particles=tempvar86;
                }
            }
            // When fell off stage
            if (p[a].y>400||p[a].x>465||p[a].x<-120) {
                p[a].lightflash.time=1;
                if (p[a].x>200) {
                    p[a].lightflash.x1=p[a].x-50;
                    p[a].lightflash.y1=p[a].y+50;
                    p[a].lightflash.x2=p[a].x+50;
                    p[a].lightflash.y2=p[a].y-50;
                } else {
                    p[a].lightflash.x1=p[a].x-50;
                    p[a].lightflash.y1=p[a].y-50;
                    p[a].lightflash.x2=p[a].x+50;
                    p[a].lightflash.y2=p[a].y+50;
                }
                p[a].lightflash.x3=avg(p[a].x,width/2);
                p[a].lightflash.y3=avg(p[a].y,height/2);
                if (a===0) {
                    p[a].x=80;
                    p[a].y=200;
                } else if (a===1) {
                    p[a].x=270;
                    p[a].y=200;
                } else {
                    p[a].x=200;
                    p[a].y=200;
                }
                p[a].vx=0;
                p[a].vy=0;
                p[a].hp=0;
                if (p[a].stock<=100) {
                    p[a].stock-=1;
                }
            }
            if (p[a].stock<=0) {
                p[a].x=200;
                p[a].y=99999999;
                p[a].vx=0;
                p[a].vy=0;
            } else if (p[a].y<-48-(height-400)/(width-400)) {
                //println(floor(frameCount/60)*60);
                if (frameCount===floor(frameCount/60)*60) {
                    p[a].hp+=1;
                }
            }
            // When hitboxes are shown
            if (showHitboxes) {
                colorMode(HSB);
                fill(0+a*40, 255, 255, 150);
                rect(p[a].hitbox.x,p[a].hitbox.y,p[a].hitbox.w,p[a].hitbox.h);
                colorMode(RGB);
            }
            // Putting this right above the Render Players section guarantees that being in ouch frames causes ouch.
            if (p[a].movecool>frameCount) { // ouch codery
                p[a].frame1=5;
                p[a].frame2=0;
            }
            // Render players
            textAlign(CENTER,CENTER);
            textSize(15);
            var playerCol = [color(127,0,0),color(0,0,127),color(0,127,0),color(127,127,0)];
            fill(playerCol[p[a].player]);
            text("P"+(p[a].player+1)+"\n^",p[a].x+24,p[a].y-4);
            var tempvar18 = [color(0, 0, 0),color(0, 0, 0)];
            if (stage===1) {
                tempvar18[0]=color(255, 0, 0);
                tempvar18[1]=color(0, 0, 255);
            }
            if (myImages[p[a].char][p[a].frame1][p[a].frame2]===undefined) {
                //println(myImages[p[a].char][p[a].frame1][p[a].frame2]);
                fill(255, 0, 0);
                textAlign(LEFT,TOP);
                textSize(24);
                text("ERROR: MISSING IMAGE\nmyImages["+p[a].char+","+p[a].frame1+","+p[a].frame2+"]",p[a].x,p[a].y);
            } else {
                if (p[a].dir===1) {
                    if (!showHitboxes) {
                        repeatsImageGenerator(myImages[p[a].char][p[a].frame1][p[a].frame2],p[a].x,p[a].y-8,48,myImages[p[a].char][p[a].frame1][p[a].frame2][0].length*3,color(tempvar18[0], 20));
                        repeatsImageGenerator(myImages[p[a].char][p[a].frame1][p[a].frame2],p[a].x,p[a].y+8,48,myImages[p[a].char][p[a].frame1][p[a].frame2][0].length*3,color(tempvar18[1], 50));
                    }
                    repeatsImageGenerator(myImages[p[a].char][p[a].frame1][p[a].frame2],p[a].x,p[a].y,48,myImages[p[a].char][p[a].frame1][p[a].frame2][0].length*3,p[a].colorvar);
                    if (p[a].hp>=100) {
                        repeatsImageGenerator(myImages[p[a].char][p[a].frame1][p[a].frame2],p[a].x,p[a].y,48,myImages[p[a].char][p[a].frame1][p[a].frame2][0].length*3,color(255,0,0,min(p[a].hp-100,200)*(sin(frameCount*5/(180/PI))/2+0.5)));
                    }
                } else {
                    if (!showHitboxes) {
                        repeatsImageGenerator(myImages[p[a].char][p[a].frame1][p[a].frame2],p[a].x+48,p[a].y-8,48,-48,color(tempvar18[0], 20));
                        repeatsImageGenerator(myImages[p[a].char][p[a].frame1][p[a].frame2],p[a].x+48,p[a].y+8,48,-48,color(tempvar18[1], 50));
                    }
                    repeatsImageGenerator(myImages[p[a].char][p[a].frame1][p[a].frame2],p[a].x+48,p[a].y,48,-48,p[a].colorvar);
                    if (p[a].hp>=100) {
                        repeatsImageGenerator(myImages[p[a].char][p[a].frame1][p[a].frame2],p[a].x+48,p[a].y,48,myImages[p[a].char][p[a].frame1][p[a].frame2][0].length*-3,color(255,0,0,min(p[a].hp-100,200)*(sin(frameCount*5/(180/PI))/2+0.5)));
                    }
                }
            }
            // Change poses
            if (frameCount===floor(frameCount/frameSpeed)*frameSpeed) {
                if (myImages[p[a].char][p[a].frame1][p[a].frame2+1]===undefined) {
                    p[a].frame2=0;
                } else {
                    p[a].frame2+=1;
                }
            }
            var ww = "w";
            var aa = "a";
            var ss = "s";
            var dd = "d";
            var ii = "y";
            var jj = "g";
            var kk = "h";
            var ll = "j";
            //if (((keys[RIGHT]&&!keys[LEFT]&&!keys[DOWN]&&p[a].player===0)||((keyNotCode[dd]||keyNotCode[dd.toUpperCase()])&&!keyNotCode[aa]&&!keyNotCode[aa.toUpperCase()]&&!keyNotCode[ss]&&!keyNotCode[ss.toUpperCase()]&&p[a].player===1)||((keyNotCode[ll]||keyNotCode[ll.toUpperCase()])&&!keyNotCode[jj]&&!keyNotCode[jj.toUpperCase()]&&!keyNotCode[kk]&&!keyNotCode[kk.toUpperCase()]&&p[a].player===2)||(p[a].cpu.right&&!p[a].cpu.left&&!p[a].cpu.down))&&p[a].movecool<frameCount) {
            if (((keys[RIGHT]&&!keys[LEFT]&&p[a].player===0)||((keyNotCode[dd]||keyNotCode[dd.toUpperCase()])&&!keyNotCode[aa]&&!keyNotCode[aa.toUpperCase()]&&p[a].player===1)||((keyNotCode[ll]||keyNotCode[ll.toUpperCase()])&&!keyNotCode[jj]&&!keyNotCode[jj.toUpperCase()]&&p[a].player===2)||(p[a].cpu.right&&!p[a].cpu.left))&&p[a].movecool<frameCount&&p[a].frame1!==2) {
                if (p[a].frame1===6||p[a].frame1===9) { // nice
                    p[a].vx=2;
                } else {
                    p[a].frame1=1;
                    p[a].vx=3;
                }
                p[a].dir=1;
            }
            //if (((keys[LEFT]&&!keys[RIGHT]&&!keys[DOWN]&&p[a].player===0)||((keyNotCode[aa]||keyNotCode[aa.toUpperCase()])&&!keyNotCode[dd]&&!keyNotCode[dd.toUpperCase()]&&!keyNotCode[ss]&&!keyNotCode[ss.toUpperCase()]&&p[a].player===1)||((keyNotCode[jj]||keyNotCode[jj.toUpperCase()])&&!keyNotCode[ll]&&!keyNotCode[ll.toUpperCase()]&&!keyNotCode[kk]&&!keyNotCode[kk.toUpperCase()]&&p[a].player===2)||(p[a].cpu.left&&!p[a].cpu.right&&!p[a].cpu.down))&&p[a].movecool<frameCount) {
            if (((keys[LEFT]&&!keys[RIGHT]&&p[a].player===0)||((keyNotCode[aa]||keyNotCode[aa.toUpperCase()])&&!keyNotCode[dd]&&!keyNotCode[dd.toUpperCase()]&&p[a].player===1)||((keyNotCode[jj]||keyNotCode[jj.toUpperCase()])&&!keyNotCode[ll]&&!keyNotCode[ll.toUpperCase()]&&p[a].player===2)||(p[a].cpu.left&&!p[a].cpu.right))&&p[a].movecool<frameCount&&p[a].frame1!==2) {
                if (p[a].frame1===6||p[a].frame1===9) { // nice
                    p[a].vx=-2;
                } else {
                    p[a].frame1=1;
                    p[a].vx=-3;
                }
                p[a].dir=0;
            }
            if (((keys[DOWN]&&p[a].player===0)||(keyNotCode[ss]&&p[a].player===1)||(keyNotCode[kk]&&p[a].player===2)||(p[a].cpu.down))&&p[a].movecool<frameCount&&p[a].frame1!==8&&p[a].frame1!==9) {
                if (characterData[p[a].char]!==undefined) {
                    p[a].vx*=characterData[p[a].char].downslide;
                } else {
                    p[a].vx*=characterData[0].downslide;
                }
                //p[a].vx*=0.95;
                if ((p[a].frame1!==8&&p[a].frame1!==9)||p[a].frame1===0) {
                    p[a].frame1=2;
                    p[a].frame2=0;
                }
                //println(p[a].movecool-frameCount);
            }
            if (p[a].canjump&&p[a].frame1!==4&&p[a].frame1!==6&&p[a].frame1!==7) {
                if (p[a].frame1===3) {
                    if (p[a].frame2===0) {
                        p[a].frame2+=1;
                    } else if (random(0,5)<1) {
                        p[a].frame1=0;
                    }
                }
                if (showHitboxes) {
                    fill(255, 0, 0);
                    rect(10,10*p[a].player,10,10);
                }
                if (((keys[UP]&&p[a].player===0)||(keyNotCode[ww]&&p[a].player===1)||(keyNotCode[ii]&&p[a].player===2)||(p[a].cpu.up))&&p[a].movecool<frameCount) {
                    p[a].canjump=false;
                    //p[a].y-=17;
                    //println(p[a].vy);
                    if (characterData[p[a].char]!==undefined) {
                        p[a].vy=characterData[p[a].char].jumpheight;
                    } else {
                        p[a].vy=characterData[0].jumpheight;
                    }
                    //p[a].vy=4;
                    p[a].y-=p[a].vy;
                    p[a].fall=true;
                }
            }
            var canDoUp=true;
            var period = ".";
            var q = "q";
            var uu = "t"; // down special codery
            // this is if you press the up special input while holding down
            if (((keys[DOWN]&&p[a].player===0)||(keyNotCode[ss]&&p[a].player===1)||(keyNotCode[kk]&&p[a].player===2)||(p[a].cpu.down))&&((keyNotCode[q]&&p[a].player===1)||(keyNotCode[period]&&p[a].player===0)||(keyNotCode[uu]&&p[a].player===2)||(p[a].cpu.at2))&&p[a].movecool<frameCount) {
                canDoUp=false;
                if (frameCount===floor(frameCount/8)*8) {
                    if (p[a].canjump) { // non-aerial (may break if a double-jump mechanic is added :\)
                        p[a].frame1=8;
                        p[a].frame2=0;
                    } else { // aerial
                        if (p[a].char===3) { // temporary code to prevent any characters but Fatal Book from doing this
                        p[a].frame1=9;
                        p[a].frame2=1;
                        }
                        if (p[a].char===2) {
                            // nidorino's down special is literally a less spammy, slightly more powerful version of his aerial charge special, lmao
                            if (p[a].frame1!==5&&frameCount===floor(frameCount/10)*10) {
                                particles=append(particles,{
                                    x: p[a].x+24+(p[a].dir-0.5)*2*12,
                                    y: p[a].y+40,
                                    vx: 0,
                                    vy: p[a].vy-1,
                                    opacity: 255,
                                    owner: a,
                                    colorr: color(255, 0, 255),
                                    size: 15,
                                });
                            }
                        }
                    }
                }
            } else {
                // down special codery
                if (p[a].frame1===8) {
                    if (characterData[p[a].char]!==undefined) {
                        if (characterData[p[a].char].downspecialmove) {
                            p[a].vx=(p[a].dir-0.5)*4;
                        }
                    }
                    if (frameCount-floor(frameCount/8)*8>=4) {
                        p[a].frame2=1;
                        for (var b=0;b<p.length;b++) {
                            if (b!==a) {
                                if (coll(p[b].hitbox,p[a].hitbox)) {
                                    p[b].vx=(p[a].dir-0.5)*4;
                                    if (characterData[p[a].char]!==undefined) {
                                        p[b].vy=characterData[p[a].char].downspeciallaunch;
                                    } else {
                                        p[b].vy=1;
                                    }
                                    p[b].y-=1;
                                    p[b].fall=true;
                                    if (characterData[p[b].char]!==undefined) {
                                        p[b].vx*=p[b].hp/200+1+characterData[p[b].char].knockbackplus;
                                    } else {
                                        p[b].vx*=p[b].hp/200+1+characterData[0].knockbackplus;
                                    }
                                    //p[b].vy*=p[b].hp/200+1;
                                    p[b].movecool=10+frameCount;
                                    var dmggg = 0.2;
                                    if (characterData[p[b].char]!==undefined) {
                                        dmggg=characterData[p[b].char].downspecialmaxdmg;
                                    } else {
                                        dmggg=characterData[0].downspecialmaxdmg;
                                    }
                                    p[b].hp+=random(0.1,dmggg);
                                    p[b].canjump=false;
                                    //println(p[b].hp);
                                    p[b].hp=round(p[b].hp*10)/10;
                                    //println(p[b].hp);
                                    //p[b].movecool=frameCount+abs(p[a].vx)*5;
                                }
                            }
                        }
                    } else {
                        p[a].frame2=0;
                    }
                    if (frameCount-floor(frameCount/8)*8>=7) {
                        if (((keys[DOWN]&&p[a].player===0)||(keyNotCode[ss]&&p[a].player===1)||(keyNotCode[kk]&&p[a].player===2)||(p[a].cpu.down))&&((keyNotCode[q]&&p[a].player===1)||(keyNotCode[period]&&p[a].player===0)||(keyNotCode[uu]&&p[a].player===2)||(p[a].cpu.at2))&&p[a].movecool<frameCount) {} else {
                            p[a].frame1=0;
                        }
                        p[a].frame2=0;
                    }
                }
                // aerial down special codery
                if (p[a].frame1===9) {
                    frameSpeed=8;
                    for (var b=0;b<p.length;b++) {
                        if (b!==a) {
                            if (coll(p[b].hitbox,p[a].hitbox)&&p[a].frame2>1) {
                                if (p[b].movecool<frameCount) {
                                    p[b].movecool=30+frameCount;
                                    p[b].frame1=5;
                                    p[b].frame2=0;
                                    p[b].canjump=false;
                                    p[b].hp+=floor(random(4,7)*10)/10;
                                    if (p[b].vy!==0) {
                                        p[b].vy=-4;
                                    } else {
                                        p[b].vy=4;
                                    }
                                    p[b].y-=1;
                                }
                                if (characterData[p[a].char]!==undefined) {
                                    if (characterData[p[a].char].pogo&&p[b].vy>0) {
                                        p[a].vy=2;
                                        p[a].y-=1;
                                    }
                                }
                            }
                        }
                        if (p[a].frame2===0) {
                            p[a].frame1=0;
                        }
                    }
                }
            }
            if (p[a].vy<-16) {
                //println(p[a].vy);
            }
            // this is the normal up special move
            if (((keyNotCode[q]&&p[a].player===1)||(keyNotCode[period]&&p[a].player===0)||(keyNotCode[uu]&&p[a].player===2)||(p[a].cpu.at2))&&p[a].movecool<frameCount&&canDoUp) {
                // special move codery
                if (p[a].canjump) {
                    p[a].frame1=6;
                    p[a].canjump=false;
                    if (characterData[p[a].char]!==undefined) {
                        p[a].vy=characterData[p[a].char].upspecialheight;
                    } else {
                        p[a].vy=characterData[0].upspecialheight;
                    }
                    //p[a].vy=8;
                    p[a].y-=p[a].vy;
                    p[a].fall=true;
                } else if (p[a].frame1!==6&&p[a].vy<2) {
                    if (p[a].vy>-10) {
                        p[a].vy=-10;
                    } else {
                        p[a].vy-=0.4;
                    }
                }
                //println(p[a].vy);
                if (p[a].vy>0) {
                    for (var b=0;b<p.length;b++) {
                        if (b!==a) {
                            if (coll(p[b].hitbox,p[a].hitbox)) {
                                if (p[b].vy>-16) { // prevents everything except damage if the hit player is moving super fast downwards.
                                    p[b].vy=2;
                                    if (p[a].vy>6&&p[b].y>p[a].y) {
                                        p[b].y=p[a].y;
                                        //p[b].y=p[a].hitbox.y-p[a].hitbox.h-p[b].hitbox.h;
                                    }
                                        p[b].canjump=false;
                                    p[b].fall=true;
                                    if (characterData[p[b].char]!==undefined) {
                                        p[b].vy*=p[b].hp/200+1+characterData[p[b].char].knockbackplus;
                                        if (abs(p[a].vx)!==constrain(abs(p[a].vx),0.5,2)) {
                                            var avgaround = 10;
                            p[b].vx=(p[b].vx+p[a].vx*(avgaround-1))/avgaround;
                                        }
                                    } else {
                                        p[b].vy*=p[b].hp/200+1+characterData[0].knockbackplus;
                                        if (abs(p[a].vx)!==constrain(abs(p[a].vx),0.5,2)) {
                                            var avgaround = 10;
                                            p[b].vx=(p[b].vx+p[a].vx*(avgaround-1))/avgaround;
                                        }
                                    }
                                    //p[b].vy*=p[b].hp/200+1;
                                    if (p[a].vy===constrain(p[a].vy,0,4)) { 
                                        p[b].movecool=frameCount+20;
                                    } else {
                                        p[b].movecool=frameCount+30;
                                    }
                                } else {
                                    p[a].movecool=frameCount+10;
                                    p[a].vy=0;
                                }
                                p[b].hp+=max(floor(abs(p[a].vy))/20,0.1)+p[a].slamdown/16;
                                p[b].hp=round(p[b].hp*10)/10;
                                //println(p[b].hp);
                                //p[b].movecool=frameCount+abs(p[a].vx)*5;
                            }
                        }
                    }
                }
            } else if (p[a].frame1===6&&(p[a].canjump||p[a].vy<-3)) {
                if (p[a].frame2===0) {
                    p[a].frame1=0;
                } else {
                    p[a].frame2-=1;
                }
            }
            if (p[a].frame1===6||p[a].vy>6) {
                p[a].vy-=0.2;
            }
            //println(p[a].frame1);
            var slash = "/"; // neutral attack codery
            var ee = "e";
            var oo = "u";
            var cancelBigHits = true; // makes it so that if you try to deal a neutral attack in the middle of an up special that's going down too fast, it won't work.
            if (((keyNotCode[slash]&&p[a].player===0)||(keyNotCode[ee]&&p[a].player===1)||(keyNotCode[oo]&&p[a].player===2)||(p[a].cpu.at1))&&!(cancelBigHits&&p[a].frame1===5&&p[a].vy<-8)&&p[a].vx===constrain(p[a].vx,-0.2,0.2)&&p[a].movecool<frameCount) {
                if (((keys[UP]&&p[a].player===0)||(keyNotCode[ww]&&p[a].player===1)||(keyNotCode[ii]&&p[a].player===2)||(p[a].cpu.up))&&(p[a].frame1===3)||p[a].frame1===5) {
                    var tempCharData = characterData[0].jumpheight;
                    if (characterData[p[a].char]!==undefined) {
                        tempCharData=characterData[p[a].char].jumpheight;
                    }
                    if (p[a].vy===constrain(p[a].vy,tempCharData*0.8,tempCharData)) {//if (p[a].vy===constrain(p[a].vy,tempCharData*0.8,tempCharData)) {
                        // up tilt codery (same hitbox as jumping)
                        p[a].frame1=5;
                        p[a].frame2=1;
                        p[a].vy=0;
                        //println(frameCount);
                        if (p[a].player===0) {
                            keys[UP]=false;
                            keyNotCode[slash]=false;
                        }
                        if (p[a].player===1) {
                            keyNotCode[ww]=false;
                            keyNotCode[ee]=false;
                        }
                        if (p[a].player===2) {
                            keyNotCode[ii]=false;
                            keyNotCode[oo]=false;
                        }
                        p[a].cpu.up=false;
                        p[a].cpu.atk1=false;
                        if (p[a].char!==2) {
                            for (var b=0;b<p.length;b++) {
                                if (b!==a) {
                                    if (coll(p[b].hitbox,p[a].hitbox)) {
                                        p[b].vy=2;
                                        p[b].fall=true;
                                        if (characterData[p[b].char]!==undefined) {
                                            p[b].vy*=p[b].hp/200+1+characterData[p[b].char].knockbackplus;
                                        } else {
                                            p[b].vy*=p[b].hp/200+1+characterData[0].knockbackplus;
                                        }
                                        p[b].vx=0;
                                        p[b].movecool=frameCount+20;
                                        p[b].hp+=floor(random(10,16))/10;
                                        p[b].canjump=false;
                                        p[b].hp=round(p[b].hp*10)/10;
                                    }
                                }
                            }
                        } else if (p[a].char===2) { // nidorino up tilt codery
                            p[a].vy=0;
                            var fakedir = (p[a].dir-0.5)*2;
                            if (1===1) {
                                fakedir*=-1; // makes it come off of dinorino's back rather than his horn
                            }
                            particles=append(particles,{
                                //x: p[a].x+40,
                                x: p[a].x+24+fakedir*16,
                                y: p[a].y+40,
                                vx: (p[a].dir-0.5)*2*random(0.5,1.5),
                                vy: random(3,4),
                                opacity: 255,
                                owner: a,
                                colorr: color(255, 0, 255),
                                size: floor(random(10,16)),
                            });
                        }
                    } else if (p[a].vy<3){
                        p[a].frame1=4;
                    }
                } else {
                    if (p[a].vx===constrain(p[a].vx,-0.1,0.1)) {
                        if (p[a].dir===1) {
                            p[a].vx=10;
                        } else {
                            p[a].vx=-10;
                        }
                    } else {
                        if (p[a].dir===1) {
                            p[a].vx=5;
                        } else {
                            p[a].vx=-5;
                        }
                        //println(frameCount);
                    }
                    p[a].frame1=4;
                    p[a].frame2=0;
                    frameSpeed=9999;
                }
            }
            if (p[a].frame1===4) {
                // neutral attack codery
                if (p[a].vx===constrain(p[a].vx,-2,2)) {
                    p[a].frame2=1;
                } else {
                    p[a].vy*=0.9;
                }
                for (var b=0;b<p.length;b++) {
                    if (b!==a) {
                        if (coll(p[b].hitbox,p[a].hitbox)) {
                            if (p[a].dir===1) {
                                p[b].vx=5;
                                p[b].vy=2;
                            } else {
                                p[b].vx=-5;
                                p[b].vy=2;
                            }
                            if (p[a].vy<-2) {
                                p[b].vy=6;
                                p[b].hp+=0.5;
                                //println(p[b].hp);
                            }
                            p[b].vx*=p[b].hp/100+1;
                            p[b].vy*=p[b].hp/200+1;
                            if (p[a].vx===constrain(p[a].vx,-5,5)) { 
                                p[b].movecool=frameCount+20;
                            } else {
                                p[b].movecool=frameCount+30;
                            }
                            p[b].hp+=max(floor(abs(p[a].vx))/10,0.1);
                                    p[b].canjump=false;
                            p[b].hp=round(p[b].hp*10)/10;
                            //println(p[b].hp);
                            //p[b].movecool=frameCount+abs(p[a].vx)*5;
                        }
                    }
                }
                if (p[a].char===0) {
                    p[a].hitbox={
                        x: p[a].x+8,
                        y: p[a].y+8,
                        w: 32,
                        h: 40,
                    };
                } else if (p[a].char===1) {
                    p[a].hitbox={
                        x: p[a].x+4,
                        y: p[a].y+16,
                        w: 35,
                        h: 34,
                    };
                } else if (p[a].char===2) {
                    p[a].hitbox={
                        x: p[a].x+6,
                        y: p[a].y+21,
                        w: 42,
                        h: 27,
                    };
                } else if (p[a].char===3) {
                    p[a].fall=true;
                    p[a].hitbox.x-=p[a].vx/2;
                    p[a].hitbox.y+=p[a].vy/2;
                    fill(0,100);
                    rect(p[a].hitbox.x,p[a].hitbox.y,p[a].hitbox.w,p[a].hitbox.h);
                }
            }
            var ff = "f";
            var comma = ",";
            var colon = "k";
            if (((keyNotCode[ff]&&p[a].player===1)||(keyNotCode[comma]&&p[a].player===0)||(keyNotCode[colon]&&p[a].player===2)||(p[a].cpu.at3))) {
                if (p[a].frame1!==7) {
                    if (p[a].char===2&&p[a].fall) {
                        if (p[a].frame1!==5&&frameCount===floor(frameCount/10)*10) {
                            particles=append(particles,{
                                x: p[a].x+24+(p[a].dir-0.5)*2*12,
                                y: p[a].y+40,
                                vx: 0,
                                vy: p[a].vy-2,
                                opacity: 255,
                                owner: a,
                                colorr: color(255, 0, 255),
                                size: 5,
                            });
                        }
                    } else {
                        p[a].frame1=7;
                        p[a].frame2=0;
                    }
                }
            }
            if (p[a].frame1===7) {
                frameSpeed=20;
                if (((p[a].frame2===3&&p[a].char!==3)||(p[a].frame2===8&&p[a].char===3))&&frameCount+1===floor((frameCount+1)/frameSpeed)*frameSpeed) {
                    p[a].frame1=0;
                    p[a].frame2=0;
                }
                //var deConstrainify = function(input,min,max,too) {
                //    if (input!==constrain(input,min,max)) {
                //        return input;
                //    } else {
                //        return too;
                //    }
                //};
                if ((p[a].frame2===3&&p[a].char!==2&&p[a].char!==3)||(p[a].char===3&&p[a].frame2===8)) {
                    if (p[a].char===3) {
                        if (p[a].dir===1) {
                            p[a].vx=-5;
                            particles=append(particles,{
                                x: p[a].x+40,
                                y: p[a].y+40,
                                vx: 12,
                                vy: 0,
                                opacity: 255,
                                owner: a,
                                colorr: color(255, 0, 0),
                                size: 20,
                            });
                        } else {
                            p[a].vx=5;
                            particles=append(particles,{
                                x: p[a].x,
                                y: p[a].y+40,
                                vx: -12,
                                vy: 0,
                                opacity: 255,
                                owner: a,
                                colorr: color(255, 0, 0),
                                size: 20,
                            });
                        }
                    }
                    for (var b=0;b<p.length;b++) {
                        if (b!==a) {
                            if (coll(p[b].hitbox,p[a].hitbox)) {
                                if (p[a].dir===1) {
                                    p[b].vx=8;
                                    p[b].vy=2;
                                } else {
                                    p[b].vx=-8;
                                    p[b].vy=2;
                                }
                                p[b].vx*=p[b].hp/100+1;
                                p[b].vy*=p[b].hp/200+1;
                                p[b].movecool=frameCount+30;
                                p[b].hp+=2;
                                    p[b].canjump=false;
                                p[b].hp=round(p[b].hp*10)/10;
                                //println(p[b].hp);
                                    //p[b].movecool=frameCount+abs(p[a].vx)*5;
                            }
                        }
                    }
                } else if (p[a].char!==2&&p[a].char!==3&&((p[a].movecool<frameCount&&!characterData[p[a].char].chargeAttackCheese)||characterData[p[a].char].chargeAttackCheese)) {
                    if (p[a].dir===1) {
                        //p[a].vx=deConstrainify(p[a].vx,-3,3,0.5*p[a].frame2);
                        p[a].vx=0.5*p[a].frame2;
                    } else {
                        p[a].vx=-0.5*p[a].frame2;
                    }
                } else if (p[a].char===3&&((p[a].movecool<frameCount&&!characterData[p[a].char].chargeAttackCheese)||characterData[p[a].char].chargeAttackCheese)) {
                    if (p[a].dir===1) {
                        p[a].vx=-0.25*min(p[a].frame2,2);
                    } else {
                        p[a].vx=0.25*min(p[a].frame2,2);
                    }
                }
                if (p[a].char===0) {
                    p[a].hitbox={
                        x: p[a].x+4,
                        y: p[a].y+8,
                        w: 44,
                        h: 40,
                    };
                } else if (p[a].char===1) {
                    p[a].hitbox={
                        x: p[a].x,
                        y: p[a].y,
                        w: 48,
                        h: 48,
                    };
                } else if (p[a].char===2) {
                    p[a].hitbox={
                        x: p[a].x+4,
                        y: p[a].y,
                        w: 44,
                        h: 48,
                    };
                    if (p[a].frame2===2) {
                        p[a].vy=3;
                        p[a].canjump=false;
                        p[a].fall=true;
                        particles=append(particles,{
                            x: p[a].x,
                            y: p[a].y+40,
                            vx: -2,
                            vy: 0,
                            opacity: 255,
                            owner: a,
                            colorr: color(255, 0, 255),
                            size: 10,
                        });
                        particles=append(particles,{
                            x: p[a].x+48,
                            y: p[a].y+40,
                            vx: 2,
                            vy: 0,
                            opacity: 255,
                            owner: a,
                            colorr: color(255, 0, 255),
                            size: 10,
                        });
                        particles=append(particles,{
                            x: p[a].x,
                            y: p[a].y+40,
                            vx: -1,
                            vy: 3,
                            opacity: 255,
                            owner: a,
                            colorr: color(255, 0, 255),
                            size: 10,
                        });
                        particles=append(particles,{
                            x: p[a].x+48,
                            y: p[a].y+40,
                            vx: 1,
                            vy: 3,
                            opacity: 255,
                            owner: a,
                            colorr: color(255, 0, 255),
                            size: 10,
                        });
                        p[a].frame1=0;
                        p[a].frame2=0;
                    }
                } else if (p[a].char===3) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+20,
                        w: 25,
                        h: 30,
                    };
                }
            }
            if (p[a].frame1===6) {
                if (p[a].char===0) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+8,
                        w: 25,
                        h: 40,
                    };
                } else if (p[a].char===1) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+8,
                        w: 25,
                        h: 42,
                    };
                } else if (p[a].char===2) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+6,
                        w: 24,
                        h: 42,
                    };
                } else if (p[a].char===3) {
                    p[a].hitbox={
                        x: p[a].x+6,
                        y: p[a].y+24,
                        w: 36,
                        h: 24,
                    };
                }
                if (p[a].vy>3) {
                    p[a].frame2=0;
                } else {
                    p[a].frame2=1;
                }
            }
            if (p[a].frame1===0||p[a].frame1===1||p[a].frame1===5) {
            // standstill hitboxery
                if (p[a].char===0) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+8,
                        w: 25,
                        h: 40,
                    };
                } else if (p[a].char===1) {
                    if (p[a].frame2===0||p[a].frame2===3) {
                        p[a].hitbox={
                            x: p[a].x+12,
                            y: p[a].y+22,//-p[a].vy
                            w: 24,
                            h: 26,
                        };
                    } else {
                        p[a].hitbox={
                            x: p[a].x+12,
                            y: p[a].y+20,//-p[a].vy
                            w: 24,
                            h: 28,
                        };
                    }
                } else if (p[a].char===2) {
                    if (p[a].dir===1) {
                        p[a].hitbox={
                            x: p[a].x+6,
                            y: p[a].y+18,
                            w: 42,
                            h: 30,
                        };
                    } else {
                        p[a].hitbox={
                            x: p[a].x,//+p[a].vx
                            y: p[a].y+18,
                            w: 42,
                            h: 30,
                        };
                    }
                } else if (p[a].char===3) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+20,
                        w: 25,
                        h: 30,
                    };
                }
            }
            if (p[a].frame1===2) {
            // ducking hitboxery
                if (p[a].char===0) {
                    p[a].hitbox={
                        x: p[a].x+12+(p[a].dir+1)+(p[a].dir-1),
                        y: p[a].y+20,
                        w: 22,
                        h: 28,
                    };
                } else if (p[a].char===1) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+26,
                        w: 24,
                        h: 22,
                    };
                } else if (p[a].char===2) {
                    p[a].hitbox={
                        x: p[a].x+6+(p[a].dir-1)*6,
                        y: p[a].y+21,
                        w: 42,
                        h: 27,
                    };
                } else if (p[a].char===3) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+36,
                        w: 25,
                        h: 12,
                    };
                }
            }
            if (p[a].frame1===3) {
                // falling hitboxery
                if (p[a].char===0) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+8,
                        w: 25,
                        h: 40,
                    };
                } else if (p[a].char===1) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+20,
                        w: 25,
                        h: 30,
                    };
                } else if (p[a].char===2) {
                    p[a].hitbox={
                        x: p[a].x+6,
                        y: p[a].y+18,
                        w: 42,
                        h: 30,
                    };
                } else if (p[a].char===3) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+20,
                        w: 25,
                        h: 30,
                    };
                }
            }
            if (p[a].frame1===8) {
                // down special hitboxery
                if (p[a].char===0) {
                    p[a].hitbox={
                        x: p[a].x+10+(p[a].dir+1)*2+(p[a].dir-1)*7,
                        y: p[a].y+20,
                        w: 29,
                        h: 28,
                    };
                } else if (p[a].char===1) {
                    if (p[a].frame2===0) {
                        p[a].hitbox={
                            x: p[a].x+12+(p[a].dir-0.5)+(p[a].dir)*-1,
                            y: p[a].y+22,
                            w: 24,
                            h: 26,
                        };
                    } else {
                        p[a].hitbox={
                            x: p[a].x+6+(p[a].dir-0.5)+(p[a].dir)*-1,
                            y: p[a].y+22,
                            w: 36,
                            h: 26,
                        };
                    }
                } else if (p[a].char===2) {
                    p[a].hitbox={
                        x: p[a].x+6+(p[a].dir-1)*6,
                        y: p[a].y+21,
                        w: 42,
                        h: 27,
                    };
                } else if (p[a].char===3) {
                    p[a].hitbox={
                        x: p[a].x+12,
                        y: p[a].y+36,
                        w: 25,
                        h: 12,
                    };
                }
            }
            if (p[a].frame1===1) {
                frameSpeed=20-ceil(abs(p[a].vx)*3);
            }
            if (p[a].vx===0&&p[a].frame1!==6&&p[a].frame1!==7&&p[a].frame1!==8&&p[a].frame1!==9) {
                if ((!keys[DOWN]&&p[a].player===0)||(!keyNotCode[ss]&&p[a].player===1)||(!keyNotCode[kk]&&p[a].player===2)||(!p[a].cpu.down&&p[a].player==="cpu1")) {
                    //println(str(p[a].frame1)+str(" ")+str(frameCount));
                    p[a].frame1=0;
                }
                frameSpeed=20;
            }
            if ((!p[a].canjump)&&(p[a].frame1!==4&&p[a].frame1!==6&&p[a].frame1!==7&&p[a].frame1!==8&&p[a].frame1!==9)) {
                p[a].frame2=0;
                p[a].frame1=3;
                frameSpeed=20;
            }
            p[a].vx*=0.9;
            if (p[a].vx===constrain(p[a].vx,-0.01,0.01)) {
                p[a].vx=0;
            }
            if (p[a].frame2>myImages[p[a].char][p[a].frame1].length) {
                p[a].frame2=0;
            }
            if (p[a].fall) {
                p[a].vy-=0.1;
            } else {
                p[a].vy=0;
            }
            p[a].x+=p[a].vx;
            p[a].y-=p[a].vy;
            // fixing hitboxes hitboxery
            //if (p[a].frame1===0) {
            if (modeStats.smoothVxHitbox) {
                p[a].hitbox.x+=p[a].vx;
            }
            if (modeStats.smoothVyHitbox) {
                p[a].hitbox.y-=p[a].vy;
            }
            //    p[a].hitbox.y+=p[a].vy;
            //}
            //image(get(p[a].x,p[a].y,48,48),p[a].x-24,p[a].y-24,96,96);
            //var burger1 = (max(height-400,1)/max(width-400,1))*400;
            //var burger1 = max((height-400)-(width-400),0);
            //var burger1 = max((height-400)/(width/400),1);
            // moved it up to the width/height area instead
            //var burger1 = max(height-400,1);
            //println(burger1);
            //fill(0);
            //text(burger1,40,40);
            if ((p[a].x!==constrain(p[a].x,-24,400-24)||p[a].y<-24-burger1)&&p[a].stock>0) {
                fill(0, 0, 0, 100);
                if (p[a].x===constrain(p[a].x,0,400)) {
                ellipse(constrain(p[a].x+24,20,380),max(p[a].y+36,24-burger1),30,30);
                } else {
                ellipse(constrain(p[a].x+24,20,380),max(p[a].y+36,24-burger1),30,30);
                }
                fill(255, 0, 0);
                if (p[a].x<0) {
                    ellipse(constrain(p[a].x+24,20,380),max(p[a].y+36,24-burger1),10+(-48-p[a].x)/3,10+(-48-p[a].x)/3);
                } else if (p[a].x>400-24) {
                    ellipse(constrain(p[a].x+24,20,380),max(p[a].y+36,24-burger1),10+(p[a].x-400)/3,10+(p[a].x-400)/3);
                }
            }
            var isOk=0;
            for (var b=0;b<p.length;b++) {
                if (p[b].stock<=0) {
                    isOk+=1;
                }
            }
            if (isOk===p.length-1) {
                if (p[a].stock>0) {
                    mode="winscreen";
                    modeStats.winner=a;
                }
            }
            fill(158, 158, 158);
            rect(10+100*a,330,40,40);
            repeatsImageGenerator(myImages[p[a].char][5][0],5+100*a,325,40,40);
            if (p[a].stock>0) {
                fill(158, 158, 158);
                rect(10+100*a,330,40,40);
                repeatsImageGenerator(myImages[p[a].char][0][0],5+100*a,325,40,40,p[a].colorvar);
                fill(0, 0, 0);
                textAlign(LEFT,CENTER);
                textSize(15);
                //var temptext = ""+floor(p[a].hp*10);
                var temptext = ""+floor(lasthp[a]*10);
                if (temptext==="0") {
                    temptext="00";
                }
                text(join(shorten(temptext),"")+"."+temptext[temptext.length-1],50+100*a,350);
                textSize(10);
                text("Stocks: "+max(p[a].stock,0),10+100*a,315);
                if (p[a].vx===constrain(p[a].vx,-0.2,0.2)&&p[a].movecool<frameCount) {
                    if (p[a].vx===0) {
                        fill(0, 255, 0);
                        if (p[a].vy<-2) {
                            fill(0, 255, 255);
                        }
                    } else {
                        fill(255, 255, 0);
                    }
                } else {
                    fill(255, 0, 0);
                }
                if (modeStats.moveIndicatorsVer===0) {
                    rect(10+100*a,375,10,10);
                }
                fill(255, 0, 0);
                if (p[a].canjump&&p[a].movecool<frameCount) {
                    fill(0, 255, 0);
                }
                if (modeStats.moveIndicatorsVer===0) {
                    rect(25+100*a,375,10,10);
                }
                fill(0, 255, 0);
                if (p[a].frame1===7) {
                    if (p[a].frame2===3) {
                        fill(0, 255, 255);
                    } else if (p[a].frame2===2) {
                        fill(255, 255, 0);
                    } else {
                        fill(255, 0, 0);
                    }
                }
                if (modeStats.moveIndicatorsVer===0) {
                    rect(40+100*a,375,10,10);
                }
                // shield codery
                if (modeStats.shieldingAllowed) {
                    var shieldBarGoUp = 0;
                    if (modeStats.moveIndicatorsVer!==0) {
                        shieldBarGoUp = 15;
                    }
                    fill(0, 100, 100);
                    rect(10+100*a,390-shieldBarGoUp,40,5);
                    fill(0, 255, 255);
                    rect(10+100*a,390-shieldBarGoUp,max(40*(p[a].shieldLeft/modeStats.shieldMax),0),5);
                    var mn = "m";
                    var rr = "r";
                    var pp = "i";
                    if ((p[a].player===1&&keyNotCode[rr])||(p[a].player===0&&keyNotCode[mn])||(p[a].player===2&&keyNotCode[pp])) {
                        if (p[a].shieldLeft>0) {
                            p[a].shieldLeft-=abs(lasthp[a]-p[a].hp)*2; // this makes you lose more shield if you take damage while shielding
                            p[a].shieldLeft-=max(0,p[a].movecool-frameCount)/20; // this makes you lose more shield if you take move cooldown while shielding
                            p[a].hp=lasthp[a];
                            p[a].movecool=0;
                            if (characterData[p[a].char].meleeFox) {
                                p[a].vx=0; // Causes the Melee Fox glitch, so I made the glitch a feature for modders and future me.
                            }
                            fill(0, 255, 255, 127);
                            ellipse(p[a].hitbox.x+p[a].hitbox.w/2,p[a].hitbox.y+p[a].hitbox.h/2,p[a].hitbox.w,p[a].hitbox.h);
                        }
                        if (p[a].shieldLeft>modeStats.shieldMin) {
                            p[a].shieldLeft-=0.5;
                        }
                    } else if (p[a].shieldLeft<modeStats.shieldMax) {
                        p[a].shieldLeft+=0.25;
                    } else {
                        p[a].shieldLeft=modeStats.shieldMax;
                    }
                }
                // move indicator codery
                if (modeStats.moveIndicatorsVer===1) {
                    var shieldBarGoUp = 15;
                    var grid = [[0,0,0],[0,0,0],[0,0,0]];
                    if (p[a].vx===constrain(p[a].vx,-0.2,0.2)&&p[a].movecool<frameCount) {
                        if (p[a].vx===constrain(p[a].vx,-0.1,0.1)) {
                            grid[1][1]=3;
                            if (p[a].vy<-2) {
                                if (p[a].vy>=-8) {
                                    grid[1][1]=4;
                                } else {
                                    grid[1][1]=1;
                                }
                            }
                        } else {
                            grid[1][1]=2;
                        }
                    } else {
                        grid[1][1]=1;
                    }
                    if (p[a].canjump) {
                        grid[2][1]=3;
                        grid[0][1]=3;
                    } else {
                        if (p[a].frame1===6) {
                            grid[0][1]=1;
                        } else {
                            grid[0][1]=4;
                        }
                        grid[2][1]=1;
                    }
                    for (var c=0;c<3;c++) {
                        for (var d=0;d<3;d++) {
                            if (grid[c][d]===0) {
                                fill(100);
                            }
                            if (grid[c][d]===1) {
                                fill(255,0,0);
                            }
                            if (grid[c][d]===2) {
                                fill(255,255,0);
                            }
                            if (grid[c][d]===3) {
                                fill(0,255,0);
                            }
                            if (grid[c][d]===4) {
                                fill(0,255,255);
                            }
                            rect(10+100*a+14*d,397-shieldBarGoUp+7*c,12,5);
                        }
                    }
                }
                p[a].slamdown=(p[a].slamdown*9)/10;
                if (p[a].vy*-1>p[a].slamdown) {
                    p[a].slamdown=p[a].vy*-1;
                }
            }
            if (p[a].lightflash.time>0) {
                //println(p[a].lightflash.x2);
                fill(0, 255, 255, (frameCount-floor(frameCount/20)*20)*25.5);
                //triangle(p[a].lightflash.x1,p[a].lightflash.y1,p[a].lightflash.x2,p[a].lightflash.y2,p[a].lightflash.x3,p[a].lightflash.y3);
                quad(p[a].lightflash.x1,p[a].lightflash.y1,round(p[a].lightflash.x1/width)*width,height,p[a].lightflash.x2,p[a].lightflash.y2,p[a].lightflash.x3,p[a].lightflash.y3);
                p[a].lightflash.time+=1;
                if (p[a].lightflash.time>50) {
                    p[a].lightflash.time=0;
                }
            }
        }
        for (var a=0;a<p.length;a++) {
            if (lasthp[a]!==p[a].hp) {
                p[a].y-=1;
            }
        }
        var toStringExceptions = ["/",".",","];
        //if (event.getModifierState('CapsLock')||(str(key) === str(key).toUpperCase()&&keyCode===0&&toStringExceptions.indexOf(str(key))===-1)) {
        if (str(key) === str(key).toUpperCase()&&keyCode===0&&toStringExceptions.indexOf(str(key))===-1) {
            textAlign(LEFT,TOP);
            textSize(20);
            fill(0);
            text("Be sure that Caps Lock is off and nobody is pressing shift! (Or keys like Control, Alt, Backspace, or the number keys.)",10,10-(height-400),400,400);
        }
        //println(key);
        if (width>height) {
            fill(0,100);
            rect(0,0,-1*width,height);
            rect(400,0,width,height);
            rect(-72,0,-1*width,height);
            rect(465,0,width,height);
        }
        popMatrix();
    }
    if (mode==="winscreen") {
        pushMatrix();
        rotate(-10*(PI/180));
        translate(-50,50);
        fill(207, 207, 207);
        rect(0,0,700,50);
        fill(0, 0, 0);
        textAlign(LEFT,CENTER);
        var tempvar43 = [
            "Stickman",
            "Bouncyboi",
            "Nidorino",
            "Fatal Book",
        ];
        textSize(30);
        text(tempvar43[p[modeStats.winner].char]+" wins!",100,25);
        popMatrix();
        var tempvarr1;
        //if (p[modeStats.winner].
        if (mouseX===constrain(mouseX,50,150)&&mouseY===constrain(mouseY,150,250)) {
            repeatsImageGenerator(myImages[p[modeStats.winner].char][0][floor((frameCount-floor(frameCount/20)*20)/5)],50,150,100,100,p[modeStats.winner].colorvar);
        } else {
            repeatsImageGenerator(myImages[p[modeStats.winner].char][0][floor((frameCount-floor(frameCount/40)*40)/10)],50,150,100,100,p[modeStats.winner].colorvar);
        }
        var minuuuuuuus = 0;
        for (var a=0;a<p.length;a++) {
            if (a===modeStats.winner) {
                minuuuuuuus=1;
            } else {
                if (mouseX===constrain(mouseX,10+48*(a-minuuuuuuus),58+48*(a-minuuuuuuus))&&mouseY===constrain(mouseY,300,348)) {
                    repeatsImageGenerator(myImages[p[a].char][2][0],10+48*(a-minuuuuuuus),300,48,48,p[a].colorvar);
                } else {
                    repeatsImageGenerator(myImages[p[a].char][0][floor((frameCount-floor(frameCount/40)*40)/10)],10+48*(a-minuuuuuuus),300,48,48,p[a].colorvar);
                }
                textSize(15);
                textAlign(CENTER,TOP);
                fill(0, 0, 0);
                text("P"+(a+1)+"\nlost",34+48*(a-minuuuuuuus),350);
            }
        }
        //println(floor((frameCount-floor(frameCount/40)*40)/10));
        textSize(20);
        textAlign(RIGHT,TOP);
        text("Player Number: "+(modeStats.winner+1)+"\nStocks left: "+p[modeStats.winner].stock+"\nCurrent Damage: "+floor(p[modeStats.winner].hp*10)/10+"%",380,150);
        
        fill(255, 255, 255);
        rect(250,250,125,40);
        textAlign(CENTER,CENTER);
        textSize(15);
        fill(0, 0, 0);
        text("Back to Select",250+125/2,270);
        if (mousePresssed&&!mous&&mouseX===constrain(mouseX,250,375)&&mouseY===constrain(mouseY,250,290)) {
            mous=true;
        }
        if (mous) {
            text("just reload the site, this button does nothing sorry",200,300);
        }
    }
    if (mode==="playerselect") {
        if (modeStats.gameChars<p.length) {
            p.length=modeStats.gameChars;
        } else if (modeStats.gameChars>p.length) {
            for (var a=0;a<modeStats.gameChars;a++) {
                if (p[a]===undefined) {
                    p[a]={
                        x: 80,
                        y: 200,
                        vx: 0,
                        vy: 0,
                        char: 1,
                        player: a,
                        colorvar: 0,
                        frame1: 0,
                        frame2: 0,
                        hp: 0,
                        stock: defaultStocks,
                        dir: 1,
                        fall: false,
                        canjump: true,
                        movecool: 0,
                        slamdown: 0,
                        shieldLeft: modeStats.shieldMax,
                        hitbox: {
                            x: 200,
                            y: 200,
                            w: 10,
                            h: 10,
                        },
                        lightflash: {
                            time: 0,
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 0,
                            x3: 0,
                            y3: 0,
                        },
                        cpu: {
                            right: false,
                            left: false,
                            up: false,
                            down: false,
                            at1: false,
                            at2: false,
                            at3: false,
                        },
                    };
                    //println(p[a]===p[0]);
                }
            }
        }
        //println(p.length);
        //println(p[2]);
        //println(p[modeStats.gameChars-1]);
        fill(100);
        rect(0,0,width,40);
        rect(0,240+(height-400),width,160);
        var allchars = [
            {
                name: "Stickman",
                desc: "The most default character ever.",
            },
            {
                name: "Bouncyboi",
                desc: "He attac, he smacc, but most importantly,\na big hitbox he does lack.",
            },
            {
                name: "Nidorino",
                desc: "The big boi. His charged attack shoots poison.",
            },
            {
                name: "Fatal Book",
                desc: "It comes from the Fatal Bookshelf.\nQuite hard to learn how to play this character.",
            },
        ];
        rectMode(CENTER);
        stroke(0, 0, 0);
        strokeWeight(5);
        //allchars.length=floor(mouseX/5);
        var boxesheight=3;
        if (allchars.length>18) {
            boxesheight=3.1;
            if (allchars.length>21) {
                boxesheight=3.5;
                if (allchars.length>24) {
                    boxesheight=4;
                    if (allchars.length>32) {
                        boxesheight=4.1;
                        if (allchars.length>36) {
                            boxesheight=4.5;
                            if (allchars.length>40) {
                                boxesheight=5;
                                if (allchars.length>51) {
                                    boxesheight=5.1;
                                    if (allchars.length>56) {
                                        boxesheight=5.5;
                                        if (allchars.length>60) {
                                            boxesheight=6;
                                            if (allchars.length>66) {
                                                println("too many characters!");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var boxesamount=max(5,ceil(allchars.length/boxesheight));
        //println(allchars.length);
        //boxesamount+=0;
        //boxesamount-=floor(mouseX/200);
        //boxesamount=max(5,ceil(allchars.length/(max(ceil((allchars.length-15)/3)+2,3))));
        //println(max(ceil((allchars.length-15)/3)+2,3));
        var touchingbutton=-1;
        for (var a=0;a<allchars.length;a++) {
            noFill();
            /*
            rect(
                200-
                    ((350/boxesamount)*
                    ((a+1)-floor(a/boxesamount)*(boxesamount/2)-
                    min(allchars.length,ceil((a+1)/boxesamount)*boxesamount)/2-0.5)),
                
                80+(300/boxesamount)*(floor(a/boxesamount)),
                (350/boxesamount),
                (300/boxesamount)
            );
            */
            var ob1 = {
                x: width/2+
                    ((350/boxesamount)*
                    ((a+1)-floor(a/boxesamount)*(boxesamount/2)-
                    min(allchars.length,ceil((a+1)/boxesamount)*boxesamount)/2-0.5)),
                
                y: 80+(300/boxesamount)*(floor(a/boxesamount)),
                w: (350/boxesamount),
                h: (300/boxesamount)
            };
            rect(ob1.x,ob1.y,ob1.w,ob1.h);
            ob1.x-=ob1.w/2;
            ob1.y-=ob1.h/2;
            fill(0, 0, 0);
            textAlign(CENTER,CENTER);
            textSize(100/boxesamount);
            if (allchars[a]!==undefined) {
                if (myImages[a][69]===undefined) {
                    text(a,width/2+((350/boxesamount)*((a+1)-floor(a/boxesamount)*(boxesamount/2)-min(allchars.length,ceil((a+1)/boxesamount)*boxesamount)/2-0.5)),80+(300/boxesamount)*(floor(a/boxesamount)));
                } else {
                    //println("a");
                    repeatsImageGenerator(myImages[a][69],ob1.x,ob1.y,ob1.h,ob1.w,modeStats.colorvar);
                    stroke(0,0,0);
                }
                if (coll(ob1,{x:mouseX,y:mouseY,w:1,h:1})) {
                    touchingbutton=a;
                    //println((p[modeStats.charSelector])+" "+(modeStats.charSelector===p.length-1));
                    if (mousePresssed&&!mous) {
                        //println(modeStats.charSelector+" "+p);
                        mous=true;
                        if (p[modeStats.charSelector]!==undefined) {
                            p[modeStats.charSelector].char=a;
                            p[modeStats.charSelector].colorvar=modeStats.colorvar;
                            modeStats.charSelector++;
                            modeStats.colorvar=0;
                            if (modeStats.charSelector>=modeStats.gameChars) {
                                modeStats.charSelector=0;
                                mode="play";
                            }
                        }
                    }
                }
            }
            //text((a+1)-min(allchars.length,ceil((a+1)/5)*5)/2-0.5,5+a*10,50);
        }
        rectMode(CORNER);
        noStroke();
        fill(255, 255, 255);
        if (touchingbutton===-1) {
            textSize(30);
            text("P"+(modeStats.charSelector+1)+", select your\ncharacter!",width/2,300+(height-400));
            textSize(15);
            if (modeStats.charSelector===0) {
                text("Controls: Arrow Keys to Move, and '/', '.', and ',' to attack.\nUse 'M' to shield.",width/2,357+(height-400));
            } else if (modeStats.charSelector===1) {
                text("Controls: WASD to Move, and 'Q', 'E', and 'F' to attack.\nUse 'R' to shield.",width/2,357+(height-400));
            } else if (modeStats.charSelector===2) {
                text("Controls: YGHJ to Move, and 'T', 'U', and 'K' to attack.\nUse 'I' to shield.",width/2,357+(height-400));
            }
        } else {
            textSize(20);
            textAlign(LEFT,TOP);
            text(allchars[touchingbutton].name,15,330+(height-400));
            textSize(15);
            text(allchars[touchingbutton].desc,15,355+(height-400));
            repeatsImageGenerator(myImages[touchingbutton][0][0],10,250+(height-400),64,64,modeStats.colorvar);
            textAlign(CENTER,CENTER);
            fill(255, 255, 255, 127);
            textSize(30);
            text("P"+(modeStats.charSelector+1)+", select your\ncharacter!",width/2,300+(height-400));
        }
        fill(0, 0, 0);
        rect(modeStats.colorvar*40+80,0,40,40);
        fill(255, 255, 255);
        rect(90,10,20,20);
        fill(255, 0, 0);
        rect(130,10,20,20);
        fill(0, 255, 0);
        rect(170,10,20,20);
        if (mousePresssed&&mouseY<40&&mouseX>80&&!mous) {
            mous=true;
            if (mouseX<width/2) {
                modeStats.colorvar=floor(mouseX/40)-2;
            }
        }
    }
    if (mode==="levelselect") {
        fill(100);
        rect(0,0,width,40);
        rect(0,240+(height-400),width,160);
        var alllevels = [
            "Default Arena",
            "3D Glasses Mode",
            "Volcano",
        ];
        var allchars = alllevels;
        rectMode(CENTER);
        stroke(0, 0, 0);
        strokeWeight(5);
        //allchars.length=floor(mouseX/5);
        var boxesheight=3;
        if (allchars.length>18) {
            boxesheight=3.1;
            if (allchars.length>21) {
                boxesheight=3.5;
                if (allchars.length>24) {
                    boxesheight=4;
                    if (allchars.length>32) {
                        boxesheight=4.1;
                        if (allchars.length>36) {
                            boxesheight=4.5;
                            if (allchars.length>40) {
                                boxesheight=5;
                                if (allchars.length>51) {
                                    boxesheight=5.1;
                                    if (allchars.length>56) {
                                        boxesheight=5.5;
                                        if (allchars.length>60) {
                                            boxesheight=6;
                                            if (allchars.length>66) {
                                                println("too many characters!");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var boxesamount=max(5,ceil(allchars.length/boxesheight));
        //println(allchars.length);
        //boxesamount+=0;
        //boxesamount-=floor(mouseX/200);
        //boxesamount=max(5,ceil(allchars.length/(max(ceil((allchars.length-15)/3)+2,3))));
        //println(max(ceil((allchars.length-15)/3)+2,3));
        var touchingbutton=-1;
        for (var a=0;a<allchars.length;a++) {
            noFill();
            /*
            rect(
                200-
                    ((350/boxesamount)*
                    ((a+1)-floor(a/boxesamount)*(boxesamount/2)-
                    min(allchars.length,ceil((a+1)/boxesamount)*boxesamount)/2-0.5)),
                
                80+(300/boxesamount)*(floor(a/boxesamount)),
                (350/boxesamount),
                (300/boxesamount)
            );
            */
            var ob1 = {
                x: width/2+
                    ((350/boxesamount)*
                    ((a+1)-floor(a/boxesamount)*(boxesamount/2)-
                    min(allchars.length,ceil((a+1)/boxesamount)*boxesamount)/2-0.5)),
                
                y: 80+(300/boxesamount)*(floor(a/boxesamount)),
                w: (350/boxesamount),
                h: (300/boxesamount)
            };
            stroke(0, 0, 0);
            rect(ob1.x,ob1.y,ob1.w,ob1.h);
            noStroke();
            ob1.x-=ob1.w/2;
            ob1.y-=ob1.h/2;
            fill(0, 0, 0);
            textAlign(CENTER,CENTER);
            textSize(100/boxesamount);
            if (allchars[a]!==undefined) {
                //text(a,200+((350/boxesamount)*((a+1)-floor(a/boxesamount)*(boxesamount/2)-min(allchars.length,ceil((a+1)/boxesamount)*boxesamount)/2-0.5)),80+(300/boxesamount)*(floor(a/boxesamount)));
                if (a===0) {
                    fill(97, 97, 97);
                    rect(ob1.x+ob1.w/2,ob1.y+ob1.h/3*2,ob1.w/2,ob1.h/5);
                    rect(ob1.x+ob1.w/2,ob1.y+ob1.h/3,ob1.w/4,ob1.h/10);
                }
                if (a===1) {
                    fill(97, 97, 97);
                    rect(ob1.x+ob1.w/2,ob1.y+ob1.h/3*2,ob1.w/2,ob1.h/5);
                    rect(ob1.x+ob1.w/3.5,ob1.y+ob1.h/3,ob1.w/4,ob1.h/10);
                    rect(ob1.x+ob1.w-ob1.w/3.5,ob1.y+ob1.h/3,ob1.w/4,ob1.h/10);
                }
                if (a===2) {
                    fill(97, 97, 97);
                    rect(ob1.x+ob1.w/2,ob1.y+ob1.h/3*2,ob1.w/2,ob1.h/5);
                    rect(ob1.x+ob1.w/3.5,ob1.y+ob1.h/2.5,ob1.w/8,ob1.h/10);
                    rect(ob1.x+ob1.w-ob1.w/3.5,ob1.y+ob1.h/2.5,ob1.w/8,ob1.h/10);
                }
                if (coll(ob1,{x:mouseX,y:mouseY,w:1,h:1})) {
                    touchingbutton=a;
                    if (mousePresssed&&!mous) {
                        mous=true;
                        mode="playerselect";
                        stage=touchingbutton;
                    }
                }
            }
            //text((a+1)-min(allchars.length,ceil((a+1)/5)*5)/2-0.5,5+a*10,50);
        }
        rectMode(CORNER);
        noStroke();
        fill(255, 255, 255);
        if (touchingbutton===-1) {
            textSize(30);
            text("Select your level!",width/2,300+(height-400));
        } else {
            textSize(20);
            textAlign(LEFT,TOP);
            text(allchars[touchingbutton],15,330+(height-400));
            textAlign(CENTER,CENTER);
            fill(255, 255, 255, 127);
            textSize(30);
            text("Select your level!",width/2,300+(height-400));
        }
        fill(255);
        textAlign(LEFT,TOP);
        textSize(10);
        text(globall.views+" views",5,5);
    }
    //mode="playerselect";
    //println(mode);
    if (1===1) {
        if (modeStats.legacyMoveIndicators) {
            if (modeStats.moveIndicatorsVer!==0) {
                modeStats.moveIndicatorsVer=0;
                modeStats.legacyMoveIndicators=false;
            }
        }
    }
};
mode="levelselect";
keyPressed = function() {
    keys[keyCode]=true;
    keyNotCode[key]=true;
};
keyReleased = function() {
    console.log(keyCode, key);
    keys[keyCode]=false;
    keyNotCode[key]=false;
};
mousePressed = function() {
    mousePresssed=true;
};
mouseReleased = function() {
    mousePresssed=false;
};
    }};

  // Get the canvas that ProcessingJS will use
  var canvas = document.getElementById("mycanvas"); 
  // Pass the function to ProcessingJS constructor
  var processingInstance = new Processing(canvas, programCode); 