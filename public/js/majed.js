$(document).ready(function() {
  $("#datum").datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: function(dateText) {
          $.ajax({
              type: 'POST',
              url: '/getRowByDate',
              data: JSON.stringify({ datum: dateText }),
              contentType: 'application/json',
              success: function(response) {
                  const rowData = response.rowData;
                  $('#datum').val(rowData[0]);
                  $('#dag').val(rowData[1]);
                  $('#UpdOb1').val(rowData[2]);
                  $('#UpdOb2').val(rowData[3]);
                  $('#UpdOb3').val(rowData[4]);
                  $('#UpdOb4').val(rowData[5]);
                  $('#Updavv').val(rowData[6]);
              },
              error: function(error) {
                  alert('Error fetching data: ' + JSON.stringify(error));
              }
          });
      }
  });

  $('#updateButton').click(function() {
      const formData = {
          datum: $('#datum').val(),
          values: [
              $('#datum').val(),
              $('#dag').val(),
              $('#UpdOb1').val(),
              $('#UpdOb2').val(),
              $('#UpdOb3').val(),
              $('#UpdOb4').val(),
              $('#Updavv').val()
          ]
      };

      $.ajax({
          type: 'POST',
          url: '/update',
          data: JSON.stringify(formData),
          contentType: 'application/json',
          success: function(response) {
              alert('Update successful!');
          },
          error: function(error) {
              alert('Error updating data: ' + JSON.stringify(error));
          }
      });
  });

  $('#myFormrot').submit(function(event) {
      event.preventDefault();

      const formData = {
          Mån: $('#day1').val(),
          Tis: $('#day2').val(),
          Ons: $('#day3').val(),
          Tors: $('#day4').val(),
          Fre: $('#day5').val(),
          Lör: $('#day6').val(),
          Sön: $('#day7').val(),
          Schema: $('#sch1').val()
      };

      $.ajax({
          type: 'POST',
          url: '/addToSheet2',
          data: JSON.stringify(formData),
          contentType: 'application/json',
          success: function(response) {
              alert('Record added successfully!');
          },
          error: function(error) {
              alert('Error adding record: ' + JSON.stringify(error));
          }
      });
  });
});

    var options = ["KPV", "RP", "PALL", "AREA1", "HISS","TRUCK","SPECE1","SPECE2","GS","UPPDRAG","KRAN","WELL","STC","CMS","LASTING","Ledigt","Sjuk", "Semester" 
];

// Function to populate select inputs
function populateSelectInputs() {
  for (var i = 1; i <= 7; i++) {
    var select = document.getElementById("day" + i);
    for (var j = 0; j < options.length; j++) {
      var option = document.createElement("option");
      option.value = options[j];
      option.text = options[j];
      select.appendChild(option);
    }
  }
}

// Call the function to populate select inputs
populateSelectInputs();
 // Your API KEY abowaleed and 
 const API_KEY = "AIzaSyC1q52MPosQGnHNIsnp9Uhlwhbx1sKz0Vs";
        
        function displayData(response) {
            let tableHead = "";
            let tableBody = "";
    
            // Separate header from data rows
            const [header, ...rows] = response.result.values;
    
            // Filter rows where the value in column B (index 1) is greater than 0
            const filteredRows = rows.filter(row => parseFloat(row[1]) > 0);
    
            // Sort the filtered rows in descending order based on the value in column B (index 1)
            const sortedRows = filteredRows.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
    
            // Add table header
            tableHead += "<tr>";
            header.forEach((val) => (tableHead += "<th>" + val + "</th>"));
            tableHead += "</tr>";
    
            // Add table rows
            sortedRows.forEach((row) => {
                tableBody += "<tr>";
                row.forEach((val) => (tableBody += "<td>" + val + "</td>"));
                tableBody += "</tr>";
            });
    
            document.getElementById("data-table-head").innerHTML = tableHead;
            document.getElementById("data-table-body").innerHTML = tableBody;
        }
    
        function displayResult(response) {
            let tableHead = "";
            let tableBody = "";
    
            response.result.values.forEach((row, index) => {
                if (index === 0) {
                    tableHead += "<tr>";
                    row.forEach((val) => (tableHead += "<th>" + val + "</th>"));
                    tableHead += "</tr>";
                } else {
                    tableBody += "<tr>";
                    row.forEach((val) => (tableBody += "<td>" + val + "</td>"));
                    tableBody += "</tr>";
                }
            });
    
            document.getElementById("result-table-head").innerHTML = tableHead;
            document.getElementById("result-table-body").innerHTML = tableBody;
        }
    
        function displayOb(response) {
            let tableHead = "";
            let tableBody = "";
    
            response.result.values.forEach((row, index) => {
                if (index === 0) {
                    tableHead += "<tr>";
                    row.forEach((val) => (tableHead += "<th>" + val + "</th>"));
                    tableHead += "</tr>";
                } else {
                    tableBody += "<tr>";
                    row.forEach((val) => (tableBody += "<td>" + val + "</td>"));
                    tableBody += "</tr>";
                }
            });
    
            document.getElementById("ob-table-head").innerHTML = tableHead;
            document.getElementById("ob-table-body").innerHTML = tableBody;
        }
    
        function loadData(spreadsheetId, sheetName, range, displayFunction) {
            const fullRange = `${sheetName}!${range}`;
            getPublicValues({ spreadsheetId, range: fullRange }, displayFunction);
        }
    
        window.addEventListener("load", (e) => {
            initOAuthClient({ apiKey: API_KEY });
        });
    
        document.addEventListener("gapi-loaded", (e) => {
            loadData("1patB3L1uPYwRX_Jn6dUSE9h65NbfEfLcDv8nLJEfA1s", "Sheet3", "A:C", displayData);
            loadData("1patB3L1uPYwRX_Jn6dUSE9h65NbfEfLcDv8nLJEfA1s", "Sheet2", "A:I", displayResult);
            loadData("1patB3L1uPYwRX_Jn6dUSE9h65NbfEfLcDv8nLJEfA1s", "Sheet4", "A:F", displayOb);
        });
        $('.container > div').hide();
                    $('#navbar a').click(function (e) {
                        $('.container > div').hide();
                        $(this.hash).show();

                        e.preventDefault(); //to prevent scrolling
                        $('#myFormrot')[0].reset();
                        $('#myFormob')[0].reset();

                    });
                   