using System.Runtime.Serialization;
using System;
using System.Collections.Generic;

namespace CargoFlash.Cargo.Model.Warehouse
{
    [KnownType(typeof(WarehouseSetup))]
    public class WarehouseSetup
    {
        public int SNo { get; set; }
        public string AirportName { get; set; }
        public int AirportSNo { get; set; }
        public string WarehouseName { get; set; }
        public string WarehouseCode { get; set; }
        public int LevelNo { get; set; }
        public int WHRowCount { get; set; }
        public int WHColumnCount { get; set; }
        public int TotalArea { get; set; }
        public bool IsActive { get; set; }
        public string UpdatedBy { get; set; }
        public string Active { get; set; }
        public string TerminalName { get; set; }
        public string TerminalSNo { get; set; }
        public int WarehouseType { get; set; }
        public string Text_WarehouseType { get; set; }
    }
}
