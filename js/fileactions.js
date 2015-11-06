


(function() {

    if (!OCA.Eudat) {
        OCA.Eudat = {};
    }

    OCA.Eudat.Publish = {
        attach:function(fileList) {
            var fileActions = fileList.fileActions;
            fileActions.registerAction({
                name: "B2SHARE",
                displayName: t('files', 'B2SHARE'),
                mime: 'all',
                permissions: OC.PERMISSION_READ,
                icon:function() {
                    return OC.imagePath('eudat', 'filelisticon');
                },
                actionHandler:function(filename, context) {

                    $.post(OC.generateUrl('/apps/eudat/publish'), { id: context.$file.data('id') }, function (result) {
                        if (result && result.status === 'success') {
                            OC.dialogs.info(t('eudat', result.message), t('eudat', 'Info'));
                        }
                        else {
                            OC.dialogs.alert(t('eudat', result.message), t('eudat', 'Error'));
                        }
                    }
                    );

                    // var downloadFileaction = $(context.$file).find('.fileactions .action-download');

                    // // don't allow a second click on the download action
                    // if(downloadFileaction.hasClass('disabled')) {
                    //  return;
                    // }

                    // if (url) {
                    //  var disableLoadingState = function() {
                    //      context.fileList.showFileBusyState(filename, false);
                    //  };

                    //  context.fileList.showFileBusyState(downloadFileaction, true);
                    //  OCA.Files.Files.handleDownload(url, disableLoadingState);
                    // }
                }
            });
        }
    };

})();

OC.Plugins.register('OCA.Files.FileList', OCA.Eudat.Publish);
