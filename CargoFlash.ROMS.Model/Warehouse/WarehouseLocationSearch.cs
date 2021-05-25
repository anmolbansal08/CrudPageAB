using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Warehouse
{
    [KnownType(typeof(WarehouseLocationSearch))]
    public class WarehouseLocationSearch
    {

        public string Terminal { get; set; }
        public string Airline { get; set; }
        public string SHC { get; set; }
        public string DestCountry { get; set; }
        public string DestCity { get; set; }
        public string AgentForwarder { get; set; }
        public string Location { get; set; }
        public string SubLocation { get; set; }
        public string SubAreaName { get; set; }

    }


    [KnownType(typeof(WarehouseLocationSearchResult))]
    public class WarehouseLocationSearchResult
    {

        public string SNo { get; set; }
        public string AWBNo { get; set; }
        public string LocationName { get; set; }
        public string HdnLocationName { get; set; }
        public string PicNo { get; set; }
        public string SPHC { get; set; }
        public string CountryName { get; set; }
        public string CityName { get; set; }
        public string TerminalName { get; set; }
        public string AgentName { get; set; }
        public string AirlineName { get; set; }
        public string ULDNo { get; set; }
    }
}
