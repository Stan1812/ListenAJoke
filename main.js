var button = document.getElementById('speak');
var voiceSelect = document.getElementById('voice');
var volumeInput = document.getElementById('volume');
var rateInput = document.getElementById('rate');
var pitchInput = document.getElementById('pitch');
var refresh = document.getElementById('refresh')
var currentPage = 1
var supportMsg = document.getElementById('msg');
var setting = document.getElementById('setting')
var setPage = document.getElementById('page-wrapper')


function addCard(title, content) {
  var main = document.querySelector('#main')
  var card = document.createElement('div')
  card.className = 'card'
  var cardTitle = document.createElement('span')
  var cardContent = document.createElement('div')
  cardTitle.className = 'cardTitle'
  cardContent.className = 'cardContent'
  cardTitle.innerHTML = title
  cardContent.innerHTML = content
  card.appendChild(cardTitle)
  card.appendChild(cardContent)
  card.addEventListener('click', function (e) {
    speak(content); 
  })
  main.appendChild(card)
}

function setCard(res) {
  //alert(result);
  console.log(res)
  if (res.showapi_res_code === 0) {
    let jokes = res.showapi_res_body.contentlist
    for (let i in jokes) {
      addCard(jokes[i].title, jokes[i].text)
    }
  }
}

function getJoke(page) {
  fetch(`https://route.showapi.com/341-1?maxResult=20&page=${page}&showapi_appid=52111&showapi_test_draft=false&showapi_sign=fa09612dd7cf482a97a2f25dcd9b9ccc`).then(res => res.json()).then(data => {
    currentPage += 1
    setCard(data)
  })
}

if ('speechSynthesis' in window) {
  supportMsg.innerHTML = '支持';
} else {
  supportMsg.innerHTML = '该换浏览器了，兄弟';
  supportMsg.classList.add('not-supported');
}
function loadVoices() {
  var voices = speechSynthesis.getVoices();
  voices.forEach(function (voice, i) {
    var option = document.createElement('option');
    option.value = voice.name;
    option.innerHTML = voice.name;
    voiceSelect.appendChild(option);
  });
}
loadVoices();
window.speechSynthesis.onvoiceschanged = function (e) {
  loadVoices();
};

function speak(text) {
  var msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.volume = parseFloat(volumeInput.value);
  msg.rate = parseFloat(rateInput.value);
  msg.pitch = parseFloat(pitchInput.value);
  if (voiceSelect.value) {
    msg.voice = speechSynthesis.getVoices().filter(function (voice) {
      return voice.name == voiceSelect.value;
    })[0];
  }
  window.speechSynthesis.speak(msg);
}

getJoke(currentPage)
// refresh.onclick = getJoke(page)
refresh.addEventListener('click', () => {
  refresh.style.background = '#9f80bf7a';
  setTimeout(() => {
    refresh.style.background = 'white'
  }, 200);
  getJoke(currentPage)
})

setting.addEventListener('click', () => {
  setPage.style.display = 'block'
  const closePage = document.getElementById('close')
  closePage.addEventListener('click', () => {
    setPage.style.display = 'none'
  })
})
