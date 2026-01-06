// Final Jeopardy Version. Could be v17 if desired

let popular = [
  ["flowers", "Flowers by Miley Cyrus"],
  ["anti_hero", "Anti-Hero by Taylor Swift"],
  ["die_with_smile", "Die With A Smile by Bruno Mars and Lady Gaga"],
  ["houdini", "Houdini by Dua Lipa"],
  ["vampire", "Vampire by Olivia Rodrigo"],
  "pop",
];

let classic = [
  ["symphony5", "Symphony No. 5 by Beethoven"],
  ["spring", "Spring by Vivaldi"],
  ["hall", "In the Hall of the Mountain King by Grieg"],
  ["rite", "Rite of Spring by Stravinsky"],
  ["rhapsody", "Rhapsody in Blue by George Gershwin"],
  "classical",
];

let tv = [
  ["simpsons", "The Simpsons theme song"],
  ["starwars", "Main Theme from Star Wars"],
  ["thrones", "Opening Credits from Game of Thrones"],
  ["goodbad", "Main Theme from The Good, the Bad and the Ugly"],
  ["stranger", "Main Theme from Stranger Things"],
  "tv",
];

let school = [
  ["Joy", "Frank Tichelli"],
  ["Brave Spirit", "idk"],
  ["Rhythm Danse", "idk"],
  ["Travelling Music", "idk"],
  ["March of the Hobgoblins", "idk"],
];

let musical = [
  ["hardknock", "It's the Hard-Knock Life from Annie"],
  ["popular", "Popular from Wicked"],
  ["phantom", "Theme Song from The Phantom of the Opera"],
  ["tenduel", "Ten Duel Commandments from Hamilton"],
  ["showman", "The Greatest Show from The Greatest Showman"],
  "musical",
];

let tiktok = [
  ["anxiety", "Anxiety by Doechii"],
  ["prettybaby", "Pretty Little Baby by Connie Francis"],
  ["chanel", "Chanel by Tyla"],
  ["riptide", "Riptide by Vance Joy"],
  ["boysliar", "Boy's a liar Pt. 2 by Ice Spice and PinkPantheress"],
  "tiktok",
];

let categories = [
  popular,
  classic,
  tv,
  musical,
  tiktok,
  // school
];

let categoryNames = [
  "POP",
  "Classical",
  "TV",
  // 'School',
  "Musical",
  "TikTok",
];

let totalCards = 0;

let selectedCardValue = 0;

let gameState = "start";

function playSound(val) {
  questions[val].stop();
  questions[val].play();
}

function stopSound(val) {
  questions[val].stop();
}

class Card {
  constructor(posX, posY, points, question, answer, id, type) {
    this.x = posX;
    this.y = posY;
    this.p = points;
    this.q = question;
    this.a = answer;
    this.t = type;

    this.originalX = posX;
    this.originalY = posY;

    this.w = cardWidth;
    this.h = cardHeight;

    this.id = id;

    this.state = "available";
    this.hasBeenPlayed = false;

    this.qButtonWidth = gridWidth / 3;
    this.qButtonHeight = gridWidth / 7;

    this.qButton = createButton("🔊");
    this.qButton.size(this.qButtonWidth, this.qButtonHeight);
    this.qButton.style("text-align", "center");
    this.qButton.style("font-size", "50px");
    this.qButton.style("font-weight", "bolder");
    this.qButton.style("background-color", highlightColor);
    this.qButton.style("border-radius", "5px");

    this.qButton.hide();
  }

  show() {
    rectMode(CENTER);
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);

    if (this.t === "q") {
      if (this.state === "available") {
        fill(neutralColor);
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        text("$" + this.p, this.x, this.y);
      } else if (this.state === "played") {
        fill(darkColor);
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        text("$" + this.p, this.x, this.y);
      } else if (this.state === "on_question") {
        fill(neutralColor);
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.w = gridWidth;
        this.h = gridHeight;
        rect(this.x, this.y, this.w, this.h);
      } else if (this.state === "on_answer") {
        fill(neutralColor);
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        textSize(50);
        text(this.a, this.x, this.y + this.h / 5, this.w / 1.2);
      } else {
        fill(255, 0, 0);
        rect(this.x, this.y, this.w, this.h);
      }
    } else if (this.t === "name") {
      textStyle(BOLD);
      fill(highlightColor);
      rect(this.x, this.y, this.w, this.h);
      fill(0);
      text(this.q, this.x, this.y);
    }

