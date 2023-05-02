import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'
import '../styles/styles.scss'


function LandingPage() {
  const [count, setCount] = useState(0)
  const [options, setOptions] = useState({})
  const [categoryData, setCategoryData] = useState([])

  const settingOptions = {
    questionCount: {
      min: 1,
      max: 10
    }
    ,
    category: {
      min: 1,
      max: 10
    },
    difficulty: ["easy", "medium", "hard"],
  }

  const questionCountOptions = []
  for (let i = settingOptions.questionCount.min; i < settingOptions.questionCount.max; i++) {
    questionCountOptions.push(i)
  }


  const categoriesURL = 'https://opentdb.com/api_category.php'

  useEffect(() => {
    fetchCategoryData();
  }, []);

  function fetchCategoryData() {
    fetch(categoriesURL)
      .then(response => response.json())
      .then(data => {
        setCategoryData(data.trivia_categories)
      })
      .catch(error => {
        // Handle errors
        console.error(error);
      });
  }

  return (
    <div>
      <h1>Trivia Time!</h1>
      <div>

        <label>How many questions
          <select>
            {questionCountOptions.map(count => <option value={count} key={uuidv4()}> {count}</option>)}
          </select>
        </label>
      </div>
      <div>
        <label>Categories
          <select>
            {categoryData.map(category => <option value={category.id} key={uuidv4()}> {category.name}</option>)}
          </select>
        </label>
      </div>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}

export default LandingPage
