// --- [ 1. 초기화 및 라이브러리 설정 ] ---

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// Lenis (Smooth Scroll) 초기화
let lenis;

function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    // GSAP ScrollTrigger와 Lenis 연동
    lenis.on('scroll', ScrollTrigger.update);
}

// 초기화 함수
async function init() {
    // 1. 스무스 스크롤 시작
    initSmoothScroll();

    // 2. 비디오 설정
    setupVideo();

    // 3. GSAP 애니메이션 설정
    setupGSAPAnimations();
    
    // 4. 챕터 네비게이션 설정
    setupChapterNavigation();
    
    // 5. Vanilla Tilt 설정
    setupTiltEffect();
    
    // 6. 네비게이션 메뉴 애니메이션 설정
    setupNavigationMenu();
}

// DOM이 준비되면 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// --- [ 2. 비디오 설정 ] ---
function setupVideo() {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo && heroVideo.querySelector('source')) {
        heroVideo.style.display = 'block';
        const imagePlaceholder = document.querySelector('.hero-image-placeholder');
        if (imagePlaceholder) {
            imagePlaceholder.style.display = 'none';
        }
        
        heroVideo.addEventListener('loadeddata', () => {
            heroVideo.play().catch(err => console.log('비디오 자동 재생 실패:', err));
        });
    }
}

// --- [ 3. GSAP 애니메이션 설정 ] ---
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
            scrub: 2.5,
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
                color: "#000000",
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

    // 사인 SVG 그리기 애니메이션
    if (heroSignature) {
        heroTimeline.to(heroSignature, {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.out"
        }, 2.5);
        
        convertImageToSVG().then(() => {
            const signatureSVG = document.querySelector('.hero-signature-svg');
            let paths = Array.from(signatureSVG.querySelectorAll('path'));
            const viewBox = signatureSVG.viewBox.baseVal || { width: 400, height: 200 };
            const viewArea = viewBox.width * viewBox.height || 400 * 200;

            // 큰 배경 패스를 제거
            paths = paths.filter(path => {
                const bbox = path.getBBox();
                const area = bbox.width * bbox.height;
                if (viewArea > 0 && area / viewArea > 0.85) {
                    path.remove();
                    return false;
                }
                return true;
            });

            console.log('SVG 변환 완료, path 개수:', paths.length);
            
            if (paths.length > 0) {
                paths.forEach((path, index) => {
                    const pathLength = path.getTotalLength();
                    path.style.strokeDasharray = pathLength;
                    path.style.strokeDashoffset = pathLength;
                    path.style.opacity = 0;
                    
                    const delay = 2.5 + (index * 0.12);
                    
                    heroTimeline.to(path, {
                        opacity: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    }, delay);
                    
                    heroTimeline.to(path, {
                        strokeDashoffset: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    }, delay + 0.15);
                });
                
                const totalDuration = 2.5 + (paths.length * 0.12) + 0.8;
                heroTimeline.call(() => {
                    console.log('사인 애니메이션 완료, Vanilla-Tilt 초기화');
                    initSignatureTilt();
                }, null, totalDuration);
            }
        }).catch(err => {
            console.error('SVG 변환 실패, 이미지 직접 표시:', err);
            const signatureSVG = document.querySelector('.hero-signature-svg');
            const signatureImg = document.querySelector('.hero-signature-img-source');

            if (signatureSVG && signatureImg) {
                signatureSVG.style.display = 'none';
                const img = document.createElement('img');
                img.src = signatureImg.src;
                img.className = 'hero-signature-img-fallback';
                heroSignature.appendChild(img);
                setTimeout(() => initSignatureTilt(), 100);
            }
        });
    }

    // 2. Chapter 1 등장 애니메이션
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
    
    // 4. 이도류 스플릿 뷰 인터랙션
    setupDualWielderSplitView();

    // 5. 다른 챕터 섹션들 페이드인
    const otherChapters = document.querySelectorAll('.chapter-section:not(#chapter-1)');
    otherChapters.forEach((chapter) => {
        gsap.fromTo(chapter,
            { opacity: 0, y: 50 },
            {
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

// --- [ 4. 챕터 네비게이션 스크롤 ] ---
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

// --- [ 5. Vanilla Tilt 설정 ] ---
function setupTiltEffect() {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".stat-item, .achievement-item"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.05
        });
    }
}

// 이미지를 SVG로 변환하는 함수 (ImageTracer.js 사용)
function convertImageToSVG() {
    return new Promise((resolve, reject) => {
        const signatureImg = document.querySelector('.hero-signature-img-source');
        const signatureSVG = document.querySelector('.hero-signature-svg');
        
        if (!signatureImg || !signatureSVG) {
            reject('이미지 또는 SVG 요소를 찾을 수 없습니다');
            return;
        }
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onerror = () => reject('이미지 로드 실패');
        
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxWidth = 800;
                const maxHeight = 400;
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                if (typeof ImageTracer !== 'undefined') {
                    const options = {
                        ltres: 1, qtres: 1, pathomit: 10, colorsampling: 0,
                        numberofcolors: 2, mincolorratio: 0, colorquantcycles: 1,
                        layering: 0, strokewidth: 2, linefilter: true, scale: 1,
                        roundcoords: 1, viewbox: true, desc: false, lcpr: 0,
                        qcpr: 0, blurradius: 0, blurdelta: 20
                    };
                    
                    ImageTracer.imageToSVG(canvas.toDataURL('image/png'), (svgstr) => {
                        try {
                            const parser = new DOMParser();
                            const svgDoc = parser.parseFromString(svgstr, 'image/svg+xml');
                            const svgPaths = svgDoc.querySelectorAll('path');
                            
                            if (svgPaths.length === 0) {
                                reject('SVG path를 찾을 수 없습니다');
                                return;
                            }
                            
                            const svgElement = svgDoc.querySelector('svg');
                            const viewBox = svgElement ? svgElement.getAttribute('viewBox') : null;
                            if (viewBox) {
                                signatureSVG.setAttribute('viewBox', viewBox);
                            } else {
                                signatureSVG.setAttribute('viewBox', `0 0 ${width} ${height}`);
                            }
                            
                            svgPaths.forEach(path => {
                                const newPath = path.cloneNode(true);
                                newPath.setAttribute('fill', 'none');
                                newPath.setAttribute('stroke', '#ffffff');
                                newPath.setAttribute('stroke-width', '2');
                                newPath.setAttribute('stroke-linecap', 'round');
                                newPath.setAttribute('stroke-linejoin', 'round');
                                signatureSVG.appendChild(newPath);
                            });
                            
                            resolve();
                        } catch (e) {
                            reject('SVG 파싱 중 오류: ' + e.message);
                        }
                    }, options);
                } else {
                    console.warn('ImageTracer.js가 로드되지 않았습니다.');
                    createSimpleSVGPath(canvas, signatureSVG, width, height).then(resolve).catch(reject);
                }
            } catch (e) {
                reject('SVG 변환 중 오류: ' + e.message);
            }
        };
        
        img.src = signatureImg.src;
    });
}

