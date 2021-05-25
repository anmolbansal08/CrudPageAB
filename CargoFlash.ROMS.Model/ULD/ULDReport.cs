using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.ComponentModel.DataAnnotations;

namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(ULDReport))]
    public class ULDReport
    {
        public int ASNo { get; set; }
        public int CSNo { get; set; }
        public string Name { get; set; }
        public int Total { get; set; }
        public string Serviceable { get; set; }
        public string Damaged { get; set; }
        public string ULDType { get; set; }
        public int ULDTp { get; set; }
        public string StockType { get; set; }
        public string ULDNo { get; set; }
        public string AirlineName { get; set; }
        public string CityName { get; set; }
        public string Deviation { get; set; }
        public string DeviationPercentage { get; set; }

    }
    // Changes by Vipin Kumar
    [KnownType(typeof(ULDRecord))]
    public class ULDRecord
    {
        [Required]
        public int? AirlineSNo { get; set; }
        public int? CitySNo { get; set; }
        public int? OwnershipSNo { get; set; }
    }
    //ends
}
