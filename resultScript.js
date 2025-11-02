function setResult() {
  const resultData = {
        gameType: 'formula',
        shuffle: true,
        grade: [2,3],
        correctCount: 15,
        problemCount: 17
      };
  localStorage.setItem('resultData', JSON.stringify(resultData));
  return "seted";
}

function getResult() {
  const settingsString = localStorage.getItem('resultData');
  const settingsObject = JSON.parse(settingsString);

  const correctCountArea = document.getElementById('correct-count');
  correctCountArea.textContent =   settingsObject.correctCount;
  
  const problemCountArea = document.getElementById('problem-count');
  problemCountArea.textContent =   settingsObject.problemCount;
  
  return settingsString;
}

function deleteResult() {
  localStorage.removeItem('resultData');
}

const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', () => {
  if (restartButton.classList.contains('inactive')) {
    alert('データの取得に失敗したため、このボタンは使えません。');
  } else {
    const settingsString = localStorage.getItem('resultData');
    const settingsObject = JSON.parse(settingsString);
    
    const params = new URLSearchParams();
    settingsObject.grade.forEach(g => {
      params.append('grade', g);
    });
    params.append('shuffle', settingsObject.shuffle); 
    //console.log(`formula.html?${params}`);
    window.location.href = `formula.html?${params}`;
  }
});

const returnButton = document.getElementById('return-button');
returnButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
  const settingsString = localStorage.getItem('resultData');
  const settingsObject = JSON.parse(settingsString);
  
  if (settingsObject === null) {
    const gameTypeArea = document.getElementById('game-type');
    gameTypeArea.textContent = 'データなし';
    
    const gradeArea = document.getElementById('grade');
    gradeArea.textContent = '';
    
    const shuffleArea = document.getElementById('shuffle');
    shuffleArea.textContent = "データの取得に失敗";
    
    const restartButton = document.getElementById('restart-button');
    restartButton.classList.add('inactive');
  } else {
    const gameTypeArea = document.getElementById('game-type');
    if (settingsObject.gameType === 'formula') {
      gameTypeArea.textContent = '化学式';
    }
    
    const gradeArea = document.getElementById('grade');
    gradeArea.textContent = `${settingsObject.grade}年`;
    
    const shuffleArea = document.getElementById('shuffle');
    if (settingsObject.shuffle === 'true') {
      shuffleArea.textContent = 'シャッフルあり';
    } else {
      shuffleArea.textContent = 'シャッフルなし';
    }
  
    const correctCountArea = document.getElementById('correct-count');
    correctCountArea.textContent = settingsObject.correctCount;
  
    const problemCountArea = document.getElementById('problem-count');
    problemCountArea.textContent = settingsObject.problemCount;
    
    localStorage.removeItem('resultData');
  }
});
