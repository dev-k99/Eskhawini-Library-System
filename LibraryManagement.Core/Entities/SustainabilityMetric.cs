namespace LibraryManagement.Core.Entities;

public class SustainabilityMetric
{
    public int Id { get; set; }
    public int LoanId { get; set; }
    public decimal DistanceKm { get; set; }
    public decimal WeightKg { get; set; }
    public decimal CarbonFootprintKg { get; set; }
    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Loan Loan { get; set; } = null!;

    // Carbon calculation: ~0.21 kg CO2 per km for ground shipping
    public static decimal CalculateCarbonFootprint(decimal distanceKm, decimal weightKg)
    {
        const decimal emissionFactorPerKmPerKg = 0.00021m; // kg CO2 per km per kg
        return distanceKm * weightKg * emissionFactorPerKmPerKg;
    }

    // Trees saved calculation: ~21 kg CO2 absorbed per tree per year
    public static decimal CalculateTreesSaved(int digitalReads)
    {
        const decimal avgBookWeight = 0.5m; // kg
        const decimal avgShippingDistance = 50m; // km
        const decimal co2PerTree = 21m; // kg per year

        var co2Saved = digitalReads * CalculateCarbonFootprint(avgShippingDistance, avgBookWeight);
        return co2Saved / co2PerTree;
    }
}
