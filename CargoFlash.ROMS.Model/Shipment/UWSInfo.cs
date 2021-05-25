using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(UWSAWBInfo))]
    public class UWSAWBInfo
    {
        public long? SNo { get; set; }
        public string FlightNo { get; set; }
        public Nullable<DateTime> FlightDate { get; set; }
        public string Airline { get; set; }
        public int LoadType { get; set; }
        public string EquipmentNo { get; set; }
        public int EquipmentSNo { get; set; }
        public string ScaleWeight { get; set; }
        public string Remarks { get; set; }
        public string DollyNo { get; set; }
        public string SHC { get; set; }
        public string Priority { get; set; }
        public string Text_LoadType { get; set; }
        public string Multi_SHC { get; set; }
        public string Text_SHC { get; set; }
        public string OriginCode { get; set; }
        public string DestinationCode { get; set; }
        public bool IsManual { get; set; }
        //--------------added after ----------------
        public string Process { get; set; }
        public string TareWeight { get; set; }
        public string NetWeight { get; set; }
        public string Shipment { get; set; }
        public string issued { get; set; }
        public string Manual { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int IsULD { get; set; }
        public int IsDGR { get; set; }
        public int IsPrint { get; set; }
        public int IsDeparted { get; set; }
        public string Variance { get; set; }
        public string TotalShipWeight { get; set; }
        public bool IsCart { get; set; }
        public string PartnerAirline { get; set; }
        
    }
}

