import TEMPLATE from './templates/template';
import $ from "jquery";
//import B2shareBridgeCollection from "b2sharebridgecollection.js";

(function () {

//    var TEMPLATE =
//        '<div>' +
//		'<div id="b2sharebridgeTabView" class="dialogContainer">' +
//		'<table><tr><td>Title:</td><td><input type="text" name="b2s_title" id="b2s_title"></input></td></tr>' +
//		'<tr><td>Server:</td><td><div id="serverSelector"></div></td></tr>' +
//		'<tr><td>Community:</td><td><div id="communitySelector"></div></td></tr>' +
//		'<tr><td>Open access:</td><td><input type="checkbox" name="open_access" id="cbopen_access" /></td></tr>' +
//		'<tr><td></td><td><input type="button" value="deposit" id="publish_button"/></td></tr></table>' +
//		'<div class="errormsg" id="b2sharebridge_errormsg">ERROR3</div>' +
//        '</div>';

    function publishAction(e) {
        $(publish_button).prop('disabled', true);
        const selectedFiles = FileList.getSelectedFiles();
        // if selectedFiles is empty, use fileInfo
        // otherwise create an array of files from the selection
        let ids
        let fileInfo
        if (selectedFiles.length > 0) {
            ids = []
            for (let index in selectedFiles) {
                ids.push(selectedFiles[index].id)
            }
        } else {
            fileInfo = e.data.param;
            ids = [fileInfo.id];
        }
        let selected_community = $("#ddCommunitySelector").val();
        let open_access = $('input[name="open_access"]:checked').length > 0;
        let title = $("#b2s_title").val();
        $.post(
            OC.generateUrl('/apps/b2sharebridge/publish'),
            {
                ids: ids,
                community: selected_community,
                open_access: open_access,
                title: title,
                server_id: $('#ddServerSelector').val()
            },
            function (result) {
                if (result && result.status === 'success') {
                    OC.dialogs.info(
                        t('b2sharebridge', result.message),
                        t('b2sharebridge', 'Info'));
                }
            });
    }


    /**
     * @class OCA.B2shareBridge.B2shareBridgeTabView
     * @memberof OCA.B2shareBridge
     * @classdesc
     *
     * Shows publication (to b2share) information for file
     *
     */
    var B2shareBridgeTabView = OCA.Files.DetailTabView.extend(
        /** @lends OCA.B2shareBridge.B2shareBridgeTabView.prototype */{
            id: 'b2shareBridgeTabView',
            className: 'b2shareBridgeTabView tab',

            _label: 'b2sharebridge',

            _loading: false,

            _publish_button_disabled: false,


            initialize: function () {
                OCA.Files.DetailTabView.prototype.initialize.apply(this, arguments);
                this.collection = new OCA.B2shareBridge.B2shareBridgeCollection();
                this.collection.setObjectType('files');
                this.collection.on('request', this._onRequest, this);
                this.collection.on('sync', this._onEndRequest, this);
                this.collection.on('update', this._onChange, this);
                this.collection.on('error', this._onError, this);
                this._error_msg = "initializing";
                this._b2s_title = "Deposit title here";
                this.communities = [];
            },

            events: {},


            getLabel: function () {
                return t('b2sharebridge', 'B2SHARE');
            },

            getIcon: function () {
                return 'icon-filelist';
            },

            nextPage: function () {
            },

            _onClickShowMoreVersions: function (ev) {
            },

            _onClickRevertVersion: function (ev) {
            },

            _toggleLoading: function (state) {
            },

            _onRequest: function () {
            },

            _onEndRequest: function () {
            },

            _onAddModel: function (model) {
            },

            getTokens: function () {
                let that = this;
                if (!this.tokens) {
                    const url_path =
                        "/apps/b2sharebridge/apitoken?requesttoken=" +
                        encodeURIComponent(oc_requesttoken);
                    $.ajax({
                        type: 'GET',
                        url: OC.generateUrl(url_path),
                        async: false
                    }).done(function (data) {
                        that.tokens = data;
                    }).fail(function (data) {
                        let b2sharebridge_errormsg = $("#b2sharebridge_errormsg")
                        b2sharebridge_errormsg.html('Fetching tokens failed!');
                        b2sharebridge_errormsg.show();
                    });
                }
                return this.tokens;
            },

            getCommunities: function () {
                let that = this;
                if (!this.communities.length) {
                    const url_path =
                        "/apps/b2sharebridge/gettabviewcontent?requesttoken=" +
                        encodeURIComponent(oc_requesttoken);
                    $.ajax({
                        type: 'GET',
                        url: OC.generateUrl(url_path),
                        async: false
                    }).done(function (data) {
                        that.communities = data;
                    }).fail(function () {
                        let b2sharebridge_errormsg = $("#b2sharebridge_errormsg")
                        b2sharebridge_errormsg.html('Fetching B2SHARE communities failed!');
                        b2sharebridge_errormsg.show();
                    });
                }
                return this.communities;
            },

            getCommunitySelectorHTML: function () {
                let result = "<select id='ddCommunitySelector'>";
                let ddserver = $('#ddServerSelector');
                if (ddserver.length === 0) {
                    console.warn("Could not load ddServerSelector");
                    if(this.getCommunities().length === 0) {
                        console.warn("Could not find any communities");
                        result = result + "</select>";
                        return result;
                    }
                    else {
                        console.warn("Selecting first community as default");
                        const community = this.getCommunities()[0];
                        result = result + "<option value=\"" + community.id + "\">" + community.name + "</option>";
                        result = result + "</select>";
                        return result;
                    }
                }
                $.each(
                    this.getCommunities().filter(function (community) {
                        return community.serverId.toString() === ddserver.val().toString();
                    }),
                    function (i, c) {
                        result = result + "<option value=\"" + c.id + "\">" + c.name + "</option>";
                    }
                );
                result = result + "</select>";
                return result;
            },

            getServerSelectorHTML: function () {
                const url_path =
                    "/apps/b2sharebridge/servers?requesttoken=" +
                    encodeURIComponent(oc_requesttoken);
                let result = "";
                $.ajax({
                    type: 'GET',
                    url: OC.generateUrl(url_path),
                    async: false
                }).done(function (data) {
                    result = "<select id='ddServerSelector'>";
                    $.each(data, function (key, value) {
                        result = result + "<option value=\"" + value.id + "\">" + value.name + "</option>";
                    });
                    result = result + "</select>"
                }).fail(function () {
                    let b2sharebridge_errormsg = $("#b2sharebridge_errormsg")
                    b2sharebridge_errormsg.html('Fetching B2SHARE servers failed!');
                    b2sharebridge_errormsg.show();
                });
                return result;
            },


            template: function (data) {
                return TEMPLATE;
            },

            itemTemplate: function (data) {
            },

            setFileInfo: function (fileInfo) {
                if (fileInfo) {
                    this.fileInfo = fileInfo;
                    this.initializeB2ShareUI(fileInfo);
                    this.render();
                }
            },

            _formatItem: function (version) {
            },

            checkToken: function () {
                let b2sharebridge_errormsg = $("#b2sharebridge_errormsg")
                if (!this.tokens[$('#ddServerSelector').val()]) {
                    b2sharebridge_errormsg.html('Please set B2SHARE API token in B2SHARE settings');
                    b2sharebridge_errormsg.show();
                } else {
                    b2sharebridge_errormsg.hide();
                }
            },

            onChangeServer: function () {
                $("#communitySelector").html(this.getCommunitySelectorHTML());
                this.checkToken();
            },

            /**
             * Renders this details view
             */
            render: function () {
                this.$el.html(this.template());

                let server_selector = $("#serverSelector")
                server_selector.html(this.getServerSelectorHTML());
                $("#communitySelector").html(this.getCommunitySelectorHTML());
                this.getTokens();
                server_selector.change(this.onChangeServer.bind(this));

                let publish_button = $("#publish_button")
                publish_button.bind('click', {param: this.fileInfo}, publishAction);
                publish_button.prop('disabled', this._publish_button_disabled);
                $("#b2s_title").val(this._b2s_title);
                this.delegateEvents();

                let b2sharebridge_errormsg = $("#b2sharebridge_errormsg")
                b2sharebridge_errormsg.html(this._error_msg);
                if (this._error_msg !== "") {
                    b2sharebridge_errormsg.show();
                } else {
                    this.checkToken();
                }
            },

            /**
             * Returns true for files, false for folders.
             *
             * @return {boolean} true for files, false for folders
             */
            canDisplay: function (fileInfo) {
                if (!fileInfo) {
                    return false;
                }
                return !fileInfo.isDirectory();
            },

            processData: function (data) {
                this._publish_button_disabled = data['error'];
                this._error_msg = data['error_msg'];
                this._b2s_title = data['title'];
            },

            initializeB2ShareUI: function (fileInfo) {
                const url_path =
                    "/apps/b2sharebridge/initializeb2shareui?requesttoken=" +
                    encodeURIComponent(oc_requesttoken) + "&file_id=" +
                    encodeURIComponent(fileInfo.id);
                //var communities = [];
                //var result = "";
                let that = this;
                $.ajax({
                    type: 'GET',
                    url: OC.generateUrl(url_path),
                    async: false
                }).done(function (data) {
                    that.processData(data);
                }).fail(function () {
                    //if PHP not reachable, disable publish button
                    that._publish_button_disabled = true;
                    that._error_msg = "ERROR - Nextcloud server cannot be reached."
                });
            }
        });

    OCA.B2shareBridge = OCA.B2shareBridge || {};

    OCA.B2shareBridge.B2shareBridgeTabView = B2shareBridgeTabView;
})();

