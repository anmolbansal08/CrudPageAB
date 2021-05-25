
// <copyright file="AllotmentGrid.cs" company="Cargoflash">
//
// Created On: 12-Sep-2017
// Created By: Braj
// Description: Allotment grid model
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
    /// Allotment grid
    /// </summary>
    /// 
    [Serializable]
    public class AllotmentGrid
    {
        /// <summary>
        /// Gets or sets allotment sno
        /// </summary>
        public int SNo { get; set; }
        /// <summary>
        /// Gets or sets is used 
        /// </summary>
        public int IsUsed { get; set; }
        /// <summary>
        /// Gets or sets dailyflight sno
        /// </summary>
        public int DailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets allotment code
        /// </summary>
        public string AllotmentCode { get; set; }
        /// <summary>
        /// Gets or sets allotment type sno
        /// </summary>
        public string AllotmentTypeSNo { get; set; }
        /// <summary>
        /// Gets or sets allotment type
        /// </summary>
        public string AllotmentType { get; set; }
      
      /// <summary>
      /// Gets or sets office sno
      /// </summary>
        public string OfficeSNo { get; set; }
        /// <summary>
        /// Gets or sets office name
        /// </summary>
        public string Office { get; set; }
        /// <summary>
        /// Gets or sets account sno
        /// </summary>
        public string AccountSNo { get; set; }
        /// <summary>
        /// Gets or sets account name
        /// </summary>
        public string Account { get; set; }
        /// <summary>
        /// Gets or sets gross weight
        /// </summary>
        public Decimal? GrossWeight { get; set; }
        /// <summary>
        /// Gets or sets volume
        /// </summary>
        public Decimal? Volume { get; set; }
        /// <summary>
        /// Gets or sets Release gross
        /// </summary>
        public string ReleaseGross { get; set; }
        /// <summary>
        /// Gets or sets release volume
        /// </summary>
        public string ReleaseVolume { get; set; }
        /// <summary>
        /// Gets or sets gross variance plus
        /// </summary>
        public Decimal? GrossVariancePlus { get; set; }
        /// <summary>
        /// Gets or sets gross variance in minus 
        /// </summary>
        public Decimal? GrossVarianceMinus { get; set; }
        /// <summary>
        /// Gets or sets volume variance in plus
        /// </summary>
        public Decimal? VolumeVariancePlus { get; set; }
        /// <summary>
        /// Gets or sets volume variance in minus 
        /// </summary>
        public Decimal? VolumeVarianceMinus { get; set; }
        /// <summary>
        /// Gets or sets SHC sno
        /// </summary>
        public string SHCSNo { get; set; }
        /// <summary>
        /// Gets or sets SHC
        /// </summary>
        public string SHC { get; set; }
        /// <summary>
        /// Gets or sets commodity sno
        /// </summary>
        public string CommoditySNo { get; set; }
        /// <summary>
        /// Gets or sets commodity 
        /// </summary>
        public string Commodity { get; set; }
        /// <summary>
        /// Gets or sets product sno
        /// </summary>
        public string ProductSNo { get; set; }
        /// <summary>
        /// Gets or sets product
        /// </summary>
        public string Product { get; set; }
        /// <summary>
        /// Gets or sets Isexclide shc
        /// </summary>
        public Boolean IsExcludeSHC { get; set; }
        /// <summary>
        /// Gets or sets isexlude commodity
        /// </summary>
        public Boolean IsExcludeCommodity { get; set; }
        /// <summary>
        /// Gets or sets usexlude product
        /// </summary>
        public Boolean IsExcludeProduct { get; set; }
        /// <summary>
        /// Gets or sets relealse time hour
        /// </summary>
        public string ReleaseTimeHr { get; set; }
        /// <summary>
        /// Gets or sets release time in minute
        /// </summary>
        public string ReleaseTimeMin { get; set; }
        /// <summary>
        /// Gets or set allotment is active
        /// </summary>
        public Boolean Active { get; set; }

    }
}
