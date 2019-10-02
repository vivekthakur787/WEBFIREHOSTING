// *******************************************************************************
// SCRIPT : update_collection.js
//
//        - This script read language and collection Database details
//        - Create HTML page according to the information
//        - Save modifiy Data into Database
//        - Complete Collection Operation's
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// *********************************************
// ------------- CONFIGURATION ----------------
var basePath = '/DATABASE/DEVELOPMENT/PUBLIC/';
var baseProductionPath = '/DATABASE/PRODUCTION/PUBLIC/';
var baseTestingPath = '/DATABASE/TESTING/PUBLIC/';
// *********************************************

// ********************************************
// ------------ INPUT DATA --------------------

// ---------- User Role ---------
var coll_lang = 'NA';
var coll_name = 'NA';
var user_role = 'NA';

// ********************************************

// *********************************************
// ---------- GLOBAL VARIABLES -----------------
var allDocFormIDDetails = {}; // All Documents Form ID details
var allCollFormIDDetails = {}; // All Collection Forms ID Details
var allDocData = {};  // Complete Collection Data

//  Sleep Timer Value
var sleep_timer = 1000;

// Network status
var is_network_present = true;

// Key Selection Table
var currentKeyTableData = 'NA';

// Document publish INFO details
var doc_display_id_info_details = 'NA';  // INFO11
var doc_publish_info_details = 'NA';     // INFO12
var doc_listData_info_details = 'NA';     // INFO13

// Counter var
var total_doc_before_del = 0;
var del_docCount = 0;

var total_doc = 0;
var doc_count = 0;

// **********************************************

// ***********************************************
// ----------- Read Parameters -------------------
function getParams(){
	// Read Parameters
	console.log('Read Parameters ...')
	var idx = document.URL.indexOf('?');
	var params = new Array();
	if (idx != -1) {
		var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
		for (var i=0; i<pairs.length; i++){
			nameVal = pairs[i].split('=');
			params[nameVal[0]] = nameVal[1];
		}
	}
	console.log(params);
	
	// ------- Update Variables ------------
	coll_lang = params['lang_name'];
	coll_name = params['coll_name'];
	user_role = params['role'];
	
	
}

// *************************************************
// Read Data form Database and create HTML Page
// *************************************************
function readDataFromDatabase() {
	
	document.getElementById('message_container').style.display = "none";
	document.getElementById('collection_content_container').style.display = "none";
	
	showPleaseWait();

	var totaldocCount = 0;
	db.collection(basePath+coll_lang+'/'+coll_name).get().then((querySnapshot) => {
	    console.log("SIZE : " + querySnapshot.size);

        if(querySnapshot.size == 0) {
           hidePleaseWait();		   
		   showNoRecordMessage();          

        } else {
			
			// ------- Details Found ------------
			document.getElementById('collection_content_container').style.display = "block";

           totaldocCount = querySnapshot.size

            var list_html = '';
            var nav_html = '';
            var coll_admin_html = '';

            var docCount = 0;

            // Read Each Documents
            querySnapshot.forEach((doc) => {
                //console.log(`${doc.id} =>`, doc.data());
                        allDocData[doc.id] = doc.data();

                        if(doc.id == 'MAIN') {
                           // --------- Update Main Section ----------
                           // Create NAV HTML Tags.
                           coll_admin_html += getCollectionAdminHTMLContent(doc.data())
						   
						   // Collect global MAIN details
						   doc_display_id_info_details = allDocData[doc.id]['INFO11']['VALUE'];
                           doc_publish_info_details = allDocData[doc.id]['INFO12']['VALUE'];
                           doc_listData_info_details = allDocData[doc.id]['INFO13']['VALUE'];
						   

                        } else {

                        // Create List group HTML tags
                        list_html += '<a class="list-group-item list-group-item-action " data-toggle="list" href="#' + doc.id + '_TAB' + '" role="tab">' + doc.id + '</a>\n';

                        // Create NAV HTML Tags.
                        nav_html += getTabPanelHTMLFormat(doc.id + '_TAB',doc.id + '_NAV',doc.data(),doc.id)

                        }

                        // Check Document count
                        docCount++;
                        if(totaldocCount == docCount) {
                           hidePleaseWait();
                        }



            });

            // Update HTML Page
           // console.log(coll_admin_html);
            $("#collectionAdminContent").html(coll_admin_html);

            // Update HTML Page
            //console.log(list_html);
            $("#collectionDocumentsList").html(list_html);

            // Update HTML page
            //console.log(nav_html);
            $("#collectionDocumentsTab").html(nav_html);


            // Process disable operation handling
            disableHandling()

		}
		
	});
	
} // EOF

// ******************************************************
// --------------- START UP CODE -----------------------
// Call Function when page loaded
// ******************************************************

// Get Parameters details
getParams();

// Read Data from Database
readDataFromDatabase();

// ************************************
// Disable Page Operation Handling
// ************************************
function disableHandling(){
  // Read Data and disable DEV role elements.
  // Read Collection Data

  console.log('Disable Operation Handling .....')

  for(var doc_key in allDocData) {

      if(doc_key == 'MAIN') {

        var docData = allDocData[doc_key];
        // Get Role Details
        if(user_role == 'ADMIN'){

           for(var info_key in docData) {
               var info_data = docData[info_key];

               // Hide Dev elements
               if(info_data['ROLE'] == 'DEV'){
                   // Get DEV ID
                   var div_id = 'DIV_' + allCollFormIDDetails[info_key];
                   var div_ele = document.getElementById(div_id);
                   div_ele.style.display = "none";

                   console.log(div_id + ' - DISBALE !!');

               }
           }
        }


      }

       else {
        // ---------- For ALL Documents ---------------
         var docData = allDocData[doc_key];
            // Get Role Details
            if(user_role == 'ADMIN'){

               for(var info_key in docData) {
                   var info_data = docData[info_key];

                        // For TREE
                        if(info_data['TYPE'] == 'TREE') {
                             // Check for TREE DIV , Ignore MAIN
                             if(info_data['ROLE'] == 'DEV' && info_key != 'MAIN'){
                                 // Get DEV ID
                                  var div_id = 'DIV_' + allDocFormIDDetails[doc_key][info_key];
                                  console.log(info_key + ' : ' + div_id + ' - DISBALE !!');
                                  var div_ele = document.getElementById(div_id);
                                  div_ele.style.display = "none";
                              }


                           for(var sub_info_key in info_data['VALUE']) {
                               var sub_info_data = info_data['VALUE'][sub_info_key];
                               // Hide Dev elements
                                  if(sub_info_data['ROLE'] == 'DEV'){
                                      // Get DEV ID
                                      var div_id = 'DIV_' + allDocFormIDDetails[doc_key][info_key+'_'+sub_info_key];
                                      console.log(div_id + ' - DISBALE !!');
                                      var div_ele = document.getElementById(div_id);
                                      div_ele.style.display = "none";
                                  }

                           }

                        } else {
                           // Hide Dev elements
                           if(info_data['ROLE'] == 'DEV'){
                               // Get DEV ID
                               var div_id = 'DIV_' + allDocFormIDDetails[doc_key][info_key];
                               console.log(div_id + ' - DISBALE !!');
                               var div_ele = document.getElementById(div_id);
                               div_ele.style.display = "none";
                           }
                       }


               }
            }

      }
  }


  // -------------- Hide Documents Tabs -------------------
  // MAP Infor data with variables
  console.log('Disable Tabs ....')

    var image_tab_option = allDocData['MAIN']['INFO8']['VALUE'];
    var multi_tab_option = allDocData['MAIN']['INFO9']['VALUE'];
    var form_tab_option = allDocData['MAIN']['INFO10']['VALUE'];

  for(var each_doc_key in allDocData) {
     if(each_doc_key != 'MAIN'){

          if(image_tab_option == 'NO') {console.log('Disable Image Tab.' + each_doc_key); document.getElementById('image-'+each_doc_key).style.display = "none";}
          if(multi_tab_option == 'NO') {console.log('Disable Multi Tab.' + each_doc_key); document.getElementById('multi-'+each_doc_key).style.display = "none";}
          if(form_tab_option == 'NO') {console.log('Disable Form Tab.' + each_doc_key); document.getElementById('form-'+each_doc_key).style.display = "none";}


     }
  }

  // ---------------- Hide Buttons or Other Tabs --------------------
  if(user_role != 'DEV') {
     document.getElementById('updatekey-tab').style.display = "none";
  }


}


