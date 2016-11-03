
(function() {
    
    OCA.B2shareBridge = OCA.B2shareBridge || {};

    /**
     * @namespace
     */
    OCA.B2shareBridge.Util = {
        /**
         * Initialize the b2sharebridge plugin.
         *
         * @param {OCA.Files.FileList} fileList file list to be extended
         */
        attach: function(fileList) {
            if (fileList.id === 'trashbin' || fileList.id === 'files.public') {
                return;
            }
            var fileActions = fileList.fileActions;

            fileActions.registerAction({
                name: 'B2SHARE',
                displayName: 'B2SHARE',
                mime: 'all',
                permissions: OC.PERMISSION_READ,
                icon: OC.imagePath('b2sharebridge', 'filelisticon'),
                actionHandler: function(fileName) {
                    fileList.showDetailsView(fileName, 'b2shareBridgeTabView');
                },
            });
	    fileList.registerTabView(new OCA.B2shareBridge.B2shareBridgeTabView('B2shareBridgeTabView',{order: -30}));
        }
    };

})();

OC.Plugins.register('OCA.Files.FileList', OCA.B2shareBridge.Util);


function getCookie(cname) {
 var name = cname + "=";
 var ca = document.cookie.split(';');
 for(var i=0; i<ca.length; i++) {
 var c = ca[i];
 while (c.charAt(0)==' ') c = c.substring(1);
 if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
 }
 return "";
 }
