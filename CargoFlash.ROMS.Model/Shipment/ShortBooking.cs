using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Shipment
{
	[KnownType(typeof(ShortBookingGetWebForm))]
	public class ShortBookingGetWebForm
	{
		public string processName { get; set; }
		public string moduleName { get; set; }
		public string appName { get; set; }
		public string Action { get; set; }
		public string IsSubModule { get; set; }
	}

	[KnownType(typeof(ShortBooking))]
	public class ShortBooking
	{
		public int SNo { get; set; }
		public string BookingRefNo { get; set; }
		public string Prefix { get; set; }
		public string HdnPrefix { get; set; }
		public string AWBNo { get; set; }
		public string Origin { get; set; }
		public string HdnOrigin { get; set; }
		public string Destination { get; set; }
		public string HdnDestination { get; set; }
		public string Agent { get; set; }
		public string HdnAgent { get; set; }
		public string Pieces { get; set; }
		public string GrossWeight { get; set; }
		public string Volume { get; set; }
		public string Product { get; set; }
		public string HdnProduct { get; set; }
		public string Commodity { get; set; }
		public string HdnCommodity { get; set; }
		public string FlightDate { get; set; }
		public string FlightNo { get; set; }
		public string HdnFlightNo { get; set; }
		public string CreatedBy { get; set; }
		public string UpdatedBy { get; set; }
		
	}
}
