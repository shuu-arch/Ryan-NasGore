document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("active");
                }, idx * 50);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));


    document.querySelectorAll(".img-box").forEach((box) => {
        box.addEventListener("touchstart", () => box.classList.add("touched"), { passive: true });
        box.addEventListener("touchend", () => {
            setTimeout(() => box.classList.remove("touched"), 500);
        }, { passive: true });
    });
}); 
