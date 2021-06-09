$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $('.collapse.in').toggleClass('in');
    $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    $('#info').addClass('d-none');
});
$('.fa-info').on('click',function(){
    $('#info').toggleClass('d-none');
    $('#sidebar').removeClass('active');
});

