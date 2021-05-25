// <copyright file="SpaceControlSearchFlightGrid.cs" company="Cargoflash">
//
// Created On: 06-Feb-2017
// Created By: Braj
// Description: Space Control Search Flight Grid
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
// </copyright>

namespace CargoFlash.Cargo.Model.SpaceControl
{
    #region Using Directive
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    #endregion

    /// <summary>
    /// Space Control Search Flight Grid
    /// </summary>    
    public class SpaceControlSearchFlightGrid
    {
        /// <summary>
        /// Gets or sets daily flight sno
        /// </summary>
        public string DailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets flight no
        /// </summary>
        public string FlightNo { get; set; }
        /// <summary>
        /// Gets or sets flight date
        /// </summary>
        public DateTime? FlightDate { get; set; }
        /// <summary>
        /// Gets or sets origin airport code
        /// </summary>
        public string OriginAirportCode { get; set; }
        /// <summary>
        /// Gets or sets destination airport code
        /// </summary>
        public string DestinationAirportCode { get; set; }
        /// <summary>
        /// Gets or sets estimatated time of departure
        /// </summary>
        public string ETD { get; set; }

        /// <summary>
        /// Gets or sets time to departure
        /// </summary>
        public string TimeToDep { get; set; }
        /// <summary>
        /// Gets or sets aircraft type 
        /// </summary>
        public string AircraftType { get; set; }
        /// <summary>
        /// Gets or sets gross weight 
        /// </summary>
        public decimal GrossWeight { get; set; }
        /// <summary>
        /// Gets or sets remaining gross weight 
        /// </summary>
        public decimal RemainingGrossWeight { get; set; }
        /// <summary>
        /// Gets or sets used gross weight 
        /// </summary>
        public decimal UsedGrossWeight { get; set; }
        /// <summary>
        /// Gets or sets total volume 
        /// </summary>
        public decimal Volume { get; set; }

        /// <summary>
        /// Gets or sets used volume 
        /// </summary>
        public decimal UsedVolume { get; set; }
        /// <summary>
        /// Gets or sets total remaining volume
        /// </summary>
        public decimal RemainingVolume { get; set; }
        /// <summary>
        /// Gets or sets free sale gross weight
        /// </summary>
        public decimal FreeSaleGrossWeight { get; set; }
        /// <summary>
        /// Gets or sets free sale used gross weight
        /// </summary>
        public decimal FreeSaleUsedGrossWeight { get; set; }
        /// <summary>
        /// Gets or sets free sale remaining gross
        /// </summary>
        public decimal FreeSaleRemainingGross { get; set; }
        /// <summary>
        /// Gets or sets free sale volume
        /// </summary>
        public decimal FreeSaleVolume { get; set; }
        /// <summary>
        /// Gets or sets free sale used volume
        /// </summary>
        public decimal FreeSaleUsedVolume { get; set; }
        /// <summary>
        /// Gets or sets free sale remaining volume 
        /// </summary>
        public decimal FreeSaleRemainingVolume { get; set; }
        /// <summary>
        /// Gets or sets reserved gross weight 
        /// </summary>
        public decimal ReservedGrossWeight { get; set; }
        /// <summary>
        /// gets or sets reserved used gross weight
        /// </summary>
        public decimal ReservedUsedGrossWeight { get; set; }
        /// <summary>
        /// Gets or sets reserved remaining gross weight
        /// </summary>
        public decimal ReservedRemainingGrossWeight { get; set; }
        /// <summary>
        /// Gets or sets reserved volume
        /// </summary>
        public decimal ReservedVolume { get; set; }
        /// <summary>
        /// Gets or sets reserved used volume 
        /// </summary>
        public decimal ReservedUsedVolume { get; set; }
        /// <summary>
        /// Gets or sets reserved remaining volume
        /// </summary>
        public decimal ReservedRemainingVolume { get; set; }
        /// <summary>
        /// Gets or sets over book gross weight
        /// </summary>
        public decimal OverBookGrossWeight { get; set; }
        /// <summary>
        /// Gets or sets over book used gross weight
        /// </summary>
        public decimal OverBookUsedGrossWeight { get; set; }
        /// <summary>
        /// Gets or sets over book remaining gross weight
        /// </summary>
        public decimal OverBookRemainingGrossWeight { get; set; }
        /// <summary>
        /// Gets or sets over book volume
        /// </summary>
        public decimal OverBookVolume { get; set; }
        /// <summary>
        /// Gets or sets over book used volume
        /// </summary>
        public decimal OverBookUsedVolume { get; set; }
        /// <summary>
        /// Gets or set over book remaining volume
        /// </summary>
        public decimal OverBookRemainingVolume { get; set; }

    }

   
}