// *********************************************
// Create NAV HTML Panel code
// *********************************************
function getTabPanelHTMLFormat(tab_id,nav_id,docData,docID) {

    var eachDocFormIDdetails = {};
	
	var html = '';
                          
	html += '<div class="tab-pane" id="' + tab_id + '" role="tabpanel">\n';

	html += '<ul class="nav nav-tabs" id="docTab" role="tablist">\n';
	html += '<li class="nav-item">\n';
	html += '<a class="nav-link active" id="admin-' + docID +'" data-toggle="tab" href="#admin_' + nav_id + '" role="tab" aria-controls="admin" aria-selected="true">MAIN</a>\n';
	html += '</li>\n';
	html += '<li class="nav-item">\n';
	html += '<a class="nav-link" id="home-' + docID +'" data-toggle="tab" href="#home_' + nav_id + '" role="tab" aria-controls="home" aria-selected="true">HOME</a>\n';
	html += '</li>\n';
	html += '<li class="nav-item">\n';
	html += '<a class="nav-link" id="control-' + docID +'" data-toggle="tab" href="#control_' + nav_id + '" role="tab" aria-controls="control" aria-selected="false">CONTROL</a>\n';
	html += '</li>\n';
	html += '<li class="nav-item">\n';
	html += '<a class="nav-link" id="image-' + docID +'" data-toggle="tab" href="#image_' + nav_id + '" role="tab" aria-controls="image" aria-selected="false">IMAGE</a>\n';
	html += '</li>\n';
	html += '<li class="nav-item">\n';
	html += '<a class="nav-link" id="multi-' + docID +'" data-toggle="tab" href="#multi_' + nav_id + '" role="tab" aria-controls="multi" aria-selected="false">MULTI</a>\n';
	html += '</li>\n';
	html += '<li class="nav-item">\n';
	html += '<a class="nav-link" id="form-' + docID +'" data-toggle="tab" href="#form_' + nav_id + '" role="tab" aria-controls="form" aria-selected="false">FORM</a>\n';
	html += '</li>\n';
	html += '<li class="nav-item">\n';
    html += '<a class="nav-link" id="final-' + docID +'" data-toggle="tab" href="#final_' + nav_id + '" role="tab" aria-controls="form" aria-selected="false">VALIDATE</a>\n';
    html += '</li>\n';
    html += '<li class="nav-item">\n';
    html += '<a class="nav-link" id="options-' + docID +'" data-toggle="tab" href="#options_' + nav_id + '" role="tab" aria-controls="form" aria-selected="false">OPTIONS</a>\n';
    html += '</li>\n';
	html += '</ul>\n';
	html += '<div class="tab-content" id="docTabContent">\n';

	// ----------------------------------------------
	// ----------------- ADMIN -------------------
	// ----------------------------------------------
	html += '<div class="tab-pane fade show active" id="admin_' + nav_id +'" role="tabpanel" aria-labelledby="admin-tab"><br>\n';

    for (var key in docData) {
	   infoData =  docData[key];


	   if(infoData['MODE'] == 'MAIN' && infoData['TYPE'] == 'TREE') {
		    //console.log(infoData);

		    var data = infoData['VALUE'];

			// --------- Create Image Sub Components
			for(var sub_info in data) {
			    var sub_info_data = data[sub_info];

			    if(user_role == 'DEV') {sub_info_data['DESC'] = key + '_' + sub_info + ': ' + sub_info_data['DESC'];}

			    if(sub_info_data['TYPE'] == 'TEXT') {

                    eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
			        html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                    html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                    html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                    html += '<input type="text" class="form-control" id="' + eachDocFormIDdetails[key+'_'+sub_info] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                    html += '</div>\n';


			    } else if(sub_info_data['TYPE'] == 'MULTI_TEXT') {

                    eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
                    html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                    html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                    html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                    html += '<textarea class="form-control" rows="5" id=' + eachDocFormIDdetails[key+'_'+sub_info] + '>' + sub_info_data['VALUE'] +'</textarea>\n';
                    html += '</div>\n';


			    } else if(sub_info_data['TYPE'] == 'NUM') {

                      eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
                      html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                      html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                      html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                      html += '<input type="number" class="form-control" id="' + eachDocFormIDdetails[key+'_'+sub_info] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                      html += '</div>\n';

                }   else if(sub_info_data['TYPE'] == 'BOOL'){

                  eachDocFormIDdetails[key+'_'+sub_info] =docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
			      html +='<br><div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="card border-secondary mb-3" style="width: 28rem;">';
                  html +='<div class="card-body">';
                  html +='<h5 class="card-title">' + sub_info_data['KEY'] + '</h5>';
                  html +='<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>';

			       if(sub_info_data['VALUE'] == 'YES') {
                        html += '<label class="radio-inline"><input type="radio" name="' + eachDocFormIDdetails[key+'_'+sub_info]  +  '" value="YES" checked>YES</label>\n';
                        html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' + eachDocFormIDdetails[key+'_'+sub_info]  + '" value="NO" >NO</label>\n';
                    } else {
                        html += '<label class="radio-inline"><input type="radio" name="' + eachDocFormIDdetails[key+'_'+sub_info]  + '" value="YES" >YES</label>\n';
                        html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' + eachDocFormIDdetails[key+'_'+sub_info]  + '" value="NO" checked>NO</label>\n';
                    }

                    html +='</div>';
                    html +='</div><br>';

			    }
			}

	   }
	}


	html += '</div>\n';

	// ----------------------------------------------
	// ----------------- HOME -------------------
	// ----------------------------------------------
	html += '<div class="tab-pane fade show" id="home_' + nav_id +'" role="tabpanel" aria-labelledby="home-tab"><br>\n';
	
	for (var key in docData) {
	   infoData =  docData[key];

	   if(user_role == 'DEV') {infoData['DESC'] = key  + ': ' + infoData['DESC'];}
	   
	   
	   if(infoData['MODE'] == 'INFO' && infoData['TYPE'] == 'TEXT') {
		    //console.log(infoData);
		    // --------------- Input Text Types -------------------
		    eachDocFormIDdetails[key] = docID + '_' + key  + '_' + infoData['MODE'] + '_'  + infoData['TYPE'];
		    html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key] + '" class="form-group">\n';
			html += '<h5>' + infoData['KEY'] + '</h5>\n';
            html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + infoData['DESC'] + '</p>\n';
			html += '<input type="text" class="form-control" id="' + eachDocFormIDdetails[key] + '" required value="' + infoData['VALUE'] +'">\n';
			html += '</div>\n';

	   } else if( infoData['MODE'] == 'INFO' && infoData['TYPE'] == 'MULTI_TEXT' ) {
	        // --------------- Input Text Types -------------------
	        eachDocFormIDdetails[key] = docID + '_' + key  + '_' + infoData['MODE'] + '_'  + infoData['TYPE'];
		    html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key] + '" class="form-group">\n';
			html += '<h5>' + infoData['KEY'] + '</h5>\n';
            html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + infoData['DESC'] + '</p>\n';
			html += '<textarea class="form-control" rows="5" id=' + eachDocFormIDdetails[key] + '>' + infoData['VALUE'] +'</textarea>\n';
			html += '</div>\n';

	   } else if(infoData['MODE'] == 'INFO' && infoData['TYPE'] == 'NUM') {

           eachDocFormIDdetails[key] = docID + '_' + key  + '_' + infoData['MODE'] + '_'  + infoData['TYPE'];
           html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key] + '" class="form-group">\n';
           html += '<h5>' + infoData['KEY'] + '</h5>\n';
           html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + infoData['DESC'] + '</p>\n';
           html += '<input type="number" class="form-control" id="' + eachDocFormIDdetails[key] + '" required value="' + infoData['VALUE'].toString() +'">\n';
           html += '</div>\n';

         }
	}
	
	html += '</div>\n';



	// ----------------------------------------------
	// ----------------- CONTROL -------------------
	// ----------------------------------------------
	html += '<div class="tab-pane fade" id="control_' + nav_id +'" role="tabpanel" aria-labelledby="control-tab"><br>\n';

	for (var key in docData) {
	   infoData =  docData[key];

	   //infoData['DESC'] = key  + ': ' + infoData['DESC'];
	   
	   
	   if(infoData['MODE'] == 'INFO' && infoData['TYPE'] == 'BOOL') {
		    //console.log(infoData);
		    // --------------- BOOL -------------------
		    eachDocFormIDdetails[key] = docID + '_' + key + '_' + infoData['MODE'] + '_'  + infoData['TYPE'];
		    html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key] + '" class="card border-secondary mb-3" style="max-width: 28rem;">\n';
			html += '<div class="card-header">' + infoData['KEY'] + '</div>\n';
			html += '<div class="card-body">\n';
			html += '<p class="card-text" style="font-size:70%;">' + infoData['DESC'] + '</p>\n';
			
			if(infoData['VALUE'] == 'YES') {
				html += '<label class="radio-inline"><input type="radio" name="' + eachDocFormIDdetails[key]  + '" value="YES" checked>YES</label>\n';
				html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' + eachDocFormIDdetails[key]  + '" value="NO" >NO</label>\n';
			} else {
				html += '<label class="radio-inline"><input type="radio" name="' + eachDocFormIDdetails[key]  + '" value="YES" >YES</label>\n';
			    html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' + eachDocFormIDdetails[key]  + '" value="NO" checked>NO</label>\n';
			}
			html += '</div>\n';
			html += '</div>\n';		   
	   }	   
	}

	for (var key in docData) {

        	   infoData =  docData[key];


        	   if(infoData['MODE'] == 'LISTREF' && infoData['TYPE'] == 'TREE') {
        		    //console.log(infoData);

        		    var data = infoData['VALUE'];

        		    // --------------- Card -------------------
        		    eachDocFormIDdetails[key] = docID + '_' + key + '_' + infoData['MODE'];
        			html += '<br><div id= "' + 'DIV_' + eachDocFormIDdetails[key] +'" class="card border-secondary mb-3" ">\n';
                    html += '<div class="card-header">';
                    html += '<a class="card-link" data-toggle="collapse" href="#' + eachDocFormIDdetails[key] +'">' + infoData['KEY'] + '</a>\n';
                    html += '</div>\n';
                    html += '<div id="' + eachDocFormIDdetails[key] +'" class="collapse">';
                    html += '<div class="card-body">\n';
                    html += '<p class="card-text">' + infoData['DESC'] + '</p>\n';

        			// --------- Create Image Sub Components
        			for(var sub_info in data) {
        			    var sub_info_data = data[sub_info];

        			    if(user_role == 'DEV') {sub_info_data['DESC'] = key + '_' + sub_info + ': ' + sub_info_data['DESC'];}

        			    if(sub_info_data['TYPE'] == 'TEXT') {

                            eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
        			        html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                            html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                            html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                            html += '<input type="text" class="form-control" id="' +  eachDocFormIDdetails[key+'_'+sub_info] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                            html += '</div>\n';


        			    } else if(sub_info_data['TYPE'] == 'MULTI_TEXT') {

                            eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
                            html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                            html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                            html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                            html += '<textarea class="form-control" rows="5" id=' +  eachDocFormIDdetails[key+'_'+sub_info] + '>' + sub_info_data['VALUE'] +'</textarea>\n';
                            html += '</div>\n';


        			    }  else if(sub_info_data['TYPE'] == 'NUM') {

                             eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
                             html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                             html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                             html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                             html += '<input type="number" class="form-control" id="' +  eachDocFormIDdetails[key+'_'+sub_info] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                             html += '</div>\n';

                       }  else if(sub_info_data['TYPE'] == 'BOOL'){

                           eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
        			       html +='<br><div id ="' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] +'" class="card border-secondary mb-3" style="width: 28rem;">';
                           html +='<div class="card-body">';
                           html +='<h5 class="card-title">' + sub_info_data['KEY'] + '</h5>';
                           html +='<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>';

        			       if(sub_info_data['VALUE'] == 'YES') {
                                html += '<label class="radio-inline"><input type="radio" name="' +  eachDocFormIDdetails[key+'_'+sub_info]  +  '" value="YES" checked>YES</label>\n';
                                html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' +  eachDocFormIDdetails[key+'_'+sub_info]  + '" value="NO" >NO</label>\n';
                            } else {
                                html += '<label class="radio-inline"><input type="radio" name="' +  eachDocFormIDdetails[key+'_'+sub_info]  + '" value="YES" >YES</label>\n';
                                html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' +  eachDocFormIDdetails[key+'_'+sub_info] + '" value="NO" checked>NO</label>\n';
                            }

                            html +='</div>';
                            html +='</div><br>';

        			    }
        			}

                    html += '</div>\n';
        			html += '</div>\n';
        			html += '</div>\n';


        	   }
        	}

	
	html += '</div>\n';



	// ----------------------------------------------
	// ----------------- IMAGE -------------------
	// ----------------------------------------------
	html += '<div class="tab-pane fade" id="image_' + nav_id +'" role="tabpanel" aria-labelledby="image-tab"><br>\n';

	for (var key in docData) {
	   infoData =  docData[key];


	   if(infoData['MODE'] == 'IMAGE' && infoData['TYPE'] == 'TREE') {
		    //console.log(infoData);

		    var data = infoData['VALUE'];

		    // --------------- Card -------------------
		    eachDocFormIDdetails[key] = docID + '_' + key + '_' + infoData['MODE'];
		    html += '<br><div id= "' + 'DIV_' + eachDocFormIDdetails[key] +'" class="card border-secondary mb-3" ">\n';
			html += '<div class="card-header">';
			html += '<a class="card-link" data-toggle="collapse" href="#' + eachDocFormIDdetails[key] +'">' + infoData['KEY'] + '</a>\n';
			html += '</div>\n';
			html += '<div id="' + eachDocFormIDdetails[key] +'" class="collapse">';
			html += '<div class="card-body">\n';
			html += '<p class="card-text">' + infoData['DESC'] + '</p>\n';

			// --------- Create Image Sub Components
			for(var sub_info in data) {
			    var sub_info_data = data[sub_info];

			    if(user_role == 'DEV') {sub_info_data['DESC'] = key + '_' + sub_info + ': ' + sub_info_data['DESC'];}

			    if(sub_info_data['TYPE'] == 'TEXT') {

                    eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
			        html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                    html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                    html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                    html += '<input type="text" class="form-control" id="' + eachDocFormIDdetails[key+'_'+sub_info] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                    html += '</div><br>\n';


			    } else if(sub_info_data['TYPE'] == 'BOOL'){

                  eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
			      html +='<div id="' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] +'" class="card border-secondary mb-3" style="width: 28rem;">';
                  html +='<div class="card-body">';
                  html +='<h5 class="card-title">' + sub_info_data['KEY'] + '</h5>';
                  html +='<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>';

			       if(sub_info_data['VALUE'] == 'YES') {
                        html += '<label class="radio-inline"><input type="radio" name="' +  eachDocFormIDdetails[key+'_'+sub_info]  +  '" value="YES" checked>YES</label>\n';
                        html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' + eachDocFormIDdetails[key+'_'+sub_info]  + '" value="NO" >NO</label>\n';
                    } else {
                        html += '<label class="radio-inline"><input type="radio" name="' + eachDocFormIDdetails[key+'_'+sub_info]  + '" value="YES" >YES</label>\n';
                        html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' + eachDocFormIDdetails[key+'_'+sub_info]  + '" value="NO" checked>NO</label>\n';
                    }

                    html +='</div>';
                    html +='</div><br>';

			    }
			}

            html += '</div>\n';
            html += '</div>\n';
			html += '</div>\n';


	   }
	   
	}
	
	
	
	html += '</div>\n';


	// ----------------------------------------------
	// ----------------- MULTI -------------------
	// ----------------------------------------------
	html += '<div class="tab-pane fade" id="multi_' + nav_id +'" role="tabpanel" aria-labelledby="multi-tab">\n';

	for (var key in docData) {
	   infoData =  docData[key];


	   if(infoData['MODE'] == 'TREE' && infoData['TYPE'] == 'TREE') {
		    //console.log(infoData);

		    var data = infoData['VALUE'];

		    // --------------- Card -------------------
		    eachDocFormIDdetails[key] = docID + '_' + key + '_' + infoData['MODE'];
			html += '<br><div id= "' + 'DIV_' + eachDocFormIDdetails[key] +'" class="card border-secondary mb-3" ">\n';
            html += '<div class="card-header">';
            html += '<a class="card-link" data-toggle="collapse" href="#' + eachDocFormIDdetails[key] +'">' + infoData['KEY'] + '</a>\n';
            html += '</div>\n';
            html += '<div id="' + eachDocFormIDdetails[key] +'" class="collapse">';
            html += '<div class="card-body">\n';
            html += '<p class="card-text">' + infoData['DESC'] + '</p>\n';

			// --------- Create Image Sub Components
			for(var sub_info in data) {
			    var sub_info_data = data[sub_info];

			    if(user_role == 'DEV') {sub_info_data['DESC'] = key + '_' + sub_info + ': ' + sub_info_data['DESC'];}

			    if(sub_info_data['TYPE'] == 'TEXT') {

                    eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
			        html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                    html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                    html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                    html += '<input type="text" class="form-control" id="' +  eachDocFormIDdetails[key+'_'+sub_info] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                    html += '</div>\n';


			    } else if(sub_info_data['TYPE'] == 'MULTI_TEXT') {

                    eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
                    html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                    html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                    html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                    html += '<textarea class="form-control" rows="5" id=' +  eachDocFormIDdetails[key+'_'+sub_info] + '>' + sub_info_data['VALUE'] +'</textarea>\n';
                    html += '</div>\n';


			    }  else if(sub_info_data['TYPE'] == 'NUM') {

                     eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
                     html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                     html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                     html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                     html += '<input type="number" class="form-control" id="' +  eachDocFormIDdetails[key+'_'+sub_info] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                     html += '</div>\n';

               }  else if(sub_info_data['TYPE'] == 'BOOL'){

                   eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
                   html += '<br><div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="card border-secondary mb-3" style="width: 28rem;">';
                   html +='<div class="card-body">';
                   html +='<h5 class="card-title">' + sub_info_data['KEY'] + '</h5>';
                   html +='<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>';

			       if(sub_info_data['VALUE'] == 'YES') {
                        html += '<label class="radio-inline"><input type="radio" name="' +  eachDocFormIDdetails[key+'_'+sub_info]  +  '" value="YES" checked>YES</label>\n';
                        html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' +  eachDocFormIDdetails[key+'_'+sub_info]  + '" value="NO" >NO</label>\n';
                    } else {
                        html += '<label class="radio-inline"><input type="radio" name="' +  eachDocFormIDdetails[key+'_'+sub_info]  + '" value="YES" >YES</label>\n';
                        html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' +  eachDocFormIDdetails[key+'_'+sub_info] + '" value="NO" checked>NO</label>\n';
                    }

                    html +='</div>';
                    html +='</div><br>';

			    }
			}

            html += '</div>\n';
			html += '</div>\n';
			html += '</div>\n';


	   }
	}
	
	html += '</div>\n';


	// ----------------------------------------------
	// ----------------- FORM -------------------
	// ----------------------------------------------
	html += '<div class="tab-pane fade" id="form_' + nav_id +'" role="tabpanel" aria-labelledby="form-tab">\n';

	for (var key in docData) {
	   infoData =  docData[key];

	   if(infoData['MODE'] == 'FORM' && infoData['TYPE'] == 'TREE') {
		    //console.log(infoData);

		    var data = infoData['VALUE'];

		    // --------------- Card -------------------
		    eachDocFormIDdetails[key] = docID + '_' + key + '_' + infoData['MODE'];
			html += '<br><div id= "' + 'DIV_' + eachDocFormIDdetails[key] +'" class="card border-secondary mb-3" ">\n';
            html += '<div class="card-header">';
            html += '<a class="card-link" data-toggle="collapse" href="#' + eachDocFormIDdetails[key] +'">' + infoData['KEY'] + '</a>\n';
            html += '</div>\n';
            html += '<div id="' + eachDocFormIDdetails[key] +'" class="collapse">';
            html += '<div class="card-body">\n';
            html += '<p class="card-text">' + infoData['DESC'] + '</p>\n';

			// --------- Create Image Sub Components
			for(var sub_info in data) {
			    var sub_info_data = data[sub_info];

			    if(user_role == 'DEV') {sub_info_data['DESC'] = key + '_' + sub_info + ': ' + sub_info_data['DESC'];}

			    if(sub_info_data['TYPE'] == 'TEXT') {

                    eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
			        html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                    html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                    html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                    html += '<input type="text" class="form-control" id="' + eachDocFormIDdetails[key+'_'+sub_info] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                    html += '</div>\n';


			    } else if(sub_info_data['TYPE'] == 'MULTI_TEXT') {

                    eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
                    html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                    html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                    html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                    html += '<textarea class="form-control" rows="5" id=' + eachDocFormIDdetails[key+'_'+sub_info] + '>' + sub_info_data['VALUE'] +'</textarea>\n';
                    html += '</div>\n';


			    }  else if(sub_info_data['TYPE'] == 'NUM') {

                     eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
                     html += '<div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="form-group">\n';
                     html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                     html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                     html += '<input type="number" class="form-control" id="' + eachDocFormIDdetails[key+'_'+sub_info] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                     html += '</div>\n';

               }  else if(sub_info_data['TYPE'] == 'BOOL'){

                   eachDocFormIDdetails[key+'_'+sub_info] = docID + '_' + key + '_' + sub_info + '_' + infoData['MODE'] + '_'  +  sub_info_data['TYPE'];
                   html += '<br><div id = "' + 'DIV_' + eachDocFormIDdetails[key+'_'+sub_info] + '" class="card border-secondary mb-3" style="width: 28rem;">';
                   html +='<div class="card-body">';
                   html +='<h5 class="card-title">' + sub_info_data['KEY'] + '</h5>';
                   html +='<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>';

			       if(sub_info_data['VALUE'] == 'YES') {
                        html += '<label class="radio-inline"><input type="radio" name="' + eachDocFormIDdetails[key+'_'+sub_info]  +  '" value="YES" checked>YES</label>\n';
                        html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' + eachDocFormIDdetails[key+'_'+sub_info]  + '" value="NO" >NO</label>\n';
                    } else {
                        html += '<label class="radio-inline"><input type="radio" name="' + eachDocFormIDdetails[key+'_'+sub_info]  + '" value="YES" >YES</label>\n';
                        html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' + eachDocFormIDdetails[key+'_'+sub_info] + '" value="NO" checked>NO</label>\n';
                    }

                    html +='</div>';
                    html +='</div><br>';

			    }
			}

            html += '</div>\n';
			html += '</div>\n';
			html += '</div>\n';


	   }
	}

	html += '</div>\n';

	// ----------------------------------------------
    // ----------------- FINAL : VALIDATE -------------------
    // ----------------------------------------------
    html += '<div class="tab-pane fade" id="final_' + nav_id +'" role="tabpanel" aria-labelledby="final-tab">\n';


    // Add SAVE Button
     html +='<br><div class="text-right">';     // Add VALIDATE Button
     html +='<input type="button" id="' + docID + '_VALIDATE_BTN' +'" class="btn btn-info" value="VALIDATE" style="margin-left: 30px" onclick="validateCurrentDocument(\'' + docID + '\')" />';
     html += '</div><br>\n';

     // <!--THE CONTAINER WHERE WE'll ADD THE DYNAMIC TABLE-->
     html += '<div class="container" id="' + docID + '_TABLE'  +'"></div>';

    html += '</div>\n';



    // ----------------------------------------------
    // ----------------- OPTIONS -------------------
    // ----------------------------------------------
    html += '<div class="tab-pane fade" id="options_' + nav_id +'" role="tabpanel" aria-labelledby="form-tab">\n';


     // ----------------- BTN 1 ----------------------------
     html +='<br><div class="card" style="width: 28rem;">';
     html +='<div class="card-body">';
     html +='<h5 class="card-title">Save Document</h5>';
     html +='<p class="card-subtitle mb-2 text-muted">Save document data into Database. Note : Please validate data before saving into Database</p>';

     html +='<br><input type="button" id="' + docID + '_SAVE_DOC_BTN' +'" class="btn btn-success" value="SAVE DOCUMENT" onclick="saveCurrentDocument(\'' + docID + '\')" />';

     html +='</div>';
     html +='</div>';


       // ----------------- BTN 2 ----------------------------
      html +='<br><div class="card" style="width: 28rem;">';
      html +='<div class="card-body">';
      html +='<h5 class="card-title">Create New Document</h5>';
      html +='<p class="card-subtitle mb-2 text-muted">Create new document with current document contents.Duplicate copy of current document.</p>';

      html +='<br><input type="button" id="' + docID + '_DUPLICATE_BTN' +'" class="btn btn-warning" value="+ Create Duplicate Document" onclick="duplicateCurrentDocument(\'' + docID + '\')" />';

      html +='</div>';
      html +='</div>';


      // ----------------- BTN 3 ----------------------------
    html +='<br><div class="card" style="width: 28rem;">';
    html +='<div class="card-body">';
    html +='<h5 class="card-title">Delete Document</h5>';
    html +='<p class="card-subtitle mb-2 text-muted">Delete current document from database.</p>';

    html +='<br><input type="button" id="' + docID + '_DELETE_DOC_BTN' +'" class="btn btn-danger" value="DELETE DOCUMENT" onclick="deleteCurrentDocument(\'' + docID + '\')" />';

    html +='</div>';
    html +='</div>';


      // ------------------------------------------------------------



    html += '</div>\n';


    // -----------------------------------
	html += '</div>\n';
	html += '</div>\n\n';
	
	allDocFormIDDetails[docID] = eachDocFormIDdetails;

	return html;

	
} // EOF

