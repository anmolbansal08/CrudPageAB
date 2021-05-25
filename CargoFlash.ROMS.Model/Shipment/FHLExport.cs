using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Shipment
{
	[KnownType(typeof(FHLExport))]
	public class FHLExport
	{
		public int SNo { get; set; }
		public Int64 DailyFlightSNo { get; set; }
		public String Airline { get; set; }
		public String FlightNo { get; set; }
		public DateTime? FlightDate { get; set; }
		public String AWBNo { get; set; }
		public String SLINo { get; set; }
		public String Origin { get; set; }
		public String Destination { get; set; }
		public int Pcs { get; set; }
		public Int64 ArrivedShipmentSNo { get; set; }
		public String ATA { get; set; }
		public String ProcessStatus { get; set; }
		public String EnteredType { get; set; }
	}
}
