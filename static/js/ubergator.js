/*
 *
*
*    The internet will be occupied,
*    it will not be televised.
*
*
* */
;(function(win) {


var city_prefix     = "Occupy ";
var tabstop_regex   = /\t+/,
    nonword_regex   = /\W+/,
    lineend_regex   = /\r|\n/;

function handle_tab_text( txt_str ) {
    var lines = txt_str && txt_str.trim().split(lineend_regex) || [];
    var i=lines.length, city_data, data=[];
    while(i--) {
        city_data = lines && lines[i].split( tabstop_regex );
        if(!city_data[0] || !city_data[1]) continue;
        city_data && data.push({
            url:city_data[0],
            text:city_data[1].trim()
        });

    }
    return data.reverse();
}
function normalize( prefix, str ) {
    return str && str.replace(prefix, "").replace(nonword_regex, "").toLowerCase() || str;
}
function occupyCitySort(a,b) {
// dirty, wrong, working
    var a_str = normalize(city_prefix, a.text);
        b_str = normalize(city_prefix, b.text);

    if(a_str < b_str) {
        return -1;
    } 
    if(b_str < a_str) {
        return 1;
    }
    return 0;
}
var ubergator = {
    save_url:"/data/save/endpoint",
    cities_url:"data/facebook.txt",
    start:function() {
        this.dom.saveTemplates();
        
        // add a form
        // add a button
        // add method to submit
    },
    addRssForm:function($el) {
        var frag = newT.render("addRss.ubergator", {
            formid:"rss_form"
        });
        var self=this;

        var elem = $(frag).hide().appendTo($el).slideDown();
        elem.find("form").bind("submit", function(e) {
            e.preventDefault();
            var inputs = elem.find("input[type='text']");
            var promise = self.saveRss({
                url:inputs.val()
            });

            promise.done(function(data) {
                console.log("w00t");
                inputs.val("");
            });
        });
    },
    addCitiesList:function($el) {
        var promise = this.getCities(), self=this;
        promise.done(function(data) {
            var city_data = handle_tab_text(data);
            city_data.sort(occupyCitySort);
            self.storage.facebook_cities = city_data;
            var frag = newT.render("showCities.ubergator", {
                "city_data":city_data,
                pagination:{
                    start:1,
                    limit:10,
                    total:10000
                }
            });
            // TODO
            // something else, list is 340+ items
            $el.append(frag);
        });
        return promise;
    },
    getCities:function() {
        var promise = this.remoteCall(this.cities_url, {}, {
            dataType:"text"
        });
        return promise;
    },
    saveRss:function( data ) {
        var promise = this.remoteCall( this.save_url, data, {
            type:"GET"
        });
        promise.done(function(data) {
            console.log("I got data!", data);
        });
        return promise;
    },

    remoteCall:function( url, params, opts ) {
        var dfr = $.Deferred();
        var basics = {
            url:url,
            type:"GET",
            dataType:"json",
            success:dfr.resolve,
            error:dfr.resolve,
            data:null
        };
        basics = $.extend({}, basics, opts || {});
        if(!basics.data) basics.data=params;
        jQuery.ajax(basics);
        return dfr.promise();
    }

}
// stuff
ubergator.storage = {
    facebook_cities:[]
};

// the DOM.. see stuff on page..
ubergator.dom = {
    saveTemplates:function() {
        newT.save("addRss.ubergator", function(data) {
            return (
                newT.div({id:data.formid || ""},
                    newT.form({
                        method:"POST", 
                        action:"#"
                        },
                        newT.input({type:"text"}),
                        newT.button(data.buttontxt || "Add feed")
                    )
                )
            );
        });
        newT.save("showCities.ubergator", function(data) {
            return (
                newT.div(
                    newT.eachRender(data.city_data, "city.ubergator"),
                    // show the pagination
                    newT.render("cityPagination.ubergator", data.pagination)
                )
            )
        });
        newT.save("cityPagination.ubergator", function(data) {
            return (
                newT.div()
            );
        });
        // called via newT.eachRender
        newT.save("city.ubergator", function(data) {
            return (
                newT.div({clss:"ug_cityItem"},
                    newT.a({
                        href:data.url
                    }, data.text || "")
                )
            )
        });
    }
}


// expose to global object
win.ubergator=ubergator;
})(window);
