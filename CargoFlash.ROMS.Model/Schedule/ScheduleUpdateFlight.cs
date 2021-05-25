
// <copyright file="ScheduleFlightSearchRequest.cs" company="Cargoflash">
//
// Created On: 07-Sep-2017
// Created By: Braj
// Description: Schedule Update Flight
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
namespace CargoFlash.Cargo.Model.Schedule
{

    #region Using Directive
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Runtime.Serialization;
    #endregion
    /// <summary>
    /// Schedule Update Flight
    /// </summary>
    public class ScheduleUpdateFlight
    {
        /// <summary>
        /// Gets or sets flight date
        /// </summary>
        public DateTime? FlightDate { get; set; }
        /// <summary>
        /// Gets or sets Flight no
        /// </summary>
        public string FlightNo { get; set; }
        /// <summary>
        /// Gets or set leg's grid data
        /// </summary>
        public List<LegGridModel> LegGrid { get; set; }
        /// <summary>
        /// Gets or sets updates remarks
        /// </summary>
        public string Remarks { get; set; }
        /// <summary>
        /// Gets or sets flight allotment grid data
        /// </summary>
        public List<DailyFlightAllotment> FlightAllotment { get; set; }

    }

    public class SectorCapacityDistribution
    {
        public int SNo { get; set; }
        public string FlightNo { get; set; }
        public DateTime? FlightDate { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public string Board { get; set; }
        public string Off { get; set; }
        public decimal FreeSaleCapacity { get; set; }
        public decimal FreeSaleCapacityVolume { get; set; }
        public decimal FreeSaleUsedGross { get; set; }
        public decimal FreeSaleUsedVolume { get; set; }
        public Decimal? SecCapDisGWT { get; set; }
        public Decimal? SecCapDisVWT { get; set; }
        public bool IsSectorCapDistribution { get; set; }
    }

    public class SegmentFilghtBookingOpenClose {

        public string FlightNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string Days { get; set; }
        public bool IsBookingClosed { get; set; }
    }

    public class FlightInitDetails
    {
        public string FlightNo { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
    }
}