// 간단한 SVG path 생성 (ImageTracer가 없을 때 대체 방법)
function createSimpleSVGPath(canvas, svgElement, width, height) {
    return new Promise((resolve) => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const paths = [];
        const visited = new Set();
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                
                if (brightness < 128 && !visited.has(`${x},${y}`)) {
                    const path = tracePath(imageData, x, y, width, height, visited);
                    if (path.length > 10) {
                        paths.push(path);
                    }
                }
            }
        }
        
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
        
        paths.forEach(path => {
            if (path.length > 0) {
                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                let d = `M ${path[0].x} ${path[0].y}`;
                for (let i = 1; i < path.length; i++) {
                    d += ` L ${path[i].x} ${path[i].y}`;
                }
                pathElement.setAttribute('d', d);
                pathElement.setAttribute('fill', 'none');
                pathElement.setAttribute('stroke', '#ffffff');
                pathElement.setAttribute('stroke-width', '2');
                pathElement.setAttribute('stroke-linecap', 'round');
                pathElement.setAttribute('stroke-linejoin', 'round');
                svgElement.appendChild(pathElement);
            }
        });
        
        resolve();
    });
}

// 경로 추적 함수
function tracePath(imageData, startX, startY, width, height, visited) {
    const path = [];
    const stack = [[startX, startY]];
    const data = imageData.data;
    
    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const key = `${x},${y}`;
        
        if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) {
            continue;
        }
        
        const idx = (y * width + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        
        if (brightness < 128) {
            visited.add(key);
            path.push({ x, y });
            
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    stack.push([x + dx, y + dy]);
                }
            }
        }
    }
    
    return path;
}

