using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Web;


namespace CargoFlash.SoftwareFactory.Data
{
    [DataContract]
    public class GridFilter
    {
        [DataMember(Name = "operator")]
        public string Operator { get; set; }
        [DataMember(Name = "field")]
        public string Field { get; set; }
        [DataMember(Name = "value")]
        public string Value { get; set; }
        [DataMember(Name = "logic")]
        public string Logic { get; set; }
        [DataMember(Name = "filters")]
        public List<GridFilter> Filters { get; set; }
        [DataMember(Name = "parentlogic")]
        public string ParentLogic { get; set; }
        


        [OperationContract]
        public static string ProcessFilters<T>(GridFilter filter, string whereCondition="")
        {
            try
            {
                var entityType = (typeof(T));
                var whereClause =string.Empty;
                var Filters = filter.Filters;

                if (filter != null)
                {
                    Filters = filter.Filters;
                    if (Filters == null)
                        return "";
                }
                else return "";
                var parameters = new List<object>();
                for (int i = 0; i < Filters.Count; i++)
                {
                    var f = Filters[i];

                    if (f.Filters == null)
                    {
                        if (i > 0)
                            whereClause += ToLinqOperator(filter.Logic) + BuildWhereClause(f, i, parameters, entityType) + " ";

                        if (i == 0)
                            whereClause += BuildWhereClause(f, i, parameters, entityType) + " ";
                    }
                    else
                    {
                        // 3 LINE ADDED BY PURUSHOTTAM KUMAR
                        if(whereClause != "")
                            whereClause += ToLinqOperator(filter.Logic) + "(" + ProcessFilters<T>(f, whereCondition) + ")";
                        else
                            whereClause += "(" + ProcessFilters<T>(f, whereCondition) + ")";
                         // COMENTED EXISTING CODE BY PURUSHOTTAM KUMAR
                        //if (i < Filters.Count - 1 && Filters[i].Filters!=null)
                       //    whereClause += ToLinqOperator(filter.Logic);
                        whereCondition = whereClause;
                    }
                }
                return whereClause;
            }
            catch
            {
                return "";
            }
        }

        private static string BuildWhereClause(GridFilter filter, int index, List<object> parameters, System.Type entityType)
        {
            var property = entityType.GetProperty(filter.Field);
            var parameterIndex = parameters.Count;

            switch (filter.Operator.ToLower())
            {
                case "eq":
                case "neq":
                case "gte":
                case "gt":
                case "lte":
                case "lt":
                    if (typeof(DateTime).IsAssignableFrom(property.PropertyType))
                    {
                        parameters.Add(DateTime.Parse(filter.Value).Date.ToString("yyyy-MM-dd"));
                        return string.Format("[" + filter.Field + "]" + ToLinqOperator(filter.Operator) + "'" + parameters[parameterIndex] + "'");
                    }
                    if (typeof(DateTime?).IsAssignableFrom(property.PropertyType))
                    {
                        parameters.Add(DateTime.Parse(filter.Value).Date.ToString("yyyy-MM-dd"));
                        return string.Format("[" + filter.Field + "]" + ToLinqOperator(filter.Operator) + "'" + parameters[parameterIndex] + "'");
                    }
                    if (typeof(int).IsAssignableFrom(property.PropertyType))
                    {
                        parameters.Add(int.Parse(filter.Value));
                        return string.Format("[" + filter.Field + "]" + ToLinqOperator(filter.Operator) + "" + parameters[parameterIndex] + "");
                    }
                    parameters.Add(filter.Value);
                    return string.Format("[" + filter.Field + "]" + ToLinqOperator(filter.Operator) + "'" + parameters[parameterIndex] + "'");
                case "startswith":
                    parameters.Add(filter.Value);
                    return "[" + filter.Field + "]" + " like '" + parameters[parameterIndex] + "%'";
                case "endswith":
                    parameters.Add(filter.Value);
                    return "[" + filter.Field + "]" + " like '%" + parameters[parameterIndex] + "'";
                case "contains":
                    if (typeof(DateTime?).IsAssignableFrom(property.PropertyType))
                    {
                        parameters.Add(DateTime.Parse(filter.Value).Date.ToString("yyyy-MM-dd"));
                        return string.Format("[" + filter.Field + "]" + " like '%" + parameters[parameterIndex] + "%'");
                    }
                    parameters.Add(filter.Value);
                    return "[" + filter.Field + "]" + " like '%" + parameters[parameterIndex] + "%'";
                //case "in":
                //    parameters.Add(filter.Value);
                //    return "[" + filter.Field + "]" + " IN (" + parameters[parameterIndex] + ")";
                case "doesnotcontain":
                    parameters.Add(filter.Value);
                    return "[" + filter.Field + "]" + " not like '%" + parameters[parameterIndex] + "%'";
                default:
                    throw new ArgumentException("This operator is not yet supported for this Grid", filter.Operator);
            }
        }

