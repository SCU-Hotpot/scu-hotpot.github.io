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
    const photosGrid = document.getElementById('photos-grid');
    const seasonSelect = document.getElementById('season-select');
    const typeSelect = document.getElementById('type-select');
    const JSON_PATH = 'source/photos.json';

    let photoData = {};

    async function fetchData() {
        try {
            const response = await fetch(JSON_PATH);
            if (!response.ok) throw new Error(`无法加载图集数据`);
            return await response.json();
        } catch (error) {
            console.error('加载或解析JSON失败:', error);
            photosGrid.innerHTML = `<p style="text-align: center; color: #888;">加载图集失败，请检查 ${JSON_PATH} 文件。</p>`;
            return {};
        }
    }

    function populateSeasonFilter() {
        const seasons = Object.keys(photoData);
        if (seasons.length === 0) return;

        seasonSelect.innerHTML = '';
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season;
            option.textContent = season;
            seasonSelect.appendChild(option);
        });
        
        populateTypeFilter(); // Initial population of type filter
    }

    function populateTypeFilter() {
        const selectedSeason = seasonSelect.value;
        const types = Object.keys(photoData[selectedSeason] || {});
        
        typeSelect.innerHTML = '';
        if (types.length === 0) return;

        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeSelect.appendChild(option);
        });

        renderContent(); // Render content for the new selection
    }

    function renderContent() {
        photosGrid.innerHTML = '';
        const selectedSeason = seasonSelect.value;
        const selectedType = typeSelect.value;

        const typeData = photoData[selectedSeason]?.[selectedType];
        if (!typeData || !typeData.images) {
            photosGrid.innerHTML = '<p style="text-align: center; color: #888;">该分类下暂无图片。</p>';
            return;
        }

        // Render images
        typeData.images.forEach(url => {
            const card = document.createElement('div');
            card.className = 'photo-card';
            const filename = url.substring(url.lastIndexOf('/') + 1);
            card.innerHTML = `
                <img src="${url}" alt="战队图片">
                <a href="${url}" download="${filename}" class="download-btn" title="下载图片">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </a>
            `;
            photosGrid.appendChild(card);
        });

        // Update "More Photos" button
        const moreButtonWrapper = document.getElementById('more-photos-wrapper');
        if (typeData.more_url) {
            moreButtonWrapper.innerHTML = `<a href="${typeData.more_url}" target="_blank" class="more-photos-btn">查看更多照片</a>`;
            moreButtonWrapper.style.display = 'block';
        } else {
            moreButtonWrapper.innerHTML = '';
            moreButtonWrapper.style.display = 'none';
        }
    }
    
    seasonSelect.addEventListener('change', populateTypeFilter);
    typeSelect.addEventListener('change', renderContent);

    // Initial Load
    photoData = await fetchData();
    populateSeasonFilter();
});