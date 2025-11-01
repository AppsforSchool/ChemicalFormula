// 各要素を取得
const modal = document.getElementById("qrModal");
const btn = document.getElementById("QR-button");
const span = document.getElementsByClassName("close")[0];

// ボタンがクリックされたらモーダルを表示
btn.onclick = function() {
  modal.classList.add("show-modal");
}

// 閉じるボタン (x) がクリックされたらモーダルを非表示
span.onclick = function() {
  modal.classList.remove("show-modal");
}

// モーダルの外側をクリックしても閉じるようにする
window.onclick = function(event) {
  if (event.target == modal) {
    modal.classList.remove("show-modal");
  }
}

const selectionState = {
    mode: 'formula',
    grade: new Set(['2']),
    shuffle: 'true'
};

const modeButtons = document.querySelectorAll('.mode-button');
modeButtons.forEach(button => {
  button.addEventListener('click', () => {
    // 選択状態をリセット
    modeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const value = button.dataset.mode;
    selectionState.mode = value;
    //console.log(selectionState.mode);
    //checkSelection();
  });
});

const gradeButtons = document.querySelectorAll('.grade-button');
gradeButtons.forEach(button => {
  button.addEventListener('click', () => {
    // 選択状態をリセット
    button.classList.toggle('active');
    
    const value = button.dataset.grade;
    if (button.classList.contains('active')) {
      selectionState.grade.add(value);
    } else {
      selectionState.grade.delete(value);
    }
    //console.log(selectionState.grade);
    //checkSelection();
  });
});

const shuffleButtons = document.querySelectorAll('.shuffle-button');
shuffleButtons.forEach(button => {
  button.addEventListener('click', () => {
    // 選択状態をリセット
    shuffleButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const value = button.dataset.shuffle;
    selectionState.shuffle = value;
    //console.log(selectionState.shuffle);
    //checkSelection();
  });
});

document.getElementById('start-button').addEventListener('click', () => {
  if (selectionState.grade.size === 0) {
        alert('出題範囲を1つ以上選択してください。');
        return; // ここで処理を中断
    }
  
  const params = new URLSearchParams();
  
  selectionState.grade.forEach(g => {
    params.append('grade', g);
  });
  params.append('shuffle', selectionState.shuffle); 
  
  // 表示画面に遷移（クエリパラメータを付与）
  if (selectionState.mode === "formula") {
    //console.log(`formula.html?${params.toString()}`);
    window.location.href = `formula.html?${params.toString()}`;
  } else {
    //console.log(`reactionFormula.html?${params.toString()}`);
    window.location.href = `reactionFormula.html?${params.toString()}`;
  }
});