using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(TaskMaster))]
    public class TaskMaster
    {
        public Int32 SNo { get; set; }
    }
}
