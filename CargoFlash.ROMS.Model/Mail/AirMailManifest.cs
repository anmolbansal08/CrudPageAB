using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Mail
{
    [KnownType(typeof(AirMailPreManifestGrid))]
    public class AirMailPreManifestGrid
    {
        public string GroupFlightSNo { get; set; }
        public string FlightNo { get; set; }
        public DateTime? FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string OffPoint { get; set; }
        public string FlightStatus { get; set; }
    }

    [KnownType(typeof(AirMailPreManifestRecord))]
    public class AirMailPreManifestRecord
    {
        public int SNo { get; set; }
        public string CN38No { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string OffPoint { get; set; }
        public string SPHC { get; set; }
        public int TotalPieces { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public decimal ChargeableWeight { get; set; }
        public string MailCategoryName { get; set; }
        public string MHCName { get; set; }
        public string ULDNo { get; set; }
        public string IsManifested { get; set; }
        public int TotalDN { get; set; }
        public string CN_ULDNo { get; set; }
    }

    [KnownType(typeof(PreManifestChildRecord))]
    public class PreManifestChildRecord
    {
        public int SNo { get; set; }
        public int TransSNo { get; set; }
        public string DNNo { get; set; }
        public string OriCityCode { get; set; }
        public string DestCityCode { get; set; }
        public string ReceptacleNumber { get; set; }
        public string HNRIndicator { get; set; }
        public string RIICode { get; set; }
        public string ReceptacleWeight { get; set; }
        public string DNULDNo { get; set; }
        public string IsManifested { get; set; }
        public string DN_ULDNo { get; set; }
    }

    [KnownType(typeof(PoMailPreManifest))]
    public class PoMailPreManifest
    {
        public int PoMailSNo { get; set; }
        public int ULDStockSNo { get; set; }
        public bool IsChecked { get; set; }
        public string IsOffloaded { get; set; }
    }

    [KnownType(typeof(PoMailPreManifestTrans))]
    public class PoMailPreManifestTrans
    {
        public int PoMailSNo { get; set; }
        public int DNSNo { get; set; }
        public int ULDStockSNo { get; set; }
        public bool IsChecked { get; set; }
        public string IsOffloaded { get; set; }
    }
}
