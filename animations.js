// animations.js - GSAP 애니메이션 관련 코드

// GSAP 애니메이션 설정
function setupGSAPAnimations() {
    const heroSection = document.querySelector('.hero-section');
    const heroVideo = document.querySelector('.hero-video');
    const heroVideoContainer = document.querySelector('.hero-background');
    const heroTextOverlay = document.querySelector('.hero-text-overlay');
    const heroSignature = document.querySelector('.hero-signature-wrapper');
    const chapter1 = document.querySelector('#chapter-1');

    if (!heroSection) return;

    // 1. Hero 섹션 스크롤 애니메이션
    const heroTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "+=600vh",
            scrub: 1,
            pin: true,
        }
    });

    // 비디오 크기 축소
    if (heroVideoContainer) {
        heroTimeline.to(heroVideoContainer, {
            scale: 0.3,
            duration: 5.0,
            ease: "power2.inOut",
            transformOrigin: "center center"
        });
    }

    // 비디오 흑백 효과
    if (heroVideo) {
        heroTimeline.to(heroVideo, {
            filter: "grayscale(100%)",
            duration: 5.0,
            ease: "power2.inOut"
        }, 0);
    }

    // 텍스트 오버레이 (TWO WAY STAR) - 작아지면서 사라짐
    if (heroTextOverlay) {
        heroTimeline.to(heroTextOverlay, {
            opacity: 0,
            scale: 0.3,
            duration: 5.0,
            ease: "power2.inOut"
        }, 0);
    }

    // 네비게이션 요소 (이름) - 크기 75%로 축소, 색상 변경, 사라지지 않음
    const navNameLink = document.querySelector('.nav-name-link');
    const navNameText = document.querySelectorAll('.nav-name-first, .nav-name-last');

    if (navNameLink) {
        heroTimeline.to(navNameLink, {
            scale: 0.75,
            duration: 5.0,
            ease: "power2.inOut",
            transformOrigin: "left top"
        }, 0);
        
        // 글자 색상 변경 (흰색 -> 검정색)
        if (navNameText.length > 0) {
            heroTimeline.to(navNameText, {
                color: "#ffffff",
                textShadow: "none",
                duration: 5.0,
                ease: "power2.inOut"
            }, 0);
        }
    }
    
    // 네비게이션 요소 (로고) - TWO WAY STAR와 함께 작아지면서 사라짐
    const navLogoLink = document.querySelector('.nav-logo-link');
    if (navLogoLink) {
        heroTimeline.to(navLogoLink, {
            scale: 0.3,
            opacity: 0,
            duration: 5.0,
            ease: "power2.inOut",
            transformOrigin: "center top"
        }, 0);
    }

    // [복구] 사인 이미지 등장 애니메이션
    if (heroSignature) {
        heroTimeline.to(heroSignature, {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
            onComplete: () => {
                if (typeof initSignatureTilt === 'function') {
                    initSignatureTilt();
                }
            }
        }, 2.5);
    }

    // [복구] 공통 페이드인 섹션 애니메이션 (명언 섹션 등)
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    fadeInSections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            onEnter: () => section.classList.add('is-visible'),
            once: true
        });
    });

    // [복구] Chapter 1 등장 애니메이션
    if (chapter1) {
        gsap.fromTo(chapter1, 
            { opacity: 0, y: 100 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: chapter1,
                    start: "top 80%",
                    end: "top 50%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }
    
    // 3. 수평 스크롤 갤러리 설정
    setupHorizontalScrollWithGSAP();

    // 4. Dual Wielder Section - 양쪽에서 중간으로 당겨오는 애니메이션
 /* =================================================================
   PART 1. 데이터 베이스
   ================================================================= */
const pitcherRecords = [
    { YEAR: 2013, IP:61.2, ERA: "4.23", W: 3,  SO: 46 },
    { YEAR: 2014, IP:155.1, ERA: "2.61", W: 11,  SO: 179 },
    { YEAR: 2015, IP:160.2, ERA: "2.24", W: 15,  SO: 196 },
    { YEAR: 2016, IP:140.0, ERA: "1.86", W: 10,  SO: 174 },
    { YEAR: 2017, IP:25.1, ERA: "3.20", W: 3,  SO: 29 },
    { YEAR: 2018, IP:51.2, ERA: "3.31", W: 4,  SO: 63 },
    { YEAR: 2020, IP:1.2, ERA: "37.80", W: 0, SO: 3 },
    { YEAR: 2021, IP:130.1, ERA: "3.18", W: 9,  SO: 156 },
    { YEAR: 2022, IP:166.0, ERA: "2.33", W: 15, SO: 219 },
    { YEAR: 2023, IP:132.0, ERA: "3.14", W: 10, SO: 167 },
    { YEAR: 2025, IP:47, ERA: "2.87", W: 1,  SO: 62 }
];

const hitterRecords = [
    { YEAR: 2013, AVG: ".238", HR: 3, RBI: 20,  SB: 10, OPS: 0.643 },
    { YEAR: 2014, AVG: ".274", HR: 10, RBI: 31,  SB: 10, OPS: 0.842 },
    { YEAR: 2015, AVG: ".202", HR: 5, RBI: 17,  SB: 10, OPS: 0.628 },
    { YEAR: 2016, AVG: ".322", HR: 22, RBI: 67,  SB: 10, OPS: 1.004 },
    { YEAR: 2017, AVG: ".332", HR: 8, RBI: 31,  SB: 10, OPS: 0.942 },
    { YEAR: 2018, AVG: ".285", HR: 22, RBI: 61,  SB: 10, OPS: 0.925 },
    { YEAR: 2019, AVG: ".286", HR: 18, RBI: 62,  SB: 12, OPS: 0.848 },
    { YEAR: 2020, AVG: ".190", HR: 7,  RBI: 24,  SB: 7, OPS: 0.657 },
    { YEAR: 2021, AVG: ".257", HR: 46, RBI: 100, SB: 26, OPS: 0.964 },
    { YEAR: 2022, AVG: ".273", HR: 34, RBI: 95,  SB: 11, OPS: 0.875 },
    { YEAR: 2023, AVG: ".304", HR: 44, RBI: 95,  SB: 20, OPS: 1.066 },
    { YEAR: 2024, AVG: ".310", HR: 54, RBI: 130, SB: 59, OPS: 1.036 },
    { YEAR: 2025, AVG: ".282", HR: 55, RBI: 102, SB: 20, OPS: 1.014 }
];

/* =================================================================
   PART 2. 표 렌더링
   ================================================================= */
function renderStats() {
    const pBody = document.getElementById('pitcher-data-body');
    if(pBody) {
        let pHtml = '';
        pitcherRecords.forEach(rec => {
            pHtml += `<tr><td>${rec.YEAR}</td><td>${rec.IP}</td><td>${rec.ERA}</td><td>${rec.W}</td><td>${rec.SO}</td></tr>`;
        });
        pBody.innerHTML = pHtml;
    }

    const hBody = document.getElementById('hitter-data-body');
    if(hBody) {
        let hHtml = '';
        hitterRecords.forEach(rec => {
            hHtml += `<tr><td>${rec.YEAR}</td><td>${rec.AVG}</td><td>${rec.HR}</td><td>${rec.RBI}</td><td>${rec.SB}</td><td>${rec.OPS}</td></tr>`;
        });
        hBody.innerHTML = hHtml;
    }
}
renderStats();


/* =================================================================
   PART 3. 애니메이션 (On/Off 스위치 방식)
   ================================================================= */
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

    // [상태 변수] 현재 켜져있는지 꺼져있는지 기억하는 변수
    let isPitcherOn = false;
    let isHitterOn = false;

    // [초기 세팅]
    if(pitcherText) gsap.set(pitcherText, { rotation: 90, xPercent: -350, scale: 0.8, autoAlpha: 0.3 });
    if(hitterText) gsap.set(hitterText, { rotation: -90, xPercent: 350, scale: 0.8, autoAlpha: 0.3 });

    // --- 등장 애니메이션 ---
    const introTl = gsap.timeline({
        scrollTrigger: {
            trigger: section, start: "top 70%", end: "top 20%", scrub: 1.5
        }
    });
    introTl.fromTo(pitcherContainer, { xPercent: -80, opacity: 0 }, { xPercent: -20, opacity: 1, ease: "power2.out" }, 0);
    introTl.fromTo(hitterContainer, { xPercent: 80, opacity: 0 }, { xPercent: 20, opacity: 1, ease: "power2.out" }, 0);
    introTl.fromTo(centerContent, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, ease: "back.out(1.7)" }, 0.2);


    // ----------------------------------------------------------------
    // [핵심 함수] 현재 상태(isPitcherOn, isHitterOn)에 따라 화면을 그림
    // ----------------------------------------------------------------
    const updateView = () => {
        
        // [CASE 1] 둘 다 켜짐 (듀얼 모드) 🔥
        if (isPitcherOn && isHitterOn) {
            // 레이아웃: 50:50, 둘 다 밝게
            gsap.to([pitcherContainer, hitterContainer], { 
                flex: 1, zIndex: 1, filter: "brightness(1)", overwrite: true, duration: 0.8, ease: "power3.inOut" 
            });

            // 투수: 활성화
            gsap.to(pitcherText, { rotation: 0, xPercent: -30, yPercent: -300, scale: 1.1, autoAlpha: 1, webkitTextStroke: "2px #00a2ff", filter: "drop-shadow(0 0 20px rgba(0, 162, 255, 0.8))", duration: 0.6 });
            gsap.to(".pitcher-stats", { autoAlpha: 1, duration: 0.5 });

            // 타자: 활성화
            gsap.to(hitterText, { rotation: 0, xPercent: -30, yPercent: -300, scale: 1.1, autoAlpha: 1, webkitTextStroke: "2px #ff3c00", filter: "drop-shadow(0 0 20px rgba(255, 60, 0, 0.8))", duration: 0.6 });
            gsap.to(".hitter-stats", { autoAlpha: 1, duration: 0.5 });
        }
        
        // [CASE 2] 투수만 켜짐 (왼쪽 집중)
        else if (isPitcherOn && !isHitterOn) {
            // 레이아웃: 투수 크게(Flex 8), 타자 작게(Flex 4)
            gsap.to(pitcherContainer, { flex: 6, zIndex: 50, filter: "brightness(1)", overwrite: true, duration: 0.8, ease: "power3.inOut" });
            gsap.to(hitterContainer, { flex: 5, zIndex: 1, filter: "brightness(0.3)", overwrite: true, duration: 0.8 });

            // 투수 ON
            gsap.to(pitcherText, { rotation: 0, xPercent: -30, yPercent: -300, scale: 1.2, autoAlpha: 1, webkitTextStroke: "2px #00a2ff", filter: "drop-shadow(0 0 20px rgba(0, 162, 255, 0.8))", duration: 0.6 });
            gsap.to(".pitcher-stats", { autoAlpha: 1, duration: 0.5 });

            // 타자 OFF
            gsap.to(hitterText, { rotation: -90, xPercent: 350, scale: 0.8, autoAlpha: 0.3, webkitTextStroke: "0px transparent", filter: "none", duration: 0.6 });
            gsap.to(".hitter-stats", { autoAlpha: 0, duration: 0.3 });
        }
        
        // [CASE 3] 타자만 켜짐 (오른쪽 집중)
        else if (!isPitcherOn && isHitterOn) {
            // 레이아웃: 투수 작게(Flex 4), 타자 크게(Flex 8)
            gsap.to(pitcherContainer, { flex: 5, zIndex: 1, filter: "brightness(0.3)", overwrite: true, duration: 0.8 });
            gsap.to(hitterContainer, { flex: 6, zIndex: 50, filter: "brightness(1)", overwrite: true, duration: 0.8, ease: "power3.inOut" });

            // 투수 OFF
            gsap.to(pitcherText, { rotation: 90, xPercent: -350, scale: 0.8, autoAlpha: 0.3, webkitTextStroke: "0px transparent", filter: "none", duration: 0.6 });
            gsap.to(".pitcher-stats", { autoAlpha: 0, duration: 0.3 });

            // 타자 ON
            gsap.to(hitterText, { rotation: 0, xPercent: -30, yPercent: -300, scale: 1.2, autoAlpha: 1, webkitTextStroke: "2px #ff3c00", filter: "drop-shadow(0 0 20px rgba(255, 60, 0, 0.8))", duration: 0.6 });
            gsap.to(".hitter-stats", { autoAlpha: 1, duration: 0.5 });
        }
        
        // [CASE 4] 둘 다 꺼짐 (초기화)
        else {
            // 레이아웃: 1:1, 기본 밝기
            gsap.to([pitcherContainer, hitterContainer], { 
                flex: 1, zIndex: 1, filter: "brightness(1)", overwrite: true, duration: 0.8, ease: "power3.inOut" 
            });

            // 둘 다 OFF
            gsap.to(pitcherText, { rotation: 90, xPercent: 0, scale: 0.8, autoAlpha: 0, webkitTextStroke: "0px transparent", filter: "none", duration: 0.6 });
            gsap.to(".pitcher-stats", { autoAlpha: 0, duration: 0.5 });
            
            gsap.to(hitterText, { rotation: -90, xPercent: 0, scale: 1, autoAlpha: 0, webkitTextStroke: "0px transparent", filter: "none", duration: 0.6 });
            gsap.to(".hitter-stats", { autoAlpha: 0, duration: 0.5 });
        }
    };


    // ----------------------------------------------------
    // [이벤트 핸들러] 클릭 시 변수(true/false)만 바꾸고 updateView 호출
    // ----------------------------------------------------

    // 1. 투수 버튼 클릭
    pitcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isPitcherOn = !isPitcherOn; // 켜져있으면 끄고, 꺼져있으면 켬 (Toggle)
        updateView();
    });

    // 2. 타자 버튼 클릭
    hitterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isHitterOn = !isHitterOn; // 켜져있으면 끄고, 꺼져있으면 켬 (Toggle)
        updateView();
    });

    // 3. 배경 클릭 (모두 끄기)
    section.addEventListener('click', () => {
        if(isPitcherOn || isHitterOn) {
            isPitcherOn = false;
            isHitterOn = false;
            updateView();
        }
    });
}

