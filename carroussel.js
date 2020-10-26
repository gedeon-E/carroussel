$(function(){
    
    const carrousselSpeed = 300 
    init()

    function init(){
        $('.carroussel .carroussel-content *').attr('draggable', false)
        $('.carroussel').each(function(i, carroussel){
            if(!$(this).data('index')){
                $(this).attr('data-index', 0)
                $(this).removeData()
            }
            insertBille($(this))
            checkIndexCarroussel($(this))
        })
    }

    function insertBille($carroussel){
        const nbreStep = getNbreStep($carroussel) ;
        const $carrousselBille = $carroussel.find('.carroussel-bille').eq(0) ;
        if($carrousselBille[0]){
            for (let i = 1; i < nbreStep ; i++) {
                const $carrousselBilleClone = $carrousselBille.clone() ;
                $carroussel.find('.carroussel-billes').append($carrousselBilleClone)
            }
            $carrousselBille.addClass('target')
        }
    }

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

    $('.carroussel-content').on('touchstart', function(e){
        $(this).trigger('mousedown')
    })
    $('.carroussel-content').mousedown(function(e){
        $('.carroussel-content').attr('data-onmousedown', true)
        $('.carroussel-content').attr('data-clientx', e.clientX)
        $('.carroussel-content').attr('data-posleft', parseInt($(this).css('left')))
    })

    $('.carroussel-content').mousemove(function(e){
        $(this).removeData()
        if($(this).data('onmousedown')){
            $('.carroussel-content').attr('data-moved', true)
            const curClientX = $(this).data('clientx')
            const posLeft = $(this).data('posleft')
            
            $(this).css({
                left : `${posLeft + e.clientX - curClientX}px`
            })
        }
    })
    $('.carroussel-content').on('touchmove', function(e){
        $(this).trigger('mousemove')
    })


    $('.carroussel-content').on('touchleave', function(e){
        $(this).trigger('mouseup')
    })
    $('.carroussel-content').on('touchend', function(e){
        $(this).trigger('mouseup')
    })
    $('.carroussel-content').mouseleave(function(){
        $(this).trigger('mouseup')
    })
    $('.carroussel-content').mouseup(function(e){
        $(this).removeData()
        if($(this).data('moved')){
            const finalPos = parseInt($(this).css('left'))
            const $carroussel = $(this).parents('.carroussel').eq(0) ;
            const nbreCarroussel = getNbreCarroussel($carroussel) ;
            const nbreCardShow = getNbreCardShow($carroussel) 
            const largeurDefilement = getLargeurDefilement($carroussel) 
            
            let direction = ($(this).data('clientx') > e.clientX) ? 0 : 1 ;
            let newIndex = Math.round(
                (-finalPos / largeurDefilement) + .2 )- direction
           
            if(newIndex < 0) newIndex = 0
            else if (newIndex >= nbreCarroussel - nbreCardShow ) newIndex = nbreCarroussel - nbreCardShow

            $carroussel.attr('data-index', newIndex)
            $carroussel.find('.carroussel-content').animate({
                left : `-${largeurDefilement * newIndex}px`
            }, carrousselSpeed, "swing")

            $('.carroussel-content').removeAttr('data-moved')
            checkIndexCarroussel($carroussel)
        }
        $('.carroussel-content').removeAttr('data-onmousedown')
        $('.carroussel-content').removeAttr('data-clientx')
        $('.carroussel-content').removeAttr('data-posleft')
    })
    function checkIndexCarroussel($carroussel){
        const nbreCarroussel = getNbreCarroussel($carroussel) ;
        const nbreCardShow = getNbreCardShow($carroussel) 

        $carroussel.removeData()
        const targetIndex = $carroussel.data('index')
        if(targetIndex == 0){
            $carroussel.find('.carrousel-navigator-left').addClass('carrousel-navigator-off')
        }else{
            $carroussel.find('.carrousel-navigator-left').removeClass('carrousel-navigator-off')
        }

        if(targetIndex == nbreCarroussel - nbreCardShow){
            $carroussel.find('.carrousel-navigator-right').addClass('carrousel-navigator-off')
        }else{
            $carroussel.find('.carrousel-navigator-right').removeClass('carrousel-navigator-off')
        }

        //set bille target
        $carroussel.find('.carroussel-bille.target').removeClass('target') ;
        $carroussel.find('.carroussel-bille').eq(targetIndex).addClass('target') ;
    }

    function nextCarroussel($carroussel){
        const largeurDefilement = getLargeurDefilement($carroussel) ;
        const index = $carroussel.data('index')

        $carroussel.attr('data-index', index + 1)
        $carroussel.find('.carroussel-content').animate({
            left : `-=${largeurDefilement}px`
        }, carrousselSpeed, "swing")
        $carroussel.removeData()
        checkIndexCarroussel($carroussel)
    }
    function prevCarroussel($carroussel){
        const largeurDefilement = getLargeurDefilement($carroussel) ;
        const index = $carroussel.data('index')

        $carroussel.attr('data-index', index - 1)
        $carroussel.find('.carroussel-content').animate({
            left : `+=${largeurDefilement}px`
        }, carrousselSpeed, "swing")
        $carroussel.removeData()
        checkIndexCarroussel($carroussel)
    }
    function getNbreCarroussel($carroussel){
        return $carroussel.find('.carroussel-element').length
    }
    function getLargeurDefilement($carroussel){
        return $carroussel.find('.carroussel-element').eq(0).outerWidth(true) ;
    }
    function getNbreCardShow($carroussel){
        return $carroussel.find('.carroussel-wrapper').eq(0).innerWidth() / getLargeurDefilement($carroussel) ;
    }
    function getNbreStep($carroussel){
        const nbreCarroussel = getNbreCarroussel($carroussel)
        const nbreCardShow = getNbreCardShow($carroussel)
        // const delta1 = nbreCarroussel % nbreCardShow
        // const delta2 = Math.ceil(nbreCarroussel / nbreCardShow)
        // return (delta2 * nbreCardShow) + delta1
        return nbreCarroussel - nbreCardShow + 1
    }
})