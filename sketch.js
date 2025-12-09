let stopSheet;
let walkSheet;
let pushSheet;
let toolSheet;
let runSheet;
let fallSheet;
let downSheet;
let hiSheet; // 新增：問候動畫的圖片精靈
let newCharFallSheet;
let newCharHahaSheet;

let stopFrames = [];
let walkFrames = [];
let pushFrames = [];
let toolFrames = [];
let runFrames = [];
let fallFrames = [];
let jumpFrames = [];
let downFrames = [];
let hiFrames = []; // 新增：問候動畫的影格陣列
let newCharFallFrames = [];
let newCharHahaFrames = [];

let newCharStopSheet;
let newCharStopFrames = [];
const numNewCharFrames = 8; // 新角色圖片精靈檔中有8張圖
const newCharSpriteWidth = 699;
const newCharSpriteHeight = 190;
let newCharFrameWidth;
let newCharX, newCharY;
let newCharInitialX; // 角色2的初始位置
let newCharFacingDirection = 1; // 1 for right, -1 for left
let isNewCharGreeting = false; // 新增：追蹤新角色是否正在問候
let newCharHiFrame = 0; // 新增：問候動畫的計數器
let isNewCharHit = false; // 角色2是否被擊中
let newCharFallFrame = 0; // 角色2倒下動畫的計數器
let isNewCharLaughing = false; // 角色2是否在嘲笑

const numNewCharHahaFrames = 8;
const newCharHahaSpriteWidth = 803;
const newCharHahaSpriteHeight = 181;

const numNewCharFallFrames = 9;
const newCharFallSpriteWidth = 2218;
const newCharFallSpriteHeight = 113;

let nameInput; // 用於儲存輸入框物件
let dialogueState = 'idle'; // 對話狀態: 'idle', 'asking', 'answered', 'quiz_intro', 'quiz_ready_check', 'quiz_inprogress', 'quiz_feedback', 'quiz_wrong_answer', 'quiz_end', 'quiz_show_hint_button', 'quiz_showing_hint'
let playerName = ''; // 儲存玩家輸入的名字
let dialogueText = "請問你叫什麼名字"; // 對話內容

// --- 測驗相關變數 ---
let questionTable; // 儲存從CSV載入的題目
let allQuestions = []; // 儲存所有解析後的題目物件
let quizQuestions = []; // 儲存本次測驗隨機抽出的5題
let currentQuestionIndex = 0; // 當前題目的索引
let score = 0; // 分數
let retryButton; // 測驗重試按鈕
let hintButton; // 提示按鈕
let hintTimer; // 用於儲存提示計時器
// --- 測驗相關變數結束 ---

const numHiFrames = 5; // 新增：問候動畫的影格數
const hiSpriteWidth = 585; // 新增：問候動畫圖片寬度
const hiSpriteHeight = 183; // 新增：問候動畫圖片高度

const numFrames = 9; // 圖片精靈檔中有9張圖
const numPushFrames = 4; // push-all.png 中有4張圖
const numToolFrames = 5; // tool-all.png 中有5張圖
const numRunFrames = 12; // run-all.png 中有12張圖
const numFallFrames = 7; // fall-all.png 中有8張圖
const numJumpFrames = 13; // jump-all.png 中有13張圖
const numDownFrames = 5; // down-all.png 中有5張圖

// 靜止動畫的圖片尺寸
const stopSpriteWidth = 1246;
const stopSpriteHeight = 196;
let stopFrameWidth;

// 走路動畫的圖片尺寸
const walkSpriteWidth = 1246;
const walkSpriteHeight = 198;
let walkFrameWidth;

// 攻擊動畫的圖片尺寸
const pushSpriteWidth = 1039;
const pushSpriteHeight = 146;
let pushFrameWidth;

// 投射物動畫的圖片尺寸
const toolSpriteWidth = 740;
const toolSpriteHeight = 19;
let toolFrameWidth;

// 跑步動畫的圖片尺寸
const runSpriteWidth = 2323;
const runSpriteHeight = 168;
let runFrameWidth;

