using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   
        public class FlownAsBookedReport 
        {


           // public string Airline { get; set; }
            public string AWBNo { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public string Origin { get; set; }
            public string Destination { get; set; }
            public string whereCondition { get; set; }
            public string OrderBy { get; set; }

            public string AgentName { get; set; }
            public string Commodity { get; set; }
            public string BookedFlightNo { get; set; }
            public string BookedFlightDate { get; set; }
            public string BookedOri { get; set; }
            public string BookedDest { get; set; }
            public int BookedPieces { get; set; }
            public Decimal BookedGrossWeight { get; set; }
            public Decimal BookedVolumeWeight { get; set; }
            public string AcceptanceFlightNo { get; set; }
            public Decimal AcceptancePieces { get; set; }
            public Decimal AcceptanceGrossWeight { get; set; }
            public Decimal AcceptanceVolumeWeight { get; set; }
            public string AcceptanceFlightDate { get; set; }
            public string FlownFlightNo { get; set; }
            public string FlownFlightDate { get; set; }
            public string FlownOrigin { get; set; }
            public string FlownDestination { get; set; }
            public int FlownPieces { get; set; }
            public Decimal FlownGrossWeight { get; set; }
            public Decimal FlownVolumeWeight { get; set; }
            public string Status { get; set; }
        




    }
    }