// *********************************************
// ---- Collection ADMIN Content ---------------
// *********************************************
function getCollectionAdminHTMLContent(docData) {

   var html = '';

   html += '<ul class="nav nav-tabs" id="collTab" role="tablist">\n';
   html += '<li class="nav-item">\n';
   html += '<a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">HOME</a>\n';
   html += '</li>\n';
   html += '<li class="nav-item">\n';
   html += '<a class="nav-link" id="options-tab" data-toggle="tab" href="#options" role="tab" aria-controls="options" aria-selected="false">OPTIONS</a>\n';
   html += '</li>\n';
   html += '<li class="nav-item">\n';
   html += '<a class="nav-link" id="updatekey-tab" data-toggle="tab" href="#updatekey" role="tab" aria-controls="updatekey" aria-selected="false">TAGS DETAILS</a>\n';
   html += '</li>\n';

   html += '</ul>\n';
   html += '<div class="tab-content" id="collTabContent">\n';


  // ----------------------------------------------
  // ----------------- HOME -------------------
  // ----------------------------------------------

   html += '<div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab"><br>\n';

   for (var key in docData) {
         sub_info_data =  docData[key];
         sub_info = 'COLLMAIN'

         if(user_role == 'DEV') {sub_info_data['DESC'] = key + ': ' + sub_info_data['DESC'];}


         if(sub_info_data['MODE'] == 'INFO') {

              if(sub_info_data['TYPE'] == 'TEXT') {

                    allCollFormIDDetails[key] = key + '_' + sub_info + '_' +   sub_info_data['TYPE'];
                    html += '<div id = "' + 'DIV_' + allCollFormIDDetails[key] + '" class="form-group">\n';
                    //html += '<label data-toggle="tooltip" data-placement="bottom" title=' + sub_info_data['DESC'] + '>' + sub_info_data['KEY'] + '</label>\n';
                    html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                    html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';
                    html += '<input type="text" class="form-control" id="' + allCollFormIDDetails[key] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                    html += '</div>\n';


              } else if(sub_info_data['TYPE'] == 'MULTI_TEXT') {

                    allCollFormIDDetails[key] = key + '_' + sub_info + '_' +   sub_info_data['TYPE'];
                    html += '<div id = "' + 'DIV_' + allCollFormIDDetails[key] + '" class="form-group">\n';
                    html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                    html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';

                    html += '<textarea class="form-control" rows="5" id=' + allCollFormIDDetails[key] + '>' + sub_info_data['VALUE'] +'</textarea>\n';
                    html += '</div>\n';


              } else if(sub_info_data['TYPE'] == 'NUM') {

                      allCollFormIDDetails[key] = key + '_' + sub_info + '_' +  sub_info_data['TYPE'];
                      html += '<div id = "' + 'DIV_' + allCollFormIDDetails[key] + '" class="form-group">\n';
                      html += '<h5>' + sub_info_data['KEY'] + '</h5>\n';
                      html += '<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>\n';

                      html += '<input type="number" class="form-control" id="' + allCollFormIDDetails[key] + '" required value="' + sub_info_data['VALUE'] +'">\n';
                      html += '</div>\n';

                }   else if(sub_info_data['TYPE'] == 'BOOL'){

                 allCollFormIDDetails[key] = key + '_' + sub_info + '_' +  sub_info_data['TYPE'];
                 html +='<br><div id = "' + 'DIV_' + allCollFormIDDetails[key] + '" class="card border-secondary mb-3" style="width: 28rem;">';
                 html +='<div class="card-body">';
                 html +='<h5 class="card-title">' + sub_info_data['KEY'] + '</h5>';
                 html +='<p class="card-subtitle mb-2 text-muted" style="font-size:70%;">' + sub_info_data['DESC'] + '</p>';

                 //html += '<br><br><label data-toggle="tooltip" data-placement="bottom" title=' + sub_info_data['DESC'] + '>' + sub_info_data['KEY'] + '</label>\n';
                 //html += '<label for="details">' +  ' : ' + '</label><br>\n';

                 if(sub_info_data['VALUE'] == 'YES') {
                        html += '<label class="radio-inline"><input type="radio" name="' + allCollFormIDDetails[key]  +  '" value="YES" checked>YES</label>\n';
                        html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' + allCollFormIDDetails[key]  + '" value="NO" >NO</label>\n';
                    } else {
                        html += '<label class="radio-inline"><input type="radio" name="' + allCollFormIDDetails[key]  + '" value="YES" >YES</label>\n';
                        html += '<label class="radio-inline"><input type="radio" style="margin-left: 30px" name="' + allCollFormIDDetails[key]  + '" value="NO" checked>NO</label>\n';
                 }

                  html +='</div>';
                  html +='</div><br>';

              }


         }
    }

   html += '</div>\n';


   // ----------------------------------------------
   // ----------------- OPTIONS -------------------
   // ----------------------------------------------

   html += '<div class="tab-pane fade" id="options" role="tabpanel" aria-labelledby="options-tab">\n';

     // --------------------------------------------------------------------
     // --------------------- BUTTON CARD GROUP 1 ----------------------------
     html +='<div class="row">';
     html +='<div class="col-sm-6">';

     html +='<br><div class="card" style="width: 28rem;">';
     html +='<div class="card-body">';
     html +='<h5 class="card-title">Save Collection</h5>';
     html +='<p class="card-subtitle mb-2 text-muted">Save collection data into Database. Note : No validation is available before saving collection data.</p>';

     html +='<br><input type="button" id="' + coll_name + '_SAVE_BTN' +'" class="btn btn-success" value="SAVE COLLECTION" onclick="saveCurrentCollection()" />';

     html +='</div>';
     html +='</div>';

     html +='</div>';

      // ---------------------- BUTTON 2 -------------------------

      if(user_role == 'DEV') {
          html +='<div class="col-sm-6">';

          html +='<br><div class="card" style="width: 28rem;">';
          html +='<div class="card-body">';
          html +='<h5 class="card-title">Save Collection Key Data</h5>';
          html +='<p class="card-subtitle mb-2 text-muted">Save collection key data from Update fields table.Live table data will be saved into database.</p>';

          html +='<br><input type="button" id="' + coll_name + '_SAVE_KEY_FIELD_BTN' +'" class="btn btn-success" value="SAVE KEY DATA" onclick="saveAllDocFieldsData()" />';

          html +='</div>';
          html +='</div>';

          html +='</div>';
      }

      html +='</div><br>';

      // ------------------------------------------------------------



     if(user_role == 'DEV') {

         // --------------------------------------------------------------------
         // --------------------- BUTTON CARD GROUP 2 ----------------------------
         html +='<div class="row">';
         html +='<div class="col-sm-6">';

         html +='<div class="card" style="width: 28rem;">';
         html +='<div class="card-body">';
         html +='<h5 class="card-title">Create New Collection</h5>';
         html +='<p class="card-subtitle mb-2 text-muted">Create new collection with current collection document contents.Duplicate copy of current collection.</p>';

         html +='<br><input type="button" id="' + coll_name + '_SAVE_KEY_BTN' +'" class="btn btn-primary" value=" + Create Duplicate" onclick="duplicateCurrentCollection()" />';

         html +='</div>';
         html +='</div>';

         html +='</div>';

         // ---------------------- BUTTON 2 -------------------------

         html +='<div class="col-sm-6">';

         html +='<div class="card" style="width: 28rem;">';
         html +='<div class="card-body">';
         html +='<h5 class="card-title">Add New Field</h5>';
         html +='<p class="card-subtitle mb-2 text-muted">Adding new field into Collection main document or all documents.</p>';

         html +='<br><input type="button" id="' + coll_name + '_ADD_NEW_FIELD_BTN' +'" class="btn btn-primary" value=" + Add New Field" onclick="showAskFieldOptionModel()" />';

         html +='</div>';
         html +='</div>';

         html +='</div>';
         html +='</div><br>';

         // ------------------------------------------------------------
     }

     // --------------------------------------------------------------------
     // --------------------- BUTTON CARD GROUP 3 ----------------------------
     html +='<div class="row">';
     html +='<div class="col-sm-6">';

     html +='<div class="card" style="width: 28rem;">';
     html +='<div class="card-body">';
     html +='<h5 class="card-title">Publish Collection</h5>';
     html +='<p class="card-subtitle mb-2 text-muted">Publish collection into Database, So other application use its content.</p>';

     html +='<br><input type="button" id="' + coll_name + '_PUBLISH_COLL_BTN' +'" class="btn btn-warning" value=" Publish Collection" onclick="publishCurrentCollection()" />';

     html +='</div>';
     html +='</div>';

     html +='</div>';

     // ---------------------- BUTTON 2 -------------------------

     html +='<div class="col-sm-6">';

     html +='<div class="card" style="width: 28rem;">';
     html +='<div class="card-body">';
     html +='<h5 class="card-title">Collection Backup</h5>';
     html +='<p class="card-subtitle mb-2 text-muted">Create collection local backup for future use. It will generate a collection backup file.</p>';

     html +='<br><input type="button" id="' + coll_name + '_BACKUP_COLL_BTN' +'" class="btn btn-warning" value=" Create Collection BACKUP" onclick="backupCurrentCollection()" />';

     html +='</div>';
     html +='</div>';

     html +='</div>';
     html +='</div><br>';

     // ------------------------------------------------------------
	 
	  // --------------------------------------------------------------------
     // --------------------- BUTTON CARD GROUP 4 ----------------------------
     html +='<div class="row">';
     html +='<div class="col-sm-6">';

     html +='<div class="card" style="width: 28rem;">';
     html +='<div class="card-body">';
     html +='<h5 class="card-title">Publish Production Collection</h5>';
     html +='<p class="card-subtitle mb-2 text-muted">Publish collection into PRODUCTION Database, So main application use its content.</p>';

     html +='<br><input type="button" id="' + coll_name + '_PROD_PUBLISH_COLL_BTN' +'" class="btn btn-warning" value=" Publish Production Collection" onclick="publishProductionCurrentCollection()" />';

     html +='</div>';
     html +='</div>';

     html +='</div>';   
     html +='</div><br>';	 

     // ------------------------------------------------------------
	 
	 
	 // --------------------------------------------------------------------
     // --------------------- BUTTON CARD GROUP 5 ----------------------------
     html +='<div class="row">';
     html +='<div class="col-sm-6">';

     html +='<div class="card" style="width: 28rem;">';
     html +='<div class="card-body">';
     html +='<h5 class="card-title">Upload Backup File</h5>';
     html +='<p class="card-subtitle mb-2 text-muted">Update Collection with Backup file. Current collection content will be updated by Backup file content.</p>';

     
	 html +='<br><input type="file" id="collBackupFile" onchange="getBackupFileData()">';
	 html +='<p id="backupFileDetails"></p>';


     html +='</div>';
     html +='</div>';

     html +='</div>';

     // ---------------------- BUTTON 2 -------------------------

      if(user_role == 'DEV') {
          html +='<div class="col-sm-6">';

          html +='<div class="card" style="width: 28rem;">';
          html +='<div class="card-body">';
          html +='<h5 class="card-title">DELETE Collection</h5>';
          html +='<p class="card-subtitle mb-2 text-muted">This operation delete complete collection from database and also published collection Data.</p>';

          html +='<br><input type="button" id="' + coll_name + '_DELETE_DEV_COLL_BTN' +'" class="btn btn-danger" value=" DELETE COLLECTION" onclick="deleteCurrentCollection()" />';
          html +='<br><br><input type="button" id="' + coll_name + '_DELETE_PROD_COLL_BTN' +'" class="btn btn-danger" value=" DELETE PRODUCTION COLLECTION" onclick="deleteProductionCollection()" />';

          html +='</div>';
          html +='</div>';

          html +='</div>';
      }

      html +='</div><br>';

    

     // ------------------------------------------------------------



   html += '</div>\n';


   // ----------------------------------------------
  // ----------------- UPDATE KEY -------------------
  // ----------------------------------------------

   html += '<div class="tab-pane fade" id="updatekey" role="tabpanel" aria-labelledby="options-tab">\n';

    html +='<br><div class="text-right">';
    html +='<input type="button" id="' + coll_name + '_UPDATE_COLL_TABLE_BTN' +'" class="btn btn-primary" value=" Update Collection Keys" onclick="updateCollKeysTable()" />';
    html +='<input type="button" id="' + coll_name + '_UPDATE_DOC_TABLE_BTN' +'" class="btn btn-primary" value=" Update Documents Keys" style="margin-left: 30px" onclick="updateDocKeysTable()" />';
    //html +='<input type="button" id="' + coll_name + '_SAVE_KEY_BTN' +'" class="btn btn-outline-success" value="SAVE" style="margin-left: 30px" onclick="saveAllDocFieldsData()" />';
    html += '</div><br>\n';

    html += '<p><strong>Note:</strong> The <strong>data-parent</strong> </p>';


     // <!--THE CONTAINER WHERE WE'll ADD THE DYNAMIC TABLE-->
     html += '<div class="container" id="' + coll_name + '_TABLE'  +'"></div>';


   html += '</div>\n';

   html += '</div>\n';

  return html;

} // EOF