// 倒地動畫的圖片尺寸
const fallSpriteWidth = 1108;
const fallSpriteHeight = 193;
let fallFrameWidth;

// 跳躍動畫的圖片尺寸
const jumpSpriteWidth = 1776;
const jumpSpriteHeight = 188;
let jumpFrameWidth;

// 蹲下動畫的圖片尺寸
const downSpriteWidth = 675;
const downSpriteHeight = 153;
let downFrameWidth;

let characterX, characterY;
let groundLevel; // 地面高度
let characterWidth = 150; // 角色圖片的大約寬度，用於邊界偵測
let facingDirection = 1; // 1 for right, -1 for left

let isAttacking = false;
let attackFrame = 0;
let isFalling = false;
let fallFrame = 0;
let jumpFrame = 0;
let crouchFrame = 0;

let isJumping = false;
let velocityY = 0;
const gravity = 0.5; // 重力加速度
const jumpForce = -15; // 向上跳躍的初始力量

let tools = []; // 用來儲存所有投射物物件的陣列

function preload() {
  // 預載入圖片資源
  stopSheet = loadImage('1/stop/stop-all.png');
  walkSheet = loadImage('1/walk/walk-all.png');
  pushSheet = loadImage('1/push/push-all.png');
  toolSheet = loadImage('1/tool/tool-all.png');
  runSheet = loadImage('1/run/run-all.png');
  fallSheet = loadImage('1/fall/fall-all.png');
  jumpSheet = loadImage('1/jump/jump-all.png');
  downSheet = loadImage('1/down/down-all.png');
  hiSheet = loadImage('2/hi/hi_all.png');
  newCharStopSheet = loadImage('2/stop/stop_all.png');
  newCharFallSheet = loadImage('2/fall/fall_all.png');
  newCharHahaSheet = loadImage('2/haha/haha_all.png');

  // 預載入CSV題目檔案
  questionTable = loadTable('question.csv', 'csv', 'header');
}