        private static string ToLinqOperator(string Operator)
        {
            switch (Operator.ToLower())
            {
                case "eq": return " = ";
                case "neq": return " != ";
                case "gte": return " >= ";
                case "gt": return " > ";
                case "lte": return " <= ";
                case "lt": return " < ";
                case "or": return " or  ";
                case "and": return " and ";
                default: return null;
            }
        }


        #region For Auto Complete

        public static void WMSProcessFilter(GridFilter filter, ref string queryable, string filterLogic, ref int totalFilter)
        {
            var whereClause = string.Empty;
            var filters = filter.Filters;
            var parameters = new List<object>();
            for (int i = 0; i < filters.Count; i++)
            {
                GridFilter f = filters[i];

                if (f.Filters == null)
                {
                    if (i == 0)
                        whereClause += (queryable != "" ? ToLinqOperator(filterLogic) + "(" : (totalFilter > 1 ? "((" : "(")) + BuildWherePredicate(f, parameters) + " ";
                    if (i != 0)
                        whereClause += ToLinqOperator(filter.Logic) + BuildWherePredicate(f, parameters) + " ";
                    if (i == (filters.Count - 1))
                    {
                        --totalFilter;
                        TrimWherePredicate(ref whereClause);
                        queryable = queryable + whereClause + ")" + (totalFilter == 1 ? ")" : "");
                    }
                }
                else
                {
                    WMSProcessFilter(f, ref queryable, (f.ParentLogic == null || f.ParentLogic == "" ? "AND" : f.ParentLogic), ref totalFilter);
                }
            }

        }

        public static void ProcessFilter(GridFilter filter, ref string queryable)
        {
            var whereClause = string.Empty;
            var filters = filter.Filters;
            var parameters = new List<object>();
            for (int i = 0; i < filters.Count; i++)
            {
                GridFilter f = filters[i];

                if (f.Filters == null)
                {
                    if (i == 0)
                        whereClause += (queryable != "" ? ToLinqOperator(filter.Logic) + "(" : "(") + BuildWherePredicate(f, parameters) + " ";
                    if (i != 0)
                        whereClause += ToLinqOperator(filter.Logic) + BuildWherePredicate(f, parameters) + " ";
                    if (i == (filters.Count - 1))
                    {
                        TrimWherePredicate(ref whereClause);
                        queryable = queryable + whereClause + ")";
                    }
                }
                else
                    ProcessFilter(f, ref queryable);
            }
        }

        private static string TrimWherePredicate(ref string whereClause)
        {
            switch (whereClause.Trim().Substring(0, 2).ToLower())
            {
                case "&&":
                    whereClause = whereClause.Trim().Remove(0, 2);
                    break;
                case "||":
                    whereClause = whereClause.Trim().Remove(0, 2);
                    break;
            }

            return whereClause;
        }

