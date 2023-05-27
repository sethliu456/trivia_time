// @ts-nocheck
import React from "react";
import { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'


type IndividualQuestionAndAnswer = {
  category: string,
  correct_answer: string,
  difficulty: string,
  incorrect_answers: string[],
  question: string,
  type: string
}

function QuestionAndAnswer({ questionItem, currentQuestion, setCurrentQuestion, currentScore }) {
  const [userAnswered, setUserAnswered] = useState(false)
  const [userSelectedAnswer, setUserSelectedAnswer] = useState(null)
  const [userAnsweredCorrect, setUserAnsweredCorrect] = useState(false)

  const allAnswersTest = [...questionItem.incorrect_answers, questionItem.correct_answer].sort(() => Math.random() - 0.5)
  const [allAnswers, setAllAnswers] = useState(allAnswersTest)


  function handleUserClick(event) {
    const userAnswer = event.target.getAttribute('data-value');
    setUserAnswered(true);
    setUserSelectedAnswer(userAnswer)

    if (userAnswer === questionItem.correct_answer) {
      currentScore.current++;
      setUserAnsweredCorrect(true)
    }
  }

  function updateCurrentQuestion() {
    setCurrentQuestion(currentQuestion + 1)
  }

  return (
    <div>
      <h2>Question {currentQuestion + 1}. {questionItem.question}</h2>
      {userAnswered ? <div>{userAnsweredCorrect ? "Correct!" : "Incorrect!"}</div> : ""}
      {allAnswers.map(answer => <div onClick={userAnswered ? null : handleUserClick} key={uuidv4()} className={`answer ${userAnswered && answer === questionItem.correct_answer ? 'correct' : ''} ${userAnswered && userSelectedAnswer === answer && answer !== questionItem.correct_answer ? 'incorrect' : ''}`} data-value={answer}>{answer}</div>)}
      {userAnswered ? <div onClick={updateCurrentQuestion} className="next-button">Next Question</div> : ""}
    </div>
  );
}

export default QuestionAndAnswer;