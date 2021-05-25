using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;

namespace CargoFlash.Cargo.Model.Report
{
    #region Tariff History Description
    /*
	*****************************************************************************
	Class Name:		Tariff History  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		18 June 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(TariffHistory))]
    public class TariffHistory
    {
        //Changes by Vipin Kumar
        //public String Tariffsno { get; set; }
        [Required]
        public int? Tariffsno { get; set; }
        // Ends
        public String TariffCode { get; set; }
        public String TariffName { get; set; }

    }
}