function setup() {
  // 建立一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化角色位置在畫面中央
  characterX = width / 2;
  groundLevel = height / 2; // 將初始Y設為地面
  characterY = height / 2;

  // 初始化新角色的位置在原角色的左邊
  newCharInitialX = width / 3;
  newCharX = newCharInitialX;
  newCharY = height / 2;

  // 建立一個輸入框並隱藏它
  nameInput = createInput('');
  nameInput.attribute('placeholder', '(請在此輸入文字)'); // 加入淡灰色提示文字
  nameInput.hide();

  // 建立一個重試按鈕並隱藏它
  retryButton = createButton('再次作答本題');
  retryButton.hide();
  retryButton.mousePressed(retryQuestion); // 綁定點擊事件

  // 建立一個提示按鈕並隱藏它
  hintButton = createButton('提示');
  hintButton.hide();
  hintButton.mousePressed(showHint); // 綁定點擊事件

  // 計算靜止動畫單一影格的寬度
  stopFrameWidth = stopSpriteWidth / numFrames;
  // 從靜止圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numFrames; i++) {
    let frame = stopSheet.get(i * stopFrameWidth, 0, stopFrameWidth, stopSpriteHeight);
    stopFrames.push(frame);
  }

  // 計算走路動畫單一影格的寬度
  walkFrameWidth = walkSpriteWidth / numFrames;
  // 從走路圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numFrames; i++) {
    let frame = walkSheet.get(i * walkFrameWidth, 0, walkFrameWidth, walkSpriteHeight);
    walkFrames.push(frame);
  }

  // 計算攻擊動畫單一影格的寬度
  pushFrameWidth = pushSpriteWidth / numPushFrames;
  // 從攻擊圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numPushFrames; i++) {
    let frame = pushSheet.get(i * pushFrameWidth, 0, pushFrameWidth, pushSpriteHeight);
    pushFrames.push(frame);
  }

  // 計算投射物動畫單一影格的寬度
  toolFrameWidth = toolSpriteWidth / numToolFrames;
  // 從投射物圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numToolFrames; i++) {
    let frame = toolSheet.get(i * toolFrameWidth, 0, toolFrameWidth, toolSpriteHeight);
    toolFrames.push(frame);
  }

  // 計算跑步動畫單一影格的寬度
  runFrameWidth = runSpriteWidth / numRunFrames;
  // 從跑步圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numRunFrames; i++) {
    let frame = runSheet.get(i * runFrameWidth, 0, runFrameWidth, runSpriteHeight);
    runFrames.push(frame);
  }

  // 計算倒地動畫單一影格的寬度
  fallFrameWidth = fallSpriteWidth / numFallFrames;
  // 從倒地圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numFallFrames; i++) {
    let frame = fallSheet.get(i * fallFrameWidth, 0, fallFrameWidth, fallSpriteHeight);
    fallFrames.push(frame);
  }

  // 計算跳躍動畫單一影格的寬度
  jumpFrameWidth = jumpSpriteWidth / numJumpFrames;
  // 從跳躍圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numJumpFrames; i++) {
    let frame = jumpSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpSpriteHeight);
    jumpFrames.push(frame);
  }

  // 計算蹲下動畫單一影格的寬度
  downFrameWidth = downSpriteWidth / numDownFrames;
  // 從蹲下圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numDownFrames; i++) {
    let frame = downSheet.get(i * downFrameWidth, 0, downFrameWidth, downSpriteHeight);
    downFrames.push(frame);
  }

  // 計算新角色動畫單一影格的寬度
  newCharFrameWidth = newCharSpriteWidth / numNewCharFrames;
  // 從新角色圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numNewCharFrames; i++) {
    let frame = newCharStopSheet.get(i * newCharFrameWidth, 0, newCharFrameWidth, newCharSpriteHeight);
    newCharStopFrames.push(frame);
  }

  // 計算問候動畫單一影格的寬度
  const hiFrameWidth = hiSpriteWidth / numHiFrames;
  // 從問候圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numHiFrames; i++) {
    let frame = hiSheet.get(i * hiFrameWidth, 0, hiFrameWidth, hiSpriteHeight);
    hiFrames.push(frame);
  }

  // 計算角色2倒下動畫單一影格的寬度
  const newCharFallFrameWidth = newCharFallSpriteWidth / numNewCharFallFrames;
  // 從角色2倒下圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numNewCharFallFrames; i++) {
    let frame = newCharFallSheet.get(i * newCharFallFrameWidth, 0, newCharFallFrameWidth, newCharFallSpriteHeight);
    newCharFallFrames.push(frame);
  }

  // 計算角色2嘲笑動畫單一影格的寬度
  const newCharHahaFrameWidth = newCharHahaSpriteWidth / numNewCharHahaFrames;
  // 從角色2嘲笑圖片精靈檔中裁切出每一個影格
  for (let i = 0; i < numNewCharHahaFrames; i++) {
    let frame = newCharHahaSheet.get(i * newCharHahaFrameWidth, 0, newCharHahaFrameWidth, newCharHahaSpriteHeight);
    newCharHahaFrames.push(frame);
  }

  // 解析CSV題目到 allQuestions 陣列
  for (let r = 0; r < questionTable.getRowCount(); r++) {
    allQuestions.push({
      question: questionTable.getString(r, '題目'),
      answer: questionTable.getString(r, '正確答案'),
      correctFeedback: questionTable.getString(r, '答對回饋語'),
      wrongFeedback: questionTable.getString(r, '答錯回饋語'),
      hint: questionTable.getString(r, '提示語')
    });
  }
}

