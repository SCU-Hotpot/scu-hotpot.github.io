document.addEventListener('DOMContentLoaded', () => {
    const mainLogo = document.querySelector('.easter-egg-logo');
    const paradeContainer = document.getElementById('school-logo-parade-container');
    let isAnimating = false;

    const schoolLogos = [
        '四川大学', '西南交通大学', '西南石油大学', '成都大学', 
        '成都工业学院', '成都信息工程大学', '重庆大学', '重庆理工大学', 
        '三峡学院', '西南民族大学'
    ];
    
    const speechBubbles = [
        "冲冲冲！", "加油加油！", "一块去春茧！", "顶一个！", "雄起！"
    ];

    if (!mainLogo || !paradeContainer) {
        console.error('彩蛋区域的元素未找到!');
        return;
    }

    mainLogo.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        mainLogo.style.opacity = '0';
        setTimeout(startLogoParade, 500);
    });

    function startLogoParade() {
        const shuffledLogos = [...schoolLogos].sort(() => 0.5 - Math.random());
        let animationsCompleted = 0;

        shuffledLogos.forEach((schoolName, index) => {
            const afterImageContainer = document.createElement('div');
            afterImageContainer.className = 'afterimage-container';
            
            for (let i = 0; i < 5; i++) {
                const logoImg = document.createElement('img');
                logoImg.src = `source/school_logos/${schoolName}.png`;
                logoImg.className = 'parading-logo-layer';
                logoImg.style.opacity = Math.pow((i + 1) / 5, 2);
                logoImg.style.transform = `translateX(${(4 - i) * -8}px)`;
                afterImageContainer.appendChild(logoImg);
            }

            let bubble = null;
            if (schoolName === '成都信息工程大学') {
                bubble = document.createElement('div');
                bubble.className = 'speech-bubble';
                bubble.textContent = '此处出售刘工🪝子';
                afterImageContainer.appendChild(bubble);
            } else if (Math.random() < 0.4) {
                bubble = document.createElement('div');
                bubble.className = 'speech-bubble';
                bubble.textContent = speechBubbles[Math.floor(Math.random() * speechBubbles.length)];
                afterImageContainer.appendChild(bubble);
            }
            
            paradeContainer.appendChild(afterImageContainer);

            // Set z-index to prevent overlap between different school containers
            afterImageContainer.style.zIndex = shuffledLogos.length - index;

            const randomTop = Math.random() * (paradeContainer.clientHeight - 80);
            afterImageContainer.style.top = `${randomTop}px`;
            afterImageContainer.style.left = '-200px';

            gsap.to(afterImageContainer, {
                x: window.innerWidth + 300,
                duration: 4,
                delay: index * 0.3,
                ease: "none",
                onStart: () => {
                    if (bubble) {
                        gsap.to(bubble, { opacity: 1, duration: 0.3 });
                    }
                },
                onComplete: () => {
                    animationsCompleted++;
                    if (animationsCompleted === shuffledLogos.length) {
                        mainLogo.style.opacity = '1';
                        isAnimating = false;
                        paradeContainer.innerHTML = '';
                    }
                }
            });
        });
    }
});