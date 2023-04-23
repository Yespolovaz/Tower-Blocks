let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
context.font = 'bold 30px sans-serif';
let scrollCounter, cameraY, current, mode, xSpeed;
let ySpeed = 5;
let height = 50;
let boxes = [];
let records = [];
boxes[0] = {
  x: 200,
  y: 300,
  width: 200
};
 
function newBox() {
  boxes[current] = {
    x: 0,
    y: (current + 10) * height,
    width: boxes[current - 1].width
  };
}
 
function gameOver() {
  alert("GAME OVER! Try again");
  mode = 'gameOver';
  let username = prompt("Please enter your name:");
  addRecord(username, current - 1);
}
 
function animate() {
  if (mode != 'gameOver') {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText('Score: ' + (current - 1).toString(), 5, 30);
    for (let n = 0; n < boxes.length; n++) {
      let box = boxes[n];
      context.fillRect(box.x, 600 - box.y + cameraY, box.width, height);
    }
    if (mode == 'bounce') {
      boxes[current].x = boxes[current].x + xSpeed;
      if (xSpeed > 0 && boxes[current].x + boxes[current].width > canvas.width)
        xSpeed = -xSpeed;
      if (xSpeed < 0 && boxes[current].x < 0)
        xSpeed = -xSpeed;
    }
    if (mode == 'fall') {
      boxes[current].y = boxes[current].y - ySpeed;
      if (boxes[current].y <= boxes[current - 1].y + height) {
        boxes[current].y = boxes[current - 1].y + height;
        mode = 'bounce';
        let centerDiff = Math.abs(boxes[current].x + boxes[current].width / 2 - (boxes[current - 1].x + boxes[current - 1].width / 2));
        if (centerDiff > 70) {
          gameOver();
        }
        current++;
        scrollCounter = height;
        newBox();
      }
    }
    if (scrollCounter) {
      cameraY++;
      scrollCounter--;
    }
  }
  window.requestAnimationFrame(animate);
}
 
function restart() {
  boxes.splice(1, boxes.length - 1);
  mode = 'bounce';
  cameraY = 0;
  scrollCounter = 0;
  xSpeed = 2;
  current = 1;
  newBox();
}
 
function updateRecords() {
  const recordsList = document.getElementById('records');
  recordsList.innerHTML = '';
  records.sort((a, b) => b.score - a.score);
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const listItem = document.createElement('li');
    listItem.textContent = `${record.name}: ${record.score}`;
    recordsList.appendChild(listItem);
  }
}

function addRecord(name, score) {
  records.push({ name: name, score: score });
  updateRecords();
}


canvas.onpointerdown = function() {
  if (mode == 'gameOver'){
	restart();
  }else {
    if (mode == 'bounce')
      mode = 'fall';
  }
};
 
restart();
animate();
