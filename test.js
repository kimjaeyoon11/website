// animations.js

function setupDualSection() {
    const section = document.querySelector('.dual-wielder-section');
    const pitcherContainer = document.querySelector('.pitcher-side');
    const hitterContainer = document.querySelector('.hitter-side');
    const centerContent = document.querySelector('.dual-center-content');
    const pitcherBtn = document.querySelector('.pitcher-btn');
    const hitterBtn = document.querySelector('.hitter-btn');
    
    const pitcherText = pitcherContainer.querySelector('.bg-text');
    const hitterText = hitterContainer.querySelector('.bg-text');

    if (!section) return;

    // ----------------------------------------------------
    // [0. 초기 세팅] 무조건 세로로 시작!
    // ----------------------------------------------------
    // 투수 글자: 90도 회전 (세로) + 왼쪽 구석
    if(pitcherText) {
        gsap.set(pitcherText, { 
            rotation: 90,      // [세로 상태]
            xPercent: -350,    // 왼쪽 구석에 박아두기
            scale: 0.8,
            autoAlpha: 0.3
        });
    }

    // 타자 글자: -90도 회전 (세로) + 오른쪽 구석
    if(hitterText) {
        gsap.set(hitterText, { 
            rotation: -90,     // [세로 상태]
            xPercent: 350,     // 오른쪽 구석에 박아두기
            scale: 0.8,
            autoAlpha: 0.3
        });
    }

    // --- 1. 등장 애니메이션 (기존 유지) ---
    // (이미지 박스가 모이는 애니메이션은 그대로 둡니다)
    const introTl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 70%", end: "top 20%", scrub: 1.5
        }
    });
    introTl.fromTo(pitcherContainer, { xPercent: -80, opacity: 0 }, { xPercent: -20, opacity: 1, ease: "power2.out" }, 0);
    introTl.fromTo(hitterContainer, { xPercent: 80, opacity: 0 }, { xPercent: 20, opacity: 1, ease: "power2.out" }, 0);
    introTl.fromTo(centerContent, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, ease: "back.out(1.7)" }, 0.2);


    // ----------------------------------------------------
    // [2. 호버 인터랙션] 마우스 올리면 -> 가로로 눕기(0도)
    // ----------------------------------------------------

    // [투수 버튼] 호버
    pitcherBtn.addEventListener('mouseenter', () => {
        // 영역 확장
        gsap.to(pitcherContainer, { flex: 8, duration: 1, ease: "power3.inOut" });
        gsap.to(hitterContainer, { flex: 4, filter: "brightness(0.3)", duration: 1 });

        // 글자: 세로(90) -> 가로(0)
        gsap.to(pitcherText, {
            rotation: 0,        // [가로로 눕기!]
            xPercent: -30,       // 중앙으로 이동
            yPercent: -300,
            scale: 1.2,
            autoAlpha: 1,
            webkitTextStroke: "2px #00a2ff", // 파란 불
            filter: "drop-shadow(0 0 20px rgba(0, 162, 255, 0.8))",
            duration: 0.6,
            ease: "back.out(1.7)"
        });
    });

    // [타자 버튼] 호버
    hitterBtn.addEventListener('mouseenter', () => {
        // 영역 확장
        gsap.to(pitcherContainer, { flex: 4, filter: "brightness(0.3)", duration: 1});
        gsap.to(hitterContainer, { flex: 8, duration: 1, ease: "power3.inOut" });

        // 글자: 세로(-90) -> 가로(0)
        gsap.to(hitterText, {
            rotation: 0,        // [가로로 눕기!]
            xPercent: -30,      // 중앙으로 이동
            yPercent: -300,
            scale: 1.2,
            autoAlpha: 1,
            webkitTextStroke: "2px #ff3c00", // 빨간 불
            filter: "drop-shadow(0 0 20px rgba(255, 60, 0, 0.8))",
            duration: 0.6,
            ease: "back.out(1.7)"
        });
    });

    // [마우스 떼면] 원상복구
    const resetLayout = () => {
        gsap.to([pitcherContainer, hitterContainer], { 
            flex: 1, filter: "brightness(1)", duration: 0.6, ease: "power3.inOut" 
        });

        gsap.to(pitcherText, {
            rotation: 90,       // [다시 세로!]
            xPercent: 0,
            scale: 0.8,
            autoAlpha: 0,
            webkitTextStroke: "2px rgba(255, 255, 255, 0)",
            filter: "none",
            duration: 0.6
        });

        gsap.to(hitterText, {
            rotation: -90,      // [다시 세로!]
            xPercent: 0,      // 구석으로
            scale: 1,
            autoAlpha: 0,
            webkitTextStroke: "2px rgba(255, 255, 255, 0)",
            filter: "none",
            duration: 0.6
        });
    };

    pitcherBtn.addEventListener('mouseleave', resetLayout);
    hitterBtn.addEventListener('mouseleave', resetLayout);
}

setupDualSection();