function draw() {
  // 設定背景顏色
  background('#a3b18a');
  // 讓圖片的定位點在中心
  imageMode(CENTER);

  // 檢查角色1與角色2的距離
  const distance = abs(characterX - newCharX);
  const proximityThreshold = 200; // 觸發問候的距離閾值

  // --- 角色2的狀態與繪製邏輯 ---
  if (isNewCharHit) {
    // --- 1. 播放被擊中倒下的動畫 ---
    const fallAnimationSpeed = 5;
    let currentFallFrame = floor(newCharFallFrame / fallAnimationSpeed);

    if (currentFallFrame >= numNewCharFallFrames) {
      // 動畫結束，恢復正常
      isNewCharHit = false;
      newCharFallFrame = 0;
      newCharX = newCharInitialX; // 將角色2的位置重設回初始位置
    } else {
      // 播放倒下動畫，方向與被攻擊時的方向一致
      const knockbackSpeed = 2; // 角色2被擊退的速度
      // 根據角色面向的反方向移動，產生被擊退的效果
      newCharX -= newCharFacingDirection * knockbackSpeed;
      drawCharacter(newCharFallFrames[currentFallFrame], newCharX, newCharY, newCharFacingDirection);
      newCharFallFrame++;
    }

  } else if (isNewCharLaughing) {
    // --- 2. 播放嘲笑動畫 ---
    const hahaAnimationSpeed = 5;
    let currentHahaFrame = floor(frameCount / hahaAnimationSpeed) % numNewCharHahaFrames;
    // 嘲笑時面向角色1
    newCharFacingDirection = (characterX > newCharX) ? 1 : -1;
    drawCharacter(newCharHahaFrames[currentHahaFrame], newCharX, newCharY, newCharFacingDirection);

  } else if (distance < proximityThreshold) {
    // --- 3. 角色1在附近 (未被擊中且未嘲笑) ---

    // 1. 觸發問候與輸入框
    if (dialogueState === 'idle') {
      dialogueState = 'asking';
      dialogueText = "請問你叫什麼名字";
      // 設定角色2面向，並在問答期間鎖定
      newCharFacingDirection = (characterX > newCharX) ? 1 : -1;

      // 計算對話框寬度
      push();
      const textPadding = 10;
      textSize(18);
      const boxWidth = textWidth(dialogueText) + textPadding * 2;
      const boxHeight = textSize() + textPadding * 2;
      pop();
      // 用計算出的寬度設定輸入框大小，然後顯示它
      nameInput.size(boxWidth, boxHeight);
      nameInput.show();
    }

    // 2. 播放問候動畫
    const hiAnimationSpeed = 6;
    let currentHiFrame = floor(frameCount / hiAnimationSpeed) % numHiFrames;
    drawCharacter(hiFrames[currentHiFrame], newCharX, newCharY, newCharFacingDirection);

    // 3. 繪製對話框
    push(); // 儲存當前的繪圖設定，避免影響其他部分
    const textYOffset = 130; // 對話框在角色上方的高度 (從150改為120，讓它更靠近角色)
    const textPadding = 10;  // 文字與方框邊緣的間距
    textSize(18);
    textFont('Arial');
    const boxWidth = textWidth(dialogueText) + textPadding * 2;
    const boxHeight = textSize() + textPadding * 2;
    rectMode(CENTER);
    fill(255, 255, 255, 220); // 白色半透明背景
    stroke(0); // 黑色邊框
    rect(newCharX, newCharY - textYOffset, boxWidth, boxHeight, 10); // 圓角方框
    textAlign(CENTER, CENTER);
    fill(0); // 黑色文字
    noStroke(); // 文字不需要邊框
    text(dialogueText, newCharX, newCharY - textYOffset);
    pop(); // 恢復原本的繪圖設定

    // 4. 更新輸入框位置 (如果正在詢問)
    if (dialogueState === 'asking' || dialogueState === 'quiz_ready_check' || dialogueState === 'quiz_inprogress') {
      // 將輸入框定位在角色1的頭上
      nameInput.position(characterX - nameInput.width / 2, characterY - 150); // 這裡只負責更新位置
    }

    // 5. 更新重試按鈕位置 (如果答錯了)
    if (dialogueState === 'quiz_wrong_answer' || dialogueState === 'quiz_end') {
      const buttonY = (newCharY - textYOffset) - (boxHeight / 2) - 50; // 對話框頂部再往上50px
      retryButton.position(newCharX - retryButton.width / 2, buttonY);
    }

    // 6. 更新提示按鈕位置
    if (dialogueState === 'quiz_show_hint_button') {
      const buttonY = (newCharY - textYOffset) - (boxHeight / 2) - 50; // 對話框頂部再往上50px
      hintButton.position(newCharX - hintButton.width / 2, buttonY);
    }

  } else { 
    // --- 4. 預設狀態：站立 ---
    // 重置所有對話狀態並隱藏輸入框
    if (dialogueState !== 'idle') { // 當角色1離開時，重置所有對話相關狀態
      dialogueState = 'idle';
      playerName = '';
      quizQuestions = [];
      currentQuestionIndex = 0;
      score = 0;
      clearTimeout(hintTimer); // 清除計時器
      hintButton.hide();
      retryButton.hide();
      nameInput.hide();
    }

    // 判斷新角色的面向
    newCharFacingDirection = (characterX > newCharX) ? 1 : -1;
    // 播放站立動畫
    const newCharAnimationSpeed = 5;
    let newCharCurrentFrameIndex = floor(frameCount / newCharAnimationSpeed) % numNewCharFrames;
    drawCharacter(newCharStopFrames[newCharCurrentFrameIndex], newCharX, newCharY, newCharFacingDirection);
  }

  // (frameCount / 5) 控制動畫速度，數字越大動畫越慢
  const animationSpeed = 5;
  let currentFrameIndex = floor(frameCount / animationSpeed) % numFrames;

  // --- 物理更新 ---
  // 如果在跳躍中，就更新Y座標和垂直速度
  if (isJumping) {
    characterY += velocityY;
    velocityY += gravity;

    // 如果角色回到或低於地面
    if (characterY >= groundLevel) {
      characterY = groundLevel;
      isJumping = false;
      jumpFrame = 0;
    }
  }

  // --- 狀態與動畫處理 ---
  if (isFalling) {
    // --- 倒地狀態 ---
    const fallAnimationSpeed = 5; // 倒地動畫速度
    let currentFallFrame = floor(fallFrame / fallAnimationSpeed);

    if (currentFallFrame >= numFallFrames) {
      // 倒地動畫結束
      isFalling = false;
      fallFrame = 0;
      isNewCharLaughing = false; // 角色1倒地結束，角色2停止嘲笑
      // 如果角色掉到地面以下，將其重置到地面上
      if (characterY > groundLevel) {
        characterY = groundLevel;
      }
      // 確保垂直速度歸零
      velocityY = 0;

      // 讓角色從邊界彈回一點
      if (characterX <= 0) characterX = 50;
      if (characterX >= width) characterX = width - 50;
    } else {
      // 播放倒地動畫
      // 根據面向方向的反方向移動，製造向內反彈的效果
      const bounceSpeed = 3;
      characterX -= facingDirection * bounceSpeed;

      // 如果在空中，套用重力
      characterY += velocityY;
      velocityY += gravity;

      // 在下落過程中持續檢查是否已到達地面
      if (characterY >= groundLevel) {
        characterY = groundLevel;
        velocityY = 0;
      }

      drawCharacter(fallFrames[currentFallFrame]);
      fallFrame++;
    }
  } else if (isAttacking) {
    // --- 攻擊狀態 ---
    const attackAnimationSpeed = 4; // 攻擊動畫速度可以獨立設定
    let currentAttackFrame = floor(attackFrame / attackAnimationSpeed);

    if (currentAttackFrame >= numPushFrames) {
      // 攻擊動畫結束
      isAttacking = false;
      attackFrame = 0;
    } else {
      // 播放攻擊動畫
      drawCharacter(pushFrames[currentAttackFrame]);
      attackFrame++;
    }
  } else if (isJumping) {
    // --- 跳躍狀態 ---
    const jumpAnimationSpeed = 3; // 跳躍動畫速度
    let currentJumpFrame = floor(jumpFrame / jumpAnimationSpeed);
    // 播放跳躍動畫，如果動畫播完但還在空中，就停在最後一幀
    if (currentJumpFrame >= numJumpFrames) {
      currentJumpFrame = numJumpFrames - 1;
    }
    drawCharacter(jumpFrames[currentJumpFrame]);
    jumpFrame++;
  } else if (keyIsDown(DOWN_ARROW)) {
    // --- 蹲下狀態 ---
    const crouchAnimationSpeed = 4;
    let currentCrouchFrame = floor(crouchFrame / crouchAnimationSpeed);

    // 播放動畫直到蹲下最低點(第3幀，索引為2)，然後保持該姿勢
    if (currentCrouchFrame >= 2) {
      currentCrouchFrame = 2;
    }

    const crouchOffset = 20; // 蹲下時的Y軸偏移量，讓角色看起來更低
    // 顯示對應的蹲下動畫影格，並將角色位置往下移
    drawCharacter(downFrames[currentCrouchFrame], characterX, characterY + crouchOffset);
    
    crouchFrame++;
  } else if (keyIsDown(82)) { // 82 是 'R' 鍵的 keycode
    // --- 跑步狀態 (R + 方向鍵) ---
    const runSpeed = 10; // 跑步速度 (比走路的 5 快)
    const runAnimationSpeed = 4;
    let currentRunFrame = floor(frameCount / runAnimationSpeed) % numRunFrames;

    if (keyIsDown(RIGHT_ARROW)) {
      facingDirection = 1;
      characterX += runSpeed;
      drawCharacter(runFrames[currentRunFrame]);
    } else if (keyIsDown(LEFT_ARROW)) {
      facingDirection = -1;
      characterX -= runSpeed;
      drawCharacter(runFrames[currentRunFrame]);
    } else {
      // 只按下R鍵但沒有按方向鍵，則靜止
      drawCharacter(stopFrames[currentFrameIndex]);
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    // --- 向右走 (不在跳躍時) ---
    facingDirection = 1;
    characterX += 5;
    drawCharacter(walkFrames[currentFrameIndex]);
  } else if (keyIsDown(LEFT_ARROW)) {
    // --- 向左走 (不在跳躍時) ---
    facingDirection = -1;
    characterX -= 5;
    drawCharacter(walkFrames[currentFrameIndex]);
  } else {
    // --- 靜止狀態 ---
    crouchFrame = 0; // 當沒有按下任何鍵時，重置蹲下動畫
    drawCharacter(stopFrames[currentFrameIndex]);
  }

  // 在跳躍時依然可以左右移動
  if (isJumping && !isAttacking) {
    if (keyIsDown(RIGHT_ARROW)) {
      characterX += 5;
      facingDirection = 1;
    }
    if (keyIsDown(LEFT_ARROW)) {
      characterX -= 5;
      facingDirection = -1;
    }
  }

  // --- 邊界碰撞檢查 ---
  const halfCharWidth = characterWidth / 2;
  // 檢查角色是否碰到螢幕左右邊界，且當前不處於倒地狀態
  // 預留角色寬度的一半，讓角色在完全超出螢幕前就觸發倒地
  if ((characterX - halfCharWidth <= 0 || characterX + halfCharWidth >= width) && !isFalling) {
    isFalling = true;
    isNewCharLaughing = true; // 觸發角色2的嘲笑狀態
    fallFrame = 0;
    if (isJumping) {
      // 如果在空中撞牆，重置垂直速度，使其開始下落
      velocityY = 0;
    }
    isJumping = false; // 如果在空中撞到牆，也取消跳躍狀態
  }

  // 處理並繪製所有投射物
  // 從後往前遍歷陣列，這樣在刪除元素時不會出錯
  for (let i = tools.length - 1; i >= 0; i--) {
    let tool = tools[i];
    const toolAnimationSpeed = 3;
    // 讓投射物動畫循環播放
    let currentToolFrame = floor(tool.frame / toolAnimationSpeed) % numToolFrames;

    // 檢查投射物是否超出螢幕邊界，加上一點緩衝確保完全移出畫面
    const offScreenMargin = toolFrameWidth;
    if (tool.x > width + offScreenMargin || tool.x < -offScreenMargin) {
      // 超出螢幕，從陣列中銷毀它
      tools.splice(i, 1);
    } else if (!isNewCharHit && abs(tool.x - newCharX) < 50 && abs(tool.y - newCharY) < 100) {
      // --- 碰撞偵測 ---
      // 如果投射物擊中角色2 (且角色2當前未處於被擊中狀態)
      isNewCharHit = true; // 設定角色2為被擊中狀態
      newCharFallFrame = 0; // 重置倒下動畫
      newCharFacingDirection = tool.direction * -1; // 讓角色2面向攻擊者
      dialogueState = 'idle'; nameInput.hide(); // 中斷對話
      // 超出螢幕，從陣列中銷毀它
      tools.splice(i, 1);
    } else {
      // 移動並繪製投射物
      tool.x += tool.speed * tool.direction;
      drawCharacter(toolFrames[currentToolFrame], tool.x, tool.y, tool.direction); // 這裡的 speed 已經在 tool 物件裡了
      tool.frame++;
    }
  }
}

function keyPressed() {
  // 當按下空白鍵且不在攻擊狀態時，觸發攻擊
  if (key === ' ' && !isAttacking) {
    isAttacking = true;
    attackFrame = 0;
    // 立即產生一個投射物
    tools.push({
      x: characterX + (facingDirection * 50), // 讓投射物從角色前方出現
      y: characterY,
      direction: facingDirection,
      frame: 0,
      speed: 20 // 您可以調整此速度
    });
  }

  // 當按下向上鍵且不在跳躍狀態時，觸發跳躍
  if (keyCode === UP_ARROW && !isJumping) {
    isJumping = true;
    velocityY = jumpForce;
    jumpFrame = 0; // 重置跳躍動畫計數器
  }

  // 當按下 Enter 鍵且正在詢問時
  if (keyCode === ENTER && dialogueState === 'asking') {
    playerName = nameInput.value(); // 獲取輸入框的內容
    if (playerName.trim() !== '') { // 確保玩家有輸入內容
      dialogueState = 'answered'; // 1. 更新對話狀態為 'answered'
      dialogueText = `${playerName}，歡迎你`; // 更新對話內容
      nameInput.value(''); // 清空輸入框
      nameInput.hide(); // 隱藏輸入框

      // 2. 設定一個計時器，1秒 (1000毫秒) 後執行
      setTimeout(() => {
        dialogueState = 'quiz_intro';
        dialogueText = "接下來我們來進行一個小測驗";

        // 3. 再設定一個計時器，1秒後顯示下一句
        setTimeout(() => {
          dialogueState = 'quiz_ready_check'; // 4. 更新狀態為準備確認
          dialogueText = "準備好了嗎?Ok打Ok";   // 5. 更新對話文字
          nameInput.value('');
          nameInput.show(); // 6. 再次顯示輸入框
        }, 1000); // 第二個延遲
      }, 1000); // 延遲1000毫秒
    }
  } else if (keyCode === ENTER && dialogueState === 'quiz_ready_check') {
    // 當玩家確認準備好時
    const playerResponse = nameInput.value().trim().toUpperCase();
    if (playerResponse === 'OK') {
      nameInput.hide();
      nameInput.value('');
      dialogueText = "好的，第一題來了！";
      setTimeout(startQuiz, 1000); // 1秒後開始測驗
    }
  } else if (keyCode === ENTER && (dialogueState === 'quiz_inprogress' || dialogueState === 'quiz_show_hint_button')) {
    // 當玩家回答問題時
    const userAnswer = nameInput.value().trim();
    const correctAnswer = quizQuestions[currentQuestionIndex].answer;

    // 玩家作答了，清除提示計時器
    clearTimeout(hintTimer);

    // 如果提示按鈕是可見的，將其隱藏
    hintButton.hide();

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      // 答對了
      score++;
      dialogueText = quizQuestions[currentQuestionIndex].correctFeedback; // 使用CSV中的答對回饋
      nameInput.hide();
      nameInput.value('');
      currentQuestionIndex++; // 準備進入下一題

      setTimeout(askNextQuestion, 1000); // 1秒後問下一題
    } else {
      // 答錯了
      dialogueState = 'quiz_feedback'; // 1. 進入顯示回饋狀態
      dialogueText = quizQuestions[currentQuestionIndex].wrongFeedback; // 2. 顯示答錯回饋
      nameInput.hide();
      nameInput.value('');

      // 3. 延遲後，再顯示題目與重試按鈕
      setTimeout(() => {
        // 確保玩家沒有中途走開
        if (dialogueState === 'quiz_feedback') {
          dialogueState = 'quiz_wrong_answer'; // 4. 進入等待重試狀態
          dialogueText = quizQuestions[currentQuestionIndex].question; // 5. 恢復顯示題目
          retryButton.show(); // 6. 顯示重試按鈕
        }
      }, 2000); // 讓玩家有2秒時間閱讀回饋
    }
  }
}

