const fs = require('fs');
const data = JSON.parse(fs.readFileSync('reports/newman_report.json', 'utf-8'));

const generateHtmlTable = (executions) => {
  return executions.map((execution) => `
    <tr>
      <td>${execution.item.name}</td>
      <td>${execution.assertions.map(a => a.assertion).join('<br>')}</td>
      <td>${execution.assertions.every(a => a.error === undefined) ? 'Passed' : 'Failed'}</td>
    </tr>
  `).join('');
};

const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newman API Test Report</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      table, th, td {
        border: 1px solid #ddd;
      }
      th, td {
        padding: 10px;
        text-align: left;
      }
      th {
        background-color: #f4f4f4;
      }
      .passed {
        color: green;
      }
      .failed {
        color: red;
      }
    </style>
  </head>
  <body>
    <h1>Newman API Test Report</h1>
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Assertions</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${generateHtmlTable(data.run.executions)}
      </tbody>
    </table>
  </body>
  </html>
`;

fs.writeFileSync('reports/newman_report.html', html);
console.log('HTML report generated: reports/newman_report.html');
