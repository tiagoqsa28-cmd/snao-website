// ==========================================
// Fade In Sections
// ==========================================

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.15
});

document.querySelectorAll("section").forEach(section=>{

    section.classList.add("hidden");

    observer.observe(section);

});


// ==========================================
// Dashboard Animation
// ==========================================

const bars=document.querySelectorAll(".fill");

const dashboard=document.querySelector(".dashboard");

let animated=false;

const dashboardObserver=new IntersectionObserver(entries=>{

    if(entries[0].isIntersecting && !animated){

        animated=true;

        bars.forEach(bar=>{

            const width=bar.style.width || getComputedStyle(bar).width;

            const finalWidth=bar.classList.contains("whale") ? "87%"
                :bar.classList.contains("liquidity") ? "74%"
                :bar.classList.contains("sentiment") ? "62%"
                :"31%";

            bar.style.width="0";

            setTimeout(()=>{

                bar.style.transition="width 2s ease";

                bar.style.width=finalWidth;

            },200);

        });

    }

});

dashboardObserver.observe(dashboard);


// ==========================================
// Active Menu
// ==========================================

const sections=document.querySelectorAll("section");
const navLinks=document.querySelectorAll("nav a");

window.addEventListener("scroll",()=>{

    let current="";

    sections.forEach(sec=>{

        const top=window.scrollY;

        const offset=sec.offsetTop-120;

        const height=sec.offsetHeight;

        if(top>=offset && top<offset+height){

            current=sec.getAttribute("id");

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#"+current){

            link.classList.add("active");

        }

    });

});

// ==========================================
// Cursor Glow
// ==========================================

const glow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove",(e)=>{

    glow.style.left = e.clientX + "px";

    glow.style.top = e.clientY + "px";

});

// ==========================================
// Mobile Menu
// ==========================================

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("header nav");

menuToggle.addEventListener("click", () => {

    menuToggle.classList.toggle("active");
    mobileNav.classList.toggle("open");

});

mobileNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        menuToggle.classList.remove("active");
        mobileNav.classList.remove("open");

    });

});