setupDualSection();

    // 5. 다른 챕터 섹션들 페이드인
    const otherChapters = document.querySelectorAll('.chapter-section:not(#chapter-1):not(.dual-wielder-section)');
    otherChapters.forEach((chapter) => {
        gsap.fromTo(chapter,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: chapter,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

// 가로 스크롤 갤러리 설정 (User Provided Logic)
function setupHorizontalScrollWithGSAP() {
    // 1. 요소 선택
    const section = document.querySelector('#chapter-1');
    const gallery = document.querySelector('.chapter-image-gallery');
    if (!section || !gallery) return;

    // 2. 이동 거리 계산
    const getScrollAmount = () => {
        const galleryWidth = gallery.scrollWidth;
        const viewportWidth = window.innerWidth;
        return -(galleryWidth - viewportWidth) - (viewportWidth * 0.05);
    };

    // 3. 메인 타임라인 생성
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${gallery.scrollWidth}`, 
            pin: true,
            scrub: 1, 
            invalidateOnRefresh: true,
            anticipatePin: 1
        }
    });

    // 4. 가로 이동 애니메이션
    tl.to(gallery, {
        x: getScrollAmount, 
        ease: "none",
        duration: 1
    });

    // ✨ [배경색 변경] 어두운 파랑 -> 밝은 하양
    // 스크롤 시작부터 끝까지 서서히 바뀝니다.
    tl.to(".global-bg-overlay", {
        backgroundColor: "rgba(255, 255, 255, 0.8)", 
        ease: "none",
        duration: 1
    }, 0);

    // 5. 패럴랙스 움직임 (랜도 스타일의 '둥둥 떠다니는' 느낌은 유지)
    // *필터나 효과는 다 뺐습니다*
    const items = gsap.utils.toArray('.gallery-image-item');
    
    items.forEach((item, index) => {
        // 짝수는 아래로, 홀수는 위로 천천히 움직임
        const yMove = index % 2 === 0 ? 100 : -100;
        
        tl.to(item, {
            y: yMove,
            ease: "none",
            duration: 1
        }, 0);
    });
}
    // 6. 엔딩 섹션 애니메이션
    setupEndingAnimation();
}
// 엔딩 섹션 애니메이션 (커튼 효과 + 3D 터널 줌)
function setupEndingAnimation() {
    const endingSection = document.querySelector('.ending-section');
    const dualWielderSection = document.querySelector('.dual-wielder-section');
    const zoomItems = gsap.utils.toArray('.zoom-item');
    const finalText = document.querySelector('.ending-final-text');
    
    if (!endingSection || !dualWielderSection) {
        console.log('엔딩 섹션 또는 Dual Wielder 섹션을 찾을 수 없습니다');
        return;
    }

    console.log('엔딩 섹션 애니메이션 초기화 중...');

    // Step 1: 커튼 등장 (scrub: 1)
    gsap.fromTo(endingSection,
        { y: '100%' },
        {
            y: '0%',
            ease: 'none',
            scrollTrigger: {
                trigger: dualWielderSection,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 1,
                anticipatePin: 1,
            }
        }
    );

    // Step 2 & 3: 화면 고정 + 터널 줌 효과 (scrub: 0.8)
    const endingTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: endingSection,
            start: 'top top',
            end: '+=300vh',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            anticipatePin: 1,
        }
    });

    // 줌 아이템 애니메이션 (scale: 1.5로 축소, stagger: 0.2)
    zoomItems.forEach((item, index) => {
        const startTime = index * 0.25; // 간격을 조금 더 넓힘
        const duration = 1.5; // 지속 시간 늘림
        // 지그재그 배치: 왼쪽 -> 오른쪽 -> 왼쪽 ...
        const xOffset = (index % 2 === 0) ? '-120%' : '120%'; 
        const yOffset = (index % 3 === 0) ? '-20%' : (index % 3 === 1) ? '20%' : '0%'; // 상하로도 약간 분산

        endingTimeline
            .fromTo(item,
                {
                    scale: 0,
                    opacity: 0,
                    x: 0,
                    y: 0
                },
                {
                    scale: 1.5, // 적당한 크기
                    opacity: 1,
                    duration: duration * 0.4,
                    ease: 'power2.out'
                },
                startTime
            )
            .to(item,
                {
                    x: xOffset,
                    y: yOffset,
                    opacity: 0,
                    scale: 2.0, // 사라질 때 조금 더 커지면서
                    duration: duration * 0.6,
                    ease: 'power1.in'
                },
                startTime + duration * 0.4
            );
    });

    // 최종 텍스트 등장
    const textStartTime = zoomItems.length * 0.25 + 0.5;
    endingTimeline.to(finalText,
        {
            opacity: 1,
            scale: 1,
            duration: 1.0,
            ease: 'back.out(1.7)'
        },
        textStartTime
    );

    console.log('엔딩 섹션 애니메이션 설정 완료');
}