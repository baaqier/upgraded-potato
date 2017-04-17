var currentSectionNo = 0;
var currenctQuestionNo = 0;
var flattenedQuestionIndex = [];

var sections = [{
  heading: 'Site Rating',
  questions: [
    { question: ' How satisfied were you with our transportation?', rating: 0 },
    { question: 'How easy was it to locate the site?', rating: 0, customOptions: {
      filledStar: '<i class="glyphicon glyphicon-heart"></i>',
      emptyStar: '<i class="glyphicon glyphicon-heart-empty"></i>'
    } },
    { question: 'How would you rate the reception at site?', rating: 0 }
  ]
},
 {
  heading: 'Sales representative',
  questions: [
    { question: 'How friendly was our sales representative?', rating: 0 },
    { question: 'Knowledge of our sales representative', rating: 0 },
    { question: 'How responsive was our sales representative', rating: 0 },
    { question: 'Did your sales person invite you to the Model Apartment', rating: 0 }

  ]
}, {
  heading: 'Project Rating',
  questions: [
    { question: 'Features and amenities', rating: 0 },
    { question: 'Cost sheet and payment process', rating: 0, customOptions: {
      filledStar: '<i class="glyphicon glyphicon-heart"></i>',
      emptyStar: '<i class="glyphicon glyphicon-heart-empty"></i>'
    } },
    { question: 'Financing options', rating: 0 }
  ]
}];

function enableQuestion() {
  flattenedQuestionIndex.forEach(([sectionNo, questionNo]) => {
    let questionBlock = $(`.feedback-questionblock[data-section="${sectionNo}"][data-question="${questionNo}"]`)
    if (sectionNo === currentSectionNo && questionNo === currenctQuestionNo) {
      questionBlock.removeClass('disabled')
    } else {
      questionBlock.addClass('disabled')
    }
  })
}

function enableQuestionOnScroll() {
  const questionHeight = $('.feedback-questionblock').outerHeight()
  const feedbackFormHeight = $('#feedback-form').height();
  $('.feedback-section').first().css('padding-top', feedbackFormHeight/2);
  $('.feedback-section').last().css('padding-bottom', feedbackFormHeight/2);
  $('#feedback-form').on('scroll', function (event) {
    const scrollTop = $('#feedback-form').scrollTop()
    const questionHeight = $(`.feedback-questionblock[data-section="${currentSectionNo}"][data-question="${currenctQuestionNo}"]`).outerHeight()
    const [sectionEnabled, questionEnabled] = flattenedQuestionIndex[Math.floor(scrollTop / questionHeight)]
    if (currentSectionNo !== sectionEnabled || currenctQuestionNo !== questionEnabled) {
      currentSectionNo = sectionEnabled
      currenctQuestionNo = questionEnabled
      enableQuestion()
    }
  })
}

function addQuestion(question) {
  return `
    <div class="feedback-questionblock-question">
      ${question}
    </div>
  `;
}

function addRating(sectionNo, questionNo, rating) {
  return `
    <input class="feedback-questionblock-rating" data-question=${questionNo} data-section=${sectionNo}>
    </input>
  `;
}

var defaultRatingOptions = {
  showClear: false,
  step: 1,
  starCaptions: {
    0.5: 'yo',
    1: 'Very Dissatisfied',
    1.5: 'Good',
    2: 'Somewhat Dissatisfied',
    2.5: 'Two & Half Stars',
    3: 'Neutral',
    3.5: 'Three & Half Stars',
    4: 'Somewhat Satisfied',
    4.5: 'Four & Half Stars',
    5: 'Highly Satisfied'
  }
}

function scrollToRating() {
  let questionBlock = $(`.feedback-questionblock[data-section="${currentSectionNo}"][data-question="${currenctQuestionNo}"]`)
  setTimeout(function () {
    $('#feedback-form').animate({
      scrollTop: $('#feedback-form').scrollTop()
        + questionBlock.offset().top
        - $('#feedback-form').offset().top
        - $('#feedback-form').outerHeight() / 2
        + questionBlock.height() / 2
    }, 200);
  }, 200);
}

function initRating(sectionNo, questionNo) {
  let questionBlock = sections[sectionNo].questions[questionNo]
  let rating = questionBlock.rating
  let ratingInput = $(`.feedback-questionblock-rating[data-section="${sectionNo}"][data-question="${questionNo}"]`)
  const ratingOptions = Object.assign({}, defaultRatingOptions)
  Object.assign(ratingOptions, questionBlock.customOptions)
  ratingInput.rating(ratingOptions)
  ratingInput.rating('update', rating)
  ratingInput.on('rating.change', function(event, value) {
    sections[sectionNo].questions[questionNo].rating = value
    if (questionNo === sections[sectionNo].questions.length - 1 && sectionNo < sections.length - 1) {
      currentSectionNo = sectionNo + 1
      currenctQuestionNo = 0
      scrollToRating()
    } else if (questionNo < sections[sectionNo].questions.length - 1) {
      currentSectionNo = sectionNo
      currenctQuestionNo = questionNo + 1
      scrollToRating()
    }
  })
}

function renderPage() {
  for (let sectionNo = 0; sectionNo < sections.length; sectionNo++) {
    $('#feedback-form').append(`
      <div class="feedback-section" data-section=${sectionNo}>
        <div class="feedback-section-heading">
          ${sections[sectionNo].heading}
        </div>
        <div class="feedback-section-body" data-section=${sectionNo}>
        </div>
      </div>
    `)
    for(let questionNo = 0; questionNo < sections[sectionNo].questions.length; questionNo++) {
      const question = sections[sectionNo].questions[questionNo]
      flattenedQuestionIndex.push([sectionNo, questionNo])
      $(`.feedback-section-body[data-section="${sectionNo}"]`).append(`
        <div class="feedback-questionblock" data-section=${sectionNo} data-question=${questionNo}>
          <div class="feedback-questionblock-body">
            ${addQuestion(question.question)}
            ${addRating(sectionNo, questionNo)}
          </div>
        </div>
      `)
      initRating(sectionNo, questionNo)
    }
  }
}

function init() {
  renderPage()
  scrollToRating()
  enableQuestionOnScroll()
  enableQuestion()
}

$(document).ready(function() {
  init()
  $('.buttons .submit').on('click', function() {
    // Send to backend
    console.log(sections)
  })
})
