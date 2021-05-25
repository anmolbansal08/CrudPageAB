using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Export Import Description
    /*
	*****************************************************************************
	Class Name:		Export Import
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		6 July 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ExportImport))]
    public class ExportImport
    {
        
       
        public String PMonth { get; set; }
        public String PYear { get; set; }

        public String CMonth { get; set; }
        public String CYear { get; set; }

        public String @Top { get; set; }
        public String @Airline { get; set; }
        public String @Agent { get; set; }


       
    }
}
