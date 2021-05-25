using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Irregularity
{
    [KnownType(typeof(IrregularityIncident))]
    public class IrregularityIncident
    {
        public int SNo { get; set; }
        public string IncidentCategory { get; set; }
        public string IncidentCategoryCode { get; set; }
        public string Description { get; set; }
        public int InitiationDays { get; set; }
        public int ClosureDays { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public string Active { get; set; }
        public string UpdatedByUser { get; set; }
        public string CreatedByUser { get; set; }




        //public string SubCategoryCode { get; set; }
        //public string SubCategoryName { get; set; }
        //public string SubCategoryDesc { get; set; }

        public List<SubCategoryTrans> TransData { get; set; } //added
    }
}

