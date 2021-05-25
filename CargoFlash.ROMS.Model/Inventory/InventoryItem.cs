using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.Inventory
{
    [KnownType(typeof(InventoryItem))]
    public class InventoryItem
      {
         public int SNo { get; set; }
         public string ItemName { get; set; }
         public bool IsActive { get; set; }
         public String Active { get; set; }
         public string CreatedBy { get; set; }
         // public DateTime CreatedOn { get; set; }  
         public string UpdatedBy { get; set; }
          // public DateTime UpdatedOn { get; set; }
      }
}
