/*
 * Copyright 2025 四川大学火锅战队
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const seasonSelect = document.getElementById('season-select');
    const membersList = document.getElementById('members-list');

    const MANAGEMENT_ROLES = ["队长","副队长", "项目管理", "视觉导航组长", "机械组长", "硬件组长", "电控组长", "运营组长", "质量管理", "顾问"];

    async function fetchAndParseCSV(season) {
        const CSV_PATH = `source/members/${season}/members.csv`;
        try {
            const response = await fetch(CSV_PATH);
            if (!response.ok) {
                throw new Error(`无法加载 ${season} 赛季的成员数据`);
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
            membersList.innerHTML = `<p style="text-align: center; color: #888;">${error.message}</p>`;
            return [];
        }
    }

    function renderMembers(membersData) {
        membersList.innerHTML = '';
        if (membersData.length === 0) return;

        const teacher = membersData.filter(m => m.post === '指导老师');
        const management = membersData.filter(m => MANAGEMENT_ROLES.includes(m.post));
        const regularMembers = membersData.filter(m => m.post !== '指导老师' && !MANAGEMENT_ROLES.includes(m.post));

        const leadership = [...teacher];

        // Render Teacher
        if (leadership.length > 0) {
            const leadershipRow = createMemberRow(leadership, seasonSelect.value);
            membersList.appendChild(leadershipRow);
        }

        // Add separator
        if (leadership.length > 0 && (management.length > 0 || regularMembers.length > 0)) {
            const separator = document.createElement('hr');
            membersList.appendChild(separator);
        }

        // Render Management
        if (management.length > 0) {
            const managementRow = createMemberRow(management, seasonSelect.value);
            membersList.appendChild(managementRow);
        }
        
        // Add separator
        if (management.length > 0 && regularMembers.length > 0) {
            const separator = document.createElement('hr');
            membersList.appendChild(separator);
        }

        // Render Regular Members
        for (let i = 0; i < regularMembers.length; i += 5) {
            const memberChunk = regularMembers.slice(i, i + 5);
            const memberRow = createMemberRow(memberChunk, seasonSelect.value);
            membersList.appendChild(memberRow);
        }
    }

    function createMemberRow(members, season) {
        const row = document.createElement('div');
        row.className = 'member-row';
        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'member-card';
            const photoPath = `source/members/${season}/队员照片/${member.name}.png`;
            
            const isLeadership = member.post === '队长' || member.post === '指导老师' || MANAGEMENT_ROLES.includes(member.post);
            const thirdLineContent = isLeadership ? member.post : member.responsibility;
            const photoClass = member.post === '指导老师' ? 'member-photo teacher-photo' : 'member-photo';

            card.innerHTML = `
                <img src="${photoPath}" alt="${member.name}" class="${photoClass}" onerror="this.src='source/logo/color_logo.png'; this.style.border='none';">
                <h3 class="member-name">${member.name}</h3>
                <p class="member-major">${member.college} - ${member.major}</p>
                <p class="member-responsibility">${thirdLineContent}</p>
            `;
            row.appendChild(card);
        });
        return row;
    }

    async function loadSeasonData() {
        const selectedSeason = seasonSelect.value;
        const membersData = await fetchAndParseCSV(selectedSeason);
        renderMembers(membersData);
    }

    seasonSelect.addEventListener('change', loadSeasonData);

    // Initial load
    loadSeasonData();
});