// *****************************************
// EVENT : Click on list group
// *****************************************
$('a[data-toggle="list"]').on('shown.bs.tab', function (e) {
  e.target // newly activated tab
  e.relatedTarget // previous active tab
  var res = e.target.toString().split("#");
  
  console.log("You have selected " + res[1]);  
  
}) //EOF

$('#collectionDocumentsList a').on('click', function (e) {
  e.preventDefault()
  //$(this).tab('show')

  console.log("You have selected " + $(this));
})

$("#container_dropdownMenuOption_menu a").click(function(e){
    e.preventDefault(); // cancel the link behaviour
    var selText = $(this).text();
    $("#container_dropdownMenuOption").text(selText);
	console.log("You have selected " + $("#container_dropdownMenuOption").text());
});

$("#datatype_dropdownMenuOption_menu a").click(function(e){
    e.preventDefault(); // cancel the link behaviour
    var selText = $(this).text();
    $("#datatype_dropdownMenuOption").text(selText);
	console.log("You have selected " + $("#datatype_dropdownMenuOption").text());
});



// *****************************************
// BUTTON Call Back
// Save Current Collection into Database
// *****************************************
function saveCurrentDocument(value){

   var currentData = readCurrentDocData(value);

   var result = confirm("Do you want to SAVE " + value + " Details ?");

    if(result) {

      showPleaseWait();

      // Update Data Set with new Details

      var dbDataSet = allDocData[value]

      for (var key in dbDataSet) {
               dbDataValue =  dbDataSet[key];

               if(dbDataValue['TYPE'] == 'TREE') {
                   var sub_data_set = dbDataValue['VALUE'];

                   for(var sub_key in sub_data_set) {

                       sub_dbDataValue = sub_data_set[sub_key]

                       dbDataSet[key]['VALUE'][sub_key]['VALUE'] = currentData[key + '_' + sub_key];

                   }

               } else {
                 dbDataSet[key]['VALUE'] = currentData[key];
               }
      }

      console.log(dbDataSet);

      // Write Into Database
      showPleaseWait();
      doc_count = 0;
      total_doc = 1;
	  writeDocument(basePath + coll_lang+'/'+coll_name,value,dbDataSet,'Document Updated !!');
      //let docData = db.collection(basePath + coll_lang+'/'+coll_name).doc(value).set(dbDataSet);

    }

} // EOF

