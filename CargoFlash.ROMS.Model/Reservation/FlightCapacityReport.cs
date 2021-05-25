using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Reservation
{

    [KnownType(typeof(FlightCapacityReport))]
    public class FlightCapacityReport
    {
        public int SNo { get; set; }
        public string FlightNumber { get; set; }
        public string DepartureDate { get; set; }
        public string BoardPoint { get; set; }
        public string OffPoint { get; set; }
        public string Sector { get; set; }
        public string Stretch { get; set; }
        public string PlannedAircraftType { get; set; }
        public string OperatedAircraftType { get; set; }
        public string Distance { get; set; }
        public string CommercialCapacity { get; set; }
        public string RTKC { get; set; }
        public string ATKC { get; set; }
        public string ActualCLF { get; set; }
        public string GrossWeight { get; set; }
        public string GrossVolume { get; set; }
        public string Revenue { get; set; }
        public string FlightStatus { get; set; }
        public string TargetedGrossWeight { get; set; }
        public string TargetedRevenue { get; set; }
        public string TargetedRTKC { get; set; }
        public string TargetedATKC { get; set; }
        public string TargetedCLF { get; set; }
    }


    [KnownType(typeof(FlightCapacityRequestModel))]
    public class FlightCapacityRequestModel
    {
        public string AirlineCode { get; set; }
        public string OriginSNo { get; set; }
        public string DestinationSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string DateType { get; set; }
        public string FlightNo { get; set; }
    }
}
