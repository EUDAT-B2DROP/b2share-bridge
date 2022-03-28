(()=>{"use strict";!function(){function e(e){if($(publish_button).prop("disabled",!0),selectedFiles=FileList.getSelectedFiles(),selectedFiles.length>0)for(index in ids=[],selectedFiles)ids.push(selectedFiles[index].id);else fileInfo=e.data.param,ids=[fileInfo.id];selected_community=$(ddCommunitySelector).val(),open_access=$('input[name="open_access"]:checked').length>0,title=$(b2s_title).val(),$.post(OC.generateUrl("/apps/b2sharebridge/publish"),{ids,community:selected_community,open_access,title,server_id:$("#ddServerSelector").val()},(function(e){e&&"success"===e.status&&OC.dialogs.info(t("b2sharebridge",e.message),t("b2sharebridge","Info"))}))}var i=OCA.Files.DetailTabView.extend({id:"b2shareBridgeTabView",className:"b2shareBridgeTabView tab",_label:"b2sharebridge",_loading:!1,_publish_buton_disabled:!1,initialize:function(){OCA.Files.DetailTabView.prototype.initialize.apply(this,arguments),this.collection=new OCA.B2shareBridge.B2shareBridgeCollection,this.collection.setObjectType("files"),this.collection.on("request",this._onRequest,this),this.collection.on("sync",this._onEndRequest,this),this.collection.on("update",this._onChange,this),this.collection.on("error",this._onError,this),this._error_msg="initializing",this._b2s_title="Deposit title here",this.communities=[]},events:{},getLabel:function(){return t("b2sharebridge","B2SHARE")},getIcon:function(){return"icon-filelist"},nextPage:function(){},_onClickShowMoreVersions:function(e){},_onClickRevertVersion:function(e){},_toggleLoading:function(e){},_onRequest:function(){},_onEndRequest:function(){},_onAddModel:function(e){},getTokens:function(){var e=this;if(!this.tokens){var t="/apps/b2sharebridge/apitoken?requesttoken="+encodeURIComponent(oc_requesttoken);$.ajax({type:"GET",url:OC.generateUrl(t),async:!1}).done((function(t){e.tokens=t})).fail((function(e){$(b2sharebridge_errormsg).html("Fetching tokens failed!"),$(b2sharebridge_errormsg).show()}))}return this.tokens},getCommunities:function(){var e=this;if(!this.communities.length){var t="/apps/b2sharebridge/gettabviewcontent?requesttoken="+encodeURIComponent(oc_requesttoken);$.ajax({type:"GET",url:OC.generateUrl(t),async:!1}).done((function(t){e.communities=t})).fail((function(e){$(b2sharebridge_errormsg).html("Fetching B2SHARE communities failed!"),$(b2sharebridge_errormsg).show()}))}return this.communities},getCommunitySelectorHTML:function(){return result="",result="<select id='ddCommunitySelector'>",$.each(this.getCommunities().filter((function(e){return e.serverId.toString()===$("#ddServerSelector").val().toString()})),(function(e,t){result=result+'<option value="'+t.id+'">'+t.name+"</option>"})),result+="</select>",result},getServerSelectorHTML:function(){var e="/apps/b2sharebridge/servers?requesttoken="+encodeURIComponent(oc_requesttoken);return result="",$.ajax({type:"GET",url:OC.generateUrl(e),async:!1}).done((function(e){result="<select id='ddServerSelector'>",$.each(e,(function(e,t){result=result+'<option value="'+t.id+'">'+t.name+"</option>"})),result+="</select>"})).fail((function(e){$(b2sharebridge_errormsg).html("Fetching B2SHARE servers failed!"),$(b2sharebridge_errormsg).show()})),result},template:function(e){return'<div><div id="b2sharebridgeTabView" class="dialogContainer"><table><tr><td>Title:</td><td><input type="text" name="b2s_title" id="b2s_title"></input></td></tr><tr><td>Server:</td><td>{{serverSelector}}</td></tr><tr><td>Community:</td><td>{{communitySelector}}</td></tr><tr><td>Open access:</td><td><input type="checkbox" name="open_access" id="cbopen_access" /></td></tr><tr><td></td><td><input type="button" value="deposit" id="publish_button"/></td></tr></table><div class="errormsg" id="b2sharebridge_errormsg">ERROR3</div></div>'},itemTemplate:function(e){},setFileInfo:function(e){e&&(this.fileInfo=e,this.initializeB2ShareUI(e),this.render())},_formatItem:function(e){},checkToken:function(){this.tokens[$("#ddServerSelector").val()]?$(b2sharebridge_errormsg).hide():($(b2sharebridge_errormsg).html("Please set B2SHARE API token in B2SHARE settings"),$(b2sharebridge_errormsg).show())},onChangeServer:function(){$(communitySelector).html(this.getCommunitySelectorHTML()),this.checkToken()},render:function(){this.$el.html(this.template()),$(serverSelector).html(this.getServerSelectorHTML()),$(communitySelector).html(this.getCommunitySelectorHTML()),this.getTokens(),$(serverSelector).change(this.onChangeServer.bind(this)),$(publish_button).bind("click",{param:this.fileInfo},e),$(publish_button).prop("disabled",this._publish_button_disabled),$(b2s_title).val(this._b2s_title),this.delegateEvents(),$(b2sharebridge_errormsg).html(this._error_msg),""!=this._error_msg?$(b2sharebridge_errormsg).show():this.checkToken()},canDisplay:function(e){return!!e&&!e.isDirectory()},processData:function(e){this._publish_button_disabled=e.error,this._error_msg=e.error_msg,this._b2s_title=e.title},initializeB2ShareUI:function(e){var t="/apps/b2sharebridge/initializeb2shareui?requesttoken="+encodeURIComponent(oc_requesttoken)+"&file_id="+encodeURIComponent(e.id);communities=[],result="";var i=this;$.ajax({type:"GET",url:OC.generateUrl(t),async:!1}).done((function(e){i.processData(e)})).fail((function(e){i._publish_button_disabled=!0,i._error_msg="ERROR - Nextcloud server cannot be reached."}))}});OCA.B2shareBridge=OCA.B2shareBridge||{},OCA.B2shareBridge.B2shareBridgeTabView=i}()})();