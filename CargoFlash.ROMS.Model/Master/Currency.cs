using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Currency Description
    /*
	*****************************************************************************
	Class Name:		Currency      
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		05 Mar 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(Currency))]
    public class Currency
    {
        public Int32 SNo { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrencyName { get; set; }
        public string Text_InDecimal { get; set; }
        public Int32 InDecimal { get; set; }
        public string Text_InAmount { get; set; }
        public Int32 InAmount { get; set; }
        public string Text_Basis { get; set; }
        public Int32 Basis { get; set; }
        public string LabelInDecimal { get; set; }
        public string LabelInAmount { get; set; }
        public string LabelSpace { get; set; }


        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }
}
