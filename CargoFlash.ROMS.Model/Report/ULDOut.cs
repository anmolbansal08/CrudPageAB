using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Agent ULD Out Description
    /*
	*****************************************************************************
	Class Name:		ULD Out
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		14 Sept 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ULDOut))]
    public class ULDOut
    {
        public int SNo { get; set; }
        public String ULDNo { get; set; }
        public String IssuanceDate { get; set; }
        public String UCRReceiptNo { get; set; }
        public String Destination { get; set; }
        public String UserName { get; set; }
        public String TransfredBy { get; set; }
        public String ReceivedBy { get; set; }
        public String IssuedTo { get; set; }
        public String Dt { get; set; }

        public String ULD{ get; set; }
        public String FromDt { get; set; }
        public String ToDt { get; set; }
        public String Issue { get; set; }
        public String Recd { get; set; }
        public String UCR { get; set; }
        public String Remarks { get; set; }
        public String Amount { get; set; }
    }
    public class ULDOutRequest
    {
        /// <summary>
        /// Get or Set FDate
        /// </summary>
        public string FDate { get; set; }
        /// <summary>
        /// Get or Set TDate
        /// </summary>
        public string TDate { get; set; }
        /// <summary>
        /// Get or Set Issue
        /// </summary>
        public string Issue { get; set; }
        /// <summary>
        /// Get or Set ULD
        /// </summary>
        public string ULD { get; set; }
        /// <summary>
        /// Get or Set UCR
        /// </summary>
        public string UCR { get; set; }
        /// <summary>
        /// Get or Set Recd
        /// </summary>
        public string Recd { get; set; }
    }
}
