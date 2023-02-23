// const startBtn = document.createElement("button");
// startBtn.innerHTML = "Start listening";
// const result = document.createElement("div");
// const processing = document.createElement("p");
// document.write("<body><h1>My Siri</h1><p>Give it a try with 'hello', 'how are you', 'what's your name', 'what time is it', 'stop', ... </p></body>");
// document.body.append(startBtn);
// document.body.append(result);
// document.body.append(processing);
//
// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// if (typeof SpeechRecognition === "undefined") {
//   startBtn.remove();
//   result.innerHTML = "<b>Browser does not support Speech API. Please download latest chrome.<b>";
// }
//
// const recognition = new SpeechRecognition();
// recognition.continuous = true;
// recognition.interimResults = true;
//
// function process(speech_text) {
//   return "....";
// }
// recognition.onresult = event => {
//   const last = event.results.length - 1;
//   const res = event.results[last];
//   const text = res[0].transcript;
//   console.log(text)
//   if (res.isFinal) {
//     processing.innerHTML = "processing ....";
//     const response = process(text);
//     const p = document.createElement("p");
//     p.innerHTML = `You said: ${text} </br>Siri said: ${response}`;
//     processing.innerHTML = "";
//     result.appendChild(p);
//     // add text to speech later
//   } else {
//     processing.innerHTML = `listening: ${text}`;
//   }
// }
//
// let listening = false;
// toggleBtn = () => {
//   if (listening) {
//     recognition.stop();
//     startBtn.textContent = "Start listening";
//   } else {
//     recognition.start();
//     startBtn.textContent = "Stop listening";
//   }
//   listening = !listening;
// };
// startBtn.addEventListener("click", toggleBtn);



// document.addEventListener('DOMContentLoaded', speechToEmotion, false);
//
// function speechToEmotion() {
//   const recognition = new webkitSpeechRecognition()
//   recognition.lang = 'en-US'
//   recognition.continuous = true
//
//   recognition.onresult = function(event) {
//     const results = event.results;
//     const transcript = results[results.length-1][0].transcript
//
//     console.log(transcript)
//
//     setEmoji('searching')
//
//     fetch(`/emotion?text=${transcript}`)
//       .then((response) => response.json())
//       .then((result) => {
//         if (result.score > 0) {
//           setEmoji('positive')
//         } else if (result.score < 0) {
//           setEmoji('negative')
//         } else {
//           setEmoji('listening')
//         }
//       })
//       .catch((e) => {
//         console.error('Request error -> ', e)
//         recognition.abort()
//       })
//   }
//
//   recognition.onerror = function(event) {
//     console.error('Recognition error -> ', event.error)
//     setEmoji('error')
//   }
//
//   recognition.onaudiostart = function() {
//     setEmoji('listening')
//   }
//
//   recognition.onend = function() {
//     setEmoji('idle')
//   }
//
//   recognition.start();
//
//   /**
//    * @param {string} type - could be any of the following:
//    *   error|idle|listening|negative|positive|searching
//    */
//   function setEmoji(type) {
//     const emojiElem = document.querySelector('.emoji img')
//     emojiElem.classList = type
//   }
// }

const {
  Porcupine,
  BuiltinKeyword,
}= require("@picovoice/porcupine-node");


const accessKey = "J1NBmfuvinZheYnZfcXK7sitPTFp/5f1Mj9MKwvEwUeTN/OXHbs+fQ=="
let porcupine = new Porcupine(
  accessKey,
  [BuiltinKeyword.GRASSHOPPER, BuiltinKeyword.BUMBLEBEE],
  [0.5, 0.65]
);

module.exports = porcupine

console.log('====')