// 開始測驗的函式
function startQuiz() {
  // 從所有題目中隨機排序，然後取出前5題
  retryButton.html('再次作答本題'); // 重置按鈕文字
  quizQuestions = shuffle(allQuestions).slice(0, 5);
  currentQuestionIndex = 0;
  score = 0;
  askNextQuestion();
}

// 提出下一個問題的函式
function askNextQuestion() {
  // 清除上一個問題可能遺留的計時器和按鈕
  clearTimeout(hintTimer);
  hintButton.hide();

  if (currentQuestionIndex < quizQuestions.length) {
    dialogueState = 'quiz_inprogress';
    dialogueText = quizQuestions[currentQuestionIndex].question;
    retryButton.hide(); // 確保在問新問題時隱藏按鈕
    nameInput.show();
    startQuestionTimer(); // 啟動問題計時器
  } else {
    // 測驗結束
    dialogueState = 'quiz_end';
    dialogueText = `測驗結束！你真棒！`;
    retryButton.html('再次挑戰'); // 更改按鈕文字為再次挑戰
    retryButton.show(); // 顯示按鈕
    nameInput.hide();
  }
}

// 點擊重試按鈕時呼叫的函式
function retryQuestion() {
  if (dialogueState === 'quiz_wrong_answer') {
    dialogueState = 'quiz_inprogress'; // 回到作答中狀態
    retryButton.hide(); // 隱藏按鈕
    nameInput.show(); // 顯示輸入框讓玩家作答
    startQuestionTimer(); // 重新開始計時
  } else if (dialogueState === 'quiz_end') {
    // 如果在測驗結束時點擊，則重新開始測驗
    retryButton.hide();
    startQuiz();
  }
}

