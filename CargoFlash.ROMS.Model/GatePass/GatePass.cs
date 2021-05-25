using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.GatePass
{
   public class GatePass
    {
    }
  public class GatePassGridData
    {
        public string Booked_G_V_CBM { get; set; }
        public string Avilable_G_V_CBM { get; set; }
        public decimal BookedGrossWeight { get; set; }
        public decimal BookedVolumeWeight { get; set; }
        public decimal BookedCBMWeight { get; set; }
        public decimal AvilableGrossWeight { get; set; }
        public decimal AvilableVolumeWeight { get; set; }
        public decimal AvilableCBMWeight { get; set; }
        public string ProcessStatus { get; set; }
        public string FlightStatus { get; set; }
        public string ETA { get; set; }
        public string ETD { get; set; }
        public string ATD { get; set; }
        public string ATDGMT { get; set; }
        public string BoardingPoint { get; set; }
        public string EndPoint { get; set; }
        public string ACType { get; set; }
        public string CAO { get; set; }
        public string DAY { get; set; }
        public Int64 SNo { get; set; }
        public int GatePassSNo { get; set; } public int ULDSNo { get; set; } public int BTRSNo { get; set; }
        public string FlightNo { get; set; }
        public string ATDSystemTime { get; set; }
        //public string FlightDate { get; set; }
        public Nullable<DateTime> FlightDate { get; set; }
        public string FlightRoute { get; set; }
        public string SearchRoute { get; set; }

        public string GroupFlightSNo { get; set; }
        public string AirlineName { get; set; } //add  by Brajesh
        public bool IsStack { get; set; }
        public bool IsStopOver { get; set; }
        public bool IsNILManifested { get; set; }
        public bool IsRFS { get; set; }
        public bool IsBuildup { get; set; }
        public bool IsPreManifested { get; set; }
        public bool IsFlightClosed { get; set; }
        public bool IsRFSFlightsEdit { get; set; }
        public bool IsPAX { get; set; }
        public bool IsUWS { get; set; }
        public string RegistrationNo { get; set; }
        public string PartnerAirline { get; set; }
        public bool IsCargoTransfered { get; set; }
        public int FlightType { get; set; }

    }
}
