import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Percent, Save, Layers } from 'lucide-react';

export const CommissionSettings: React.FC = () => {
  const { categoryCommissions, updateCategoryCommission, addToast } = useStore();

  const [editingRates, setEditingRates] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    categoryCommissions.forEach(c => {
      map[c.categoryName] = c.commissionRate;
    });
    return map;
  });

  const handleRateChange = (catName: string, value: number) => {
    setEditingRates(prev => ({ ...prev, [catName]: value }));
  };

  const handleSaveRate = (catName: string) => {
    const rate = editingRates[catName];
    if (rate < 0 || rate > 50) {
      addToast('error', 'Invalid Rate', 'Commission percentage must be between 0% and 50%');
      return;
    }
    updateCategoryCommission(catName, Number(rate));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Percent className="w-5 h-5 text-amber-500" />
            <span>Platform Commission Rate Settings</span>
          </h2>
          <p className="text-xs text-slate-500">Configure global & per-category platform commission deductions calculated at checkout.</p>
        </div>
      </div>

      {/* Categories Commission Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
              <th className="p-4">Product Category</th>
              <th className="p-4 text-center">Configured Commission %</th>
              <th className="p-4 text-right">Save Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {categoryCommissions.map(item => (
              <tr key={item.categoryName} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-slate-900 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>{item.categoryName}</span>
                </td>

                <td className="p-4 text-center">
                  <div className="inline-flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="50"
                      value={editingRates[item.categoryName] ?? item.commissionRate}
                      onChange={e => handleRateChange(item.categoryName, Number(e.target.value))}
                      className="w-20 px-3 py-1.5 border border-slate-300 rounded-xl text-center font-mono font-bold text-amber-600 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="font-bold text-slate-600">%</span>
                  </div>
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => handleSaveRate(item.categoryName)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 ml-auto"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>Save Rate</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommissionSettings;
