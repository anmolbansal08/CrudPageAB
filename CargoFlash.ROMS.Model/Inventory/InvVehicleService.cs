using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Inventory
{
    [KnownType(typeof(InvVehicleService))]
    public class InvVehicleService
    {
        public int SNo { get; set; }
        public int VehicleSNo { get; set; }
        public string Text_VehicleSNo { get; set; }
        public int VehicleServiceTypeSNo { get; set; }
        public string Text_VehicleServiceType { get; set; }
        public DateTime? ServicedOn { get; set; }
        public DateTime? NextServiceDueOn { get; set; }
        public string RegistrationNo { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Boolean IsActive { get; set; }
      

    }
}
