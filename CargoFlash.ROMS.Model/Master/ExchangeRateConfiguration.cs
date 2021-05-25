using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(ExchangeRateConfiguration))]
    public class ExchangeRateConfiguration
    {
        public Int32 SNo { get; set; }
        public string ProcessName { get; set; }
        public int ExecutionOn { get; set; }
        public string Text_ExecutionOn { get; set; }
        public string RateTypeUse { get; set; }
        public string Text_RateTypeUse { get; set; }
        public string RateTypeUseWithOR { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
    }
}
