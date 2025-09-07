//===================================
// Updates de display do temporizador
//===================================

const timerDisplay = document.getElementById('timer-display');

//===================================
// Botões de controle do temporizador
//===================================

const btnStart = document.getElementById('start');
const btnPause = document.getElementById('pause');
const btnReset = document.getElementById('reset');

btnStart.addEventListener('click', async () => {
  const res = await chrome.runtime.sendMessage({ type: 'START' });
  if(!res.started){
    alert(res.error);
  }
});

btnPause.addEventListener('click', async () => {
  const res = await chrome.runtime.sendMessage({ type: 'PAUSE' });
  if(!res.paused){
    alert(res.error);
  }
});

btnReset.addEventListener('click', async () => {
  const res = await chrome.runtime.sendMessage({ type: 'RESET' });
  if(!res.reset){
    alert(res.error);
  }
});

//===================================
// Controles de tempo do temporizador
//===================================

async function updateTimer(minutes){
  console.log('Updating timer to ', minutes, ' minutes.');
  response = await chrome.runtime.sendMessage({ 
    type: 'TIMER_SET', 
    minutes: minutes, 
  });
}

const timer1 = document.getElementById('timer-1');
const timer2 = document.getElementById('timer-2');
const timer3 = document.getElementById('timer-3');
const timer4 = document.getElementById('timer-4');

timer1.addEventListener('click', () => updateTimer(15));
timer2.addEventListener('click', () => updateTimer(30));
timer3.addEventListener('click', () => updateTimer(45));
timer4.addEventListener('click', () => updateTimer(60));