namespace TetroONE.Models
{
    public class EwayBillJSONData
    {
        public string? supplyType { get; set; }
        public string? subSupplyType { get; set; }
        public string? subSupplyDesc { get; set; }
        public string? docType { get; set; }
        public string? docNo { get; set; }
        public string? docDate { get; set; }
        public string? fromGstin { get; set; }
        public string? fromTrdName { get; set; }
        public string? fromAddr1 { get; set; }
        public string? fromAddr2 { get; set; }
        public string? fromPlace { get; set; }
        public int? actFromStateCode { get; set; }
        public int? fromPincode { get; set; }
        public int? fromStateCode { get; set; }
        public string? toGstin { get; set; }
        public string? toTrdName { get; set; }
        public string? toAddr1 { get; set; }
        public string? toAddr2 { get; set; }
        public string? toPlace { get; set; }
        public int? toPincode { get; set; }
        public int? actToStateCode { get; set; }
        public int? toStateCode { get; set; }
        public int? transactionType { get; set; }
        public string? dispatchFromGstin { get; set; }
        public string? dispatchFromTradeName { get; set; }
        public string? shipToGstin { get; set; }
        public string? shipToTradeName { get; set; }
        public decimal? totalValue { get; set; }
        public decimal? cgstValue { get; set; }
        public decimal? sgstValue { get; set; }
        public decimal? igstValue { get; set; }
        public decimal? cessValue { get; set; }
        public decimal? cessNonAdvolValue { get; set; }
        public decimal? totInvValue { get; set; }
        public string? transMode { get; set; }
        public string? transDistance { get; set; }
        public string? transporterName { get; set; }
        public string? transporterId { get; set; }
        public string? transDocNo { get; set; }
        public string? transDocDate { get; set; }
        public string? vehicleNo { get; set; }
        public string? vehicleType { get; set; }
        public List<ItemList> itemList { get; set; }
    }

    public class ItemList
    {
        public string? productName { get; set; }
        public string? productDesc { get; set; }
        public int? hsnCode { get; set; }
        public int? quantity { get; set; }
        public string? qtyUnit { get; set; }
        public decimal? taxableAmount { get; set; }
        public decimal? sgstRate { get; set; }
        public decimal? cgstRate { get; set; }
        public decimal? igstRate { get; set; }
        public decimal? cessRate { get; set; }
    }
}
