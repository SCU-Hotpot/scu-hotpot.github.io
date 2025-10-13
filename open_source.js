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
document.addEventListener('DOMContentLoaded', () => {
    // --- 用户配置区域 ---
    // 1. 主要的GitHub组织名
    const GITHUB_ORG = 'SCU-Hotpot';

    // 2. 需要额外展示的个人仓库列表
    //    请在此处添加或修改，格式为 '用户名/仓库名'
    const INDIVIDUAL_REPOS = [
        'PolarisXQ/SCURM_SentryNavigation',
        'PolarisXQ/SCURM_Nav_Tutorial',
        'KangweiYang/dartRack_upper'
        // 在这里添加更多仓库...
    ];
    // --- 配置结束 ---

    const projectsContainer = document.getElementById('projects-list');
    const searchInput = document.getElementById('repo-search-input');
    let allRepos = []; // 用于缓存所有获取到的仓库数据

    const languageColors = {
        'Python': '#3572A5', 'C++': '#f34b7d', 'HTML': '#e34c26', 'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489', 'Vue': '#4FC08D', 'C': '#555555', 'Shell': '#89e051',
        'CMake': '#DA3434', 'Markdown': '#083fa1', 'default': '#cccccc'
    };

    function renderRepos(reposToRender) {
        projectsContainer.innerHTML = '';
        if (reposToRender.length === 0) {
            projectsContainer.innerHTML = '<p style="text-align: center; color: #888;">没有找到匹配的仓库。</p>';
            return;
        }

        reposToRender.forEach(repo => {
            const langColor = languageColors[repo.language] || languageColors['default'];
            const description = repo.description || '暂无描述。';

            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-repo">
                    <a href="${repo.html_url}" target="_blank">${repo.full_name}</a>
                </div>
                <p class="project-description">${description}</p>
                <div class="project-meta">
                    <div class="meta-item">
                        <span class="language-color" style="background-color: ${langColor};"></span>
                        <span>${repo.language || 'N/A'}</span>
                    </div>
                    <div class="meta-item">
                        <span>⭐</span>
                        <span>${repo.stargazers_count}</span>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(card);
        });
    }

    function filterRepos() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredRepos = allRepos.filter(repo => {
            const repoName = repo.full_name.toLowerCase();
            const repoDesc = (repo.description || '').toLowerCase();
            return repoName.includes(searchTerm) || repoDesc.includes(searchTerm);
        });
        renderRepos(filteredRepos);
    }

    async function fetchAndRenderProjects() {
        if (!projectsContainer) {
            console.error('项目容器未找到!');
            return;
        }
        projectsContainer.innerHTML = '<p style="text-align: center; color: #888;">正在加载项目...</p>';

        try {
            const fetchPromises = [];
            if (GITHUB_ORG) {
                fetchPromises.push(fetch(`https://api.github.com/users/${GITHUB_ORG}/repos`));
            }
            INDIVIDUAL_REPOS.forEach(repoPath => {
                fetchPromises.push(fetch(`https://api.github.com/repos/${repoPath}`));
            });

            const responses = await Promise.all(fetchPromises);
            const jsonPromises = responses
                .filter(response => {
                    if (!response.ok) {
                        console.warn(`无法获取仓库: ${response.url} (状态: ${response.status})`);
                        return false;
                    }
                    return true;
                })
                .map(response => response.json());
            
            const results = await Promise.all(jsonPromises);
            allRepos = results.flat();
            // Filter out the specific repo for GitHub Pages
            allRepos = allRepos.filter(repo => repo.name !== 'scu-hotpot.github.io');
            allRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            
            renderRepos(allRepos);
            searchInput.addEventListener('input', filterRepos);

        } catch (error) {
            console.error('获取项目失败:', error);
            projectsContainer.innerHTML = '<p>加载项目失败，请稍后再试。</p>';
        }
    }

    fetchAndRenderProjects();
});