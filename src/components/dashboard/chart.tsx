/** @format */

"use client";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	AreaChart,
	Area,
} from "recharts";

const data = [
	{ name: "Mon", views: 400 },
	{ name: "Tue", views: 700 },
	{ name: "Wed", views: 500 },
	{ name: "Thu", views: 900 },
	{ name: "Fri", views: 1100 },
	{ name: "Sat", views: 800 },
	{ name: "Sun", views: 1300 },
];

export default function DashboardCharts() {
	return (
		<ResponsiveContainer width='100%' height='100%'>
			<AreaChart data={data}>
				<defs>
					<linearGradient id='colorViews' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
						<stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid
					strokeDasharray='3 3'
					stroke='#27272a'
					vertical={false}
				/>
				<XAxis
					dataKey='name'
					stroke='#71717a'
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke='#71717a'
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `${value}`}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "#18181b",
						border: "#27272a",
						borderRadius: "8px",
					}}
					itemStyle={{ color: "#fff" }}
				/>
				<Area
					type='monotone'
					dataKey='views'
					stroke='#3b82f6'
					strokeWidth={3}
					fillOpacity={1}
					fill='url(#colorViews)'
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
