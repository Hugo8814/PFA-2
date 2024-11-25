import SubTitle from "../../ui/SubTitle";
import BudgetChart from "../budgets/BudgetChart";

import BugetPots from "./BugetPots";
import { formatCurrency } from "../../utils/helpers";
import { useSelector } from "react-redux";
import { getBudgetData, getBudgetTotal } from "../budgets/budgetSlice";
import { useMemo } from "react";

function BugetsWiget() {
  const budgetData = useSelector(getBudgetData);
  const budgetTotal = useSelector(getBudgetTotal);
  const spentTotal = budgetData.reduce((total, item) => total + item.spent, 0);

  const chartData = useMemo(() => {
    return budgetData.map((item) => ({
      name: item.category, // Label for the pie slice
      value: Number(item.maximum), // Value for the pie slice
      theme: item.theme, // Color for the pie slice
    }));
  }, [budgetData]);

  return (
    <div className="flex bg-white rounded-md h-content w-full flex-col p-10">
      <SubTitle to="/budgets">Budgets</SubTitle>

      <div className="flex gap-6 justify-between ">
        <div className="ml-[20%] relative text-center">
          <div className="text-5xl font-bold absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
            ${spentTotal}
            <p className="text-gray-500 text-lg">
              of {formatCurrency(budgetTotal)} limit
            </p>
          </div>
          <BudgetChart data={chartData} />
        </div>

        <div className=" grid grid-cols-1 gird-rows-4 gap-4">
          <BugetPots data={budgetData} budget={true} />
        </div>
      </div>
    </div>
  );
}

export default BugetsWiget;
