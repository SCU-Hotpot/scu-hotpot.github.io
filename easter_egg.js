document.addEventListener('DOMContentLoaded', () => {
    const mainLogo = document.querySelector('.easter-egg-logo');
    const paradeContainer = document.getElementById('school-logo-parade-container');
    let isAnimating = false;

    const schoolLogos = [
        '四川大学', '西南交通大学', '西南石油大学', '成都大学', 
        '成都工业学院', '成都信息工程大学', '重庆大学', '重庆理工大学', 
        '三峡学院', '西南民族大学'
    ];

    if (!mainLogo || !paradeContainer) {
        console.error('彩蛋区域的元素未找到!');
        return;
    }

    mainLogo.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        mainLogo.style.opacity = '0';

        setTimeout(() => {
            startLogoParade();
        }, 500);
    });

    function startLogoParade() {
        const shuffledLogos = [...schoolLogos].sort(() => 0.5 - Math.random());
        let totalAnimations = shuffledLogos.length;
        let animationsCompleted = 0;

        shuffledLogos.forEach((schoolName, schoolIndex) => {
            const afterImageContainer = document.createElement('div');
            afterImageContainer.className = 'afterimage-container';
            
            const layers = [];
            for (let i = 0; i < 5; i++) {
                const logoImg = document.createElement('img');
                logoImg.src = `source/school_logos/${schoolName}.png`;
                logoImg.className = 'parading-logo-layer';
                // Use a power curve for a more natural fade-in
                logoImg.style.opacity = Math.pow((i + 1) / 5, 2);
                afterImageContainer.appendChild(logoImg);
                layers.push(logoImg);
            }
            
            paradeContainer.appendChild(afterImageContainer);

            const randomTop = Math.random() * (paradeContainer.clientHeight - 80);
            afterImageContainer.style.top = `${randomTop}px`;
            afterImageContainer.style.left = '-100px';

            // Animate each layer independently for constant spacing
            layers.forEach((layer, layerIndex) => {
                gsap.to(layer, {
                    x: window.innerWidth + 200,
                    duration: 4, // Slower speed
                    delay: (schoolIndex * 0.3) + ((4 - layerIndex) * 0.01), // Adjusted school spacing
                    ease: "none",
                    onComplete: () => {
                        // Only listen for the completion of the very last animation
                        if (schoolIndex === shuffledLogos.length - 1 && layerIndex === layers.length - 1) {
                            mainLogo.style.opacity = '1';
                            isAnimating = false;
                            paradeContainer.innerHTML = '';
                        }
                    }
                });
            });
        });
    }
});