$(function(){
    
    const carrousselSpeed = 300 
    $('.carroussel').each(function(i, carroussel){
        if(!$(this).data('index')){
            $(this).attr('data-index', 0)
            $(this).removeData()
        }
        $('.carroussel .carroussel-content *').attr('draggable', false)
        checkIndexCarroussel($(this))
    })

    $('.carroussel .carrousel-navigator-left').click(function(){
        if(!$(this).is('.carrousel-navigator-off')){
            prevCarroussel($(this).parents('.carroussel').eq(0)) ;
        }
    })
    $('.carroussel .carrousel-navigator-right').click(function(){
        if(!$(this).is('.carrousel-navigator-off')){
            nextCarroussel($(this).parents('.carroussel').eq(0)) ;
        }
    })
    $('.carroussel-content').mousedown(function(e){
        $('.carroussel-content').attr('data-onmove', true)
        $('.carroussel-content').attr('data-clientx', e.clientX)
        $('.carroussel-content').attr('data-posleft', parseInt($(this).css('left')))
    })
    $('.carroussel-content').mousemove(function(e){
        $(this).removeData()
        if($(this).data('onmove')){
            const curClientX = $(this).data('clientx')
            const posLeft = $(this).data('posleft')
            
            $(this).css({
                left : `${posLeft + e.clientX - curClientX}px`
            })
        }
    })
    $('.carroussel-content').mouseleave(function(){
        $(this).trigger('mouseup')
    })
    $('.carroussel-content').mouseup(function(e){
        $(this).removeData()
        if($(this).data('onmove')){
            const finalPos = parseInt($(this).css('left'))
            const nbreCarroussel = $(this).find('.carroussel-element').length ;
            const largeurDefilement = $(this).find('.carroussel-element').eq(0).outerWidth(true) ;
            const nbreCardShow = $(this).parents('.carroussel-wrapper').eq(0).innerWidth() / largeurDefilement ;
            
            let direction = ($(this).data('clientx') > e.clientX) ? 0 : 1 ;
            let newIndex = Math.ceil(-finalPos / largeurDefilement) - direction
           
            if(newIndex < 0) newIndex = 0
            else if (newIndex >= nbreCarroussel - nbreCardShow ) newIndex = nbreCarroussel - nbreCardShow

            $carroussel = $(this).parents('.carroussel').eq(0)
            $carroussel.attr('data-index', newIndex)
            $carroussel.find('.carroussel-content').animate({
                left : `-${largeurDefilement * newIndex}px`
            }, carrousselSpeed, "swing")

            $('.carroussel-content').removeAttr('data-onmove')
            $('.carroussel-content').removeAttr('data-clientx')
            $('.carroussel-content').removeAttr('data-posleft')
            checkIndexCarroussel($carroussel)
        }
    })
    function checkIndexCarroussel($carroussel){
        const nbreCarroussel = $carroussel.find('.carroussel-element').length ;
        const largeurDefilement = $carroussel.find('.carroussel-element').eq(0).outerWidth(true) ;
        const nbreCardShow = $carroussel.find('.carroussel-wrapper').innerWidth() / largeurDefilement ;

        $carroussel.removeData()
        if($carroussel.data('index') == 0){
            $carroussel.find('.carrousel-navigator-left').addClass('carrousel-navigator-off')
        }else{
            $carroussel.find('.carrousel-navigator-left').removeClass('carrousel-navigator-off')
        }

        if($carroussel.data('index') == nbreCarroussel - nbreCardShow){
            $carroussel.find('.carrousel-navigator-right').addClass('carrousel-navigator-off')
        }else{
            $carroussel.find('.carrousel-navigator-right').removeClass('carrousel-navigator-off')
        }
    }

    function nextCarroussel($carroussel){
        const largeurDefilement = $carroussel.find('.carroussel-element').eq(0).outerWidth(true) ;
        const index = $carroussel.data('index')

        $carroussel.attr('data-index', index + 1)
        $carroussel.find('.carroussel-content').animate({
            left : `-=${largeurDefilement}px`
        }, carrousselSpeed, "swing")
        $carroussel.removeData()
        checkIndexCarroussel($carroussel)
    }
    function prevCarroussel($carroussel){
        const largeurDefilement = $carroussel.find('.carroussel-element').eq(0).outerWidth(true) ;
        const index = $carroussel.data('index')

        $carroussel.attr('data-index', index - 1)
        $carroussel.find('.carroussel-content').animate({
            left : `+=${largeurDefilement}px`
        }, carrousselSpeed, "swing")
        $carroussel.removeData()
        checkIndexCarroussel($carroussel)
    }
})