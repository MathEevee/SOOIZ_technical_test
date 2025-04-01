import './App.css';
import React, { useState } from 'react';
import questionsData from './data/questions.json';
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";

Chart.register(ArcElement);


function Responses({ responses, questionId, selectedResponse, onSelect }) {
  /*create radio's button to select your response and call function to change response*/
  return (
    <div>
      {responses.map((res, index) => {
        const uniqueId = `choice-${questionId}-${index}`;
        return (
          <div key={uniqueId}>
            <input
              type="radio"
              id={uniqueId}
              value={res.response}
              checked={selectedResponse === res.response}
              onChange={() => onSelect(questionId, res.response)}
            />
            <label htmlFor={uniqueId}>{res.response}</label>
          </div>
        );
      })}
    </div>
  );
}

function Question({ question, questionId, selectedResponse, onSelect }) {
  /*Put a questions and create one ID and call another function to create responses*/
  return (
    <div>
      <h2>{question.description}</h2>
      <Responses 
        responses={question.responses} 
        questionId={questionId} 
        selectedResponse={selectedResponse} 
        onSelect={onSelect} 
      />
    </div>
  );
}

function DisplayQuestion({ selectedResponses, onSelect }) {
  /*Select a response*/ 
  return (
    <div>
      {questionsData.data.map((question, index) => (
        <Question 
          key={index} 
          question={question} 
          questionId={index} 
          selectedResponse={selectedResponses[index]}
          onSelect={onSelect} 
        />
      ))}
    </div>
  );
}

function addAllScore(response, categories, data) {
  return categories.map((category) => {
    let categoryTotal = 0;
    const keys = Object.keys(response);

    keys.forEach((questionIndex) => {
      const questionResponse = response[questionIndex];
      const question = data[questionIndex];

      const selectedResponse = question.responses.find(r => r.response === questionResponse);
      if (selectedResponse && selectedResponse.points)
      {
        const categoryPoints = selectedResponse.points.find(p => p.category === category);
        if (categoryPoints) {
          categoryTotal += categoryPoints.value;
        }
      }
    });

    return categoryTotal;
  });
}

function DrawGraphPrint ({score, maxScore, categories}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
      {categories.map((category, index) => {
        const currentScore = score[index];
        console.log("currentScore",currentScore)
        const maxValue = maxScore[index];
        console.log("maxValue",maxValue)

        let percentage = currentScore;
        if (maxValue !== 0)
          percentage = Math.round((currentScore / maxValue) * 100);
        const remaining = 100 - percentage;
        console.log("percentage",percentage)
        let data = {};
        if (percentage < 0)
        {
          data = {
            labels: [category],
            datasets: [{
              data: [percentage, maxValue],
              backgroundColor: ['#FF0000', '#ddd'],
              hoverBackgroundColor: ['#FF0000', '#ccc'],
            }]
          };
        }
        else
        {
          data = {
            labels: [category],
            datasets: [{
              data: [percentage, remaining],
              backgroundColor: ['#4CAF50', '#ddd'],
              hoverBackgroundColor: ['#45a049', '#ccc'],
            }]
          };
        }

        const options = {
          cutout: '50%',
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.raw}%`;
                }
              }
            }
          }
        };

        return (
          <div key={category} style={{ width: '200px', textAlign: 'center' }}>
            <h3>{category}</h3>
            <div style={{ position: 'relative' }}>
              <Doughnut data={data} options={options} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {percentage}%
              </div>
            </div>
            <p>Score: {currentScore}/{maxValue}</p>
          </div>
        );
      })}
    </div>
  );
}

function DrawGraphPrintAll ({score, maxScore})
{
  let totalScore = 0;
  let maxTotalScore = 0;
  for (let i = 0; i < score.length; i++)
  {
    totalScore += score[i];
  }
  for (let i = 0; i < maxScore.length; i++)
  {
    maxTotalScore += maxScore[i];
  }
  const percentage = (Math.round((totalScore / maxTotalScore) * 100));
  const remaining = 100 - percentage;
  let data = {};
  if (percentage < 0)
  {
    data = {
      labels: "CyberScore",
      datasets: [{
        data: [percentage, maxScore],
        backgroundColor: ['#FF0000', '#ddd'],
        hoverBackgroundColor: ['#FF0000', '#ccc'],
      }]
    };
  }
  else
  {
    data = {
      labels: "CyberScore",
      datasets: [{
        data: [percentage, remaining],
        backgroundColor: ['#4CAF50', '#ddd'],
        hoverBackgroundColor: ['#45a049', '#ccc'],
      }]
    };
  }

  const options = {
    cutout: '50%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.raw}%`;
          }
        }
      }
    }
  };

  return (

    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          <div style={{ width: '200px', textAlign: 'center' }}>
            <h3>CyberScore</h3>
            <div style={{ position: 'relative' }}>
              <Doughnut data={data} options={options} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {percentage}%
              </div>
            </div>
            <p>Score: {totalScore}/{maxTotalScore}</p>
          </div>
          </div>
      )
}