    if (this.state === "on_question") {
      this.qButton.position(
        this.x - this.qButtonWidth / 2,
        this.y - this.qButtonHeight / 2
      );
      this.qButton.show();
      this.qButton.mousePressed(() => playSound(this.id));
    } else if (this.state === "on_answer") {
      this.qButton.position(
        this.x - this.qButtonWidth / 2,
        this.y - this.qButtonHeight / 2 - this.h / 5
      );
      this.qButton.show();
      this.qButton.mousePressed(() => playSound(this.id));
    } else {
      this.qButton.hide();
    }
  }

  isClicked(mx, my) {
    if (this.t === "q") {
      if (!this.qButton.elt.matches(":active")) {
        if (
          mx > this.x - this.w / 2 &&
          mx < this.x + this.w / 2 &&
          my > this.y - this.h / 2 &&
          my < this.y + this.h / 2
        ) {
          if (this.state === "available") {
            gridMusic.stop();
            openSound.play();
            this.state = "on_question";
            selectedCardValue = this.p;
          } else if (this.state === "on_question") {
            stopSound(this.id);
            flipSound.play();
            this.state = "on_answer";
          } else if (this.state === "on_answer") {
            stopSound(this.id);
            gridMusic.loop();
            this.hasBeenPlayed = true;
            this.state = "played";
            this.x = this.originalX;
            this.y = this.originalY;
            this.w = cardWidth;
            this.h = cardHeight;
            selectedCardValue = 0;
            cardsPlayed++;
          }
          return true;
        }
        return false;
      }
    } else if (this.t === "name") {
      return false;
    }
  }

  getState() {
    return this.state;
  }
}

class Player {
  constructor(number, posX, posY, valW, valH) {
    this.n = number;
    this.x = posX;
    this.y = posY;
    this.w = valW;
    this.h = valH;

    this.s = 0;

    this.buttonHeight = 20;
    this.buttonWidth = this.buttonHeight * 1.5;
    this.buttonOffsetX = 50;

    this.correctButton = createButton("+");
    this.correctButton.size(this.buttonWidth, this.buttonHeight);
    this.correctButton.style("text-align", "center");
    this.correctButton.style("font-size", "13px");
    this.correctButton.style("font-weight", "bolder");
    this.correctButton.style("border-radius", "5px");

    this.wrongButton = createButton("-");
    this.wrongButton.size(this.buttonWidth, this.buttonHeight);
    this.wrongButton.style("text-align", "center");
    this.wrongButton.style("font-size", "13px");
    this.wrongButton.style("font-weight", "bolder");
    this.wrongButton.style("border-radius", "5px");

    this.correctButton.hide();
    this.wrongButton.hide();
  }

  show() {
    rectMode(CENTER);
    fill(neutralColor);

    rect(this.x, this.y, this.w, this.h);

    this.correctButton.position(this.x - this.buttonOffsetX, this.y + 20);
    this.wrongButton.position(
      this.x + (this.buttonOffsetX - this.buttonWidth),
      this.y + 20
    );

    this.correctButton.show();
    this.wrongButton.show();

    if (gameState === "grid") {
      this.correctButton.style("background-color", "darkolivegreen");
      this.wrongButton.style("background-color", "darkred");
    } else if (gameState === "big_card") {
      if (cardInPlay.getState() === "on_answer") {
        this.correctButton.style("background-color", "lightgreen");
        this.wrongButton.style("background-color", "red");
      }
    }

    textSize(20);
    fill(0);
    text("Team " + this.n, this.x, this.y - playerTileHeight / 1.6);

    textAlign(CENTER);
    if (this.s < 0) {
      fill(255, 0, 0);
    } else {
      fill(0);
    }

    text("$ " + this.s, this.x, this.y);

    if (gameState === "big_card") {
      if (cardInPlay.getState() === "on_answer")
        this.correctButton.mousePressed(() => correctAnswer(this.n));
      this.wrongButton.mousePressed(() => wrongAnswer(this.n));
    }
  }
}

