namespace TetroONE.Models
{
    public class GetDashboard
    {
        public int LoginUserId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int? BuyerId { get; set; }   

    }

    public class GetPOById
    {
        public int LoginUserId { get; set; }
        public string? ModuleName { get; set; }
        public int ModuleId { get; set; }
    }

    public class GetDashBoardDetails
    {
        public int LoginUserId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }

    public class GetDashBoardDetailsTetro1
    {
        public int LoginUserId { get; set; }
        public int ModuleId { get; set; }
        public int Type { get; set; }
        public int Value { get; set; }
    }

    public class GetDashBoard3
    {
        public int LoginUserId { get; set; }
        public int FranchiseId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int DistributorId { get; set; }
       

    }

    public class GetDropDown
    {
        public int LoginUserId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

    }

}
