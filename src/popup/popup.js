//===================================
// MISC
//===================================

let status_timer = 'stopped'; // 'running', 'paused'
let preset_timer = 15;
let minutesLeft = 0;
let secondsLeft = 0;

async function sendMessage(message) {
  let res = null;
  if (typeof chrome !== 'undefined' && chrome.runtime){
    res = await chrome.runtime.sendMessage(message);
  }
  return res;
}

function resetTimer(){
  minutesLeft = preset_timer;
  secondsLeft = 0;
  updateDisplayedTime();
}

//===================================
// Updates de display do temporizador
//===================================

async function updateDisplayedTime() {
  const minutesDisplay = document.getElementById('display-min');
  const secondsDisplay = document.getElementById('display-sec');

  minutesDisplay.innerText = String(minutesLeft).padStart(2, '0');
  secondsDisplay.innerText = String(secondsLeft).padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', async () => {
  // Atualiza o display a cada segundo
  while (true) {
    if (status_timer === 'running') {
      await updateDisplayedTime();
      
      if (secondsLeft > 0) {
        secondsLeft -= 1;
      } else if (minutesLeft > 0) {
        minutesLeft -= 1;
        secondsLeft = 59;
      } else {
        // Timer acabou
        status_timer = 'stopped';
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          // nesse caso o background já vai notificar o alarme.
        } else {
          alert('O tempo do Pomodoro acabou!');
        }
        resetTimer();
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
});

//===================================
// Botões de controle do temporizador
//===================================

const btnStart = document.getElementById('start');
const btnReset = document.getElementById('reset');

btnStart.addEventListener('click', async () => {
  res = await sendMessage({ type: 'START', minutes: preset_timer });
  if(res != null && !res.started){
    alert(res.error);
  }
  status_timer = 'running';
  resetTimer();
});

btnReset.addEventListener('click', async () => {
  res = await sendMessage({ type: 'RESET' });
  if(res != null && !res.reset){
    alert(res.error);
  }
  status_timer = 'stopped';
  resetTimer();
});

//===================================
// Controles de tempo do temporizador
//===================================

async function updateTimer(minutes){
  preset_timer = minutes;
  res = await sendMessage({ 
    type: 'TIMER_SET', 
    minutes: minutes 
  });
  status_timer = 'stopped';
  resetTimer();
}

const timer1 = document.getElementById('timer-1');
const timer2 = document.getElementById('timer-2');
const timer3 = document.getElementById('timer-3');
const timer4 = document.getElementById('timer-4');

timer1.addEventListener('click', () => updateTimer(15));
timer2.addEventListener('click', () => updateTimer(30));
timer3.addEventListener('click', () => updateTimer(45));
timer4.addEventListener('click', () => updateTimer(60));