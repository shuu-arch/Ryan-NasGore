document.addEventListener("DOMContentLoaded", () => {
    // 0. Lightweight iOS 26 Liquid Glass Refraction Generator
    const isChromium = !!window.chrome && !/Firefox/.test(navigator.userAgent);
    const svgContainer = document.getElementById("liquid-svg-defs");

    function buildRefractionFilter(id, el, radius, bezel, scale) {
        if (!isChromium || !svgContainer || !el) return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const w = Math.max(Math.round(rect.width), 80);
        const h = Math.max(Math.round(rect.height), 40);
        const r = Math.min(radius, Math.floor(Math.min(w, h) / 2));

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        const imgData = ctx.createImageData(w, h);
        const data = imgData.data;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const px = Math.abs(x - w / 2) - (w / 2 - r);
                const py = Math.abs(y - h / 2) - (h / 2 - r);
                const distToEdge = r - (Math.hypot(Math.max(px, 0), Math.max(py, 0)) + Math.min(Math.max(px, py), 0));

                let rVal = 128;
                let gVal = 128;

                if (distToEdge < bezel && distToEdge >= 0) {
                    const t = 1 - distToEdge / bezel;
                    const bend = Math.pow(t, 2) * 110;
                    const nx = (x - w / 2) / (w / 2);
                    const ny = (y - h / 2) / (h / 2);
                    rVal = Math.max(0, Math.min(255, Math.round(128 - nx * bend)));
                    gVal = Math.max(0, Math.min(255, Math.round(128 - ny * bend)));
                } else if (distToEdge >= bezel) {
                    const nx = (x - w / 2) / (w / 2);
                    const ny = (y - h / 2) / (h / 2);
                    rVal = Math.round(128 - nx * 14);
                    gVal = Math.round(128 - ny * 14);
                }

                const idx = (y * w + x) * 4;
                data[idx] = rVal;
                data[idx + 1] = gVal;
                data[idx + 2] = 128;
                data[idx + 3] = 255;
            }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");

        let defs = svgContainer.querySelector("defs");
        if (!defs) {
            defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            svgContainer.appendChild(defs);
        }

        const oldFilter = document.getElementById(id);
        if (oldFilter) oldFilter.remove();

        const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filter.setAttribute("id", id);
        filter.setAttribute("x", "0%");
        filter.setAttribute("y", "0%");
        filter.setAttribute("width", "100%");
        filter.setAttribute("height", "100%");
        filter.setAttribute("color-interpolation-filters", "sRGB");

        const feImg = document.createElementNS("http://www.w3.org/2000/svg", "feImage");
        feImg.setAttribute("href", dataUrl);
        feImg.setAttribute("result", "map");
        feImg.setAttribute("preserveAspectRatio", "none");

        const feDisp = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
        feDisp.setAttribute("in", "SourceGraphic");
        feDisp.setAttribute("in2", "map");
        feDisp.setAttribute("scale", String(scale));
        feDisp.setAttribute("xChannelSelector", "R");
        feDisp.setAttribute("yChannelSelector", "G");

        filter.appendChild(feImg);
        filter.appendChild(feDisp);
        defs.appendChild(filter);
        el.classList.add("has-refraction");
    }

    function initLiquidGlassRefraction() {
        buildRefractionFilter("refract-navbar", document.querySelector(".navbar"), 999, 14, 18);
        buildRefractionFilter("refract-fab", document.querySelector(".ai-fab"), 999, 12, 16);
        buildRefractionFilter("refract-popup", document.querySelector(".ai-popup"), 22, 16, 14);
    }

    initLiquidGlassRefraction();
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initLiquidGlassRefraction, 250);
    }, { passive: true });

    // 1. Scroll Progress Bar
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.prepend(progressBar);

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
    }, { passive: true });

    // 2. Crisp Fade Reveal
    const revealElements = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.06,
        rootMargin: "0px 0px -16px 0px"
    });

    revealElements.forEach((el) => revealObserver.observe(el));

    // 3. Category Filter
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectItems = document.querySelectorAll(".project-item");

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");
            projectItems.forEach((item) => {
                const categories = item.getAttribute("data-category") || "";
                if (filterValue === "all" || categories.includes(filterValue)) {
                    item.classList.remove("hidden");
                    item.classList.add("active");
                } else {
                    item.classList.add("hidden");
                }
            });
        });
    });

    // 4. Stat Counter (+45%)
    const statNum = document.querySelector(".stat-num");
    if (statNum) {
        const statObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = 45;
                    let current = 0;
                    const timer = setInterval(() => {
                        current += 1;
                        statNum.textContent = `+${current}%`;
                        if (current >= target) {
                            statNum.textContent = `+${target}%`;
                            clearInterval(timer);
                        }
                    }, 20);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statObserver.observe(statNum);
    }

    // 5. Lightbox Modal (Pop-up Detail Showcase dengan Liquid Glass)
    const lightbox = document.getElementById("lightbox");
    const lightboxPanel = document.getElementById("lightbox-panel");
    const lightboxImg = document.getElementById("lightbox-img");
    const lbTitle = document.getElementById("lb-title");
    const lbTools = document.getElementById("lb-tools");
    const lbDesc = document.getElementById("lb-desc");
    const closeLb = document.querySelector(".close-lb");
    const imgFrames = document.querySelectorAll(".img-frame");

    const openModal = (frame) => {
        const img = frame.querySelector("img");
        if (!img || !lightbox) return;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "Fullscreen Preview";
        lbTitle.textContent = frame.getAttribute("data-title") || img.alt || "Detail Karya";
        lbTools.textContent = frame.getAttribute("data-tools") || "GRAPHIC DESIGN";
        lbDesc.textContent = frame.getAttribute("data-desc") || "";

        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";

        requestAnimationFrame(() => {
            buildRefractionFilter("refract-lightbox", lightboxPanel, 24, 18, 16);
        });
    };

    imgFrames.forEach((frame) => {
        frame.setAttribute("tabindex", "0");
        frame.setAttribute("role", "button");

        frame.addEventListener("click", () => openModal(frame));
        frame.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal(frame);
            }
        });
    });

    const closeModal = () => {
        if (!lightbox) return;
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
        setTimeout(() => {
            if (!lightbox.classList.contains("open")) {
                lightboxImg.src = "";
            }
        }, 250);
    };

    if (closeLb) {
        closeLb.addEventListener("click", closeModal);
    }

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeModal();
        });
    }

    // 6. Copy Handle + Toast
    const copyBtn = document.getElementById("copy-handle-btn");
    const toast = document.getElementById("toast");

    if (copyBtn && toast) {
        copyBtn.addEventListener("click", async () => {
            const textToCopy = copyBtn.getAttribute("data-copy") || "@ryanramadhani_exe";
            try {
                await navigator.clipboard.writeText(textToCopy);
                toast.textContent = `Username ${textToCopy} disalin!`;
            } catch {
                toast.textContent = `Username: ${textToCopy}`;
            }
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 2500);
        });
    }

    // 7. Floating Reiha-AI Project Widget
    const aiFabBtn = document.getElementById("ai-fab-btn");
    const aiPopup = document.getElementById("ai-popup");
    const aiCloseBtn = document.getElementById("ai-close-btn");

    const toggleAiPopup = (forceState) => {
        if (!aiFabBtn || !aiPopup) return;
        const isOpen = typeof forceState === "boolean"
            ? forceState
            : !aiPopup.classList.contains("open");

        aiPopup.classList.toggle("open", isOpen);
        aiFabBtn.setAttribute("aria-expanded", String(isOpen));
        aiPopup.setAttribute("aria-hidden", String(!isOpen));

        if (isOpen) {
            requestAnimationFrame(() => {
                buildRefractionFilter("refract-popup", aiPopup, 22, 16, 14);
            });
        }
    };

    if (aiFabBtn && aiPopup) {
        aiFabBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleAiPopup();
        });

        if (aiCloseBtn) {
            aiCloseBtn.addEventListener("click", () => toggleAiPopup(false));
        }

        document.addEventListener("click", (e) => {
            if (aiPopup.classList.contains("open") && !aiPopup.contains(e.target) && !aiFabBtn.contains(e.target)) {
                toggleAiPopup(false);
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            toggleAiPopup(false);
        }
    });
});
