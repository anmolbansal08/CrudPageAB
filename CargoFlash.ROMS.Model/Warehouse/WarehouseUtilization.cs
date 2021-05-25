using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Warehouse
{

    [KnownType(typeof(WarehouseUtilization))]
    public class WarehouseUtilization
    {
            public string SNo  { get; set; }
            public string  Airport { get; set; }
            public string  Warehouse { get; set; }
            public string  Type { get; set; }
            public string  Terminal { get; set; }
            public string  TotalGross { get; set; }                        
            public string  TotalVol { get; set; }
            public string  AWBs { get; set; }
            public string  TotalGrossUsed { get; set; }
            public string  TotalVolUsed { get; set; }
            public string  TotalGrossAvail { get; set; }
            public string TotalVolAvail { get; set; }
    }

    [KnownType(typeof(SubAreaUtilization))]
    public class SubAreaUtilization
    {
        public string SNo { get; set; }
        public string StorageArea { get; set; }
        public string Airline { get; set; }
        public string SHC { get; set; }
        public string DestCountry { get; set; }
        public string DestCity { get; set; }
        public string Agent { get; set; }
        public string Type { get; set; }
        public string SubLocationType { get; set; }
        public string TotalGross { get; set; }
        public string TotalVol { get; set; }
        public string AWBs { get; set; }
        public string TotalGrossUsed { get; set; }
        public string TotalVolUsed { get; set; }
        public string TotalGrossAvail { get; set; }
        public string TotalVolAvail { get; set; }
    }

    [KnownType(typeof(RackUtilization))]
    public class RackUtilization
    {
        public string SNo { get; set; }
        public string RackNumber { get; set; }
        public string SlabNumber { get; set; }
        public string Name { get; set; }        
        public string TotalGross { get; set; }
        public string TotalVol { get; set; }
        public string AWBs { get; set; }
        public string TotalGrossUsed { get; set; }
        public string TotalVolUsed { get; set; }
        public string TotalGrossAvail { get; set; }
        public string TotalVolAvail { get; set; }
    }
}
