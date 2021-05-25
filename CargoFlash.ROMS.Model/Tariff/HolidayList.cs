using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Tariff
{
    [KnownType(typeof(HolidayList))]
    public class HolidayList
    {
        public int SNo { get; set; }
        public DateTime Date { get; set; }
        public String Description { get; set; }
        public String CityCode { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }

    }
}
