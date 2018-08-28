class BaseCharacter{
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true; 
  }
  attack(character, damage) {
    if(this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }
  getHurt(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }
    var _this = this;//_this 是用來暫存 hero／monster 物件本身
    var i = 1;//計算連續播放特效的圖片的編號

    _this.id = setInterval(function() {
      if (i == 1) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i +'.png';
      i++;
      //加入特效和傷害數字
      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
      //取消特效和傷害數字

    },50);
  }
  die() {
    this.alive = false;
  }
  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100-this.hp/this.maxHp *100) + "%";
  }
  //更新生命值 bar 和數字
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");
    //建立 HTML 標籤與 JavaScript 物件的關係
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;
    //在遊戲開始時更新生命值的數字
    console.log("召喚英雄" + this.name + "!");
  }
  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage)); 
  }
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
  //把負責生命值的 element 傳給 updateHTML 方法
  heal() {//新增 heal 方法
   
   if (this.hp + 30 <= this.maxHp) {
    this.hp = this.hp + 30;
    this.updateHtml(this.hpElement, this.hurtElement);
    var _this = this;
    var i = 1;

    _this.id = setInterval(function() {
      if (i == 1) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = 30;
      }
      _this.element.getElementsByClassName("effect-image")[0].src = "images/effect/heal/" + i + ".png"
      i++;
    
      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
        
      }
     

    },50);
   } else {
    this.hp = this.maxHp;
    this.updateHtml(this.hpElement, this.hurtElement);

    var _this = this;
    var i = 1;

    _this.id = setInterval(function() {
      if (i == 1) {
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = 30;
      }
      i++;
      //加入傷害數字
      if (i > 8) {
        
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
      }
      //取消傷害數字

    },50);
   }
    


   
    
  
  }
  
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("遇到怪獸" + this.name + "了！")
  }
  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

var hero = new Hero("QQ", 130, 30);
var monster = new Monster("BB", 130, 60);

//設定戰鬥的開始和結束


//新增技能事件
function addSkillEvent() {
  var skill = document.getElementById("skill");
  skill.onclick = function() {
    heroAttack();
  }

  document.onkeyup = function(event) {
    var key = String.fromCharCode(event.keyCode);
    if (key == "A") {
      heroAttack(); 
    } 
  }

}
addSkillEvent();

function addHealEvent() {
  var heal = document.getElementById("heal");
  heal.onclick = function() {
    heroHeal();
  }

  document.onkeydown = function(event) {
    var key = String.fromCharCode(event.keyCode);
    if (key == "S") {
      heroHeal(); 
    } 
  }
}
addHealEvent();//設定恢復按鈕的事件驅動

//撰寫回合結束的機制
var rounds = 10
function endTurn() {
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1) {
    finish();
  }
}



function heroAttack() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  //攻擊按鈕隱藏

  setTimeout(function(){
    hero.element.classList.add("attacking");
    setTimeout(function(){
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    },500);
  },100);
  //英雄移動攻擊歸位

  setTimeout(function(){
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function(){
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          finish();
        }else{
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      },500)
    } else{
      finish();
    }
  },1100);
  //怪獸移動攻擊歸位
}

function heroHeal() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  hero.heal();
  setTimeout(function(){
    document.getElementsByClassName("skill-block")[0].style.display = "block";
    setTimeout(function(){
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function(){
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          finish();
        }else{
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      },500)
    } else{
      finish();
    }
  },100);
  },500)
}



function finish() {
  var dialog = document.getElementById("dialog")
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}













