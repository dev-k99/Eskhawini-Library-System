using LibraryManagement.Core.DTOs;
using LibraryManagement.Core.Entities;
using LibraryManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SustainabilityController : ControllerBase
{
    private readonly ISustainabilityRepository _sustainabilityRepository;

    public SustainabilityController(ISustainabilityRepository sustainabilityRepository)
    {
        _sustainabilityRepository = sustainabilityRepository;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<SustainabilityStatsDto>> GetStats()
    {
        var stats = await _sustainabilityRepository.GetStatsAsync();
        return Ok(stats);
    }

    [HttpPost("calculate")]
    public ActionResult<object> CalculateCarbonFootprint([FromBody] CalculateCarbonRequest request)
    {
        var carbonFootprint = SustainabilityMetric.CalculateCarbonFootprint(
            request.DistanceKm, request.WeightKg);

        return Ok(new
        {
            distanceKm = request.DistanceKm,
            weightKg = request.WeightKg,
            carbonFootprintKg = carbonFootprint,
            message = $"Estimated carbon footprint: {carbonFootprint:F4} kg CO2"
        });
    }

    [HttpGet("eco-impact")]
    public async Task<ActionResult<object>> GetEcoImpact()
    {
        var stats = await _sustainabilityRepository.GetStatsAsync();
        
        // Additional eco-friendly stats
        var paperSaved = stats.DigitalReadsSavedTrees * 8333; // ~8333 sheets per tree
        var waterSaved = stats.DigitalReadsSavedTrees * 75700; // ~75700 liters per tree

        return Ok(new
        {
            treesSaved = Math.Round(stats.DigitalReadsSavedTrees, 2),
            paperSheetsSaved = Math.Round(paperSaved, 0),
            waterLitersSaved = Math.Round(waterSaved, 0),
            carbonFootprintReduced = stats.TotalCarbonFootprintKg,
            message = $"By choosing digital, we've saved approximately {stats.DigitalReadsSavedTrees:F2} trees!"
        });
    }
}
