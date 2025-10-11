# 四川大学火锅战队官网

![SCURM Logo](./source/logo/color_logo_with_scurm.png)

欢迎来到四川大学RoboMaster火锅战队的官方网站项目仓库。本项目是一个纯静态网站，旨在展示战队的风采、分享技术成果并提供最新的团队动态。

## ✨ 功能特性

本网站包含了多个精心设计的页面，用于全方位展示火锅战队：

- **🏠 首页 (`index.html`)**: 动态视频背景，展示战队介绍、社交媒体链接和赞助商信息。
- **📅 近期赛程 (`schedule.html`)**: 动态从 CSV 文件加载并展示历年赛程。用户可以按 **赛季年份** 和 **对手名称** 进行筛选和搜索。
- **👥 战队成员 (`members.html`)**: 展示各赛季的战队成员列表。成员按“队长”、“管理层”和“队员”分组展示，并支持按赛季切换查看。
- **📖 项目开源 (`open_source.html`)**: 连接到战队的 GitHub，展示团队的开源项目和技术贡献。
- **📞 联系我们 (`contact.html`)**: 提供战队的联系方式和地理位置。

## 🛠️ 技术栈

本项目完全使用前端基础技术构建，确保了轻量、快速和易于部署。

- **HTML5**: 负责网站的结构和内容。
- **CSS3**: 负责页面的样式、布局和美化，包括 Flexbox 布局、半透明风格和响应式设计。
- **JavaScript (ES6+)**: 负责网站的动态功能，例如：
  - 通过 `fetch` API 异步从 `.csv` 文件加载赛程和成员数据。
  - 实现赛程和成员的动态筛选、搜索和排序功能。
  - 动态生成和渲染 HTML 内容。

## 🚀 本地运行

你可以轻松地在本地运行本项目以进行查看或二次开发。

1.  **克隆仓库**
    ```bash
    git clone [the repo link]
    ```

2.  **进入项目目录**
    ```bash
    cd [project name]
    ```

3.  **启动本地服务器**
    由于浏览器存在跨域安全限制（CORS），直接打开 `index.html` 文件将无法加载 `.csv` 数据。请使用一个本地 HTTP 服务器来运行本项目。

    如果你安装了 Python 3，可以使用以下命令：
    ```bash
    python3 -m http.server
    ```
    如果你安装了 Node.js，可以先安装一个静态服务器工具，如 `http-server`：
    ```bash
    npm install -g http-server
    # 然后运行
    http-server
    ```

4.  **访问网站**
    本地开发可在浏览器中打开 `http://localhost:8000` (或服务器指定的其他端口) 即可查看网站。

## 📁 文件结构

```
.
├── index.html              # 网站首页
├── schedule.html           # 赛程页面
├── members.html            # 成员页面
├── open_source.html        # 开源项目页面
├── contact.html            # 联系我们页面
│
├── style.css               # 全局主要样式
├── schedule.css            # 赛程页面专属样式
├── members.css             # 成员页面专属样式
│
├── schedule.js             # 赛程页面的逻辑脚本
├── members.js              # 成员页面的逻辑脚本
│
├── data/
│   └── schedule.csv        # 历年赛程数据
│
└── source/
    ├── members/
    │   ├── 25/members.csv  # 25赛季成员数据
    │   └── 26/members.csv  # 26赛季成员数据
    ├── logo/               # 战队和学校Logo
    ├── icons/              # 社交媒体图标
    └── ...                 # 其他静态资源 (图片, 视频等)
```
