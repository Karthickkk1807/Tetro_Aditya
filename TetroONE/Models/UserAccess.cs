using System.Data;

namespace TetroONE.Models
{
    public class GetUserAcces
    {
        public int LoginUserId { get; set; }
        public int PlantId { get; set; }
        public string Category { get; set; }
        public int Value { get; set; }
        public string? Search { get; set; }

    }

    public class GetReportValueUserAcces
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; }

    }

    public class UseraccessRequest
    {
        public int ModuleActionId { get; set; }
        public int UserGroupId { get; set; }
        public bool IsActive { get; set; }

    }
    public class UpdateUseraccess
    {
        public int LoginUserId { get; set; }
        public List<UserActionMappingDetails> userActionMappingDetails { get; set; }
        public DataTable TVP_UserActionMappingDetails { get; set; }
    }

    public class UserActionMappingDetails
    {
        public int? UserActionMappingId { get; set; }
        public int? UserId { get; set; }
        public int? ModuleActionId { get; set; }
        public bool IsActive { get; set; }
    }

    public class UserAccess
    {
        public byte UserGroupId { get; set; }
        public byte ActionId { get; set; }
        public string Module { get; set; }
        public string ModuleAction { get; set; }
        public Int32 IsHasAccess { get; set; }
    }
    public class UserAccessOption
    {
        public bool Create { get; set; }
        public bool View { get; set; }
        public bool Update { get; set; }
        public bool Delete { get; set; }
    }

    public class UserScreen
    {
        public const string MyProfile = "MyProfile";
        public const string ManageUser = "ManageUser";
        public const string UserAccess = "UserAccess";
        public const string Settings = "Settings";
        public const string HumanResource = "HumanResource";
        public const string Employee = "Employee";
        public const string Attendance = "Attendance";
        public const string Leave = "Leave";
        public const string Permission = "Permission";
        public const string Deductions = "Deductions";
        public const string Payslip = "Payslip";
        public const string CompanyDocs = "Company Docs";

        public const string Contact = "Contact";
        public const string Vendor = "Vendor";
        public const string Distributor = "Distributor";
        public const string Franchise = "Franchise";
        public const string Inventory = "Inventory";
        public const string Product = "Product";
        public const string ManageStock = "ManageStock";
        public const string AssetManagement = "AssetManagement";
        public const string Transfer = "Transfer";
        public const string Purchase = "Purchase";
        public const string PurchaseOrder = "PurchaseOrder";
        public const string Distributor_PO = "Distributor_PO";
        public const string PurchaseBill = "PurchaseBill";
        public const string PurchaseReturn = "PurchaseReturn";
        public const string Sales = "Sales";
        public const string Estimate = "Estimate";
        public const string DeliveryChallan = "DeliveryChallan";
        public const string Sale = "Sale";
        public const string EInvoice = "EInvoice";
        public const string SaleReturn = "SaleReturn";
        public const string Finance = "Finance";
        public const string Payment = "Payment";
        public const string Expense = "Expense";
        public const string Productions = "Productions";
        public const string InwardOutWard = "InwardOutWard";
        public const string Production = "Production";
        public const string Logistics = "Logistics";
        public const string Sample = "Sample";
        public const string TargetVSActual = "Target vs Actual";
        public const string QualityCheck = "QualityCheck";
        public const string CRM = "CRM";
        public const string Reports = "Reports";
        public const string Dashboard = "Dashboard";
        public const string Enquiry = "Enquiry";
		public const string DeliveryPlan = "Delivery Plan";
        public const string ProductionPlan = "Production Plan";
        public const string TeamInfo = "Team Info";
        public const string Ticketing = "Ticketing";

        public const string View = "View";


    }
}
