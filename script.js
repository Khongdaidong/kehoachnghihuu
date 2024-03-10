document.getElementById('calculate').addEventListener('click', function() {
    const monthlyExpenditures = parseFloat(document.getElementById('monthly-expenditures').value);
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value);

    // Calculate retirement goal using the 4% rule (annual expenditure / 0.04)
    const retirementGoal = (monthlyExpenditures * 12) / 0.04;

    // Calculate monthly savings
    const monthlySavings = monthlyIncome - monthlyExpenditures;

    // Check if monthly income is greater than monthly expenditures
    if (monthlySavings <= 0) {
        document.getElementById('result').innerHTML = 'Your monthly income must be greater than your monthly expenditures to start saving for retirement.';
        return;
    }

    // Calculate the number of months to achieve the retirement goal
    const monthsToRetirement = retirementGoal / monthlySavings;

    document.getElementById('result').innerHTML = `Months to achieve retirement goal: ${Math.ceil(monthsToRetirement)}`;
});

