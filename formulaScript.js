let formulasData = [];

function getGradesFromUrl() {
    const params = new URLSearchParams(window.location.search);
    // 'grade' パラメータの全ての値を配列として取得
    return params.getAll('grade');
}

async function loadFormulasData() {
    const grades = getGradesFromUrl();
    const fetchPromises = [];

    // URLパラメータに含まれる学年に応じてフェッチのPromiseを作成
    if (grades.includes('2')) {
        fetchPromises.push(fetch('./formulas2.json').then(res => res.json()));
    }
    if (grades.includes('3')) {
        fetchPromises.push(fetch('./formulas3.json').then(res => res.json()));
    }

    // フェッチ対象がない場合の処理
    if (fetchPromises.length === 0) {
      console.warn('URLパラメータに有効な学年 (grade=2 または grade=3) が見つかりませんでした。');
      // データがない状態での後続処理を開始
      alert('URLパラメータに有効な学年 (grade=2 または grade=3) が見つかりませんでした。');
      //startCountdown(); 
      return;
    }

    try {
        // 全てのフェッチが完了するまで待機
        const results = await Promise.all(fetchPromises);
        
        // 取得したデータを一つの配列に結合
        // results は [dataFrom2, dataFrom3] のような配列になっている
        formulasData = results.flat(); // .flat() でネストされた配列を平坦化

        // データの読み込みが完了したら後続処理を呼び出す
        //alert('データロード完了');
        startCountdown();

    } catch (error) {
        console.error('JSONファイルの取得または処理に失敗しました:', error);
        alert('JSONファイルの取得または処理に失敗しました');
    }
}

loadFormulasData();

let questions = [];

//countDown
function startCountdown() {
  const countdownOverlay = document.getElementById('countdown-overlay');
  const countdownTimer = document.getElementById('countdown-timer');
  const questionContainer = document.getElementById('question-container');
  
  let count = 3;

  const countdownInterval = setInterval(() => {

    //countdownTimer.classList.remove('loading');
    
    if (count === 0) {
      countdownTimer.textContent = 'Go!';
      count -= 1;
    } else if (count === -1) {
      clearInterval(countdownInterval);
      
      // データが読み込まれた後にシャッフルと最初の問題表示を行う
      const urlParams = new URLSearchParams(window.location.search);
      const doShuffle = urlParams.get('shuffle');
      if (doShuffle === 'true') {
        questions = shuffle(formulasData);
      } else {
        questions = formulasData;
      }
      
      const problemCount = document.getElementById('problem-count');
      problemCount.textContent = questions.length;
      
      changeQuestion(0);
      
      countdownOverlay.style.display = 'none';
      questionContainer.classList.remove('hidden');
    } else {
      if (count === 3) {
        countdownTimer.classList.remove('loading');
      }
      countdownTimer.textContent = count;
      count -= 1;
      //alert('現在のカウント: ' + count);
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
let correctCount = 0;

function changeQuestion(index) {
  const nowCount = document.getElementById('now-count');
  nowCount.textContent = index + 1;
  
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
      //console.log(buttonPlus.classList.contains('inactive'));
      if (!(buttonPlus.classList.contains('inactive'))) {
        elementCount[i] += 1;
        console.log(elementCount[i]);
        updateAnswerArea(questionsIndex,elementCount);
      }
    });
    buttonsDiv.appendChild(buttonPlus);
    
    const buttonMinus = document.createElement("button");
    buttonMinus.className = "element-minus-button";
    buttonsDiv.appendChild(buttonMinus);
    buttonMinus.textContent = "-";
    buttonMinus.addEventListener("click", () => {
      //console.log(buttonMinus.classList.contains('inactive'));
      if (!(buttonMinus.classList.contains('inactive'))) {
        if (0 < elementCount[i]) {
          elementCount[i] -= 1;
          console.log(elementCount[i]);
          updateAnswerArea(questionsIndex,elementCount);
        }
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
  answerText.classList.remove('fail');
  
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
    let resultData = {
      gameType: 'formula',
      shuffle: 'false',
      grade: urlParams.getAll('grade'),
      correctCount: correctCount,
      problemCount: questions.length
    };
    const urlParams = new URLSearchParams(window.location.search);
    const doShuffle = urlParams.get('shuffle');
    const boolShuffle = (doShuffle === 'true');
    if (boolShuffle) {
      resultData.shuffle = 'true';
    }
    localStorage.setItem('resultData', JSON.stringify(resultData));
    alert('リザルト画面へ遷移');
    window.location.href = 'result.html';
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
        const elementAddButton = document.querySelectorAll('.element-add-button');
        elementAddButton.forEach(element => {
          element.classList.add('inactive');
        });
        const elementMinusButton = document.querySelectorAll('.element-minus-button');
        elementMinusButton.forEach(element => {
          element.classList.add('inactive');
        });
        
        answerText.classList.add('correct');

        if (answerSubText.textContent === "不正解...") {
          correctCount += 1;
        }
        
        answerSubText.textContent = "正解！";
        if (questionsIndex + 1 === questions.length) {
          answerButton.textContent = "結果をみる";
          answerButton.classList.add('toResult');
          alert('リザルトボタンを設定');
        } else {
          answerButton.textContent = "次の問題";
          answerButton.classList.add('nextQuestion');
        }
      } else {
        answerText.classList.add('fail');
        answerSubText.textContent = "不正解...";
      }
    }
  }
}

/*document.getElementById('answer-check-button').addEventListener('click', () => {
  // リザルトボタンなら
  if (this.classList.contains('toResult')) {
    window.location.href = 'result.html';
  }
});*/