// ----------- Write Document Into Database ------------------
async function writeDocument(collPath,docValue,dbDataSet,message){

   var writeOperation = await db.collection(collPath).doc(docValue).set(dbDataSet);
   //now this code is reached after that async write

   console.log(docValue + '  Doc Updating !!');

   doc_count = doc_count + 1;

   console.log('Counter : ' + doc_count);
   console.log('Total Doc : ' + total_doc);

   if(total_doc == doc_count) {    

      if(message != 'NA') {
		   hidePleaseWait();
		   alert(message);
	  }

   }
}

// ----------- Delete Document Into Database ------------------
async function deleteDocument(collPath,docValue,message){

  let deleteDoc = await db.collection(collPath).doc(docValue).delete();
  //now this code is reached after that async write

  console.log(docValue + '  Document Deleting !!')

  del_docCount = del_docCount + 1;

  console.log('Counter : ' + del_docCount.toString())
  console.log('Total Doc : ' + total_doc_before_del.toString() + '\n')

  if(del_docCount == total_doc_before_del) {    
	 
    if(message != 'NA') {
		hidePleaseWait();
		alert(message);
	}

  }

}

/*
*  Delete Current Document
*/
function deleteCurrentDocument(value){

   var currentData = readCurrentDocData(value);

   var result = confirm("Do you want to DELETE " + value + " Document ?");

    if(result) {

         var result2 = confirm("One more time CONFIRMATION to DELETE " + value + " Document ??");

         if(result2) {

           showPleaseWait();

           del_docCount = 0;
           total_doc_before_del = 1;
           deleteDocument(basePath + coll_lang+'/'+coll_name,value,'Document DELETED !!');


         }


    }

} // EOF

/*
*  Create Duplicate Doument from existing document
*/
function duplicateCurrentDocument(value) {

    var docNumArray = [];
   // Read All document key
   for(var key in allDocData){
       if(key != 'MAIN') {
        //console.log(key);
        var matches = key.match(/(\d+)/);
        //console.log(matches[0]);
        docNumArray.push(Number(matches[0]))
       }
   }

   console.log(docNumArray);
   var newDocNumber = Math.max.apply(null, docNumArray) + 1;
   console.log(newDocNumber);

   // ------------- Create Duplicate Document ----------
   if(newDocNumber > 0) {
      var result = confirm("Do you want to create a Duplicate document : " + 'DOC'+newDocNumber + '?');

      if(result) {

         console.log('Duplicate New Document !!')
         // Add a new document in collection
         showPleaseWait();
         doc_count = 0;
         total_doc = 1;
         writeDocument(basePath + coll_lang+'/'+coll_name,'DOC'+newDocNumber,allDocData[value],'New Document ADDED - ' + ' DOC'+newDocNumber + '\nPlease Refresh page.');
     }
   }


}//EOF

// *********************************************
// -------- Validate all Inputs -----------
// *********************************************
function validateCurrentDocument(value){
   console.log("You have selected " + value);

   //console.log(allDocFormIDDetails[value]);
   //console.log(allDocData[value]);

   //console.log(filterExistingDBData(value));
   //console.log(filterExistingDBData(value)[0]);
   //console.log(filterExistingDBData(value)[1]);

   updateTable(value,filterExistingDBData(value)[0],readCurrentDocData(value),filterExistingDBData(value)[1])

} // EOF

// *********************************************
// -------- Read Current Document Details ------
// *********************************************
function readCurrentDocData(value){

   var readCurrentData = {};
   var dcIDDetails = allDocFormIDDetails[value]


   // Read all Current ID
   for (var key in dcIDDetails) {
   	   idData =  dcIDDetails[key];

   	   if(idData.includes("_BOOL")) {

   	   // For Radio Buttons Input
   	   var rb_hd = document.getElementsByName(idData);

       for(i = 0; i < rb_hd.length; i++) {
           if(rb_hd[i].checked) {
                //console.log( key + ' : ' +  rb_hd[i].value);
                readCurrentData[key] = rb_hd[i].value;
           }
       }

       } else {

   	      //console.log( key + ' : ' +  $('#' + idData).val());
   	      readCurrentData[key] = $('#' + idData).val();

   	   }
   	}


   	return readCurrentData;

} //EOF

// *********************************************
// ------- Filter Existing DB Document Data ------
// *********************************************
function filterExistingDBData(value){

    var existingDbData = {};
    var existingDbKey = {};

    var dbDataSet = allDocData[value]

    for (var key in dbDataSet) {
      	   dbDataValue =  dbDataSet[key];
      	   if(dbDataValue['TYPE'] == 'TREE') {
      	       var sub_data_set = dbDataValue['VALUE'];
      	       for(var sub_key in sub_data_set) {
      	           sub_dbDataValue = sub_data_set[sub_key]
      	           existingDbData[key + '_' + sub_key] = sub_dbDataValue['VALUE'];
      	           existingDbKey[key + '_' + sub_key] = sub_dbDataValue['KEY'];
      	       }

      	   } else {
      	      existingDbData[key] = dbDataValue['VALUE'];
      	      existingDbKey[key] = dbDataValue['KEY'];
      	   }
    }

    return [existingDbData,existingDbKey];

} //EOF

/*
*  ------------ COLLECTION BUTTON CALL BACK ----------
*/

// *********************************************
// Create Duplicate collection from current collection
// *********************************************
function duplicateCurrentCollection() {

   var newCollection = prompt("What is New Collection Name ?");
    if (newCollection != null ) {
       if(newCollection != '') {

        newCollection = newCollection.toUpperCase();
        var result = confirm("Do you want to create a Duplicate COLLECTION : " + newCollection + '?');

        if(result) {

              showPleaseWait();
              doc_count = 0;
              total_doc = Object.keys(allDocData).length;


             // Read Current Collection Details
             for(var key in allDocData) {
                 writeDocument(basePath + coll_lang+'/'+newCollection,key,allDocData[key],'Collection Created !!');
             }


         }
       }
    }

}//EOF

// *********************************************
// Save all Collection Changes
// *********************************************
function saveCurrentCollection() {

  var result = confirm("Do you want SAVE " + coll_name + "Collection Data ?");

  if(result) {
      //console.log(readCurrentCOLLData());
      var currentData = readCurrentCOLLData();

       // Update Data Set with new Details
        var dbDataSet = allDocData['MAIN']

         showPleaseWait();

        for (var key in dbDataSet) {
                 dbDataValue =  dbDataSet[key];
                 dbDataSet[key]['VALUE'] = currentData[key];
        }

        console.log(dbDataSet);

        // Write Into Database
        doc_count = 0;
        total_doc = 1;
        writeDocument(basePath + coll_lang+'/'+coll_name,'MAIN',dbDataSet,'Collection Updated !!');

  }

}//EOF

// *********************************************
// -------- Read Current Document Details ----------
// *********************************************
function readCurrentCOLLData(){

   var readCurrentData = {};

   // Read all Current ID
   for (var key in allCollFormIDDetails) {
   	   idData =  allCollFormIDDetails[key];

   	   if(idData.includes("_BOOL")) {

   	   // For Radio Buttons Input
   	   var rb_hd = document.getElementsByName(idData);

       for(i = 0; i < rb_hd.length; i++) {
           if(rb_hd[i].checked) {
                //console.log( key + ' : ' +  rb_hd[i].value);
                readCurrentData[key] = rb_hd[i].value;
           }
       }

       } else {

   	      //console.log( key + ' : ' +  $('#' + idData).val());
   	      readCurrentData[key] = $('#' + idData).val();

   	   }
   	}


   	return readCurrentData;

} //EOF

// *********************************************
// -------- ADD new Field in Collection Or Document ----
// *********************************************
function showAskFieldOptionModel(){

$("#askFieldsDetailsModel").modal("show");

}//EOF

// *********************************************
// -------- Update Doc and COll Fields Details
// *********************************************
function addNewFieldInCollorDoc(){

   var container = $("#container_dropdownMenuOption").text().trim()
   var dataType = $("#datatype_dropdownMenuOption").text().trim()

   if(container != 'Please Select' && dataType != 'Please Select') {

   console.log(container);
   console.log(dataType);

   //console.log(getNewFieldDataSet(dataType));

   switch(container) {

   case 'COLLECTION':
         // Read All documents
         showPleaseWait();
         doc_count = 0;
         total_doc = 1;

          for(var key in allDocData){
             if(key == 'MAIN') {
                var docData = allDocData[key];

               var totalInfo = Object.keys(docData).length
               console.log('Value : '+totalInfo)

               // ---- Add New Field ---
               var fieldData = getNewFieldDataSet(dataType);
               //console.log(fieldData)

               docData['INFO'+totalInfo] = fieldData
               //let setDoc = db.collection(basePath + coll_lang+'/'+coll_name).doc(key).set(docData);
               writeDocument(basePath + coll_lang+'/'+coll_name,key,docData,'Collection Updated !!');

               console.log('New Field ADDED '+ key + ' : INFO'+totalInfo)
             }
          }


   break;

   case 'DOCUMENTS':
       // Read All documents
       showPleaseWait();

       doc_count = 0;
       total_doc = Object.keys(allDocData).length - 1;

       for(var key in allDocData){
          if(key != 'MAIN') {
             var docData = allDocData[key];

            var totalInfo = Object.keys(docData).length
            console.log('Value : '+totalInfo)

            // ---- Add New Field ---
            var fieldData = getNewFieldDataSet(dataType);
            //console.log(fieldData)

            docData['INFO'+totalInfo] = fieldData

            writeDocument(basePath + coll_lang+'/'+coll_name,key,docData,'Collection Updated !!');

            console.log('New Field ADDED '+ key + ' : INFO'+totalInfo)
          }
       }

       break;

   }

   } else {
     alert('Please Select Correct Options !!');
   }



}//EOF

// *********************************************************************
// UPDATE DOCUMENT DATA TABLE
// *********************************************************************
// ARRAY FOR HEADER.
var arrHead = new Array();
arrHead = ['S.NO','ID','KEY','DB DATA','CURRENT DATA'];

// FIRST CREATE A TABLE STRUCTURE BY ADDING A FEW HEADERS AND
// ADD THE TABLE TO YOUR WEB PAGE.
function createTable(docID) {

	var elem = document.getElementById(docID + '_docDetailsTable');
	if(elem){elem.parentNode.removeChild(elem);}


	var empTable = document.createElement('table');
	empTable.setAttribute('id', docID + '_docDetailsTable');            // SET THE TABLE ID.
	empTable.setAttribute('class', 'table table-bordered w-auto');            // SET THE TABLE ID.
	empTable.setAttribute('cellspacing', '100');            // SET THE TABLE ID.

	var tr = empTable.insertRow(-1);

	for (var h = 0; h < arrHead.length; h++) {

		var th = document.createElement('th');          // TABLE HEADER.
		th.innerHTML = arrHead[h];
		//th.setAttribute('class', 'col-sm-2');
		tr.appendChild(th);

	}

	var div = document.getElementById(docID + '_TABLE');
	div.appendChild(empTable);    // ADD THE TABLE TO YOUR WEB PAGE.


}

