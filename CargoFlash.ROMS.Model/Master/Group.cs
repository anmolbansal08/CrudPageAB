using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model
{
    [KnownType(typeof(Group))]
    public class Group
    {
        public Int64 GroupID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string WeightUnit { get; set; }

        public string Days { get; set; }

        public string Active { get; set; }
    }
}
