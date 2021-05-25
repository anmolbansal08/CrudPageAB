using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model
{

    [KnownType(typeof(AutoComplete))]
    public class AutoComplete
    {
        public string Key { get; set; }
        public string Text { get; set; }
        public string TemplateColumn { get; set; }
    }
}
