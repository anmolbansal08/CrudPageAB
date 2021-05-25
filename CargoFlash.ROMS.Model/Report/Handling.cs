using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Handling Description
    /*
	*****************************************************************************
	Class Name:		Handling   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		25 Nov 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(Handling))]
    public class Handling
    {
        public String FromDate { get; set; }
        public String ToDate { get; set; }
        public String HandlingType{get;set;}
        public String AWBNo {get;set;}
        public String ReportType { get;set;}
        public String Agent { get;set;}
        public string Text_Agent { get; set; }
        public String Airline { get;set;}
        public string Text_Airline { get; set; }
        public String Type { get;set;}
        public String InvoiceNo { get; set; }
       
    }
}
