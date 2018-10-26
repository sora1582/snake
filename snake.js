var isAlive = true;//活着的状态
var snakes = [];//定义蛇的数组，蛇是一节一节的
var egg = null;//蛇要吃的食物
var isFirst = true;//初始化的标记
var panel = document.getElementById("container");//得到container
var scoreBoard = document.getElementById("score");//得到score
var score = 0;//初始化成绩为零
var timer;//控制蛇移动速度

//定义枚举变量
var DIR = {
    L: 1,
    R: 2,
    U: 3,
    D: 4
}

//定义蛇的对象
//相对位置以父容器位基准
function snake(top, left, dir){
    this.top = top;/*距离顶端的距离*/
    this.left = left;/*距离左边的距离*/
    this.dir = dir;/*方向*/
}
//定义食物对象
function newEgg(top, left){
    this.top = top;/*距离顶端的距离*/
    this.left = left;/*距离左边的距离*/
}

//运行游戏的函数
function gameRun(){
    if(isFirst){//判断是否是第一次游戏
        snakes.push(new snake(40, 40, DIR.D))//创建一个小蛇块放到蛇数组
        isFirst = false;//标记改变
        createEgg();//执行createEgg方法
    }
    snakeRun();//执行snakeRun方法
    display();//在gameRun中执行dispaly方法
}

//随机生成egg
function createEgg(){
    egg = new newEgg(//创建新的egg
        //取随机数作为top,因为游戏框的大小是300*500,食物不可以出框
        Math.floor(Math.random() * 25) * 20,
        //取随机数作为left
        Math.floor(Math.random() * 15) * 20
    )
}
//设置键盘的监听相应
document.onkeydown = function (e) {
    var header = snakes[snakes.length - 1];//取得蛇头

    switch (e.keyCode) {
        case 37:
            //left
            //因为蛇没法向反方向移动
            if(header.dir != DIR.R){//如果蛇头不是向右移动
                header.dir = DIR.L;//设置蛇头向左
            }
            break;
        case 38:
            //up
            if(header.dir != DIR.D){//如果蛇头不是向下
                header.dir = DIR.U;//设置蛇头向上
            }
            break;
        case 39:
            //right
            if(header.dir != DIR.L){//如果蛇头不是向左
                header.dir = DIR.R;//设置蛇头向右
            }
            break;
        case 40:
            //down
            if(header.dir != DIR.U){//如果蛇头不是向上
                header.dir = DIR.D;//设置蛇头向下
            }
            break;
    }
}.bind(panel)

//蛇的移动
function snakeRun() {
    //获取当前的蛇头，因为蛇块是push进去的，所以用length-1
    var header = snakes[snakes.length - 1];
    var newHeader = null;//新的head
    
    switch (header.dir) {
        case DIR.L:
            //向左走，蛇头左边的位置变成新的蛇头
            newHeader = new snake(header.top, header.left - 20, header.dir);
            break;
        case DIR.R:
            //向右走，蛇头右边的位置变成新蛇头
            newHeader = new snake(header.top, header.left + 20, header.dir);
            break;
        case DIR.U:
            //向上同理
            newHeader = new snake(header.top - 20, header.left, header.dir);
            break;
        case DIR.D:
            //同理
            newHeader = new snake(header.top + 20, header.left, header.dir);
            break;
    }
    deathCheck(newHeader);//检查是不是还或者
    if(isAlive) {//如果还或者
        snakes.push(newHeader);//把新的头加到蛇身，到数组尾

        //如果蛇头和食物重合就不删除尾部的一个节点
        if (newHeader.top == egg.top && newHeader.left == egg.left) {
            createEgg();//创建新的egg，吃掉食物了要创建新的食物
        } else {//如果没和食物重合就删掉尾部节点正常移动
            snakes.shift();//删除数组中的第一个元素，也就是蛇尾
        }
    }else{//死了
        clearInterval(timer);//停止执行timer
    }


}

//判断是不是死啦
function deathCheck(header){
    //如果到了边界
    if(header.top < 0 | header.top > 480 || header.left < 0 || header.left > 280){
        isAlive = false;
        return;
    }

    //遍历蛇的身子
    for(var i = 0; i < snakes.length - 1; i++){
        //如果蛇的头和蛇的身子任意部分重合
        if(header.top == snakes[i].top && header.left == snakes[i].left){
            isAlive = false;//标记为死亡
            return;
        }
    }

}

//显示
function display(){
    if(isAlive){//蛇还活着
        if(score != snakes.length - 1){//如果成绩不是0
            score = snakes.length - 1;//更新当先的成绩
            scoreBoard.innerHTML = 'Score:' + score;//显示当前的成绩
        }
    }else{//如果死了
        //显示最后的分数
        scoreBoard.innerHTML = 'Game Over, Final Score:' + score;
    }

    var fragment = document.createDocumentFragment();//创建新节点

    for(var i = 0; i < snakes.length; i++){//循环遍历蛇
        var div = document.createElement('div');//创建一个新的蛇身小块
        div.className = 'snake';//归类
        div.style.top = snakes[i].top + 'px';//新长出的蛇身的位置
        div.style.left = snakes[i].left + 'px';//新长出的蛇身的位置
        fragment.appendChild(div);//拼接新节点
     }


    var ediv = document.createElement('div');//创建食物div
    ediv.className = 'egg';//设置ediv的class为egg
    ediv.style.top = egg.top + 'px';//设置ediv的位置
    ediv.style.left = egg.left + 'px';//设置ediv的位置
    fragment.appendChild(ediv);//把ediv加到fragment中

    panel.innerHTML = '';//清空之前的显示
    panel.appendChild(fragment);//把fragment加到panel上

}

timer = setInterval(gameRun, 200);//设置蛇每次行走时间间隔
