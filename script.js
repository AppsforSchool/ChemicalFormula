/*formulasData = [
  {
    "name": "二酸化炭素",
    "formula": [
      {"substance": "C", "count": 1, "type": 0},
      {"substance": "O", "count": 2, "type": 0}
    ]
  },
  {
    "name": "水",
    "formula": [
      {"substance": "H", "count": 2, "type": 0},
      {"substance": "O", "count": 1, "type": 0},
    ]
  },
  {
    "name": "塩化ナトリウム",
    "formula": [
      {"substance": "Na", "count": 1, "type": 0},
      {"substance": "Cl", "count": 1, "type": 0},
    ]
  },
  {
    "name": "炭酸水素ナトリウム",
    "formula": [
      {"substance": "Na", "count": 1, "type": 0},
      {"substance": "H", "count": 1, "type": 0},
      {"substance": "C", "count": 1, "type": 0},
      {"substance": "O", "count": 3, "type": 0},
    ]
  },
  {
    "name": "水酸化カルシウム",
    "formula": [
      {"substance": "Ca", "count": 1, "type": 0},
      {"substance": "OH", "count": 2, "type": 1},
    ]
  },
];*/

let formulasData = [];

fetch('./formulas.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('ネットワーク応答が異常です');
    }
    return response.json();
  })
  .then(data => {
    // データの読み込みが完了したら、formulasDataに格納
    formulasData = data;
    // そして、ゲームの開始処理を呼び出す
    startCountdown();
  })
  .catch(error => {
    console.error('JSONファイルの取得に失敗しました:', error);
    alert('化学式の読み込みに失敗しました。ページをリロードしてください。');
  });

let questions = [];

//countDown
function startCountdown() {
  const countdownOverlay = document.getElementById('countdown-overlay');
  const countdownTimer = document.getElementById('countdown-timer');
  const questionContainer = document.getElementById('question-container');
  
  let count = 3;

  const countdownInterval = setInterval(() => {
    if (count === 0) {
      countdownTimer.textContent = 'Go!';
      count -= 1;
    } else if (count === -1) {
      clearInterval(countdownInterval);
      
      // データが読み込まれた後にシャッフルと最初の問題表示を行う
      questions = shuffle(formulasData);
      changeQuestion(0);
      
      countdownOverlay.style.display = 'none';
      questionContainer.classList.remove('hidden');
    } else {
      if (count === 3) {
        countdownTimer.classList.remove('loading');
      }
      countdownTimer.textContent = count;
      count -= 1;
    }
  }, 1000);
}



function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // まだシャッフルしていない要素がある限りループを続ける
  while (currentIndex > 0) {

    // 残りの要素からランダムに1つ選ぶ
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // 現在の要素と選んだ要素を交換する
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

let questionsIndex = 0;
let elementCount = [];

function changeQuestion(index) {
  const elementText = document.getElementById('element-text');
  elementText.textContent = questions[index].name;
  
  
  const elementAddArea = document.getElementById('element-add');
  elementAddArea.innerHTML = '';
  
  //元素の追加・削除ボタンを生成
  for (let i = 0; i < questions[index].formula.length; i++) {
    elementCount.push(0);
    
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "element-buttons";
    
    
    const buttonPlus = document.createElement("button");
    buttonPlus.className = "element-add-button";
    buttonPlus.textContent = questions[index].formula[i].substance;
    buttonPlus.addEventListener("click", () => {
      elementCount[i] += 1;
      console.log(elementCount[i]);
      updateAnswerArea(questionsIndex,elementCount);
    });
    buttonsDiv.appendChild(buttonPlus);
    
    const buttonMinus = document.createElement("button");
    buttonMinus.className = "element-minus-button";
    buttonsDiv.appendChild(buttonMinus);
    buttonMinus.textContent = "-";
    buttonMinus.addEventListener("click", () => {
      if (0 < elementCount[i]) {
        elementCount[i] -= 1;
        console.log(elementCount[i]);
        updateAnswerArea(questionsIndex,elementCount);
      }
    });
    
    elementAddArea.appendChild(buttonsDiv);
  }
  
  
  const answerText = document.getElementById('answer-text');
  answerText.textContent = "";
  
  for (let i = 0; i < questions[index].formula.length; i++) {
    const elementSpan = document.createElement("span");
    elementSpan.className = "element-zero";
    
    answerText.appendChild(elementSpan);
    
    const elementText = document.createTextNode(questions[index].formula[i].substance);
    const subElement = document.createElement('sub');
    subElement.textContent = '0';
    
    elementSpan.appendChild(elementText);
    elementSpan.appendChild(subElement);
  }
}

function updateAnswerArea(index,counts) {
   const answerText = document.getElementById('answer-text');
   answerText.textContent = "";
  answerText.classList.remove('correct');
  
   for (let i = 0; i < questions[index].formula.length; i++) {
     const elementSpan = document.createElement("span");
     if (counts[i] === 0) {
       elementSpan.className = "element-zero";
     }
     answerText.appendChild(elementSpan);
    
     let elementText;
     if (questions[index].formula[i].type === 1 && counts[i] > 1) {
       elementText = document.createTextNode(`(${questions[index].formula[i].substance})`);
     } else {
       elementText = document.createTextNode(questions[index].formula[i].substance);
     }
     
     const subElement = document.createElement('sub');
     subElement.textContent = counts[i];
     if (counts[i] === 1) {
       subElement.className = "element-zero";
     }
     
    
     elementSpan.appendChild(elementText);
     elementSpan.appendChild(subElement);
   }
}

const answerButton = document.getElementById('answer-check-button');

answerButton.addEventListener('click', () => {
  answerCheck(questionsIndex);
});

function answerCheck(index) {
  const answerText = document.getElementById('answer-text');
  const answerSubText = document.getElementById('answer-sub-text');
  const answerButton = document.getElementById('answer-check-button');

  const resultButton = answerButton.classList.contains('toResult');
  if (resultButton) {
    
  } else {
    const nextButton = answerButton.classList.contains('nextQuestion');
    console.log(nextButton);
  
  if (nextButton) {
    answerButton.classList.remove('nextQuestion');
    answerSubText.textContent = "";
    answerButton.textContent = "答える";
    answerText.classList.remove('correct');
    
    elementCount.length = 0;
    questionsIndex += 1;
    changeQuestion(questionsIndex);
  } else {
    let perfect = true;
    for (let i = 0; i < elementCount.length; i++) {
      const answerCount = questions[index].formula[i].count;
      const nowCount = elementCount[i];
      if (answerCount === nowCount) {
        
      } else {
        perfect = false;
        break;
      }
    }
    if (perfect) {
      answerText.classList.add('correct');
      answerSubText.textContent = "正解！";
      if (questionsIndex + 1 === questions.length) {
      answerButton.textContent = "結果をみる";
        answerButton.classList.add('toResult');
      } else {
        answerButton.textContent = "次の問題";
        answerButton.classList.add('nextQuestion');
      }
    } else {
      answerSubText.textContent = "不正解...";
    }
  }
}
