document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', function() {
        const formatToNumber = (str) => str ? Number(str.replace(/,/g, '')) : 0;
        const formatNumberWithSeparators = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        const monthlyExpenditures = formatToNumber(document.getElementById('monthly-expenditures').value);
        const monthlyIncome = formatToNumber(document.getElementById('monthly-income').value);
        const savingsRate = parseFloat(document.getElementById('savings-rate').value) / 100;
        const initialBalance = formatToNumber(document.getElementById('initial-balance').value);

        const oneOffAmountInput = document.getElementById('one-off-amount').value;
        const oneOffAmount = oneOffAmountInput ? formatToNumber(oneOffAmountInput) : 0;
        // Format the one-off amount for display
        document.getElementById('one-off-amount').value = formatNumberWithSeparators(oneOffAmount);
        
        const oneOffMonthInput = document.getElementById('one-off-month').value;
        const oneOffMonth = oneOffMonthInput ? parseInt(oneOffMonthInput) : 0;
        if (monthlyIncome <= monthlyExpenditures) {
            document.getElementById('result').innerHTML = 'Thu nhập hàng tháng của bạn phải lớn hơn chi tiêu hàng tháng.';
            return;
        }

        if (oneOffAmount && (isNaN(oneOffMonth) || oneOffMonth < 1)) {
            alert("Please enter a valid month (1 or higher) for the one-off transaction.");
            return;
        }

        const inflationRate = 0.031;
        const depositGrowthRate = 0.057;
        const investmentGrowthRate = 0.077;

        let months = 0;
        let totalSavings = initialBalance;
        let retirementGoal = (monthlyExpenditures * 12) / 0.04;

        while (totalSavings < retirementGoal) {
            months++;
            let monthlySavings = (monthlyIncome - monthlyExpenditures) * savingsRate;
            let monthlyNonInvestmentSavings = (monthlyIncome - monthlyExpenditures - monthlySavings);

            totalSavings *= (1 + (savingsRate * investmentGrowthRate + (1 - savingsRate) * depositGrowthRate) / 12);

            totalSavings += monthlySavings + monthlyNonInvestmentSavings;

            if (months === oneOffMonth) {
                totalSavings -= oneOffAmount;
                if (totalSavings < 0) totalSavings = 0;
            }

            if (months % 12 === 0) {
                retirementGoal *= (1 + inflationRate);
            }
        }

        const yearsToRetirement = Math.floor(months / 12);
        const remainingMonths = months % 12;

        document.getElementById('result').innerHTML = `
            <p>Mục tiêu hưu trí của bạn dựa trên quy tắc 4% là: ${retirementGoal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}.</p>
            <p>Thời gian cần thiết để đạt mục tiêu hưu trí: ${yearsToRetirement} năm và ${remainingMonths} tháng.</p>
        `;
        // Existing code to calculate retirement savings...

        // Pass the oneOffAmount and oneOffMonth to the updateChart function
        updateChart(months, initialBalance, monthlyIncome, savingsRate, monthlyExpenditures, investmentGrowthRate, depositGrowthRate, oneOffAmount, oneOffMonth);

    });

    function updateChart(months, initialBalance, monthlyIncome, savingsRate, monthlyExpenditures, investmentGrowthRate, depositGrowthRate, oneOffAmount, oneOffMonth) {
        const ctx = document.getElementById('savingsChart').getContext('2d');
        const labels = Array.from({length: months}, (_, i) => `${i + 1}`);
        let data = [];
        let totalSavings = initialBalance;
    
        for (let i = 0; i < months; i++) {
            let monthlySavings = (monthlyIncome - monthlyExpenditures) * savingsRate;
            let monthlyNonInvestmentSavings = (monthlyIncome - monthlyExpenditures - monthlySavings);
    
            totalSavings *= (1 + (savingsRate * investmentGrowthRate + (1 - savingsRate) * depositGrowthRate) / 12);
            totalSavings += monthlySavings + monthlyNonInvestmentSavings;
    
            // Subtract the one-off transaction in the specified month
            if (i + 1 === oneOffMonth) {
                totalSavings -= oneOffAmount;
                if (totalSavings < 0) totalSavings = 0;
            }
    
            data.push(totalSavings);
        }
    
        if (window.savingsChart && typeof window.savingsChart.destroy === 'function') {
            window.savingsChart.destroy();
        }
    
        window.savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Tổng số tiền để dành theo thời gian',
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
                            text: 'Tổng số tiền để dành (VND)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Số tháng'
                        },
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }
            }
        });
    }
    
});
