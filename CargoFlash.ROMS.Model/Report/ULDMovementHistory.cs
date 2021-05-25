using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;
using System.ComponentModel.DataAnnotations;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(ULDHistory))]
    public class ULDMovementHistory
    {
        public String OriginAirPortCode { get; set; }
        public String DestinationAirPortCode { get; set; }
        public String FlightNo { get; set; }
        public String FlightDate { get; set; }
        public String ULDNo { get; set; }
        public String Status { get; set; }
        public String Arrival { get; set; }
        public String Departure { get; set; }
        public String MovementType { get; set; }
        public Boolean IsAvailable { get; set; }
        public String CurrentCityCode { get; set; }


        public String AirportCode { get; set; }
        public String ULDSno { get; set; }
        public String FDt { get; set; }
        public String TDt { get; set; }

        public String ATD { get; set; }
        public String ATA { get; set; }

    }
    // Changes by Vipin Kumar
    [KnownType(typeof(SearchData))]
    public class SearchData
    {
        [Required]
        public string Airport { get; set; }
        [Required]
        public int? ULDSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }

    public class ULDMovement
    {
        public string ULDNo { get; set; }
        public string ToDate { get; set; }
        public string FromDate { get; set; }
    }
    //Ends
}
