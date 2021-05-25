using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   public class DashBoardFlightReport
    {
       public int AirlineSNo { get; set; }
       public string OriginSNo { get; set; }
       public string DestinationSNo { get; set; }
       public string FlightNo { get; set; }
       public string Status { get; set; }
       public string FromDate { get; set; }
       public string ToDate { get; set; }
       public string FlightNos { get; set; }
       public string DepartureDate { get; set; }
       public string BoardPoint { get; set; }
       public string Offpoint { get; set; }
       public string Sector { get; set; }
       public string Stretch { get; set; }
       public string PlannedAircraftType { get; set; }
       public string OperatedAircraftType { get; set; }
       public string Distance { get; set; }
       public string Commercialcapacity { get; set; }
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
    }
}
