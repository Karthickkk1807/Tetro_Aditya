SELECT * FROM ProductionPlanStatusDetails

SELECT * FROM MachineDetails

SELECT * FROM OutwardFabricDetails




SELECT	FTD.FabricTypeName AS Fabric
		,OFD.Dia
		,OFD.NoOfRolls AS Roll
		,IFD.Qty AS 'Inward Wt'
		,OFD.OutWardQty AS 'Delivery Wt'
		,ID.ClientDCNumber AS 'DC No'
		,CD.ColorName AS Color              
		,ISNULL(P.Process, '') AS Process
		,CASE WHEN IFD.Qty = 0 THEN '0.00%' ELSE
			FORMAT( ((OFD.ProductionPlanQty - OFD.OutWardQty) * 100.0) / IFD.Qty, 'N2') + '%'
		END AS Loss
FROM	[dbo].[OutWardFabricDetails] AS OFD
JOIN	[dbo].[OutwardDetails] AS OWD
	ON	OWD.OutWardId = OFD.OutwardId
LEFT JOIN	[dbo].[InwardDetails] AS ID
	ON	ID.InWardId = OWD.InwardId
LEFT JOIN	[dbo].[ColorDetails] AS CD
	ON	CD.ColorId = ID.ColorId
JOIN	[dbo].[FabricTypeDetails] AS FTD
	ON	FTD.FabricTypeId = OFD.FabricTypeId
LEFT JOIN	[dbo].[InwardFabricDetails] AS IFD
	ON	IFD.InWardId = OWD.InwardId
	AND IFD.FabricId = OFD.FabricTypeId
	AND IFD.Dia = OFD.Dia
LEFT JOIN ( SELECT OFPMD.OutwardFabricId
					,STRING_AGG(PTD.ProcessTypeName, ', ') AS Process
			FROM	[dbo].[OutwardFabricProcessMappingDetails] AS OFPMD
			JOIN	[dbo].[ProcessTypeDetails] AS PTD
				ON	PTD.ProcessTypeId = OFPMD.ProcessId
			GROUP BY OFPMD.OutwardFabricId) AS P
	ON	P.OutwardFabricId = OFD.OutwardFabricId
WHERE OWD.OutWardId = 12;

SELECT * FROM [OutWardFabricDetails]
SELECT * FROM [OutwardDetails]
SELECT * FROM [InwardDetails]
SELECT * FROM [ColorDetails]
SELECT * FROM [FabricTypeDetails]
SELECT * FROM [InwardFabricDetails]
SELECT * FROM [OutwardFabricProcessMappingDetails]
SELECT * FROM [ProcessTypeDetails]


SELECT	FabricTypeName
		,Dia
		,GSM
		,NoOfRolls
		,ProductionPlanQty AS InwardWt
		,OutWardQty AS DeliveryWt
		,ClientDcNumber AS 'DC No'
		,ColorName AS Colour
		,PMD.Process
		,CONCAT(CAST(((ProductionPlanQty - OutWardQty) / ProductionPlanQty) * 100  AS DECIMAL(5,2)), ' %') AS Loss
FROM	[dbo].[OutWardFabricDetails] OFD
JOIN	[dbo].[OutWardDetails] OD
	ON	OD.OutwardId = OFD.OutwardId
JOIN	[dbo].[InwardDetails] ID
	ON	ID.InwardId = OD.InwardId
JOIN	[dbo].[FabricTypeDetails] FTD
	ON	FTD.FabricTypeId = OFD.FabricTypeId  
JOIN	[dbo].[ColorDetails] CD
	ON	CD.ColorId = ID.ColorId 
JOIN	(
			SELECT	OFPMD.OutwardFabricId, STRING_AGG(PTD.ProcessTypeName, ', ') AS Process
			FROM	[dbo].[OutwardFabricProcessMappingDetails] OFPMD
			JOIN	[dbo].[OutWardFabricDetails] OFD
				ON	OFD.OutwardFabricId = OFPMD.OutwardFabricId
			JOIN	[dbo].[ProcessTypeDetails] PTD
				ON	PTD.ProcessTypeId = OFPMD.ProcessId 
			GROUP BY OFPMD.OutwardFabricId, OutwardId 
		) PMD
	ON	PMD.OutwardFabricId = OFD.OutwardFabricId
WHERE   OD.OutwardId = 14;

SELECT (400.000 - 250.500) / 400.000

SELECT 0.3737500000 / 100

SELECT	CAST(OWD.TotalQty AS DECIMAL(12,3)) AS TotalInwardWt
		,CAST(OWD.TotalRolls AS DECIMAL(12,3)) AS TotalOutwardWt
		,CASE WHEN IWD.TotalQty = 0 THEN '0.00%' ELSE 
				FORMAT( ((OWD.TotalQty - OWD.TotalRolls) * 100.0) / OWD.TotalQty, 'N2') + '%'
			END AS AvgLoss
		,CONCAT(Salutation,' . ',UserName) AS DeliveredBy
		,OWD.VehicleNo
		,DriverName
FROM	[dbo].[OutWardDetails] AS OWD
LEFT JOIN	[dbo].[InWardDetails] AS IWD
	ON	IWD.InwardId = OWD.InwardId
JOIN	[dbo].[UserDetails] AS UD
	ON	UD.UserId = OWD.OutWardedBy
WHERE	OutWardId = 14;


SELECT	OutwardNo AS DCNo
		,CONVERT(NVARCHAR(50), OutwardDate, 113) AS DCDate
		,CASE WHEN OutWardStatusId = 9 THEN FORMAT(UpdatedDate, 'hh:mm tt')
			  ELSE '' 
		 END Time
		,CASE WHEN OutWardTo = 1 THEN 'Client'
		      ELSE 'JobWorker'
		 END DeliveryTo
FROM	[dbo].[OutwardDetails]
WHERE	OutWardId = 14;

SELECT UpdatedDate FROM [OutwardDetails]