using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model
{
     [KnownType(typeof(User))]
   public  class User
   {
       public Int32 SNo { get; set; }
       public string UserID { get; set; }
       public string Password { get; set; }
       public string EMailID { get; set; }
       public string Name { get; set; }
       public string Mobile { get; set; }      
       public string UserType { get; set; }
       public string CityCode { get; set; }       
       public string AirlineName { get; set; }       
       public int CreatedBy { get; set; }
       public Nullable<DateTime> CreatedOn { get; set; }
       public int UpdatedBy { get; set; }
       public Nullable<DateTime> UpdatedOn { get; set; }
    }
}
