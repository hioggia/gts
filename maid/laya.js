Laya.init(320,560,true);
//Laya.stage.screenMode = laya.display.Stage.SCREEN_VERTICAL;
Laya.stage.alignH = laya.display.Stage.ALIGN_CENTER;
Laya.stage.alignV = laya.display.Stage.ALIGN_MIDDLE;

var ape = new laya.display.Sprite();
//加载猩猩图片
ape.loadImage("img/chara/120_bu02u0065a_000_x38y139_result.png", 30, 280);
ape.scale(0.2,0.2);

Laya.stage.addChild(ape);


var txt = new laya.display.Text();
 
//设置文本内容
txt.text = "Hello Layabox";
 
//设置文本颜色为白色，默认颜色为黑色
txt.color = "#ffffff";
 
//将文本内容添加到舞台 
Laya.stage.addChild(txt);