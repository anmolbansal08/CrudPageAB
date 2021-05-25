using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;

namespace CargoFlash.SoftwareFactory.Data
{
   public class DataSourceResult
    {
        /// <summary>
        /// Represents a single page of processed data.
        /// </summary>
        public IEnumerable Data { get; set; }

        /// <summary>
        /// The total number of records available.
        /// </summary>
        public int Total { get; set; }

        /// <summary>
        /// Represents a single page of processed data.
        /// </summary>
        public IEnumerable ExtraData { get; set; }

        /// <summary>
        /// Filter condition for processed data.
        /// </summary>
        public string FilterCondition { get; set; }

        /// <summary>
        /// OrderBy condition for processed data.
        /// </summary>
        public string SortCondition { get; set; }

        /// <summary>
        /// Called procedure for processed data.
        /// </summary>
        public string StoredProcedure { get; set; }
    }
}
