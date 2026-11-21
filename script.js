document.addEventListener("DOMContentLoaded", () => {
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

    // 2. Scroll Reveal
    const revealElements = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("active");
                }, index * 45);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -24px 0px"
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
                    }, 22);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statObserver.observe(statNum);
    }

    // 5. Lightbox Modal
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lbTitle = document.getElementById("lb-title");
    const lbTools = document.getElementById("lb-tools");
    const lbDesc = document.getElementById("lb-desc");
    const closeLb = document.querySelector(".close-lb");
    const imgFrames = document.querySelectorAll(".img-frame");

    imgFrames.forEach((frame) => {
        frame.addEventListener("click", () => {
            const img = frame.querySelector("img");
            if (!img) return;
            lightboxImg.src = img.src;
            lbTitle.textContent = frame.getAttribute("data-title") || img.alt || "Detail Karya";
            lbTools.textContent = frame.getAttribute("data-tools") || "GRAPHIC DESIGN";
            lbDesc.textContent = frame.getAttribute("data-desc") || "";
            lightbox.classList.add("open");
        });
    });

    const closeModal = () => {
        lightbox.classList.remove("open");
        setTimeout(() => { lightboxImg.src = ""; }, 200);
    };

    closeLb.addEventListener("click", closeModal);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeModal();
    });

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

    // 7. Floating AI Project Pop-up Widget
    const aiFabBtn = document.getElementById("ai-fab-btn");
    const aiPopup = document.getElementById("ai-popup");
    const aiCloseBtn = document.getElementById("ai-close-btn");

    if (aiFabBtn && aiPopup) {
        const toggleAiPopup = (forceState) => {
            const isOpen = typeof forceState === "boolean"
                ? forceState
                : !aiPopup.classList.contains("open");

            aiPopup.classList.toggle("open", isOpen);
            aiFabBtn.setAttribute("aria-expanded", String(isOpen));
            aiPopup.setAttribute("aria-hidden", String(!isOpen));
        };

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
});
