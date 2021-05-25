using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Reservation
{


    public class FlightCapacityDashboard
    {
        public int SNo { get; set; }
        public string CarrierFlightNumberSuffix { get; set; }
        public string DepartureDate { get; set; }
        public string BoardPoint { get; set; }
        public string OffPoint { get; set; }
        public string Mode { get; set; }
        public string PlannedAircraftType { get; set; }
        public string OperatedAircraftType { get; set; }
        public string GrossWeight { get; set; }
        public string GrossVolume { get; set; }
        public string Revenue { get; set; }
        public string Grossweightutilization { get; set; }
        public string Grossvolumeutilization { get; set; }
        public string YieldbyChargeableWeight { get; set; }
        public string LoadFactor { get; set; }
        public string FlightNo { get; set; }
        public string FlightStatus { get; set; }
        public string TargetedGrossWeight { get; set; }
        public string TargetedRevenue { get; set; }
        public string TargetedYield { get; set; }
        public string GrossWeightDeviation { get; set; }
        public string RevenueDeviation { get; set; }
        public string YieldDeviation { get; set; }

    }

    public class FlightCapacityDashboardRequestModel
    {
        public string AirlineSNo { get; set; }
        public string FlightNo { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int FlightStatus { get; set; }

    }
}