// 點擊提示按鈕時呼叫的函式
function showHint() {
  if (dialogueState === 'quiz_show_hint_button') {
    dialogueState = 'quiz_showing_hint'; // 1. 進入顯示提示狀態
    dialogueText = quizQuestions[currentQuestionIndex].hint; // 2. 顯示提示語
    hintButton.hide(); // 3. 隱藏提示按鈕
    nameInput.hide(); // 4. 暫時隱藏輸入框

    // 5. 2秒後恢復題目並顯示輸入框
    setTimeout(() => {
      if (dialogueState === 'quiz_showing_hint') {
        dialogueState = 'quiz_inprogress'; // 回到作答中狀態
        dialogueText = quizQuestions[currentQuestionIndex].question; // 恢復題目
        nameInput.show(); // 重新顯示輸入框
      }
    }, 2000); // 顯示提示2秒
  }
}

// 開始問題計時器的函式
function startQuestionTimer() {
  // 先清除舊的計時器，以防萬一
  clearTimeout(hintTimer);
  // 設定5秒計時器，如果玩家未作答，則顯示提示按鈕
  hintTimer = setTimeout(() => {
    if (dialogueState === 'quiz_inprogress') { // 再次確認狀態，避免玩家剛好作答
      dialogueState = 'quiz_show_hint_button';
      hintButton.show();
    }
  }, 5000); // 5秒
}

// 抽取出繪製角色的函式，方便重複使用與翻轉
function drawCharacter(img, x = characterX, y = characterY, direction = facingDirection) {
  if (direction === 1) {
    // 面向右邊，正常繪製
    image(img, x, y);
  } else {
    // 面向左邊，水平翻轉
    push();
    translate(x, y);
    scale(-1, 1);
    image(img, 0, 0);
    pop();
  }
}

function windowResized() {
  // 當視窗大小改變時，自動調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}
