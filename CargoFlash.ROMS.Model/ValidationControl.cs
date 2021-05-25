using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model
{
     [KnownType(typeof(ValidateControls))]
   public  class ValidateControls
   {
     
       public string ValidationMessage { get; set; }
       public string ControlValue { get; set; }
     
    }
}
