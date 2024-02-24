const emotions = { angry: 0, disgusted: 0, happy: 0, fearful: 0, sad: 0 };
const buttons = document.querySelectorAll('.emotion-buttons button');
const ctx = document.getElementById('emotionChart').getContext('2d');
let myChart;

buttons.forEach(button => {
    button.addEventListener('click', function() {
        emotions[this.id]++;
        updateLocalStorage();
        updateChart();
        updateCrown();
    });
});

function updateLocalStorage() {
    localStorage.setItem('emotions', JSON.stringify(emotions));
}

function getLocalStorageData() {
    const storedData = localStorage.getItem('emotions');
    if (storedData) {
        Object.assign(emotions, JSON.parse(storedData));
    }
}

function calculatePercentage() {
    const total = Object.values(emotions).reduce((sum, current) => sum + current, 0);
    return Object.values(emotions).map(value => total > 0 ? (value / total * 100).toFixed(2) : 0);
}

function updateChart() {
    const percentages = calculatePercentage(); // 각 감정의 비율을 계산합니다.
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['화남😡', '까칠🤢', '기쁨😄', '소심😨', '슬픔😢'],
            datasets: [{
                label: '오늘 사람들의 감정 상태',
                data: percentages, // 각각의 비율을 데이터로 사용합니다.
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + "%";
                        },
                        color: '#808080' // y축 눈금 색상도 회색으로 조정할 수 있습니다.
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += `${context.raw}%`;
                            return label;
                        }
                    }
                },
                legend: {
                    display: false // 범례 숨김
                },
                title: {
                    display: true,
                    text: '오늘 사람들의 감정 상태',
                    color: '#808080', // 타이틀 색상을 회색으로 설정
                    font: {
                        size: 16
                    }
                }
            }
        }        
    });
}

const canvas = document.getElementById('emotionChart');
canvas.width = 600;
canvas.height = 400;

function updateCrown() {
    // 이전에 추가된 왕관 아이콘 제거
    document.querySelectorAll('.crown').forEach(crown => crown.remove());

    // 모든 버튼의 테두리를 초기화합니다.
    buttons.forEach(button => {
        button.style.border = '2px solid #696969';
    });
    
    const highestEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
    const button = document.getElementById(highestEmotion);
    
    // 왕관 아이콘 HTML 추가
    const crownIcon = document.createElement('span');
    crownIcon.classList.add('crown');
    crownIcon.innerHTML = '👑';
    button.appendChild(crownIcon);
        
    // 채도가 낮은 무지개색 테두리를 추가합니다.
    button.style.border = '3px solid';
    button.style.borderImage = 'linear-gradient(45deg, hsla(0, 50%, 60%, 1), hsla(30, 50%, 60%, 1), hsla(60, 50%, 60%, 1), hsla(90, 50%, 60%, 1), hsla(120, 50%, 60%, 1), hsla(240, 50%, 60%, 1), hsla(300, 50%, 60%, 1)) 1';
}

getLocalStorageData();
updateChart();
updateCrown();
