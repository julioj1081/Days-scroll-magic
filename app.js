/*BOTON EXPLORE */
/*EXPERIMENTO PARA VER COMO SE VAN A REVELAR LAR IMAGENES 
const btnexplore = document.querySelector(".hike-exp");
window.addEventListener("scroll", scrollReveal);
function scrollReveal(){
    const hikePos = btnexplore.getBoundingClientRect().top;
    const windowHeight = window.innerHeight/1.8;
    if(hikePos < windowHeight){
        btnexplore.style.color = "red";
    }
    
}
*/
let controller;
let slideScene;
let pageScene;
function animateSlides(){
    controller = new ScrollMagic.Controller();
    //Select some things
    const sliders = document.querySelectorAll(".slide");
    const nav = document.querySelector(".nav-header");
    //loop ober each slide
    sliders.forEach((slide, index, slides) =>{
        const revealImg = slide.querySelector(".reveal-img");
        const img = slide.querySelector("img");
        const revealText = slide.querySelector(".reveal-text");
        //GSAP
        /*NECESITAMOS EL GSAP CDN PARA PODER ACTIVARLO CON EL SCROLLMAGIC 
         gsap.to(revealImg, 1, {x: "100%", opacity: 0.5})
         */
        const slideTl = gsap.timeline({
            defaults: {duration: 1, ease: "power2.inOut"}
        });
        slideTl.fromTo(revealImg, {x: "0%"}, {x:"100%", opacity: 0.2});
        /*AGREGAMOS OVERFLOW HIDDEN EN .hero-img y en el body para que no se salga de su caja 
        el -=1 es para aumentar la velocidad de la escala por lo que se ve*/
        //slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
        slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
        slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    
        //CREACION DE LA SCENE
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false
        })
        .setTween(slideTl)
        //.addIndicators({
            //colorStart: "white",
            //colorTrigger: "white",
            //name: "slide"
        //})
        .addTo(controller);

        //NEW ANIMATION
        const pageTl = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
        pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
        pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
        pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
        //NEW SCENE
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: "100%",
            triggerHook: 0
        })
        //.addIndicators({
            //colorStart: "white",
            //colorTrigger: "white",
            //name: "page",
            //indent: 200
        //})
        .setPin(slide, {pushFollowers: false})
        .setTween(pageTl)
        .addTo(controller);
    });
}
/**Cambiamos este llamado de funcion a barba
 * animateSlides();
 */
/*CURSOR CIRCULO */
let mouse = document.querySelector(".cursor");
let mouseTxt = mouse.querySelector("span");
window.addEventListener("mousemove", cursor);
function cursor(e){
    mouse.style.top = e.pageY+"px";
    mouse.style.left = e.pageX+"px";
}
window.addEventListener("mouseover", activeCursor);
function activeCursor(e){
    const item = e.target;
    if(item.id === "logo" || item.classList.contains("burger")){
        mouse.classList.add("nav-active");
    }else{
        mouse.classList.remove("nav-active");
    }
    if(item.classList.contains("explore")){
        mouse.classList.toggle("explore-active");
        /**efecto de titulo */
        gsap.to(".title-swipe", 1,{y:"0%"});
        mouseTxt.innerText = "Tap";
    }else{
        mouse.classList.remove("explore-active");
        mouseTxt.innerText = "";
        gsap.to(".title-swipe", 1,{y:"100%"});
    }
}

/*MENU BURGER */
const burger = document.querySelector(".burger");
burger.addEventListener("click", navToggle);
function navToggle(e){
    if(!e.target.classList.contains("active")){
        e.target.classList.add("active");
        //rota la x en el menu
    gsap.to(".linea1", 0.5, {rotate:45, y:5, background: "black"});
    gsap.to(".linea2", 0.5, {rotate:-45, y: -5, background: "black"});
    gsap.to("#logo", 1, {color: "black"});
    gsap.to(".nav-bar", 1, {clipPath: "circle(2500px at 100% -10%"});
    /**Esto es para quitar el scroll en el menu */
    document.body.classList.add("hide");
    }else{
        e.target.classList.remove("active");
        // rota la x en blanco y su posicion original
        gsap.to(".linea1", 0.5, {rotate:0, y: 0, background: "white"});
        gsap.to(".linea2", 0.5, {rotate:0, y: 0, background: "white"});
        gsap.to("#logo", 1, {color: "white"});
        gsap.to(".nav-bar", 1, {clipPath: "circle(50px at 100% -10%"});
        document.body.classList.remove("hide");
    }
}


