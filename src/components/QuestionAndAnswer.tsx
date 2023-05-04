import React from "react";
import {useState} from 'react'
import { v4 as uuidv4 } from 'uuid'


function QuestionAndAnswer ({questionItem, currentQuestion, setCurrentQuestion, currentScore, setCurrentScore}) {
  const [userAnswered, setUserAnswered] = useState(false)

  type IndividualQuestionAndAnswer = {
    category: string,
    correct_answer: string,
    difficulty: string,
    incorrect_answers: string[],
    question: string,
    type: string
  }

  const allAnswers = [... questionItem.incorrect_answers, questionItem.correct_answer]

  function handleUserAnswer (event) {
    // console.log(event.target.getAttribute('data-value'))
    const userAnswer = event.target.getAttribute('data-value')
    if (userAnswer === questionItem.correct_answer && !userAnswered) {
      setCurrentScore(currentScore + 1)
    }
    setUserAnswered(true)
  }

  function updateCurrentQuestion () {
    setCurrentQuestion(currentQuestion + 1)
  }

  return (
    <div>
      <h2>{questionItem.question}</h2>
      {allAnswers.map(answer => <div onClick={handleUserAnswer} key={uuidv4()} data-value={answer}>{answer}</div>)}
      {userAnswered ? <div onClick={updateCurrentQuestion}>Next Question</div> : ""}
    </div>
  );
}

export default QuestionAndAnswer;