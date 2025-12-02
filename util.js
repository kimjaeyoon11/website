// util.js - 유틸리티 함수들

// 비디오 설정
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

// Vanilla Tilt 설정
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
        
        const tiltTarget = heroSignature.querySelector('.hero-signature-svg, .hero-signature-img-fallback, .hero-signature-img');
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