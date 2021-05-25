using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Tariff
{
    #region RateGlobalDueCarrier
    /*
	*****************************************************************************
	Class Name:		RateGlobalDueCarrier   
	Purpose:		This class used to handle Rate Airlin eMaster
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Amit Kumar Gupta
	Created On:		29 APR 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(RateGlobalDueCarrier))]
    public class RateGlobalDueCarrier
    {

        public int SNo { get; set; }

        public int AirlineSNo { get; set; }

        public string Text_AirlineSNo { get; set; }

        public string Airline { get; set; }

        public int OriginIATASNo { get; set; }

        public string Text_OriginIATASNo { get; set; }

        public string OriginIATA { get; set; }

        public int OriginCountrySNo { get; set; }

        public string Text_OriginCountrySNo { get; set; }

        public string OriginCountry { get; set; }

        public int OriginAirportSNo { get; set; }

        public string Text_OriginAirportSNo { get; set; }

        public string OriginAirPort { get; set; }

        public int DestinationIATASNo { get; set; }

        public string Text_DestinationIATASNo { get; set; }

        public string DestinationIATA { get; set; }

        public int DestinationCountrySNo { get; set; }

        public string Text_DestinationCountrySNo { get; set; }

        public string DestinationCountry { get; set; }

        public int DestinationAirportSNo { get; set; }

        public string Text_DestinationAirportSNo { get; set; }

        public string DestinationAirPort { get; set; }

        public bool IsActive { get; set; }

        public String Active { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }

        public string CreatedUser { get; set; }

        public string UpdatedUser { get; set; }

   }
}
