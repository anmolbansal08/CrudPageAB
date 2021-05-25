using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.SpaceControl
{
    [KnownType(typeof(AWBQueueManagement))]
    public class AWBQueueManagement
    {
        public int SNo { get; set; }
        public string QueueManagmentType { get; set; }
        public string SectorName { get; set; }
        public string SectorDescription { get; set; }
        public int OriginAirportSNo { get; set; }
        public string OriginAirportCode { get; set; }

        public string Text_OriginAirportSNo { get; set; }
        public int DestinationAirportSNo { get; set; }
        public string DestinationAirportCode { get; set; }
        public string Text_DestinationAirportSNo { get; set; }
        public string CarrierCode { get; set; }
        public int FlightNumber { get; set; }
     
        public int FlightTypeSNo { get; set; }

        public string Text_FlightTypeSNo { get; set; }
        public bool IsActive { get; set; }

        public string Active { get; set; }
        public string CreatedBy  { get; set; }
        public string UpdatedBy { get; set; }


    }
}
