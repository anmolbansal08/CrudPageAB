using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Inventory
{
    [KnownType(typeof(Consumable))]
    public class Consumable
    {
        public int SNo { get; set; }
        public string Item { get; set; }
        public int ItemSno { get; set; }
        public string Text_Item { get; set; }
        //public int BasisOfChargeSNo { get; set; }
        //public string Text_BasisOfChargeSNo { get; set; }
        public Boolean IsChargeable { get; set; }
        public Boolean IsNumbered { get; set; }
        public Boolean IsReturnable { get; set; }
        public string Chargeable { get; set; }
        public string Numbered { get; set; }
        public string Returnable { get; set; }
        public decimal TareWeight { get; set; }
        public Boolean Type { get; set; }
        public string Text_Type { get; set; }
        public int City { get; set; }
        public string Text_City { get; set; }
        public int Airport { get; set; }
        public string Text_Airport { get; set; }

        public int Owner { get; set; }
        public string Text_Owner { get; set; }

        public int OwnerName { get; set; }
        public string Text_OwnerName { get; set; }

        public int Office { get; set; }
        public string Text_Office { get; set; }

        public string AllTareWeight { get; set; }
        public int CreatedBy { get; set; }

        public string AirportName { get; set; }
        /***********************************************/
        public Boolean InventoryBuild { get; set; }
        public Boolean InventoryLocation { get; set; }
        public Boolean InventoryWeighing { get; set; }
        public string InvenatoryUsage { get; set; }

    }
}