// 사인 이미지에 Vanilla-Tilt 효과 초기화
function initSignatureTilt() {
    const heroSignature = document.querySelector('.hero-signature-wrapper');
    if (heroSignature && typeof VanillaTilt !== 'undefined') {
        if (heroSignature.vanillaTilt) {
            heroSignature.vanillaTilt.destroy();
        }
        
        const tiltTarget = heroSignature.querySelector('.hero-signature-svg, .hero-signature-img-fallback');
        if (tiltTarget) {
            VanillaTilt.init(tiltTarget, {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
                scale: 1.0,
                perspective: 1000,
                transition: true,
                gyroscope: false,
                reset: true
            });
        } else {
            VanillaTilt.init(heroSignature, {
                max: 5,
                speed: 400,
                glare: false,
                scale: 1.0,
                perspective: 1000,
                transition: true,
                gyroscope: false,
                reset: true
            });
        }
    }
}

// --- [ 6. 네비게이션 메뉴 애니메이션 설정 ] ---
function setupNavigationMenu() {
    const navHam = document.querySelector('.nav-ham');
    const navMenu = document.querySelector('.nav-menu-w');
    const navLinks = document.querySelectorAll('.nav-menu-link-w');
    
    // 햄버거 메뉴 클릭 이벤트
    if (navHam && navMenu) {
        navHam.addEventListener('click', () => {
            // active 클래스 토글
            navHam.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // aria-expanded 속성 업데이트
            const isExpanded = navHam.classList.contains('active');
            navHam.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // 메뉴 링크 호버 애니메이션
    navLinks.forEach(element => {
        const textElement = element.querySelector('.nav-menu-link-text');
        if (textElement) {
            element.addEventListener('mouseenter', () => {
                gsap.to(textElement, {
                    color: 'var(--ohtani-blue)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(textElement, {
                    color: 'var(--text-color)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        }
        
        // 메뉴 링크 클릭 시 메뉴 닫기
        element.addEventListener('click', () => {
            if (navHam && navMenu) {
                navHam.classList.remove('active');
                navMenu.classList.remove('active');
                navHam.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// 사인 이미지에 Vanilla-Tilt 효과 초기화
function initSignatureTilt() {
    const heroSignature = document.querySelector('.hero-signature-wrapper');
    if (heroSignature && typeof VanillaTilt !== 'undefined') {
        if (heroSignature.vanillaTilt) {
            heroSignature.vanillaTilt.destroy();
        }
        
        const tiltTarget = heroSignature.querySelector('.hero-signature-svg, .hero-signature-img-fallback');
        if (tiltTarget) {
            VanillaTilt.init(tiltTarget, {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
                scale: 1.0,
                perspective: 1000,
                transition: true,
                gyroscope: false,
                reset: true
            });
        } else {
            VanillaTilt.init(heroSignature, {
                max: 5,
                speed: 400,
                glare: false,
                scale: 1.0,
                perspective: 1000,
                transition: true,
                gyroscope: false,
                reset: true
            });
        }
    }
}

// --- [ 6. 네비게이션 메뉴 애니메이션 설정 ] ---
function setupNavigationMenu() {
    const navHam = document.querySelector('.nav-ham');
    const navMenu = document.querySelector('.nav-menu-w');
    const navLinks = document.querySelectorAll('.nav-menu-link-w');
    
    // 햄버거 메뉴 클릭 이벤트
    if (navHam && navMenu) {
        navHam.addEventListener('click', () => {
            // active 클래스 토글
            navHam.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // aria-expanded 속성 업데이트
            const isExpanded = navHam.classList.contains('active');
            navHam.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // 메뉴 링크 호버 애니메이션
    navLinks.forEach(element => {
        const textElement = element.querySelector('.nav-menu-link-text');
        if (textElement) {
            element.addEventListener('mouseenter', () => {
                gsap.to(textElement, {
                    color: 'var(--ohtani-blue)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(textElement, {
                    color: 'var(--text-color)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        }
        
        // 메뉴 링크 클릭 시 메뉴 닫기
        element.addEventListener('click', () => {
            if (navHam && navMenu) {
                navHam.classList.remove('active');
                navMenu.classList.remove('active');
                navHam.setAttribute('aria-expanded', 'false');
            }
        });
    });
}