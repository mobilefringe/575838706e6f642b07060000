function init(e){
    $('<div class="modal-backdrop custom_backdrop"><img src="http://kodekloud.s3.amazonaws.com/sites/554a79236e6f64713f000000/69e8cd982124dc73de1f5a67a627ee75/loading.gif" class="" alt=""></div>').appendTo(document.body);
    $('.open_menu').click(function(e){
        e.preventDefault();
        $('body').addClass('no_scroll');
        $('.mobile_menu_container').addClass('active_menu')
    });
    $('#close_menu').click(function(e){
        e.preventDefault();
        $('body').removeClass('no_scroll');
        $('.mobile_menu_container').removeClass('active_menu');
        $('.sub_menu.hidden_now').css('display', "none")
        $('.plus_icon').show();
        $('.minus_icon.menu_icon').hide()
    });
    
    $('.submenu_expander').click(function(e){
		e.preventDefault()
		if ($(this).hasClass('open') == false){
        	$('.open').next().slideToggle();
        	$('.open').find('img').toggle();
        	$('.open').toggleClass('open')
		}
		$(this).next().slideToggle();
		$(this).find('img').toggle();
		$(this).toggleClass('open')
	})
	
	$('html').click(function() {
        $('body').removeClass('no_scroll');
        $('.mobile_menu_container').removeClass('active_menu')
        $('.sub_menu.hidden_now').css('display', "none")
        $('.plus_icon').show()
        $('.minus_icon.menu_icon').hide()
    });
    
    $('.mobile_menu_container, .open_menu').click(function(event){
        event.stopPropagation();
    });
    
    $('#option_selector').change(function(){
        window.location = $(this).val();
    })

}

function show_content(){
    $('.yield').fadeIn();
    $(".modal-backdrop").remove();
    var d = new Date();
    var n = d.getDay();
    var today_hours = getTodaysHours();
    renderHomeHours('#home_hours_container', '#home_hours_template', today_hours)
    renderHomeHours('#home_hours_container3', '#home_hours_template3', getTodaysHours())
    $.each( getPropertyHours(), function(i,v){
        if(v.is_closed == true){
            var hours_day = new Date(v.holiday_date + "T07:00:00Z")
            if(hours_day.setHours(0, 0, 0, 0) == d.setHours(0, 0, 0, 0)){
                $('.hours_today').text("Closed Today")
            }
        } 
        if(v.is_holiday == true){
            var hours_day = new Date(v.holiday_date + "T07:00:00Z")
            if(hours_day.setHours(0, 0, 0, 0) == d.setHours(0, 0, 0, 0)){
                console.log(v)
                var open_time = new Date (v.open_time);
                var close_time = new Date (v.close_time);
                v.open_time = convert_hour(open_time);
                v.close_time = convert_hour(close_time);
                v.h = v.open_time+ " - " + v.close_time;
                $('#hours_home').text(v.h)
            }
        }
        
    })
    var events = getEventsList();
    var news_exist = false;
    var contests_exist = false;
    $.each(events, function(i, v){
        if(($.inArray("news", v.tags) != -1) && showOnWeb(v)){
            news_exist = true;
        }
        if(($.inArray("contests", v.tags) != -1) && showOnWeb(v)){
            contests_exist = true;
        }
    })
    if (news_exist == false){
        // $('.news_link').hide()
    }
    if (contests_exist == false){
        // $('.contest_link').hide()
    }
    
    
}