// UPDATE TABLE ACCORDING TO THE DETAILS
function updateTable(docID,databaseData,currentData,databaseKey) {

	createTable(docID);

	// ------------------------------------------------------
	// ----- ADD all DATA into ROWS ---
	// ------------------------------------------------------
	var cnt = 0;
	for(var key in databaseData) {

	   addRow(cnt++,docID,key,databaseData[key],currentData[key],databaseKey[key])
	}

}

// ADD A NEW ROW TO THE TABLE.s
function addRow(count,docID,keyData,dbData,currentData,dbKey) {
	var empTab = document.getElementById(docID + '_docDetailsTable');

	var rowCnt = empTab.rows.length;        // GET TABLE ROW COUNT.
	var tr = empTab.insertRow(rowCnt);      // TABLE ROW.
	tr = empTab.insertRow(rowCnt);

	// Check Both DATA
	// If DATA is changed then mark it red
	if(dbData != currentData) {
	   tr.setAttribute("class",'table-danger');
	}

	for (var c = 0; c < arrHead.length; c++) {
		var td = document.createElement('td');          // TABLE DEFINITION.
		td = tr.insertCell(c);


		switch(c) {
			case 0:
				td.innerHTML = count;

			break;

			case 1:
                td.innerHTML = keyData;

            break;

            case 2:
                td.innerHTML = dbKey;

            break;

			case 3:
                td.innerHTML = dbData;
			break;

			case 4:
                td.innerHTML = currentData;
			break;
		}


	}
}

// *************************************************************************



// *********************************************************************
// UPDATE COLLECTION DATA TABLE
// *********************************************************************

// ----- Update documents Key Table ----
function updateDocKeysTable() {
   currentKeyTableData = 'DOCUMENTS';
   updateCollectionTable(coll_name,'DOCUMENTS');

}//EOF

// ----- Update Collection Key Table ----
function updateCollKeysTable() {
   currentKeyTableData = 'COLLECTION';
   updateCollectionTable(coll_name,'COLLECTION');

}//EOF

// ARRAY FOR HEADER.
var collarrHead = new Array();
collarrHead = ['S.NO','ID','KEY', 'DESC','DATA TYPE', 'ROLE', 'PUBLISH' ,'BASE'];

// FIRST CREATE A TABLE STRUCTURE BY ADDING A FEW HEADERS AND
// ADD THE TABLE TO YOUR WEB PAGE.
function createCollectionTable(collName) {

	var elem = document.getElementById(collName + '_collKeyTable');
	if(elem){elem.parentNode.removeChild(elem);}


	var empTable = document.createElement('table');
	empTable.setAttribute('id', collName + '_collKeyTable');            // SET THE TABLE ID.
	empTable.setAttribute('class', 'table table-bordered w-auto');            // SET THE TABLE ID.
	empTable.setAttribute('cellspacing', '100');            // SET THE TABLE ID.

	var tr = empTable.insertRow(-1);

	for (var h = 0; h < collarrHead.length; h++) {

		var th = document.createElement('th');          // TABLE HEADER.
		th.innerHTML = collarrHead[h];
		//th.setAttribute('class', 'col-sm-2');
		tr.appendChild(th);

	}

	var div = document.getElementById(collName + '_TABLE');
	div.appendChild(empTable);    // ADD THE TABLE TO YOUR WEB PAGE.


}//EOF

// UPDATE TABLE ACCORDING TO THE DETAILS
function updateCollectionTable(collName,type) {

	createCollectionTable(collName);

	// ------------------------------------------------------
	// ----- ADD all DATA into ROWS ---
	// ------------------------------------------------------

	if(type == 'DOCUMENTS') {
            var cnt = 0;
            for(var key in allDocData) {
               if(key != 'MAIN') {
                   var eachDocData = allDocData[key];

                   // Read Each Info Details
                   for(var sub_key in eachDocData) {
                       var sub_data = eachDocData[sub_key];
                       console.log(sub_data);
                       if(sub_data['TYPE'] == 'TREE') {

                          addCollTBRow(collName,cnt++,sub_key,sub_data['KEY'],sub_data['DESC'],sub_data['TYPE'],sub_data['ROLE'],sub_data['PUBLISH'],sub_data['TYPE']+'_INFO');

                          for(var sub_info_key in sub_data['VALUE']) {
                               var sub_info_data = sub_data['VALUE'][sub_info_key];
                               addCollTBRow(collName,cnt++,sub_key + '_' + sub_info_key,sub_info_data['KEY'],sub_info_data['DESC'],sub_info_data['TYPE'],sub_info_data['ROLE'],sub_info_data['PUBLISH'],sub_data['TYPE']);
                          }

                       } else {
                         // ['S.NO','ID','KEY', 'DESC','DATA TYPE', 'MODE']
                          addCollTBRow(collName,cnt++,sub_key,sub_data['KEY'],sub_data['DESC'],sub_data['TYPE'],sub_data['ROLE'],sub_data['PUBLISH'],sub_data['TYPE']);
                       }

                   }


                   break;
               }
            }
    // ------------- Get Collection MAIN Data --------------
	} else {

	   var cnt = 0;
       for(var key in allDocData) {
          if(key == 'MAIN') {
              var eachDocData = allDocData[key];

              // Read Each Info Details
              for(var sub_key in eachDocData) {
                  var sub_data = eachDocData[sub_key];
                  console.log(sub_data);
                  if(sub_data['TYPE'] == 'TREE') {

                     addCollTBRow(collName,cnt++,sub_key,sub_data['KEY'],sub_data['DESC'],sub_data['TYPE'],sub_data['ROLE'],sub_data['PUBLISH'],sub_data['TYPE']+'_INFO');

                     for(var sub_info_key in sub_data['VALUE']) {
                          var sub_info_data = sub_data['VALUE'][sub_info_key];
                          addCollTBRow(collName,cnt++,sub_key + '_' + sub_info_key,sub_info_data['KEY'],sub_info_data['DESC'],sub_info_data['TYPE'],sub_info_data['ROLE'],sub_info_data['PUBLISH'],sub_data['TYPE']);
                     }

                  } else {
                    // ['S.NO','ID','KEY', 'DESC','DATA TYPE', 'MODE']
                     addCollTBRow(collName,cnt++,sub_key,sub_data['KEY'],sub_data['DESC'],sub_data['TYPE'],sub_data['ROLE'],sub_data['PUBLISH'],sub_data['TYPE']);
                  }

              }

              break;
          }

	   }
	}

} //EOF

// ADD A NEW ROW TO THE TABLE.s
function addCollTBRow(collName,count,id,key,desc,datatype,role,publish,mode) {
	var empTab = document.getElementById(collName + '_collKeyTable');

	var rowCnt = empTab.rows.length;        // GET TABLE ROW COUNT.
	var tr = empTab.insertRow(rowCnt);      // TABLE ROW.
	tr = empTab.insertRow(rowCnt);

	for (var c = 0; c < collarrHead.length; c++) {
		var td = document.createElement('td');          // TABLE DEFINITION.
		td = tr.insertCell(c);


		switch(c) {
			case 0:
				//td.innerHTML = count;
				var newlabel = document.createElement("Label");
                newlabel.setAttribute("class",'control-label');
                newlabel.innerHTML = count;
                td.appendChild(newlabel);

			break;

			case 1:
                //td.innerHTML = id;
                var newlabel = document.createElement("Label");
                newlabel.setAttribute("class",'control-label');
                newlabel.innerHTML = id;
                td.appendChild(newlabel);

            break;

			case 2:
                //td.innerHTML = key;

                var ele = document.createElement('input');
                ele.setAttribute('type', 'text');
                ele.setAttribute('value', key);
                ele.setAttribute('class', 'form-control');

                td.appendChild(ele);

            break;

			case 3:
                //td.innerHTML = desc;

                 var ele = document.createElement('input');
                ele.setAttribute('type', 'text');
                ele.setAttribute('value', desc);
                ele.setAttribute('class', 'form-control');

                td.appendChild(ele);
			break;

			case 4:
                //td.innerHTML = datatype;

                 var ele = document.createElement('input');
                ele.setAttribute('type', 'text');
                ele.setAttribute('value', datatype);
                ele.setAttribute('class', 'form-control');
                ele.setAttribute('onkeyup', 'this.value = this.value.toUpperCase();');

                td.appendChild(ele);
			break;

			case 5:

                 var ele = document.createElement('input');
                ele.setAttribute('type', 'text');
                ele.setAttribute('value', role);
                ele.setAttribute('class', 'form-control');
                ele.setAttribute('onkeyup', 'this.value = this.value.toUpperCase();');

                td.appendChild(ele);
            break;
			
			case 6:

                 var ele = document.createElement('input');
                ele.setAttribute('type', 'text');
                ele.setAttribute('value', publish);
                ele.setAttribute('class', 'form-control');
                ele.setAttribute('onkeyup', 'this.value = this.value.toUpperCase();');

                td.appendChild(ele);
            break;

			case 7:
                //td.innerHTML = mode;
                var newlabel = document.createElement("Label");
                newlabel.setAttribute("class",'control-label');
                newlabel.innerHTML = mode;
                td.appendChild(newlabel);

            break;
		}


	}
}//EOF