/*BARBA PAGE TRANSITION */
const logo = document.querySelector("#logo");
barba.init({
    views: [
        {
        namespace: "home",
        beforeEnter(){
            /**EN VEZ DE LLAMARLO AL INICIO LO LLAMAMOS UNA VEZ QUE CARGE BARBA EN EL INDEX 
             * DESPUES DE QUE SE EJECUTA LA ANIMACION
             * CAMBIA DE PAGINA Y DESTRUYE TODOS LOS CONTROLADORES QUE HICIMOS 
            */
            animateSlides();
            logo.href = "./index.html";
            gsap.fromTo(".nav-header", 1,{y:"100%"},{y:"0%", ease: "power2.inOut"});
        },
        beforeLeave(){
            logo.href = "../index.html";
            slideScene.destroy();
            pageScene.destroy();
            controller.destroy();
        }
    },
    {
        namespace: "fashion",
        beforeEnter(){
            detailAnimation();
        },
        beforeLeave(){
            logo.href = "../index.html";
            slideScene.destroy();
            pageScene.destroy();
            controller.destroy();
        }
        
    }
],
/*CREAMOS LAS HOJAS DE ESTILO AL MOMENTO DE LA TRANSICION */
transitions: [
    {
        leave({current,next}){
            let done = this.async();
            //ANIMACION AL MOMENTO DE LA TRANSISION
            const tl = gsap.timeline({defaults: {ease: "power2.inOut"}});
            tl.fromTo(current.container,1,{opacity:1},{opacity: 0});
            tl.fromTo(".swipe", 0.75, {x: "-100%"}, {x: "0%", onComplete: done}, "-=0.5");
            tl.fromTo(".nav-header",1,{y:"0%"}, {y: "100%", ease: "power2.inOut"});
        },
        enter({current, next}){
            let done = this.async();
            /**CUANDO CARGE LA OTRA PAGINA SE IRA EN LA POSICION 0 0 OSEA HASTA EL PRINCIPIO DE LA PAGINA */
            window.scrollTo(0,0);
            const tl = gsap.timeline({defaults: {ease: "power2.inOut"}});
            tl.fromTo(next.container,
                1,
                {opacity:0},
                {opacity: 1});
            tl.fromTo(".swipe", 0.85, {x: "0%"}, {x: "100%",stagger: 0.25, onComplete: done}, "-=0.5");
            /**ARREGLO DE BUG */
            tl.fromTo(".nav-header",1,{y:"-100%"}, {y: "0%", ease: "power2.inOut"});

        }
    }
]
});

/*DETAILS SLIDE */
let detailScene;
function detailAnimation(){
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll(".detail-slide");
    slides.forEach((slide,index,slides) =>{
        const slideTl = gsap.timeline({defaults:{duration:1}});
        let nextSlide = slides.length -1 === index ? "end" : slides[index+1];
        const nextIng = nextSlide.querySelector("img");
        /*ANIMACION DE ARRIBA Y ABAJO */
        slideTl.fromTo(slide, {opacity:1},{opacity:0});
        slideTl.fromTo(nextSlide, {opacity:0}, {opacity:1}, "-=1");
        /*NEXT img */
        slideTl.fromTo(nextIng, {x: "50%"}, {x:"0%"});
        //Scenee
        detailScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: "100%",
            triggerHook: 0
        })
        .setPin(slide,{pushFollowers:false})
        .setTween(slideTl)
        //.addIndicators({
            //colorStart: "white",
            //colorTrigger: "white",
            //name: "slide"
        //})
        .addTo(controller);
    });
}
/*
function detailAnimation() {
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll(".detail-slide");
    slides.forEach((slide, index, slides) => {
      const slideTl = gsap.timeline({ defaults: { duration: 1 } });
      let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
      const nextImg = nextSlide.querySelector("img");
      slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
      slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
      slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });
      //Scene
      detailScene = new ScrollMagic.Scene({
        triggerElement: slide,
        duration: "100%",
        triggerHook: 0
      })
        .setPin(slide, { pushFollowers: false })
        .setTween(slideTl)
        // .addIndicators({
        //   colorStart: "white",
        //   colorTrigger: "white",
        //   name: "detailScene"
        // })
        .addTo(controller);
    });
  }
  */