let players = [];

function correctAnswer(num) {
  if (cardInPlay.getState() === "on_answer") {
    correctSound.play();
    players[num - 1].s += selectedCardValue;
  }
}

function wrongAnswer(num) {
  if (cardInPlay.getState() === "on_answer") {
    wrongSound.play();
    players[num - 1].s -= selectedCardValue;
  }
}

let correctSound, wrongSound, openSound, flipSound;
let gridMusic, endMusic;
let questions = [];

function preload() {
  correctSound = loadSound("sound/correct.mp3");
  wrongSound = loadSound("sound/wrong.mp3");
  openSound = loadSound("sound/open.mp3");
  flipSound = loadSound("sound/flip.mp3");

  gridMusic = loadSound("sound/grid.mp3");
  endMusic = loadSound("sound/ending.mp3");

  correctSound.setVolume(0.7);
  wrongSound.setVolume(0.7);
  openSound.setVolume(0.3);
  flipSound.setVolume(0.3);

  gridMusic.setVolume(0.1);

  for (let cat of categories) {
    let thisCategoryName = cat[5];
    questions.push(null);
    for (let i = 0; i < cat.length - 1; i++) {
      questions.push(
        loadSound("questions/" + thisCategoryName + "/" + cat[i][0] + ".mp3")
      );
    }
  }
}

let cards = [];
let cardInPlay = null;
let cardsPlayed = 0;

let canvasWidth, canvasHeight, gridWidth, gridHeight;

let playerNumInput, startButton;
let offsetX, offsetY;

let bgColor = "#9FE2BF";
let highlightColor = "#89CFF0";
let neutralColor = "white";
let darkColor = "#3F51B5";

let cardWidth, cardHeight;

function setup() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;

  cardWidth = canvasWidth / categories.length / 2;
  cardHeight = canvasHeight / 10;

  createCanvas(canvasWidth, canvasHeight);
  background(bgColor);

  let inputWidth = canvasWidth / 2;
  let inputHeight = 30;

  playerNumInput = createInput("2");

  playerNumInput.style("box-sizing", "border-box");
  playerNumInput.style("text-align", "center");
  playerNumInput.style("border-radius", "5px");
  playerNumInput.style("background-color", "rgba(255, 255, 255, 0.5)");
  playerNumInput.size(inputWidth, inputHeight);
  playerNumInput.position(
    canvasWidth / 2 - inputWidth / 2,
    canvasHeight * (16 / 30) - inputHeight / 2
  );

  let buttonWidth = canvasWidth / 2;
  let buttonHeight = 30;

  startButton = createButton("Start");

  startButton.style("box-sizing", "border-box");
  startButton.style("border-radius", "5px");
  startButton.style("background-color", neutralColor);
  startButton.size(buttonWidth, buttonHeight);
  startButton.position(
    canvasWidth / 2 - buttonWidth / 2,
    canvasHeight * (6 / 10) - buttonHeight / 2
  );

  startButton.mousePressed(startGame);

  let spacingFactorX = 1.25;
  let spacingFactorY = 1.15;

  gridWidth =
    categories.length * cardWidth +
    (categories.length - 1) * cardWidth * (spacingFactorX - 1);
  gridHeight = 6 * cardHeight + 5 * cardHeight * (spacingFactorY - 1);

  offsetX = (canvasWidth - gridWidth) / 2 + cardWidth / 2;
  offsetY = (canvasHeight - gridHeight) / 2 + cardHeight / 2;

  let idNum = 0;
  for (let i = 0; i < categories.length; i++) {
    cards.push(
      new Card(
        i * cardWidth * spacingFactorX + offsetX,
        offsetY,
        null,
        categoryNames[i],
        null,
        idNum,
        "name"
      )
    );
    idNum++;
    for (let j = 0; j < 5; j++) {
      cards.push(
        new Card(
          i * cardWidth * spacingFactorX + offsetX,
          (j + 1) * cardHeight * spacingFactorY + offsetY,
          j * 200 + 200,
          categories[i][j][0],
          categories[i][j][1],
          idNum,
          "q"
        )
      );
      idNum++;
      totalCards++;
    }
  }
}

