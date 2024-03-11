document.getElementById('calculate').addEventListener('click', function() {
    const formatToNumber = (str) => Number(str.replace(/,/g, ''));

    const monthlyExpenditures = formatToNumber(document.getElementById('monthly-expenditures').value);
    const monthlyIncome = formatToNumber(document.getElementById('monthly-income').value);
    const savingsRate = parseFloat(document.getElementById('savings-rate').value) / 100;
    const initialBalance = formatToNumber(document.getElementById('initial-balance').value); // New initial balance input
    const inflationRate = 0.03; // 3% annual inflation

    const realDepositGrowthRate = 0.05 - inflationRate; // Adjusted for inflation
    const realInvestmentGrowthRate = 0.07 - inflationRate; // Adjusted for inflation

    if (monthlyIncome <= monthlyExpenditures) {
        document.getElementById('result').innerHTML = 'Thu nhập hàng tháng của bạn phải lớn hơn chi tiêu hàng tháng.';
        return;
    }

    let totalSavings = initialBalance; // Start with the initial balance
    let futureInvestmentValue = 0;
    let futureDepositValue = 0;
    let months = 0;

    let retirementGoal = (monthlyExpenditures * 12) / 0.04;

    while (totalSavings < retirementGoal) {
        months++;
        futureInvestmentValue += monthlyIncome * savingsRate;
        futureDepositValue += monthlyIncome - monthlyExpenditures - monthlyIncome * savingsRate;

        futureInvestmentValue *= (1 + realInvestmentGrowthRate / 12);
        futureDepositValue *= (1 + realDepositGrowthRate / 12);

        totalSavings = futureInvestmentValue + futureDepositValue + totalSavings; // Include total savings in the calculation

        if (months % 12 === 0) {
            retirementGoal *= (1 + inflationRate); // Adjust the retirement goal for inflation annually
        }
    }

    const yearsToRetirement = Math.floor(months / 12);
    const remainingMonths = months % 12;

    document.getElementById('result').innerHTML = `
        <p>Mục tiêu hưu trí của bạn dựa trên quy tắc 4% là: ${retirementGoal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}.</p>
        <p>Thời gian cần thiết để đạt mục tiêu hưu trí: ${yearsToRetirement} năm và ${remainingMonths} tháng.</p>
    `;
});
