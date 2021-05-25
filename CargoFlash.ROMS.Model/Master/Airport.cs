using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Airport))]
    public class Airport
    {
        public Int32 SNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public String AirportCode { get; set; }
        public String AirportName { get; set; }
        //public String CitySNo { get; set; }
        public String CityCode { get; set; }
        public String CityName { get; set; }
        public String Text_CityCode { get; set; }
        //public String CountrySNo { get; set; }
        public String CountryCode { get; set; }
        public String CountryName { get; set; }
        public String Text_CountryCode { get; set; }
        public bool IsDayLightSaving { get; set; }
        public String DayLightSaving { get; set; }
     
       
        public bool IsActive { get; set; }
        public String Active { get; set; }
        //public String IsActive { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CreatedBy { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string UpdatedBy { get; set; }
        public bool IsEmailAlertonoffloadedCargo { get; set; }
        public string EmailAlertonoffloadedCargo { get; set; } /* Added By Pankaj Kumar Ishwar on 28-03-2018 */
        public string EmailAlertTime { get; set; }
        public string Time { get; set; }
        public bool IsDefaultAirport { get; set; }
        public string Text_IsDefaultAirport { get; set; }
        public bool IsDoChargeApplicable { get; set; }
        public string Text_DoChargeApplicable { get; set; }
    }
    [KnownType(typeof(AirportCutoffTime))]
    public class AirportCutoffTime
    {
        // add new column for acceptance cut off time
        public int SNo { get; set; }
        public int AirportSNo { get; set; }

        public string ProductSNo { get; set; }
        public string HdnProductSNo { get; set; }
        //public string ProductName { get; set; }

        public string AirlineSNo { get; set; }
        public string HdnAirlineSNo { get; set; }
        

        public string AircraftSNo { get; set; }
        public string HdnAircraftSNo { get; set; }
        public string AircraftType { get; set; }

        public string SPHCSNo { get; set; }
        public string HdnSPHCSNo { get; set; }
        //public string SPHCode { get; set; }

        public string HdnAcceptanceCutoffType { get; set; }

        public string AcceptanceCutoffType { get; set; }
        //public string Text_AcceptanceCutoffType { get; set; }

        public int ConnectionTime { get; set; }

        public bool IsBaseSetting { get; set; }
        public string BaseSetting { get; set; }

        public bool IsActive { get; set; }
        public String Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        // 
    }

}
