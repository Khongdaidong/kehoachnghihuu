document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', function() {
        const formatToNumber = (str) => Number(str.replace(/,/g, ''));
        const monthlyExpenditures = formatToNumber(document.getElementById('monthly-expenditures').value);
        const monthlyIncome = formatToNumber(document.getElementById('monthly-income').value);
        const savingsRate = parseFloat(document.getElementById('savings-rate').value) / 100;
        const initialBalance = formatToNumber(document.getElementById('initial-balance').value);

        // Updated: Higher inflation target without adjusting growth rates
        const inflationRate = 0.031; // 5% annual inflation

        const depositGrowthRate = 0.057; // Unchanged nominal deposit growth rate
        const investmentGrowthRate = 0.077; // Unchanged nominal investment growth rate

        if (monthlyIncome <= monthlyExpenditures) {
            document.getElementById('result').innerHTML = 'Thu nhập hàng tháng của bạn phải lớn hơn chi tiêu hàng tháng.';
            return;
        }

        let months = 0;
        let totalSavings = initialBalance; // Starting with the initial balance
        let futureInvestmentValue = initialBalance * savingsRate;
        let futureDepositValue = initialBalance * (1 - savingsRate);

        let retirementGoal = (monthlyExpenditures * 12) / 0.04;

        while (totalSavings < retirementGoal) {
            months++;
            const monthlyInvestment = monthlyIncome * savingsRate;
            const monthlyDeposit = monthlyIncome - monthlyExpenditures - monthlyInvestment;

            futureInvestmentValue = (futureInvestmentValue + monthlyInvestment) * (1 + investmentGrowthRate / 12);
            futureDepositValue = (futureDepositValue + monthlyDeposit) * (1 + depositGrowthRate / 12);

            totalSavings = futureInvestmentValue + futureDepositValue;

            if (months % 12 === 0) {
                retirementGoal *= (1 + inflationRate); // Adjusting the retirement goal for the higher inflation rate annually
            }
        }

        const yearsToRetirement = Math.floor(months / 12);
        const remainingMonths = months % 12;

        document.getElementById('result').innerHTML = `
            <p>Mục tiêu hưu trí của bạn dựa trên quy tắc 4% là: ${retirementGoal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}.</p>
            <p>Thời gian cần thiết để đạt mục tiêu hưu trí: ${yearsToRetirement} năm và ${remainingMonths} tháng.</p>
        `;

        updateChart(months, initialBalance, monthlyIncome, savingsRate, monthlyExpenditures, investmentGrowthRate, depositGrowthRate);
    });

    function updateChart(months, initialBalance, monthlyIncome, savingsRate, monthlyExpenditures, investmentGrowthRate, depositGrowthRate) {
        const ctx = document.getElementById('savingsChart').getContext('2d');
        const labels = Array.from({length: months}, (_, i) => `${i + 1}`);
        let data = [];
        let investmentValue = initialBalance * savingsRate;
        let depositValue = initialBalance * (1 - savingsRate);

        for (let i = 0; i < months; i++) {
            const monthlyInvestment = monthlyIncome * savingsRate;
            const monthlyDeposit = monthlyIncome - monthlyExpenditures - monthlyInvestment;

            investmentValue = (investmentValue + monthlyInvestment) * (1 + investmentGrowthRate / 12);
            depositValue = (depositValue + monthlyDeposit) * (1 + depositGrowthRate / 12);

            data.push(investmentValue + depositValue);
        }

        if (window.savingsChart && typeof window.savingsChart.destroy === 'function') {
            window.savingsChart.destroy();
        }

        window.savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Total Savings Over Time',
                    data,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Savings (VND)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time (months)'
                        },
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }
            }
        });
    }
});
