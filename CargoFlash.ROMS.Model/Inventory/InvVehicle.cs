using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Inventory
{
    [KnownType(typeof(InvVehicle))]
    public class InvVehicle
    {
        public int SNo { get; set; }
        public int VehicleTypeSNo { get; set; }
        public string Text_VehicleTypeSNo { get; set; }
        public DateTime ManufactureDate { get; set; }
        public string EngineNo { get; set; }
        public string ChasisNo { get; set; }
        public string RegistrationNo { get; set; }
        public DateTime DateofPurchase { get; set; }
        public bool TypeOfVehicle { get; set; }
        public string VehicleType { get; set; }
        public string PurchasedFrom { get; set; }
        public decimal CostOfVehicle { get; set; }
        public int CurrentMileageReading { get; set; }
        public DateTime? NextServiceDueOn { get; set; }
        public string CityCode { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Boolean IsActive { get; set; }
      
    }

    
}
