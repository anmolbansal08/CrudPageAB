using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Tariff
{
    #region Tariff Search Description
    /*
	*****************************************************************************
	Class Name:		Tariff Search  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi
	Created On:		24 June 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(TariffSearch))]
    public class TariffSearch
    {
      
        public String TariffAgent { get; set; }
        public String TariffAirline { get; set; }
        public String TariffDate { get; set; }

        public String TariffType { get; set; }
            }
}
