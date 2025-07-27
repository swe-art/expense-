
  let entries = JSON.parse(localStorage.getItem('budgetEntries')) || [];

  function saveEntries() {
    localStorage.setItem('budgetEntries', JSON.stringify(entries));
  }

  function addEntry() {
    const type = $('#type').val();
    const desc = $('#description').val();
    const value = parseFloat($('#value').val());
    const date = $('#date').val();

    if (!desc || !value || !date) {
      alert("Please fill all fields!");
      return;
    }

    entries.push({ type, description: desc, value, date });
    saveEntries();
    $('#description').val('');
    $('#value').val('');
    $('#date').val('');
    renderEntries();
  }

  function renderEntries() {
    const list = $('#entryList');
    list.empty();
    let total = 0;
    let savings = 0, expenses = 0, investments = 0;

    entries.forEach(entry => {
      const colorClass = entry.type.toLowerCase();
      const sign = entry.type === "Expenses" ? "-" : "+";
      const amount = entry.value;

      if (entry.type === "Savings") savings += amount;
      else if (entry.type === "Expenses") expenses += amount;
      else investments += amount;

      total += entry.type === "Expenses" ? -amount : amount;

      list.append(`
        <div class="entry">
          <div>${entry.date}</div>
          <div>${entry.description}</div>
          <div class="${colorClass}">${sign}$${amount.toFixed(2)}</div>
        </div>
      `);
    });

    $('#budgetAmount').text(`$${total.toFixed(2)}`);
    updateChart(savings, expenses, investments);
  }

  let chart;

  function updateChart(s, e, i) {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    const data = {
      labels: ['Savings', 'Expenses', 'Investments'],
      datasets: [{
        data: [s, e, i],
        backgroundColor: ['green', 'red', 'orange']
      }]
    };

    const config = {
      type: 'doughnut',
      data: data,
      options: {
        cutout: '70%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }
    };

    if (chart) chart.destroy();
    chart = new Chart(ctx, config);
  }

  $(document).ready(function () {
    renderEntries();
  });