function show_cat_stores(){
    $('.show_cat_stores').click(function(e){
        var visible_row = 0
        var cat_id = $(this).attr('data-id');
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        var rows = $('.cats_row');
        rows.hide();
        $('#no_promo_in_category').hide();
        $('.store_initial').hide();
        $('#cat_name_header').text($(this).text());
        $('#cat_name_header').css('display', 'block');
        $.each(rows, function(i, val){
            var cat_array = val.getAttribute('data-cat').split(',');
            if ($.inArray(cat_id, cat_array) >= 0){
                $(val).show();
                visible_row++;
            }
        });
        if(visible_row == 0){
            $('#no_promo_in_category').show();
        }
        
        e.preventDefault();
    });
    $('.show_all_stores').click(function(e){
        $('#no_promo_in_category').hide();
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        var rows = $('.cats_row');
        rows.show();
        $.each($('.store_initial'), function(i, val){
           if ($(val).text().length > 0){
               $(val).show();
           } 
        });
        $('#cat_name_header').hide();
        e.preventDefault();
    });
    
}

function show_pin(param){
	store_id = $(param).attr('store_id');
	if($("#"+store_id).is(":visible")){
		$("."+store_id).hide();				
		$("#"+store_id).hide();
		$("#no_pin_"+store_id).show();
		$("#show_pin_"+store_id).hide();
		$("#m_no_pin_"+store_id).show();
		$("#m_show_pin_"+store_id).hide();
	}else{
		$(".marker").hide();
		$("#"+store_id).show();
		$("#"+store_id).click();
		$("#no_pin_"+store_id).hide();
		$("#show_pin_"+store_id).show();
		$("#m_no_pin_"+store_id).hide();
		$("#m_show_pin_"+store_id).show();
	}
	$('.stores_table').hide()
	
	return false;
}

function load_more(num){
    var n = parseInt(num);
    for(i=n; i < n+10; i++){
        
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    if(i >= getAllPublishedPosts().length+1){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}

function load_more_2(num, l){
    var n = parseInt(num);
    for(i=n; i < n+2; i++){
        
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    if(i >= l+1){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}

function drop_pin(id, map){

    var coords = map.get_coords(id);
    var height = parseInt(coords["height"])
    var width = parseInt(coords["width"])
    var x_offset = (parseInt(width) / 2);
    var y_offset = (parseInt(height) /2);
    
    map.setMarks([{ xy: [coords["x"] - 15 + x_offset, coords["y"] - 55 + y_offset],
              attrs: {
                        src:  'http://assets.codecloudapp.com/sites/57b338c76e6f642abb010000/image/png/1463000912000/pin2.png'     // image for marker
                      }
        }
        ])
        // map.setViewBox(id);
        map.selectRegion(id);
}
    
function get_day(id){
    switch(id) {
        case 0:
            return ("Sunday");
            break;
        case 1:
            return ("Monday");
            break;
        case 2:
            return ("Tuesday");
            break;
        case 3:
            return ("Wednesday");
            break;
        case 4:
            return ("Thursday");
            break;
        case 5:
            return ("Friday");
            break;
        case 6:
            return ("Saturday");
            break;
    }
}


function convert_hour(d){
    var h = (d.getUTCHours());
    var m = addZero(d.getUTCMinutes());
    var s = addZero(d.getUTCSeconds());
    if (h >= 12) {
        if ( h != 12) {
            h = h - 12;    
        }
        
        i = "PM"
    } else {
        i = "AM"
    }
    return h+":"+m+i;
}



function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function get_month (id){
    var month = "";
    switch(id) {
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:
            month = "December";
            break;
            
    }
    return month;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function sortByWebDate(a, b){
       
    var aDate = a.show_on_web_date;
    var bDate = b.show_on_web_date;

    return ((aDate > bDate) ? -1 : ((aDate < bDate) ? 1 : 0));
}

function dateToString(dateString){
    var datePart = dateString.split('T');
    var dateItem = datePart[0].split('-');
    var dateFormat = new Date(dateItem[0], dateItem[1]-1, dateItem[2]);
  
    return dateFormat.toDateString();
}

function sortByDate(a, b){
       
    var aDate = a.publish_date;
    var bDate = b.publish_date;

    return ((aDate > bDate) ? -1 : ((aDate < bDate) ? 1 : 0));
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function in_my_time_zone(hour, format){
    return hour.tz(site_json.time_zone).format(format)
}