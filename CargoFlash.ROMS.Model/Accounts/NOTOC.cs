using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Accounts
{
    [KnownType(typeof(NOTOCGRID))]
    public class NOTOCGRID
    {
        public int SNo { get; set; }
        public string Pieces { get; set; }
        public string Name { get; set; }
    }
}
