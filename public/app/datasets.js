// *******************************************************************************
// SCRIPT :
//        - This script contains Base Datasets
// *******************************************************************************

// *********************************************************************
// BASE Document Data Set
// *********************************************************************
function getNewFieldDataSet(control){

	// ----------- INFO ----------------
	var eachInfoField = {
		KEY: "Key Name",
		VALUE: "Value",
		TYPE: "TEXT",
		MODE: "INFO",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};


	// ----------- MULTI_INFO ----------------
	var eachMultiInfoField = {
		KEY: "Key Name",
		VALUE: "Value",
		TYPE: "MULTI_TEXT",
		MODE: "INFO",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};


	// ----------- BOOL ----------------
    var eachBoolInfoField = {
        KEY: "Key Name",
        VALUE: "NO",
        TYPE: "BOOL",
        MODE: "INFO",
        ROLE: "ADMIN",
		PUBLISH: "YES",
        DESC: "Description"
    };


    // ----------- NUM ----------------
    var eachNumInfoField = {
        KEY: "Key Name",
        VALUE: "0",
        TYPE: "NUM",
        MODE: "INFO",
        ROLE: "ADMIN",
		PUBLISH: "YES",
        DESC: "Description"
    };

	// ----------- LISTREF ----------------
	var eachListRefField = {
		KEY: "Key Name",
		VALUE: {
			INFO1 : {
				KEY: "Visible",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO2 : {
				KEY: "Ref Details",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO3 : {
				KEY: "Model Details",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			}
		},
		TYPE: "TREE",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		MODE: "LISTREF",
		DESC: "Description"
	};


	// ----------- IMAGE ----------------
	var eachImageField = {
		KEY: "Key Name",
		VALUE: {
			INFO1 : {
				KEY: "Image Name",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO2 : {
				KEY: "External Url",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO3 : {
				KEY: "Visible",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			},
			INFO4 : {
				KEY: "Source",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			}
		},
		TYPE: "TREE",
		MODE: "IMAGE",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};


	// ----------- TREE ----------------
	var eachTreeField = {
		KEY: "Key Name",
		VALUE: {
			INFO1 : {
				KEY: "Key Name",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO2 : {
				KEY: "Key Name",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO3 : {
				KEY: "Key Name",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			},
			INFO4 : {
				KEY: "Key Name",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			}
		},
		TYPE: "TREE",
		MODE: "TREE",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};



	// ----------- FORM ----------------
	var eachFormField = {
		KEY: "Key Name",
		VALUE: {
			INFO1 : {
				KEY: "Form Name",
				DESC: "Description",
				VALUE: "Name",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO2 : {
				KEY: "Form Desc",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO3 : {
				KEY: "Form Mode",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO4 : {
				KEY: "Extra",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			}
		},
		TYPE: "TREE",
		MODE: "FORM",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};


	// ----------- MAIN ----------------
	var eachMainField = {
		KEY: "Key Name",
		VALUE: {
			INFO1 : {
				KEY: "NAME",
				DESC: "Description",
				VALUE: "Name",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO2 : {
				KEY: "Description",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO3 : {
				KEY: "Owner",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "TEXT"
			},
			INFO4 : {
				KEY: "Visible",
				DESC: "Description",
				VALUE: "Value",
				ROLE: "ADMIN",
				PUBLISH: "YES",
				TYPE: "BOOL"
			}
		},
		TYPE: "TREE",
		MODE: "MAIN",
		ROLE: "ADMIN",
		PUBLISH: "YES",
		DESC: "Description"
	};
	
	
	switch(control){
		case 'MAIN':
		return eachMainField;
		break;
		
		case 'INFO':
		return eachInfoField;
		break;

		case 'MULTI_INFO':
		return eachMultiInfoField;
		break;

		case 'BOOL':
        return eachBoolInfoField;
        break;

        case 'NUM':
        return eachNumInfoField;
        break;
		
		case 'LISTREF':
		return eachListRefField;
		break;
		
		case 'IMAGE':
		return eachImageField;
		break;
		
		case 'TREE':
		return eachTreeField;
		break;

		case 'FORM':
		return eachFormField;
		break;

	}
}

function getCollectionMainDocSet(){

   // ----------- MAIN ----------------

	var eachMainField = {

	    INFO1 : {
                            KEY: "Collection Name",
                            VALUE: "Value",
                            TYPE: "TEXT",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
	            },

	    INFO2 : {
        	                KEY: "Collection Description",
                            VALUE: "Value",
                            TYPE: "MULTI_TEXT",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
        	    },

        INFO3 : {
                            KEY: "Visible",
                            VALUE: "Value",
                            TYPE: "BOOL",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
                },

        INFO4 : {
                            KEY: "Owner Details",
                            VALUE: "Value",
                            TYPE: "TEXT",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
                },

        INFO5 : {
                            KEY: "Link Activity",
                            VALUE: "Value",
                            TYPE: "TEXT",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
                },


        INFO6 : {
                            KEY: "Total Document",
                            VALUE: "0",
                            TYPE: "NUM",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
                },

         INFO7 : {
                            KEY: "Collection ADMIN Mode",
                            VALUE: "YES",
                            TYPE: "BOOL",
                            MODE: "INFO",
                            ROLE: "ADMIN",
							PUBLISH: "YES",
                            DESC: "Description"
                },

          INFO8 : {
                                     KEY: "Display Image Tab",
                                     VALUE: "YES",
                                     TYPE: "BOOL",
                                     MODE: "INFO",
                                     ROLE: "ADMIN",
									 PUBLISH: "YES",
                                     DESC: "Description"
                         },

           INFO9 : {
                                   KEY: "Display Multi Tab",
                                   VALUE: "YES",
                                   TYPE: "BOOL",
                                   MODE: "INFO",
                                   ROLE: "ADMIN",
								   PUBLISH: "YES",
                                   DESC: "Description"
                          },

           INFO10 : {
                                  KEY: "Display Form Tab",
                                  VALUE: "YES",
                                  TYPE: "BOOL",
                                  MODE: "INFO",
                                  ROLE: "ADMIN",
								  PUBLISH: "YES",
                                  DESC: "Description"
                         },
		 // --------- Documents Related Fields --------------
		  INFO11 : {
							  KEY: "Document Display ID",
							  VALUE: "INFO0",
							  TYPE: "TEXT",
							  MODE: "INFO",
							  ROLE: "ADMIN",
							  PUBLISH: "YES",
							  DESC: "Document Display ID INFO details."
					 },
		INFO12 : {
							  KEY: "Document Published Options",
							  VALUE: "INFO1",
							  TYPE: "TEXT",
							  MODE: "INFO",
							  ROLE: "ADMIN",
							  PUBLISH: "YES",
							  DESC: "Document Published options INFOR details."
					 },
		INFO13 : {
							  KEY: "Document List Data INFO Options",
							  VALUE: "NA",
							  TYPE: "TEXT",
							  MODE: "INFO",
							  ROLE: "ADMIN",
							  PUBLISH: "YES",
							  DESC: "Document List Data INFO Options Details. Ex : INFO1,INFO2,INFO3"
					 }

	};

	return eachMainField;

}

// *******************************************************
// ---------------- END -------------------
// *******************************************************