using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(TaskArrea))]
    public class TaskArrea
    {
        public Int32 SNo { get; set; }
        public Int32 TASNo { get; set; }
        public Int32 TaskSno { get; set; }
        public string Text_TaskSno { get; set; }
        public bool TIsActive { get; set; }
        public bool TAIsActive { get; set; }

        public string TaskName { get; set; }
        public string AreaName { get; set; }
        public string totRowCount { get; set; }
        
    }
}
