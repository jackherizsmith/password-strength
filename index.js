const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");
console.log(inputs)

const nameInput = form.querySelector("#name");
const nameRegex = /^[a-zA-Z-.' ]{2,}$/;
let nameGood = false;

const emailInput = form.querySelector("#email");
const emailRegex = (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
let emailGood = false;

const passwordInput = form.querySelector("#password");
const passHack = document.querySelector("#passwordTime");
let passGood = false;
let allInputsValid = [nameGood, emailGood, passGood];

passHack.textContent = "Your password should take an experienced hacker longer than 4 months to guess."

const errorMessage = {
  name: "Check your name doesn't contain odd characters",
  email: "This needs to include an @ and domain",
  password: "Try adding an unusual word",
}

form.setAttribute("novalidate", "");

form.addEventListener("submit", event => {
  allInputsValid = [nameGood, emailGood, passGood];
  if (allInputsValid.some(input => !input)) {
    event.preventDefault();

    let invalidInputs = allInputsValid.map((e, i) => e === false ? i : '').filter(String)
    for (let i = 0; i < invalidInputs.length; i ++) {
        let input = inputs[invalidInputs[i]], inputId = input.id;
        input.nextElementSibling.style.color = "hsl(0, 100%, 45%)";
        input.nextElementSibling.textContent = "✗";
        document.getElementById(inputId).parentElement.nextElementSibling.textContent = errorMessage[input.id];
     }
  }
});

function tick(input, good){
  input.parentElement.nextElementSibling.textContent = '';
  if (good) {
    input.nextElementSibling.style.color = "hsl(106, 100%, 30%)";
    input.nextElementSibling.textContent = "✔";
  } else {
    input.nextElementSibling.textContent = ""
  }
}

nameInput.addEventListener("input", () => {
  nameGood = nameRegex.test(nameInput.value);
  tick(nameInput, nameGood);
});


emailInput.addEventListener("input", () => {
  emailGood = emailRegex.test(emailInput.value);
  tick(emailInput, emailGood);
});


passwordInput.addEventListener("input", event => {
  let userInputs = nameInput.value.split(/[^0-9a-z]/gi);
  userInputs = userInputs.concat(emailInput.value.split(/[^0-9a-z]/gi));
  let result = zxcvbn(passwordInput.value, user_inputs = userInputs);

  passStrength(result.guesses_log10);
  
  passHack.textContent =
  (passwordInput.value.length > 0) ? 
    "It could take " + result.crack_times_display.online_no_throttling_10_per_second + " to guess this password." :
    "Your password should take an experienced hacker longer than 4 months to guess.";
  
  passGood = (result.score >= 3);
  tick(passwordInput, passGood);
})

function passStrength(log) {
    const elem = document.querySelector(".password__score");
    let width = log * 10; // 10^10 is very strong 4/4 therefore maximum width is 10 * 10 = 100 
    if (width > 100) {width = 100;}
    elem.style.backgroundColor = 
    width < 30 ? "hsl(0, 100%, 70%)" :
    `hsl(${(width-30) * 1.5}, 100%, ${80 - (width/2)}%)`;

    elem.style.width = width + "%";
}