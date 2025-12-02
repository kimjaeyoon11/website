// ui.js - UI 인터랙션 관련 코드

// 챕터 네비게이션 스크롤
function setupChapterNavigation() {
    const chapterLinks = document.querySelectorAll('.nav-chapter-link, .nav-menu-link-w');
    
    chapterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (lenis && targetId !== '#') {
                lenis.scrollTo(targetId, {
                    offset: 0,
                    duration: 1.5
                });
                
                chapterLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.chapter-section, .hero-section');
        const scrollPos = window.scrollY + window.innerHeight * 0.3;
        
        sections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < bottom) {
                chapterLinks.forEach(l => l.classList.remove('active'));
                const chapterNum = section.getAttribute('data-chapter') || 'home';
                const activeLinks = document.querySelectorAll(`.nav-chapter-link[data-chapter="${chapterNum}"], .nav-menu-link-w[data-chapter="${chapterNum}"]`);
                activeLinks.forEach(link => link.classList.add('active'));
            }
        });
    });
}

// ui.js - setupNavigationMenu 함수 교체

function setupNavigationMenu() {
    const navHam = document.querySelector('.nav-ham');
    const navMenu = document.querySelector('.nav-menu-w');
    const navLinks = document.querySelectorAll('.nav-menu-link-w');
    
    // 1. 햄버거 메뉴 토글
    if (navHam && navMenu) {
        navHam.addEventListener('click', () => {
            const isActive = navHam.classList.contains('active');
            
            if (!isActive) {
                // [OPEN] 메뉴 열기
                navHam.classList.add('active');
                navMenu.classList.add('active');
                navHam.setAttribute('aria-expanded', 'true');
                
                // 스크롤 잠금
                if (typeof lenis !== 'undefined' && lenis) lenis.stop();

                // ✨ [NEW] GSAP 타임라인으로 순차적 등장 연출
                const tl = gsap.timeline();

                // 1) 링크들 순차 등장
                tl.fromTo('.nav-menu-link-w', 
                    { y: 50, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.8, 
                        stagger: 0.1, 
                        ease: 'power3.out' 
                    }
                );

                // 2) 소셜 아이콘 등장 (링크 끝나기 전에 살짝 겹쳐서 시작)
                tl.fromTo('.nav-menu-social-link', 
                    { y: 20, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.6, 
                        stagger: 0.1, 
                        ease: 'back.out(1.7)' 
                    }, 
                    "-=0.4" // 0.4초 먼저 시작
                );

            } else {
                // [CLOSE] 메뉴 닫기
                closeMenu();
            }
        });
    }

    // 2. 메뉴 닫기 공통 함수
    function closeMenu() {
        if (navHam && navMenu) {
            navHam.classList.remove('active');
            navMenu.classList.remove('active');
            navHam.setAttribute('aria-expanded', 'false');
            
            // 스크롤 잠금 해제
            if (typeof lenis !== 'undefined' && lenis) lenis.start();
        }
    }
    
    // 3. 링크 클릭 이벤트
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            closeMenu(); // 메뉴 닫기

            if (targetId === '#') { // HOME 버튼
                e.preventDefault();
                if (typeof lenis !== 'undefined') {
                    requestAnimationFrame(() => lenis.scrollTo(0, { immediate: true }));
                }
            }
        });
    });
}
// 이도류 스플릿 뷰 인터랙션
function setupDualWielderSplitView() {
    const dualSection = document.querySelector('.dual-wielder-section');
    if (!dualSection) return;

    const panes = dualSection.querySelectorAll('.split-pane');

    const setActivePane = (activePane) => {
        panes.forEach((pane) => {
            if (pane === activePane) {
                pane.classList.add('is-active');
                pane.classList.remove('is-inactive');
            } else {
                pane.classList.add('is-inactive');
                pane.classList.remove('is-active');
            }
        });
    };

    const resetPanes = () => {
        panes.forEach((pane) => {
            pane.classList.remove('is-active', 'is-inactive');
        });
    };

    panes.forEach((pane) => {
        pane.addEventListener('mouseenter', () => setActivePane(pane));
        pane.addEventListener('focus', () => setActivePane(pane));
        pane.addEventListener('touchstart', () => setActivePane(pane), { passive: true });
    });

    dualSection.addEventListener('mouseleave', resetPanes);
    dualSection.addEventListener('blur', (event) => {
        if (!dualSection.contains(event.relatedTarget)) {
            resetPanes();
        }
    }, true);
}

// 스크롤 페이드인 애니메이션 설정
function setupFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // 15% 보일 때 트리거
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // 한 번만 실행
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}