/*
* -------- SAVE TABLE  KEY DATA -----------
*/
function saveAllDocFieldsData() {

   if(currentKeyTableData == 'NA') {
      alert('First Please Update TABLE !!');
   } else {

   var result = confirm("Do you want to update all Documents Fields Data ?\n" + "Current Table Data : " + currentKeyTableData);

   	if(result) {

   	    // ------------- Only Update Documents Fields ----------------
   	    if(currentKeyTableData == 'DOCUMENTS') {

   	                 showPleaseWait();

   	                 doc_count = 0;
                     total_doc = Object.keys(allDocData).length - 1;

                     var main_doc_count = 0;

                    // Read all Documents and Update
                     var noChangeFound = true;
                    for(var key in allDocData) {
                        if(key != 'MAIN') {

                           var docData = allDocData[key];

                            var myTab = document.getElementById(coll_name + '_collKeyTable');

                           // LOOP THROUGH EACH ROW OF THE TABLE.
                            for (row = 1; row < myTab.rows.length - 1; row++) {
                                var values = new Array();
                                for (c = 0; c < myTab.rows[row].cells.length; c++) {   // EACH CELL IN A ROW.

                                    var element = myTab.rows.item(row).cells[c];
                                    if (element.childNodes[0].getAttribute('type') == 'text') {
                                        values.push(element.childNodes[0].value);
                                        //console.log(element.childNodes[0].value);
                                    } else {
                                        //console.log(element.childNodes[0].innerHTML);
                                        values.push(element.childNodes[0].innerHTML);

                                    }
                                }


                            if(values.length > 0) {

                            // Check if changed then only modify
                              var changed_value = false;

                              //console.log(values);
                              if(values[7] == 'TREE') {

                                  if(  docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['KEY'] != values[2] ||
                                         docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['DESC'] != values[3] ||
                                         docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['TYPE'] != values[4] ||
                                         docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['ROLE'] != values[5]  ||
										 docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['PUBLISH'] != values[6] ) {

                                          console.log('KEY DATA CHANGED : ' + values[1]);
                                          main_doc_count = main_doc_count + 1;


                                          docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['KEY'] = values[2];
                                          docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['DESC'] = values[3];
                                          docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['TYPE'] = values[4];
                                          docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['ROLE'] = values[5];
                                          docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['PUBLISH'] = values[6];

                                          changed_value = true;

                                        }


                              } else {

                                  if( docData[values[1]]['KEY'] != values[2] ||
                                      docData[values[1]]['DESC'] != values[3] ||
                                      docData[values[1]]['TYPE'] != values[4] ||
                                      docData[values[1]]['ROLE'] != values[5]  ||
									  docData[values[1]]['PUBLISH'] != values[6] ) {

                                      console.log('KEY DATA CHANGED : ' + values[1]);
                                      main_doc_count = main_doc_count + 1;


                                      docData[values[1]]['KEY'] = values[2];
                                      docData[values[1]]['DESC'] = values[3];
                                      docData[values[1]]['TYPE'] = values[4];
                                      docData[values[1]]['ROLE'] = values[5];
                                      docData[values[1]]['PUBLISH'] = values[6];

                                      changed_value = true;

                                  }

                              }


                              if(changed_value) {
                                 total_doc = main_doc_count;
                                 writeDocument(basePath + coll_lang+'/'+coll_name,key,docData,'All Documents ' + currentKeyTableData + 'Fields Updated !!');
                                 noChangeFound = false;
                              }


                            }

                            }
                        }
                    }

                    if(noChangeFound) {
                        hidePleaseWait();
                        alert('No Change Found !!')
                     }




        // ------------- Only Collection Keys Content --------------------
        } else {

            showPleaseWait();
            doc_count = 0;
            total_doc = 1;

            var main_doc_count = 0;

                   // Read all Documents and Update
                   var noChangeFound = true;
                   for(var key in allDocData) {
                       if(key == 'MAIN') {

                          var docData = allDocData[key];

                           var myTab = document.getElementById(coll_name + '_collKeyTable');

                          // LOOP THROUGH EACH ROW OF THE TABLE.
                           for (row = 1; row < myTab.rows.length - 1; row++) {
                               var values = new Array();
                               for (c = 0; c < myTab.rows[row].cells.length; c++) {   // EACH CELL IN A ROW.

                                   var element = myTab.rows.item(row).cells[c];
                                   if (element.childNodes[0].getAttribute('type') == 'text') {
                                       values.push(element.childNodes[0].value);
                                       //console.log(element.childNodes[0].value);
                                   } else {
                                       //console.log(element.childNodes[0].innerHTML);
                                       values.push(element.childNodes[0].innerHTML);

                                   }
                               }


                           if(values.length > 0) {

                             // Check if changed then only modify
                           var changed_value = false;

                           //console.log(values);
                           if(values[7] == 'TREE') {

                               if(  docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['KEY'] != values[2] ||
                                      docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['DESC'] != values[3] ||
                                      docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['TYPE'] != values[4] ||
                                      docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['ROLE'] != values[5]  ||
									  docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['PUBLISH'] != values[6] ) {

                                       console.log('KEY DATA CHANGED : ' + values[1]);
                                       main_doc_count = main_doc_count + 1;

                                       docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['KEY'] = values[2];
                                       docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['DESC'] = values[3];
                                       docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['TYPE'] = values[4];
                                       docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['ROLE'] = values[5];
                                       docData[values[1].split("_")[0]]['VALUE'][values[1].split("_")[1]]['PUBLISH'] = values[6];

                                        changed_value = true;

                                     }


                           } else {

                               if( docData[values[1]]['KEY'] != values[2] ||
                                   docData[values[1]]['DESC'] != values[3] ||
                                   docData[values[1]]['TYPE'] != values[4] ||
                                   docData[values[1]]['ROLE'] != values[5] ||
                                   docData[values[1]]['PUBLISH'] != values[6] ) {

                                   console.log('KEY DATA CHANGED : ' + values[1]);
                                   main_doc_count = main_doc_count + 1;

                                   docData[values[1]]['KEY'] = values[2];
                                   docData[values[1]]['DESC'] = values[3];
                                   docData[values[1]]['TYPE'] = values[4];
                                   docData[values[1]]['ROLE'] = values[5];
                                   docData[values[1]]['PUBLISH'] = values[6];

                                   changed_value = true;

                               }

                           }

                             if(changed_value) {
                               total_doc = main_doc_count;
                               writeDocument(basePath + coll_lang+'/'+coll_name,key,docData,'All Documents ' + currentKeyTableData + 'Fields Updated !!');
                               noChangeFound = false;
                             }

                           }

                           }
                       }
                   }

                   if(noChangeFound) {
                       hidePleaseWait();
                       alert('No Change Found !!')
                    }


        }// END ELSE

    } // END RESULT

   }// NA IF

}//EOF

// *************************************************************************


// *************************************************************
// ------------- PUBLISH COLLECTION ----------------------------
// - Create New Collection with _DATA postfix
// - If already present then Delete existing content
// - Create only Key and Value inside the Document.
// -- Publish Production collection also.
// -- Publish control INFO : INFO12
// -- Update Collection List Data also
// *************************************************************

function publishCurrentCollection(){

    var coll_name_data = coll_name + '_DATA';

    var result = confirm("Have you Refresh Page before process?\nAre you sure to publish your collection? ");

    if(result) {
       // Check is Collection is Present or Not?

       showPleaseWait();

       db.collection(basePath+coll_lang+'/'+coll_name_data).get().then(query => {
            console.log("SIZE : " + query.size);
            if(query.size == 0) {
              console.log(coll_name_data + " NOT PRESENT !!");

              // Create New DATA Collection
              createDATACollection(basePath+coll_lang+'/'+coll_name_data,basePath);

            } else {

              console.log(coll_name_data + " PRESENT !!");

              // ----- DELETE CURRENT COLLECTION CONTENT ---
              deletePublishedCollection(basePath+coll_lang+'/'+coll_name_data,basePath);

            }
			
       });

    } //EIF

}//EOF

// Delete Collection using async method
function deletePublishedCollection(collection_path,db_basePath){

    db.collection(collection_path).get().then((querySnapshot) => {
            console.log("SIZE : " + querySnapshot.size);

            if(querySnapshot.size != 0) {

                del_docCount = 0;
                total_doc_before_del = querySnapshot.size;

                var docCount = 0;
                // Read Each Documents
                querySnapshot.forEach((doc) => {
                    //console.log(`${doc.id} =>`, doc.data());
                    deletePublishedDocument(collection_path,doc.id,db_basePath);
                });

            }

    });

}

// ----------- Delete Document Into Database ------------------
async function deletePublishedDocument(collPath,docValue,db_basePath){

  let deleteDoc = await db.collection(collPath).doc(docValue).delete();
  //now this code is reached after that async write

  console.log(docValue + '  Document Deleting !!')

  del_docCount = del_docCount + 1;

  console.log('Counter : ' + del_docCount.toString())
  console.log('Total Doc : ' + total_doc_before_del.toString() + '\n')

  if(del_docCount == total_doc_before_del) {
     console.log('Create new published collection !!')
     createDATACollection(collPath,db_basePath);
  }

}

// -------- Create DATA Collection ---------
function createDATACollection(collection_path,db_basePath) {
	
	updateCollectionListData(db_basePath);
	
   // Read Current Collection Data

   doc_count = 0;
   total_doc = Object.keys(allDocData).length;

   for(var key in allDocData) {
       var docData = allDocData[key];
	   
	   // Check is Document Published Options is enabled or not
	   var doc_publish_validation = true;
	   if(key != 'MAIN') {		   
		   if(docData['MAIN']['VALUE'][doc_publish_info_details]['VALUE'] != 'YES'){
			   doc_publish_validation = false;
			   total_doc = total_doc - 1;
		   }		   
	   }
	   
	   if(doc_publish_validation){

		   console.log("-----  " + key + "  ---------")

		   var newDocDataSet = {};

		   // Filter Dataset
		   for(var info_key in docData) {
			   var info_data = docData[info_key];

			   // Check for Type
			   if(info_data['TYPE'] == 'TREE') {
					// Parse Into Tree Data
					for(var sub_info_key in info_data['VALUE']) {
						var sub_info_data = info_data['VALUE'][sub_info_key];
						
						// ------ Check Publish Options -----------
						if(sub_info_data['PUBLISH'] == 'YES') {
							// Check for Data Type
							if(sub_info_data['TYPE'] == 'BOOL') {
								 if(sub_info_data['VALUE'] == "YES") {
									 newDocDataSet[info_key + '_' + sub_info_key] = true;
								 } else {
									 newDocDataSet[info_key + '_' + sub_info_key] = false;
								 }
							  } else if(sub_info_data['TYPE'] == 'NUM') {
								 newDocDataSet[info_key + '_' + sub_info_key] = Number(sub_info_data['VALUE']);
							  } else {
								 newDocDataSet[info_key + '_' + sub_info_key] = sub_info_data['VALUE'];
							  }
						} else {
							console.log('Not Published : ' + sub_info_key);
						}

					}
			   } else {
				   
				   // ------ Check Publish Options -----------
					if(info_data['PUBLISH'] == 'YES') {
						
						  if(info_data['TYPE'] == 'BOOL') {
							 if(info_data['VALUE'] == "YES") {
								 newDocDataSet[info_key] = true;
							 } else {
								 newDocDataSet[info_key] = false;
							 }
						  } else if(info_data['TYPE'] == 'NUM') {
							 newDocDataSet[info_key] = Number(info_data['VALUE']);
						  } else {
							 newDocDataSet[info_key] = info_data['VALUE'];
						  }	
						  
					} else 
					{
						console.log('Not Published : ' + info_key);
					}

			   }
		   }


		   //console.log(newDocDataSet);
		   // Update Into Database
		   writeDocument(collection_path,key,newDocDataSet,'Collection Published !!');

		   console.log(key + " : CREATED !!")
	   } else {
		   console.log('SKIP TO PUBLISH : '+ key);
	   }
   }

}//EOF


// *********************************************************
// ------ Publish PRODUCTION Collection --------------------
// *********************************************************
function publishProductionCurrentCollection(){

    var coll_name_data = coll_name + '_DATA';

    var result = confirm("Have you Refresh Page before process?\nAre you sure to publish your collection? ");

    if(result) {
       // Check is Collection is Present or Not?

       showPleaseWait();

       db.collection(baseProductionPath+coll_lang+'/'+coll_name_data).get().then(query => {
            console.log("SIZE : " + query.size);
            if(query.size == 0) {
              console.log(coll_name_data + " NOT PRESENT !!");

              // Create New DATA Collection
              createDATACollection(baseProductionPath+coll_lang+'/'+coll_name_data,baseProductionPath);

            } else {

              console.log(coll_name_data + " PRESENT !!");

              // ----- DELETE CURRENT COLLECTION CONTENT ---
              deletePublishedCollection(baseProductionPath+coll_lang+'/'+coll_name_data,baseProductionPath);

            }
       });

    } //EIF

}//EOF


// *********************************************************
// ----- Update Collection LIST Data -----------------------
// *********************************************************
function updateCollectionListData(db_base_path){
	
	console.log('-> LIST_DATA Updation ....')
	
	var newCollDataSet = {};
	
	if(doc_listData_info_details != 'NA') {
		
		for(var key in allDocData) {
		   var docData = allDocData[key];
		   
		   if(key != 'MAIN') {
			  // Check is Document Published Options is enabled or not
			   var doc_publish_validation = true;		   		   
			   if(docData['MAIN']['VALUE'][doc_publish_info_details]['VALUE'] != 'YES') {
				   doc_publish_validation = false;			  
			   } 
			   
			   if(doc_publish_validation){

				   console.log("-----  " + key + "  ---------")
				   var doc_list_info = {};
				   
				   // Read Keys details
				   var list_data_details = doc_listData_info_details.split(',');			   
				   
				   for(each_info_det in list_data_details) {	
					   var info_details = list_data_details[each_info_det];
					   
					   if(info_details.includes("_")) {
						   doc_list_info[info_details] = docData[info_details.split('_')[0]]['VALUE'][info_details.split('_')[1]]['VALUE'];
					   } else {
						   doc_list_info[info_details] = docData[info_details]['VALUE'];
					   }
				   }
				   
				   newCollDataSet[key] = doc_list_info;	  
				   
				   
			   }
		   }
		}// For END
	
	}
	
	if(Object.keys(newCollDataSet).length > 0) {
		//console.log(newCollDataSet);
		
		// ---- Delete LIST_DATA Document -----
		del_docCount = 0;
        total_doc_before_del = 1;
		
		deleteDocument(db_base_path+coll_lang+'/'+'LIST_DATA',coll_name,'NA')
		console.log(coll_name + " : LIST_DATA DELETED !!")
		
		// Update LIST Data into LIST_DATA Collection.
        doc_count = 0;
        total_doc = 1;
		
		writeDocument(db_base_path+coll_lang+'/'+'LIST_DATA',coll_name,newCollDataSet,'NA');
		console.log(coll_name + " : LIST_DATA CREATED !!")
		
	} else {
		console.log('No list Data.')
	}
	
	
	
	
}// EOF

