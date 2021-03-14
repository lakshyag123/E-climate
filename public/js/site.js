
let questions = [
  {
    id: 1,
    question: "No place on Earth is colder today than it was 100 years ago.",
    answer: "False",
    options: [
      "True",
      "False",
      "Can't Say",
      "Indeterminable"
    ]
  },
  {
    id: 2,
    question: "Which of the following gases does not trap heat?",
    answer: "Nitrogen",
    options: [
      "Carbon dioxide",
      "Nitrogen",
      "Water Vapour",
      "Methane"
    ]
  },
  {
    id: 3,
    question: "As average global temperature rises,",
    answer: "Average precipitation increases",
    options: [
      "Average precipitation increases",
      "Average precipitation decreases",
      "Average precipitation is unchanged",
      "Can't Say"
    ]
  },
  {
    id: 4,
    question: "Where have some of the strongest and earliest impacts of global warming occurred?",
    answer: "In northern latitudes",
    options: [
      "In tropical region",
      "Distributed equally across the planet",
      "In northern latitudes",
      "None of the above"
    ]
  },
  {
    id: 5,
    question: "Compared to other greenhouse gases, carbon dioxide is the most effective at trapping heat near the Earth's surface.",
    answer: "False",
    options: [
      "True",
      "False",
      "Can't Say",
      "Indeterminable"
    ]
  },
  {
    id: 6,
    question: "Some kinds of pollution in the atmosphere can act to cool the planet by reducing the amount of solar radiation that reaches Earth's surface.",
    answer: "True",
    options: [
      "True",
      "False",
      "Can't Say",
      "Indeterminable"
    ]
  },
  {
    id: 7,
    question: "Earth has been warmer in the past than it is today.",
    answer: "True",
    options: [
      "True",
      "False",
      "Can't Say",
      "Indeterminable"
    ]
  },
  {
    id: 8,
    question: "If you removed the atmosphere's natural greenhouse effect, and everything else stayed the same, Earth's temperature would be:",
    answer: "True",
    options: [
      "10 to 20°F (6 to 11°C) warmer",
      "30 to 40°F (17 to 22°C) warmer",
      "10 to 20°F (6 to 11°C) cooler",
      " 50 to 60°F (28 to 33°C) cooler"
    ]
  },
];

let question_count = 0;
let points = 0;

window.onload = function() {
  show(question_count);

};

function next() {

   
  // if the question is last then redirect to final page
  if (question_count == questions.length - 1) {
    sessionStorage.setItem("time", time);
    clearInterval(mytime);
    location.href = "/end";
  }
  console.log(question_count);

  let user_answer = document.querySelector("li.option.active").innerHTML;
  // check if the answer is right or wrong
  if (user_answer == questions[question_count].answer) {
    points += 10;
    sessionStorage.setItem("points", points);
  }
  console.log(points);

  question_count++;
  show(question_count);
}

function show(count) {
  let question = document.getElementById("questions");
  let [first, second, third, fourth] = questions[count].options;

  question.innerHTML = `
  <h2>Q${count + 1}. ${questions[count].question}</h2>
   <ul class="option_group">
  <li class="option">${first}</li>
  <li class="option">${second}</li>
  <li class="option">${third}</li>
  <li class="option">${fourth}</li>
</ul> 
  `;
  toggleActive();
}

function toggleActive() {
  let option = document.querySelectorAll("li.option");
  for (let i = 0; i < option.length; i++) {
    option[i].onclick = function() {
      for (let i = 0; i < option.length; i++) {
        if (option[i].classList.contains("active")) {
          option[i].classList.remove("active");
        }
      }
      option[i].classList.add("active");
    };
  }
}
