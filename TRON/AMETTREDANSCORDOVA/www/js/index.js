var app = {
    // Application Constructor
    initialize: function() {
    this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        

        // Here, we redirect to the web site.
        let targetUrl = "http://172.28.0.68:8080/login?platform="+cordova.platformId;
   
        window.location.replace(targetUrl);
}
    // Note: This code is taken from the Cordova CLI template.
   
};

app.initialize();