        private static string BuildWherePredicate(GridFilter filter, List<object> parameters)
        {
            var parameterIndex = parameters.Count;
            switch (filter.Operator.ToLower())
            {
                case "eq":
                case "neq":
                case "gte":
                case "gt":
                case "lte":
                case "lt":
                    DateTime date;
                    if (DateTime.TryParse(filter.Value, out date))
                    {
                        parameters.Add(date.Date.ToString("yyyy-MM-dd"));
                        return String.Format("[" + filter.Field + "]" + ToLinqOperator(filter.Operator) + "'" + parameters[parameterIndex] + "'");
                    }
                    int number;
                    if (int.TryParse(filter.Value, out number))
                    {
                        parameters.Add(filter.Value);
                        return String.Format("[" + filter.Field + "]" + ToLinqOperator(filter.Operator) + "'" + parameters[parameterIndex] + "'");
                    }

                    if (!String.IsNullOrEmpty(filter.Value) && filter.Value.StartsWith("'") && filter.Value.EndsWith("'"))
                        parameters.Add(filter.Value.Substring(1, filter.Value.Length - 2));
                    else
                        parameters.Add(filter.Value);

                    return String.Format(filter.Field + ToLinqOperator(filter.Operator) + "'" + parameters[parameterIndex] + "'");
                case "startswith":
                    parameters.Add(filter.Value);
                    string[] startswithFilterArray = filter.Field.Split(',');
                    string startswithFilter = "";
                    foreach (string str in startswithFilterArray)
                    {
                        startswithFilter = (startswithFilter == "" ? "" : startswithFilter + "+'-'+") + "CAST(" + "[" + str + "]" + " AS VARCHAR(MAX))"; //(startswithFilter == "" ? "" : startswithFilter + "+'-'+") + "[" + str + "]";
                    }
                    return startswithFilter + " like '" + parameters[parameterIndex] + "%'";
                case "endswith":
                    parameters.Add(filter.Value);
                    string[] endswithFilterArray = filter.Field.Split(',');
                    string endswithFilter = "";
                    foreach (string str in endswithFilterArray)
                    {
                        endswithFilter = (endswithFilter == "" ? "" : endswithFilter + "+'-'+") + "CAST(" + "[" + str + "]" + " AS VARCHAR(MAX))"; //(endswithFilter == "" ? "" : endswithFilter + "+'-'+") + "[" + str + "]";
                    }
                    return endswithFilter + " like '%" + parameters[parameterIndex] + "'";
                case "contains":
                    parameters.Add(filter.Value);
                    string[] containFilterArray = filter.Field.Split(',');
                    string containFilter = "";
                    foreach (string str in containFilterArray)
                    {
                        containFilter = (containFilter == "" ? "" : containFilter + "+'-'+") + "CAST(" + "[" + str + "]" + " AS VARCHAR(MAX))";
                    }
                    return containFilter + " like '%" + parameters[parameterIndex] + "%'";
                case "in":
                    parameters.Add(filter.Value);
                    string[] innFilterArray = filter.Field.Split(',');
                    string inFilter = "";
                    foreach (string str in innFilterArray)
                    {
                        if (str.ToLower() == "sno")
                            inFilter = (inFilter == "" ? "" : inFilter + "+'-'+") + str;
                        else
                            inFilter = (inFilter == "" ? "" : inFilter + "+'-'+") + "CAST(" + "[" + str + "]" + " AS VARCHAR(MAX))";
                    }
                    return inFilter + " IN ('" + parameters[parameterIndex].ToString().Replace(",", "','") + "')";
                case "notin":
                    parameters.Add(filter.Value);
                    string[] notinnFilterArray = filter.Field.Split(',');
                    string notinFilter = "";
                    foreach (string str in notinnFilterArray)
                    {
                        if (str.ToLower() == "sno")
                            notinFilter = (notinFilter == "" ? "" : notinFilter + "+'-'+") + str;
                        else
                            notinFilter = (notinFilter == "" ? "" : notinFilter + "+'-'+") + "CAST(" + "[" + str + "]" + " AS VARCHAR(MAX))";
                    }
                    return notinFilter + " NOT IN ('" + parameters[parameterIndex].ToString().Replace(",", "','") + "')";
                default:
                    throw new ArgumentException("This operator is not yet supported for this Grid", filter.Operator);
            }
        }

        #endregion
    }

    [DataContract]
    public class GridSort
    {
        [DataMember(Name = "field")]
        public string Field { get; set; }
        [DataMember(Name = "dir")]
        public string Dir { get; set; }
        [OperationContract]
        public static string ProcessSorting(List<GridSort> sort)
        {
            string sorts = "";
            if (sort != null && sort.Count > 0)
                foreach (var s in sort)
                    sorts = "[" + s.Field + "]" + " " + s.Dir;
            return sorts;
        }
    }
}
