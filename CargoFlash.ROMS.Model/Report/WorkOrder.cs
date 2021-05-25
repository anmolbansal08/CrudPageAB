using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region WorkOrder Description
    /*
	*****************************************************************************
	Class Name:		WorkOrder   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		05 Feb 206
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(WorkOrder))]
    public class WorkOrder
    {
        public int SNo { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string TotalAmount { get; set; }
        public string InvoiceNo { get; set; }
        public string AWBNo { get; set; }
        public string GrandTotal { get; set; }
        public string RoundOffAmount { get; set; }
        public string BalanceReceivable { get; set; }
        public string TotalReceivable { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string AWBType { get; set; }
        public string ULDNo { get; set; }
        public string SLINo { get; set; }
        public string DoNo { get; set; }
        public int DOSNo { get; set; }
        public string ProcessName { get; set; }
        public string FlightNo1 { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }

    }
}