function draw() {
  if (gameState === "start") {
    fill(0);
    textAlign(CENTER);
    textSize(getFitSize("JEOPARDY!", canvasWidth / 2));
    text("JEOPARDY!", canvasWidth / 2, canvasHeight * (4 / 10));
    textSize(
      getFitSize("Choose the amount of teams (2 to 4):", canvasWidth / 2)
    );
    text(
      "Choose the amount of teams (2 to 4):",
      canvasWidth / 2,
      canvasHeight * (5 / 10)
    );
  } else if (gameState === "initializing") {
    gameState = "grid";
  } else if (gameState === "grid" || gameState === "big_card") {
    background(bgColor);
    for (let c of cards) {
      c.show();
    }
    for (let p of players) {
      p.show();
    }
    if (cardsPlayed === totalCards) {
      gameState = "end";
      endMusic.loop();
    }
  } else if (gameState === "end") {
    background(bgColor);
    gridMusic.stop();
    for (let p of players) {
      p.correctButton.hide();
      p.wrongButton.hide();
    }

    textAlign(LEFT);
    fill(0);
    textSize(30);
    let txtToShow;
    let textPosY = 100;
    for (let p of players) {
      txtToShow = "Team " + p.n + " got $" + p.s + ".";
      text(txtToShow, canvasWidth / 4, textPosY);
      textPosY += 100;
    }
    text("Thanks for playing!", canvasWidth / 4, textPosY);
  }
}

let oldIndex = 0;

function mousePressed() {
  if (gameState !== "initializing") {
    if (gameState === "grid") {
      for (let c of cards) {
        if (c.isClicked(mouseX, mouseY)) {
          gameState = "big_card";
          cardInPlay = c;
          oldIndex = cardInPlay.id;
          cards.push(cards.splice(oldIndex, 1)[0]);
          break;
        }
      }
    } else if (gameState === "big_card") {
      if (cardInPlay.state === "on_question") {
        cardInPlay.isClicked(mouseX, mouseY);
      } else if (cardInPlay.state === "on_answer") {
        if (cardInPlay.isClicked(mouseX, mouseY)) {
          gameState = "grid";
          cards.splice(oldIndex, 0, cards.pop());
          cardInPlay = null;
        }
      }
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER && gameState === "start") {
    startGame();
  }
}

let playerNum = 0;
let playerTileSpacing,
  playerTileWidth,
  playerTileHeight,
  playersWidth,
  playersOffsetX,
  placementX;

function startGame() {
  playerNum = playerNumInput.value();

  if (playerNum !== 0 && playerNum < 5 && playerNum > 1) {
    playerNumInput.hide();
    startButton.hide();
    gameState = "initializing";

    gridMusic.loop();

    playerTileSpacing = 25;
    playerTileWidth =
      (gridWidth - (playerNum - 1) * playerTileSpacing) / playerNum;
    playerTileHeight = 50;
    playersWidth =
      playerTileWidth * playerNum + playerTileSpacing * (playerNum - 1);
    playersOffsetX = (canvasWidth - playersWidth) / 2 + playerTileWidth / 2;
    placementX = playersOffsetX;

    for (let i = 0; i < playerNum; i++) {
      players.push(
        new Player(
          i + 1,
          placementX,
          canvasHeight - playerTileHeight - 25,
          playerTileWidth,
          100
        )
      );
      placementX += playerTileWidth + playerTileSpacing;
    }
  }
}

function getFitSize(txt, maxWidth) {
  let size = 1;
  textSize(size);

  while (textWidth(txt) < maxWidth) {
    size++;
    textSize(size);
  }

  return size - 1;
}
