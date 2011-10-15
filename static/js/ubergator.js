/*
 *
*
*    The internet will be occupied,
*    it will not be televised.
*
*
* */

var ubergator = {
    save_url:"/data/save/endpoint",
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
            console.log(inputs);
            var promise = self.saveRss({
                url:inputs.val()
            });

            promise.done(function(data) {
                console.log("w00t");
                inputs.val("");
            });
        });
    },
    saveRss:function( data ) {
        var promise = this.remoteCall( this.save_url, data );
        promise.done(function(data) {
            console.log("I got data!", data);
        });
        return promise;
    },

    remoteCall:function( url, params ) {
        var dfr = $.Deferred();
        jQuery.ajax({
            url:url,
            method:"GET",
            dataType:"json",
            success:dfr.resolve,
            error:dfr.resolve,
            data:params
        });
        return dfr.promise();
    }

}

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
    }
}
