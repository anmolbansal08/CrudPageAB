using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.SpaceControl
{
    [KnownType(typeof(FreightBookingList))]
    public class FreightBookingList
    {
        //SNo,FlightNo,FlightDate,FlightOrigin,FlightDestination,ETD
        public int SNo { get; set; }
        public string FlightNo { get; set; }
        //public string FlightDate { get; set; }
        public Nullable<DateTime> FlightDate { get; set; }
        public string FlightOrigin { get; set; }
        public string FlightDestination { get; set; }
        public string ETD { get; set; }
        public string EnableSENDFBL { get; set; }

        public string EnablePRINT { get; set; }
        public string EnableVERSION { get; set; }

        public string ProcessStatus { get; set; }
    }

    [KnownType(typeof(FBLShipmentDetailsList))]
    public class FBLShipmentDetailsList
    {
        public string AirwayBill { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal Volume { get; set; }
        public string Commodity { get; set; }
        public string SHC { get; set; }
        public string NatureOfGoods { get; set; }
        public string RemarksTo { get; set; }
        public string Priority { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public int DailyFlightSNo { get; set; }
        public string FlightOrigin { get; set; }
        public string FlightDestination { get; set; }
        public string AgentName { get; set; }
        public string AgentCode { get; set; }
        public string FlightNumber { get; set; }
        public string ShipmentDate { get; set; }
        public decimal ChargeableWeight { get; set; }
        public string Product { get; set; }
        public string AWBStatus { get; set; }
        public string ShipmentStatus { get; set; }
        public string BookingStation { get; set; }
        public string BookingDate{ get; set; }

        public string Remarks { get; set; }
        public string FlightStatus{ get; set; }
        public string Mode { get; set; }
    }
}
