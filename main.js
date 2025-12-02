// main.js - 초기화 및 메인 설정

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// Lenis (Smooth Scroll) 초기화
var lenis;

function initSmoothScroll() {
    lenis = new Lenis({
        lerp: 0.05,  // 미세 컨트롤 - 낮을수록 부드럽고 느리게 감속 (0.01~0.1)
        wheelMultiplier: 0.5,  // 휠 감도 - 낮을수록 미세 조작 가능
        touchMultiplier: 1.5,
        infinite: false,
        smoothTouch: false,
    });
    
    // ScrollTrigger와 Lenis 완벽 동기화 (Awwwards 패턴)
    lenis.on('scroll', ScrollTrigger.update);
    
    // ScrollTrigger가 Lenis 스크롤을 인식하도록 설정
    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.body.style.transform ? "transform" : "fixed"
    });
    
    // GSAP ticker를 사용하여 Lenis 업데이트
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
    
    // ScrollTrigger 새로고침
    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();
}

// 초기화 함수
async function init() {
    // 1. 스무스 스크롤 시작
    initSmoothScroll();

    // 2. 비디오 설정
    if (typeof setupVideo === 'function') {
        setupVideo();
    }

    // 3. GSAP 애니메이션 설정
    if (typeof setupGSAPAnimations === 'function') {
        setupGSAPAnimations();
    }
    
    // 4. 챕터 네비게이션 설정
    if (typeof setupChapterNavigation === 'function') {
        setupChapterNavigation();
    }
    
    // 5. Vanilla Tilt 설정
    if (typeof setupTiltEffect === 'function') {
        setupTiltEffect();
    }
    
    // 6. 네비게이션 메뉴 애니메이션 설정
    if (typeof setupNavigationMenu === 'function') {
        setupNavigationMenu();
    }
    
    // 7. 이도류 스플릿 뷰 인터랙션 설정
    if (typeof setupDualWielderSplitView === 'function') {
        setupDualWielderSplitView();
    }

    // 8. 스크롤 페이드인 애니메이션 설정
    if (typeof setupFadeInAnimations === 'function') {
        setupFadeInAnimations();
    }
}

// DOM이 준비되면 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
