using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
   public class State
    {
        public int SNo { get; set; }
        public string CountryName { get; set; }
        public string StateCode { get; set; }

        public string StateName { get; set; }
        public int CountrySNo { get; set; }

        public string Text_CountrySNo { get; set; }

        public string CountryCode { get; set; }


        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }
    }
}