// **********************************************************
// ------- Create BACKUP file --------------
// *********************************************************
function backupCurrentCollection(){

    // Create Collection Content
    var collectionBackupData = {
        VALIDATE: 'FIREPROJECT_VIK_787',
        COLLECTION_NAME: coll_name,
        LANG: coll_lang,
        BASEPATH: basePath,
		DOCDATA: allDocData
    };

    var collectionBackupData_string = JSON.stringify(collectionBackupData);	
	
	//console.log(collectionBackupData_string);


   // var content = "What's up , hello world";
    // any kind of extension (.txt,.cpp,.cs,.bat)
    var filename = coll_name + "_BACKUP.json";

    var blob = new Blob([collectionBackupData_string], {
     type: "text/plain;charset=utf-8"
    });

    saveAs(blob, filename);

}

// **********************************************************
// ------- Update From Backup File  --------------
// *********************************************************

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  function getBackupFileData() {
	 var preview = document.getElementById('backupFileDetails');
	 var file = document.querySelector('input[type=file]').files[0];
	 var reader = new FileReader()
	 
	 var file_Data = '';

	 var textFile = /json.*/;

	 if (file.type.match(textFile)) {
		 
		 // Check Name
		 if(file.name == coll_name + '_BACKUP.json') {
				reader.onload = function (event) {
				   //preview.innerHTML = event.target.result;
				   file_Data = event.target.result;
				   
				   var txt = updateCollectionDatabase(file_Data);

				   preview.innerHTML = '<br>' + file.name + ' Uploaded !!<br>' + txt;
				   
				}		
		 } else {			 
			 preview.innerHTML = "<br><span class='error'>Incorrect file name.<br>File name should be : " + coll_name + "_BACKUP.json </span>";
		 }
	 } else {
		preview.innerHTML = "<br><span class='error'>It doesn't seem to be a backup file!</span>";
	 }
	 reader.readAsText(file);
	 
  }
} else {
  alert("Your browser is too old to support HTML5 File API");
}

// Update Database according to the Backup DATA
function updateCollectionDatabase(bkp_data){

	var BKP_OBJ;
    var ret_txt = '';

     try {

        BKP_OBJ = JSON.parse(bkp_data);

      } catch (e) {
         ret_txt = 'Wrong file format !!'
         return ret_txt;
      }

      // Validate Format
      // VALIDATE: 'FIREPROJECT_VIK_787',
      var vaidate = false;

      if('VALIDATE' in BKP_OBJ) {
         if(BKP_OBJ['VALIDATE'] == 'FIREPROJECT_VIK_787') {
           vaidate = true;
         }
      }

      if(!vaidate) {
         ret_txt = 'Wrong file format !!'
         return ret_txt;
      }

      console.log(BKP_OBJ);

	var COLLECTION_NAME = BKP_OBJ['COLLECTION_NAME'];
	var LANG = BKP_OBJ['LANG'];
	var BASEPATH = BKP_OBJ['BASEPATH'];

	var BKP_COLL_DATA = BKP_OBJ['DOCDATA'];



       var result = confirm("Do you want to Update Collection Data from Backup Data ?");

       if(result) {
          // Check is Collection is Present or Not?

          showPleaseWait();

          db.collection(BASEPATH+LANG+'/'+COLLECTION_NAME).get().then(query => {
               console.log("SIZE : " + query.size);

               if(query.size == 0) {
                 console.log(COLLECTION_NAME + " NOT PRESENT !!");

                 // Create New DATA Collection
                 updateCollectionFromBackup(BASEPATH+LANG+'/'+COLLECTION_NAME,BKP_COLL_DATA);

               } else {

                 console.log(COLLECTION_NAME + " PRESENT !!");

                 // ----- DELETE CURRENT COLLECTION CONTENT ---
                 deleteCompleteCollectionForBackup(BASEPATH+LANG+'/'+COLLECTION_NAME,BKP_COLL_DATA);

               }

          });

           ret_txt = 'Collection Data Updated !!'
           return ret_txt;

       } //EIF

   else {
      ret_txt = 'Updation Cancel !!'
      return ret_txt;
   }

}//EOF

// Delete Collection using async method
function deleteCompleteCollectionForBackup(collection_path,backup_data){

    db.collection(collection_path).get().then((querySnapshot) => {
            console.log("SIZE : " + querySnapshot.size);

            if(querySnapshot.size != 0) {

                del_docCount = 0;
                total_doc_before_del = querySnapshot.size;

                var docCount = 0;
                // Read Each Documents
                querySnapshot.forEach((doc) => {
                    //console.log(`${doc.id} =>`, doc.data());
                    deleteBackupCollectionDocument(collection_path,doc.id,backup_data)
                });

            }

    });

}

// ----------- Delete Document Into Database ------------------
async function deleteBackupCollectionDocument(collPath,docValue,backup_data){

  let deleteDoc = await db.collection(collPath).doc(docValue).delete();
  //now this code is reached after that async write

  console.log(docValue + '  Document Deleting !!')

  del_docCount = del_docCount + 1;

  console.log('Counter : ' + del_docCount.toString())
  console.log('Total Doc : ' + total_doc_before_del.toString() + '\n')

  if(del_docCount == total_doc_before_del) {
     console.log('Create new published collection !!')
     updateCollectionFromBackup(collPath,backup_data);
  }

}

// ----- Add New Backup Collection Documents -----
function updateCollectionFromBackup(collection_path,backup_data){

   doc_count = 0;

   total_doc = Object.keys(backup_data).length;

   //total_doc = backup_data.length;

   // Read Backup Data
   for(var doc_key in backup_data) {
      // Update Into Database
      writeDocument(collection_path,doc_key,backup_data[doc_key],'Collection Updated !!')
   }



}//EOF


// *******************************************************
// --------- DELETE COMPLETE COLLECTION ------------------
// *******************************************************

function deleteCurrentCollection(){

   var currCollection = prompt("Are you sure to DELETE Current Collection.\nPlease type Collection Name.\nCollection Name : "+coll_name);
       if (currCollection != null ) {
          if(currCollection != '') {

               currCollection = currCollection.toUpperCase();
               var result = confirm("Are you sure you want to DELETE Collection : " + currCollection + '?');

                   if(result) {

                       // Check Name Varification
                       if(currCollection == coll_name) {

                            showPleaseWait();

                            // START Deletion Process

                            console.log('MAIN Collection deletion process start ....')
							 
							// ---- Delete LIST_DATA Document -----
							del_docCount = 0;
							total_doc_before_del = 1;
							
							deleteDocument(basePath+coll_lang+'/'+'LIST_DATA',coll_name,'NA')
							console.log(coll_name + " : LIST_DATA DELETED !!")
	
	                        // Delete process
                            deleteCompleteCollection(basePath,coll_name,true);



                       } else {
                          alert('Wrong Collection name !!')
                       }

                   }
               }
       }

}//EOF

// Delete Collection using async method
function deleteCompleteCollection(base_coll_path,collection_name,nextStageStatus){

    db.collection(base_coll_path+coll_lang+'/'+collection_name).get().then((querySnapshot) => {
            console.log("SIZE : " + querySnapshot.size);

            if(querySnapshot.size != 0) {

                del_docCount = 0;
                total_doc_before_del = querySnapshot.size;

                var docCount = 0;
                // Read Each Documents
                querySnapshot.forEach((doc) => {
                    //console.log(`${doc.id} =>`, doc.data());
                    deleteFinalDocument(base_coll_path+coll_lang+'/'+collection_name,doc.id,nextStageStatus)
                });

            } else {
               hidePleaseWait();
               alert(coll_name + ' COLLECTION DELETED !!')
            }

    });

}

// ----------- Delete Document Into Database ------------------
async function deleteFinalDocument(collPath,docValue,nextStage){

  let deleteDoc = await db.collection(collPath).doc(docValue).delete();
  //now this code is reached after that async write

  console.log(docValue + '  Document Deleting !!')

  del_docCount = del_docCount + 1;

  console.log('Counter : ' + del_docCount.toString())
  console.log('Total Doc : ' + total_doc_before_del.toString() + '\n')

  if(del_docCount == total_doc_before_del) {
     console.log('Delete DATA Collection !!')
     if(nextStage) {
         deleteCompleteCollection(basePath,coll_name+'_DATA',false);
     }
     else {
        hidePleaseWait();
        alert(coll_name + ' COLLECTION DELETED !!')
        }
  }

}


// ********* DELETE Production Collection *******************
function deleteProductionCollection(){

   var currCollection = prompt("Are you sure to DELETE Production Collection.\nPlease type Collection Name.\nCollection Name : "+coll_name);
       if (currCollection != null ) {
          if(currCollection != '') {

               currCollection = currCollection.toUpperCase();
               var result = confirm("Are you sure you want to DELETE Collection : " + currCollection + '?');

                   if(result) {

                       // Check Name Varification
                       if(currCollection == coll_name) {

                             showPleaseWait();

                             // START Deletion Process

                             console.log('MAIN Production Collection deletion process start ....')
							 
							// ---- Delete LIST_DATA Document -----
							del_docCount = 0;
							total_doc_before_del = 1;
							
							deleteDocument(baseProductionPath+coll_lang+'/'+'LIST_DATA',coll_name,'NA')
							console.log(coll_name + " : LIST_DATA DELETED !!")
	
	                        // Delete process
                            deleteCompleteCollection(baseProductionPath,coll_name + '_DATA',false);



                       } else {
                          alert('Wrong Collection name !!')
                       }

                   }
               }
       }

}//EOF

// --------------------------- EXTRA ------------------------------
/**
 * Displays overlay with "Please wait" text. Based on bootstrap modal. Contains animated progress bar.
 */
function showPleaseWait() {
    var modalLoading = '<div class="modal" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false" role="dialog">\
        <div class="modal-dialog">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <h4 class="modal-title">Please wait...</h4>\
                </div>\
                <div class="modal-body">\
                    <div class="progress">\
                      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"\
                      aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%; height: 40px">\
                      </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
    $(document.body).append(modalLoading);
    $("#pleaseWaitDialog").modal("show");
}

/**
 * Hides "Please wait" overlay. See function showPleaseWait().
 */
function hidePleaseWait() {
  // Hide progress
    $("#pleaseWaitDialog").modal("hide");
}

// ----------Sleep Operation --------------
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// ------------ Internet Connection ------------
// Add event listener offline to detect network loss.
window.addEventListener("offline", function(e) {
    showPopForOfflineConnection();
});

// Add event listener online to detect network recovery.
window.addEventListener("online", function(e) {
    hidePopAfterOnlineInternetConnection();
});

function hidePopAfterOnlineInternetConnection(){
   console.log('Online');
   //alert('You are Online !!');
   is_network_present = true;
   
    // ------------ Enable All Buttons ----------------

}

function showPopForOfflineConnection(){
    console.log('offline');
     alert('You are Offline !!');
	 is_network_present = false;
    // ------------ Disable All Buttons ----------------

}


// Show No Record Message
function showNoRecordMessage(){
	
	//alert('No Collection Record Found !!')
	
	document.getElementById('collection_content_container').style.display = "none";
	document.getElementById('message_container').style.display = "block";
	
}


// ------ Create Toasts ---------------
function showToastsMessage(){
	
	var toastsLoading = '<div aria-live="polite" aria-atomic="true" style="position: relative; min-height: 200px;">\
		  <div class="toast" id="messageToasts" style="position: absolute; top: 0; right: 0;">\
			<div class="toast-header">\
			  <img src="..." class="rounded mr-2" alt="...">\
			  <strong class="mr-auto">Bootstrap</strong>\
			  <small>11 mins ago</small>\
			  <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">\
				<span aria-hidden="true">&times;</span>\
			  </button>\
			</div>\
			<div class="toast-body">\
			  Hello, world! This is a toast message.\
			</div>\
		  </div>\
		</div>';
    $(document.body).append(toastsLoading);
    $("#messageToasts").toast("show");
	
	
} // EOF

// *******************************************************
// ---------------- END -------------------
// *******************************************************