function PutGraph({ response, categories, data}) {
  const tabMaxValue = categories.map((category) => {
    let res = 0;
    let tmp = 0;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].responses.length; j++) 
      {
        for (let k = 0; k < data[i].responses[j].points.length; k++)
        {
          if (data[i].responses[j].points[k].value > tmp && data[i].responses[j].points[k].category === category)
            tmp = data[i].responses[j].points[k].value;
        }
      }
      res = res + tmp;
      tmp = 0;
    }
    return res;
  });
  const score = addAllScore(response, categories, data);

  return (
    <div>
    <DrawGraphPrint score={score} maxScore={tabMaxValue} categories={categories}/>
    <DrawGraphPrintAll score={score} maxScore={tabMaxValue}/>
    </div>
  )
}


function PutQuestionNotAnswered({ response, data}) {
  return (data.map((question, index) => {
    if (response[index] === undefined)
    {
      return (
        <div key={index}>
          <h3>Merci de répondre à la question : {index + 1}</h3>
          <h4>{question.description}</h4>
        </div>
      )
    }
    return(
    <div key={index}>
    </div>
  )
  }
  ))
}

function PrintCategories({categories}) {
  return (
    <thead>
      <tr>
      <th></th>
        {categories.map((category, index) => (
          <th key={index + 1}>{category}</th>
        ))}
      <th>Améliorations</th>
      </tr>
    </thead>
  )
}

function PutResponseScore({ category, question, response, categories}) {
  for (let i = 0; i < question.responses.length; i++) {
    const value = question.responses.find((r) => r.response === response).points.find((p) => p.category === category);
    const indexCat = categories.indexOf(category);
    if (value) {
      return (
        <div key={indexCat}>{value.value}</div>
      )
    }
    else {
      return (
        <div key={indexCat}>X</div>
      )
    }
  }
}

function CheckAmeliorations({ question, response, categories }) {
  const amelioration = question.responses.find((r) => r.response === response).showAmelioration;
  if (amelioration) {
    return (
    question.amelioration.map((amelioration, index) => (
       <h5 key={index}>{amelioration}</h5>
     ))
    )
  }
}

function PrintQuestions({ question, categories, response }) {
  return (
    <tbody>
      {question.map((q, index) => (
        <tr key={index}>
          <td>{q.description}</td>
          {categories.map((category, catIndex) => (
            <td key={catIndex}>
              <PutResponseScore category={category} question={q} response={response[index]} categories={categories}/>
            </td>
          ))}
          <td><CheckAmeliorations question={q} response={response[index]} categories={categories}/></td>
        </tr>
      ))}
    </tbody>
  );
}



function PutTabAmeliorations({ response, categories, data}) {
  /*make tab categories*/ 
  return(
    <table>
      <PrintCategories categories={categories}/>
      <PrintQuestions question={data}
                      categories={categories}
                      response={response}/>
    </table>
  )
}


function PutAmelioration({ response, categories ,data}) {
  const nbrOfResponse = Object.keys(response).length;
  const nbrQuestion = questionsData.data.length;
  if (nbrQuestion !== nbrOfResponse)
  {
    return (
      <div>
      <PutQuestionNotAnswered response={response}
                              data={data}/>
      </div>
    )
  }
  else
  {
    return (
      <div>
          <PutTabAmeliorations response={response}
                            categories={categories}
                            data={data}/>
      </div>
    )
  }
  // console.log("categories",categories);
  // console.log("data",data);
}


function App() {
  const [selectedResponses, setSelectedResponses] = useState({});
 
  /*recording of responses*/
  const handleSelect = (questionId, response) => {
    setSelectedResponses((prev) => ({
      ...prev,
      [questionId]: response,
    }));
  };

  // console.log(selectedResponses);
  /*Create all questions with JSON*/
  /*Put ameliorations*/
  /*Put graph*/
  return (
    <div className="App">
      <DisplayQuestion selectedResponses={selectedResponses}
                        onSelect={handleSelect} />
      <PutAmelioration response={selectedResponses}
                categories={questionsData.categories}
                data={questionsData.data}/>
      <PutGraph response={selectedResponses}
                categories={questionsData.categories}
                data={questionsData.data}/>
    </div>
  );
}

// console.log(questionsData);

export default App;
