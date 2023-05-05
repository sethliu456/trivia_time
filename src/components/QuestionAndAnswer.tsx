// @ts-nocheck
import React from "react";
import {useState, useRef} from 'react'
import { v4 as uuidv4 } from 'uuid'


function QuestionAndAnswer ({questionItem, currentQuestion, setCurrentQuestion, currentScore}) {
  const [userAnswered, setUserAnswered] = useState(false)

  console.log("TEST render")

  type IndividualQuestionAndAnswer = {
    category: string,
    correct_answer: string,
    difficulty: string,
    incorrect_answers: string[],
    question: string,
    type: string
  }

  const allAnswers = [... questionItem.incorrect_answers, questionItem.correct_answer]

  function handleUserClick (event) {
    const userAnswer = event.target.getAttribute('data-value');
    setUserAnswered(true);

    if (userAnswer === questionItem.correct_answer) {
      currentScore.current ++;
    }
  }

  function updateCurrentQuestion () {
    setCurrentQuestion(currentQuestion + 1)
  }

  return (
    <div>
      <h2>{questionItem.question}</h2>
      {allAnswers.map(answer => <div onClick={userAnswered? null : handleUserClick} key={uuidv4()} style={{border: 'solid'}} data-value={answer}>{answer}</div>)}
      {userAnswered ? <div onClick={updateCurrentQuestion}>Next Question</div> : ""}
    </div>
  );
}

export default QuestionAndAnswer;