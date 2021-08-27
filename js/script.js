$(document).ready(function(){

    $(".set_acc > .title_acc").on("click", function(){
      if($(this).hasClass('active')){
        $(this).removeClass("active").removeClass("text_green");
        $(this).siblings('.content_acc').slideUp(100);
      }else{
        $(".set_acc > .title_acc").removeClass("active").removeClass("text_green");
        $(this).addClass("active").addClass("text_green");
        $('.content_acc').slideUp(100);
        $(this).siblings('.content_acc').slideDown(100);
      }    
    });

    $('.title_chevron').click(function(e) {
        $(this).toggleClass('open').next().slideToggle()
    })
});
const anchors = document.querySelectorAll('a[href*="#"]')

for (let anchor of anchors) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    
    const blockID = anchor.getAttribute('href').substr(1)
    
    document.getElementById(blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}

