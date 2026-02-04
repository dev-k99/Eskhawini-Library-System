import { useState, useEffect } from 'react';
import { sustainabilityApi } from '../../services/api';
import { Leaf, TreeDeciduous, Droplets, Wind, Loader2, Calculator } from 'lucide-react';

export default function SustainabilityPage() {
  const [stats, setStats] = useState(null);
  const [ecoImpact, setEcoImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculator, setCalculator] = useState({ distance: '', weight: '' });
  const [calcResult, setCalcResult] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, impactRes] = await Promise.all([
        sustainabilityApi.getStats(),
        sustainabilityApi.getEcoImpact()
      ]);
      setStats(statsRes.data);
      setEcoImpact(impactRes.data);
    } catch (error) {
      console.error('Failed to fetch sustainability stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!calculator.distance || !calculator.weight) return;
    
    try {
      const response = await sustainabilityApi.calculate({
        distanceKm: parseFloat(calculator.distance),
        weightKg: parseFloat(calculator.weight)
      });
      setCalcResult(response.data);
    } catch (error) {
      console.error('Failed to calculate:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-8 bg-emerald-50 border border-emerald-200">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-100 rounded-2xl">
            <Leaf className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eco Impact Dashboard</h1>
            <p className="text-gray-400 mt-1">Track your library's environmental footprint</p>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <TreeDeciduous className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Trees Saved</p>
              <p className="text-2xl font-bold text-emerald-600">
                {ecoImpact?.treesSaved?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Droplets className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Water Saved (L)</p>
              <p className="text-2xl font-bold text-blue-600">
                {(ecoImpact?.waterLitersSaved || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Wind className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-400">CO2 Reduced (kg)</p>
              <p className="text-2xl font-bold text-amber-600">
                {(stats?.totalCarbonFootprintKg || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Leaf className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Paper Saved</p>
              <p className="text-2xl font-bold text-purple-600">
                {(ecoImpact?.paperSheetsSaved || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {ecoImpact?.message && (
        <div className="card p-6 text-center bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300">
          <p className="text-lg text-emerald-700">{ecoImpact.message}</p>
        </div>
      )}

      {/* Carbon Calculator */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Carbon Footprint Calculator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Distance (km)</label>
            <input
              type="number"
              value={calculator.distance}
              onChange={(e) => setCalculator({ ...calculator, distance: e.target.value })}
              placeholder="e.g., 50"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              value={calculator.weight}
              onChange={(e) => setCalculator({ ...calculator, weight: e.target.value })}
              placeholder="e.g., 0.5"
              className="input-field"
            />
          </div>
          <div className="flex items-end">
            <button onClick={handleCalculate} className="btn-primary w-full">
              Calculate
            </button>
          </div>
        </div>

        {calcResult && (
          <div className="mt-6 p-4 bg-gray-100 rounded-xl">
            <p className="text-gray-700">{calcResult.message}</p>
            <p className="text-sm text-gray-700 mt-2">
              Distance: {calcResult.distanceKm} km | Weight: {calcResult.weightKg} kg
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Eco-Friendly Library Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '📚', tip: 'Borrow instead of buying to reduce paper consumption' },
            { icon: '📱', tip: 'Consider e-books for lower environmental impact' },
            { icon: '🚶', tip: 'Walk or bike to the library when possible' },
            { icon: '♻️', tip: 'Return books on time to maximize resource sharing' },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-100 rounded-xl">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-gray-700">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
