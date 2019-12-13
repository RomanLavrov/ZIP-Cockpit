require('./bootstrap');

$(document).ready(function () {

    navToggle();
    cardToggle('#warning-collapse');
    cardToggle('#presence-collapse');
    cardToggle('#climat-collapse');
});

function navToggle() {
    var toggleButton = document.getElementById('nav-toggle');
    toggleButton.onclick = function () {
        var panel = document.getElementsByClassName('nav-side')[0];
        var navButtons = $('.p-2.nav-active');

        if (panel.classList.contains('nav-collapsed')) {
            panel.classList.remove('nav-collapsed');
            panel.getElementsByClassName('p-2')[0].classList.remove("d-none");
            $.each(navButtons, function (index, value) {
                navButtons[index].classList.remove("d-none");
            })
        } else {
            panel.classList.add('nav-collapsed');
            panel.getElementsByClassName('p-2')[0].classList.add("d-none");
            //  panel.getElementsByClassName("p-2 nav-active");
            $.each(navButtons, function (index, value) {
                navButtons[index].classList.add("d-none");
            })

        }
    }
};

function cardToggle(collapseButtonId){
    var collapseButton = $(collapseButtonId);
    collapseButton.click(function () {
        if (!collapseButton.parents(".card-wrap").children('.card-content')[0].classList.contains("d-none")) {
            collapseButton.parents(".card-wrap").children('.card-content').addClass("d-none");
            collapseButton.css('transform', 'rotate(-90deg)');
            collapseButton.parents(".card-wrap").children('.card-header').css("border-radius", "10px");
        } else {
            collapseButton.parents(".card-wrap").children('.card-content').removeClass("d-none");
            collapseButton.css('transform', 'rotate(0deg)');
            collapseButton.parents(".card-wrap").children('.card-header').css("border-radius", "0px");
        }
    })
}

