namespace TetroONE.Models
{
    public class GetTokenRequest
    {
        public string email { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string ip_address { get; set; }
        public string client_id { get; set; }
        public string client_secret { get; set; }
        public string gstin { get; set; }
        public int SaleId { get; set; }
       
        public bool IsSale { get; set; }
        public string? IRN { get; set; }
        public string? DocumentType { get; set; }
        public string? docnum { get; set; }
        public string? docdate { get; set; }
        public string? CnlRsn { get; set; }
        public string? CnlRem { get; set; }
        public string? date { get; set; }

    }
    public class GetTokenResponse
    {
        public string TokenExpiry { get; set; }
        public string Sek { get; set; }
        public string AuthToken { get; set; }

    }
    public class GetIRNResponse
    {
        public string? AckNo { get; set; }
        public string? AckDt { get; set; }
        public string? Irn { get; set; }
        public string? SignedInvoice { get; set; }
        public string? SignedQRCode { get; set; }
        public string? Status { get; set; }
        public string? EwbNo { get; set; }
        public string? EwbDt { get; set; }
        public string? EwbValidTill { get; set; }
        public string? Remarks { get; set; }
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();

    }
    public class CancelledIRNResponse
    {
        public string Irn { get; set; }
        public string CancelDate { get; set; }
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();

    }
    public class RejectedIRNResponse
    {
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
    public class EWBDetails
    {
        public string? Irn { get; set; }
        public int? Distance { get; set; }
        public string? TransMode { get; set; }
        public string? TransId { get; set; }
        public string? TransName { get; set; }
        public string? TransDocDt { get; set; }
        public string? TransDocNo { get; set; }
        public string? VehNo { get; set; }
        public string? VehType { get; set; }
        public ExpShipDtls? ExpShipDtls { get; set; } = new ExpShipDtls();
        public DispDetails? DispDetails { get; set; } = new DispDetails();

    }
    public class ExpShipDtls
    {
        public string? Addr1 { get; set; }
        public string? Addr2 { get; set; }
        public string? Loc { get; set; }
        public int? Pin { get; set; }
        public string? Stcd { get; set; }

    }
    public class DispDetails
    {
        public string? Nm { get; set; }
        public string? Addr1 { get; set; }
        public string? Addr2 { get; set; }
        public string? Loc { get; set; }
        public int? Pin { get; set; }
        public string? Stcd { get; set; }

    }
    public class EWBResponse
    {
        public string? EwbNo { get; set; }
        public string? EwbDt { get; set; }
        public string? EwbValidTill { get; set; }
        public string? Remarks { get; set; }
        public string? Status { get; set; }
        public string? GenGstin { get; set; }
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }

    public class GetEInvoice
    {
        public int LoginUserId { get; set; }
        public int? EInvoiceResponseId { get; set; }
    }
    public class PrintEInvoiceRequest
    {
        public int SaleId { get; set; }
        
    }
    public class SaleDateRequest
    {
        public int LoginUserId { get; set; }
        public int SaleId { get; set; }
       
    }

    public class GetAPICredential
    {
        public int LoginUserId { get; set; }
        public int? APICredentialId { get; set; }
    }

    public class PrintEInvoice
    {
        public string? SaleId { get; set; }
       
        public string? EWayBillNo { get; set; }
        public string? EWayBillDate { get; set; }
        public string? GeneratedBy { get; set; }
        public string? VaildFrom { get; set; }
        public string? ValidUntil { get; set; }
        public string? GSTINofSupplier { get; set; }
        public string? PlaceofDispatch { get; set; }
        public string? GSTINofRecipient { get; set; }
        public string? PlaceofDelivery { get; set; }
        public string? DocumentNo { get; set; }
        public string? DocumentDate { get; set; }
        public string? TransactionType { get; set; }
        public string? ValueofGoods { get; set; }
        public string? HSNCode { get; set; }
        public string? ReasonforTransportation { get; set; }
        public string? Transporter { get; set; }
        public string? Mode { get; set; }
        public string? VehicleTransDocNoDt { get; set; }
        public string? From { get; set; }
        public string? EnteredDate { get; set; }
        public string? EnteredBy { get; set; }
        public string? CEWBNo { get; set; }
        public string? MultiVeh { get; set; }
    }
}
