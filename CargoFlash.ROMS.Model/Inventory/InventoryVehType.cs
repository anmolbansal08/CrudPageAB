using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Inventory
{
    [KnownType(typeof(InventoryVehType))]
    public class InventoryVehType
    {
        public int SNo { get; set; }
        public string VehicleType { get; set; }
        public string VehicleName { get; set; }
        public int ManufacturerSNo { get; set; }
        public string Text_ManufacturerSNo { get; set; }
        public string ModelNo { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public bool IsActive { get; set; }

    }
}
