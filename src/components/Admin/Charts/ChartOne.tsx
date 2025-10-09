"use client";
import { ApexOptions } from "apexcharts";
import React, { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/Admin/SelectOption/DefaultSelectOption";
import { useCarpenters, useCustomers, useDealers } from "@/hooks/useUsers";

const ChartOne: React.FC = () => {
  const { data: customers = [] } = useCustomers();
  const { data: dealers = [] } = useDealers();
  const { data: carpenters = [] } = useCarpenters();

const [view, setView] = useState<"Daily" | "Monthly" | "Yearly">("Daily");

const days = useMemo(() => {
  const today = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    last7Days.push(d.getDate().toString()); // e.g., ["1","2","3",...]
  }
  return last7Days;
}, []);

  // Generate last 12 months
  const months = useMemo(() => {
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonthIndex = new Date().getMonth();
    const last12 = [];
   for (let i = 1; i <= 12; i++) {
     const monthIndex = (currentMonthIndex - i + 12) % 12;
     last12.unshift(allMonths[monthIndex]);
   }
    return last12;
  }, []);

  // Generate last 5 years
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
  }, []);

  const getCounts = (users: any[]) => {
    if (view === "Daily") {
      const counts = Array(7).fill(0);
      const today = new Date();
      users.forEach((u) => {
        const userDate = new Date(u.createdAt);
        const diff = Math.floor(
          (today.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diff >= 0 && diff < 7) counts[6 - diff]++; // 6 - diff to match days order
      });
      return counts;
    } else if (view === "Monthly") {
      const counts = Array(12).fill(0);
      const currentMonth = new Date().getMonth();
      users.forEach((u) => {
        const monthIndex = new Date(u.createdAt).getMonth();
        const index = (monthIndex - currentMonth + 12) % 12;
        counts[index]++;
      });
      return counts;
    } else {
      const currentYear = new Date().getFullYear();
      const counts = Array(5).fill(0);
      users.forEach((u) => {
        const year = new Date(u.createdAt).getFullYear();
        const index = year - (currentYear - 4);
        if (index >= 0 && index < 5) counts[index]++;
      });
      return counts;
    }
  };


  const series = useMemo(
    () => [
      { name: "Customers", data: getCounts(customers) },
      { name: "Dealers", data: getCounts(dealers) },
      { name: "Carpenters", data: getCounts(carpenters) },
    ],
    [customers, dealers, carpenters, view]
  );

  const options: ApexOptions = {
    legend: { show: true, position: "top", horizontalAlign: "left" },
    colors: ["#ab185a", "#0ABEF9", "#FACC15"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
    },
    fill: { gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    stroke: { curve: "smooth" },
    markers: { size: 0 },
    grid: {
      strokeDashArray: 5,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      x: { show: false },
      y: { title: { formatter: () => "" } },
      marker: { show: false },
    },
    xaxis: {
      type: "category",
      categories: view === "Daily" ? days : view === "Monthly" ? months : years,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { title: { style: { fontSize: "0px" } } },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Total Users
        </h4>
        <div className="flex items-center gap-2.5">
          <p className="font-medium uppercase text-dark dark:text-dark-6">
            Sort by:
          </p>
          <DefaultSelectOption
            options={["Daily", "Monthly", "Yearly"]}
            onChange={setView}
          />
        </div>
      </div>
      <div className="-ml-4 -mr-5">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={310}
        />
      </div>
    </div>
  );
};

export default ChartOne;
