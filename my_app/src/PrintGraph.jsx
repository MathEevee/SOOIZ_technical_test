import { Doughnut } from "react-chartjs-2";

function DrawGraphPrintAll ({score, maxScore})
{
  /*draw one graph and call class for circle graph and build this object*/
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

  let percentage = 0;
  if (maxTotalScore !== 0)
    percentage = Math.round((totalScore / maxTotalScore) * 100);
  const remaining = 100 - percentage;
  let data = {};
  if (percentage < 0)
  {
    data = {
      labels: "CyberScore",
      datasets: [{
        data: [0, maxTotalScore],
        backgroundColor: ['#FF0000', '#FF0000'],
        hoverBackgroundColor: ['#FF0000', '#FF0000'],
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

function DrawGraphPrint ({score, maxScore, categories}) {
  /*draw all graph and call class for circle graph and build this object*/
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {categories.map((category, index) => {
  
          const currentScore = score[index];
          const maxValue = maxScore[index];
  
          let percentage = 0;
          if (maxValue !== 0)
            percentage = Math.round((currentScore / maxValue) * 100);
          const remaining = 100 - percentage;
          let data = {};
          if (percentage < 0)
          {
            data = {
              labels: [category],
              datasets: [{
                data: [0, maxValue],
                backgroundColor: ['#FF0000', '#FF0000'],
                hoverBackgroundColor: ['#FF0000', '#FF0000'],
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

function addAllScore(response, categories, data) {
  /*calculate the total score for each category*/
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

function PutGraph({ response, categories, data}) {
  /*Print graph for each category*/
  /*Print graph for all categories*/
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

  export default PutGraph;