using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(DriverMaster))]
    public class DriverMaster
    {
        public int SNo { get; set; }
        public string ID { get; set; }
        public string Nationality { get; set; }
        public string Text_Nationality { get; set; }
        public string FirstName  { get; set; }
        public string LastName { get; set; }
       public string DriverName { get; set; }
       
        public string Mobile { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }


    }
}
