using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.ULD
{
    #region ULDBaggageType Description
    /*
    *****************************************************************************
    Class Name:		ULDBaggageType   
    Purpose:		This class used to handle
    Company:		CargoFlash Infotech Pvt Ltd.
    Author:			Devendra Singh.
    Created On:	    05 July 2017
    Updated By:     
    Updated On:    
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    #endregion
    [KnownType(typeof(ULDBaggageType))]
   public class ULDBaggageType
    {
        public int SNo { get; set; }
        public string BaggageType { get; set; }
        public string BaggageDesc { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }

    }
}
