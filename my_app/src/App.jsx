import './App.css';
import React, { useState } from 'react';
import questionsData from './data/questions.json';
import { Chart, ArcElement } from "chart.js";
import PutGraph from './PrintGraph';
import Footer from './Footer';

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
  /*Select a response and put questions*/ 
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

function PutQuestionNotAnswered({ response, data}) {
  /*Search a question if doesn't have response*/
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
  /*Check and print ameliorations*/
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

  /*Create all questions with JSON*/
  /*Put ameliorations*/
  /*Put graph*/
  return (
    <div>
    <div className="App">
      <h1>Formulaire d'évaluation du niveau de cybersécurité au sein de l'entreprise</h1>
      <DisplayQuestion selectedResponses={selectedResponses}
                        onSelect={handleSelect} />
      <PutAmelioration response={selectedResponses}
                categories={questionsData.categories}
                data={questionsData.data}/>
      <PutGraph response={selectedResponses}
                categories={questionsData.categories}
                data={questionsData.data}/>
      </div>
    <Footer />
    </div>
  );
}


export default App;
