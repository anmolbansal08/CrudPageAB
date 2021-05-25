using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Report
{
    #region Balance Stock Description
    /*
	*****************************************************************************
	Class Name:		Balance Stock
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		21 Sept 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(BalanceStock))]
    public class BalanceStock
    {

        public String Item { get; set; }
        public String City { get; set; }
        public String Ownertype { get; set; }
        public String Consumble { get; set; }
        public String Utilized { get; set; }
     
        public String Balance { get; set; }
       
        public String Owner { get; set; }
     

        public String Agt { get; set; }
        public String Air { get; set; }
        public String CItem { get; set; }
        public String Rpt { get; set; }
        public String Dt { get; set; }
       
       
    }


    public class BalanceStockRequest
    {

        /// <summary>
        /// Get or Set rpt
        /// </summary>
        public string rpt { get; set; }
        /// <summary>
        /// Get or Set agent
        /// </summary>
        public string agent { get; set; }
        /// <summary>
        /// Get or Set airline
        /// </summary>
        public string airline { get; set; }
       
    }
}
