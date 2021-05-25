using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region Product Description
    /*
	*****************************************************************************
	Class Name:		Product   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shivang Srivastava.
	Created On:		04 March 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(Product))]
    public class Product
    {

        public int SNo { get; set; }
        public string ProductName { get; set; }
        public Nullable<Decimal> Priority { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public bool IsExpress { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public string Default1 { get; set; }
        public string Active { get; set; }
        public string Express { get; set; }
        public string ProductCode { get; set; }
        public string PriorityMasterSNo { get; set; } //Added By Pankaj Kumar Ishwar on 27/03/2018
        public string Text_PriorityMasterSNo { get; set; }//Added By Pankaj Kumar Ishwar on 27/03/2018
        //Add  By Sushant Kumar Nayak On 19-05-2018
        public string Text_TypeOfDiscount { get; set; }
        public string TypeOfDiscount { get; set; }
        public string LabelTypeOfDiscount { get; set; }

    }
}
