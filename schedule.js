document.addEventListener('DOMContentLoaded', async () => {
    const scheduleList = document.getElementById('schedule-list');
    const yearSelect = document.getElementById('year-select');
    const opponentSearch = document.getElementById('opponent-search');
    const opponentList = document.getElementById('opponent-list');
    const CSV_PATH = './source/schedule.csv';

    let allMatches = []; // Store all match data
    let currentFilters = {
        year: 'all',
        opponent: ''
    };

    async function fetchAndParseCSV() {
        try {
            const response = await fetch(CSV_PATH);
            if (!response.ok) {
                throw new Error(`无法加载赛程数据: ${response.statusText}`);
            }
            const csvText = await response.text();
            
            const rows = csvText.trim().split('\n');
            const headers = rows.shift().split(',');
            const data = rows.map(row => {
                const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                return headers.reduce((obj, header, i) => {
                    let value = values[i] ? values[i].trim() : '';
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.substring(1, value.length - 1);
                    }
                    obj[header.trim()] = value;
                    return obj;
                }, {});
            });
            return data;
        } catch (error) {
            console.error('加载或解析CSV失败:', error);
            scheduleList.innerHTML = '<p style="text-align: center; color: #888;">加载赛程失败，请稍后再试。</p>';
            return [];
        }
    }

    function populateOpponentDatalist(scheduleData) {
        const opponents = new Set();
        scheduleData.forEach(match => {
            if (match.red_team_name !== '四川大学 火锅') {
                opponents.add(match.red_team_name);
            }
            if (match.blue_team_name !== '四川大学 火锅') {
                opponents.add(match.blue_team_name);
            }
        });

        opponentList.innerHTML = '';
        opponents.forEach(opponent => {
            const option = document.createElement('option');
            option.value = opponent;
            opponentList.appendChild(option);
        });
    }

    function renderSchedule() {
        scheduleList.innerHTML = ''; 

        const filteredData = allMatches.filter(match => {
            const yearMatch = currentFilters.year === 'all' || match.year === currentFilters.year;
            const opponentMatch = !currentFilters.opponent || 
                                  match.red_team_name.includes(currentFilters.opponent) || 
                                  match.blue_team_name.includes(currentFilters.opponent);
            return yearMatch && opponentMatch;
        });

        if (filteredData.length === 0) {
            scheduleList.innerHTML = '<p style="text-align: center; color: #888;">暂无符合条件的赛程信息。</p>';
            return;
        }

        // Sort schedule by match time in descending order (most recent first)
        filteredData.sort((a, b) => {
            const dateA = new Date(a.match_time.replace('年', '-').replace('月', '-').replace('日', ''));
            const dateB = new Date(b.match_time.replace('年', '-').replace('月', '-').replace('日', ''));
            return dateB - dateA;
        });

        filteredData.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';

            matchCard.innerHTML = `
                <div class="match-header">
                    <h2 class="match-title">${match.year}${match.match_title}</h2>
                    <p class="match-time-link">
                        ${match.match_time}
                        <a href="${match.match_link}" target="_blank">比赛回放</a>
                    </p>
                </div>
                <div class="match-details">
                    <div class="team red">
                        <img src="${match.red_logo_path}" alt="${match.red_team_name}" class="team-logo">
                        <span>${match.red_team_name}</span>
                    </div>
                    <div class="match-score">
                        <span class="score-red">${match.red_score}</span>
                        <span class="score-colon">:</span>
                        <span class="score-blue">${match.blue_score}</span>
                    </div>
                    <div class="team blue">
                        <span>${match.blue_team_name}</span>
                        <img src="${match.blue_logo_path}" alt="${match.blue_team_name}" class="team-logo">
                    </div>
                </div>
            `;
            scheduleList.appendChild(matchCard);
        });
    }

    yearSelect.addEventListener('change', (e) => {
        currentFilters.year = e.target.value;
        renderSchedule();
    });

    opponentSearch.addEventListener('input', (e) => {
        currentFilters.opponent = e.target.value;
        renderSchedule();
    });

    allMatches = await fetchAndParseCSV();
    populateOpponentDatalist(allMatches);
    renderSchedule();
});