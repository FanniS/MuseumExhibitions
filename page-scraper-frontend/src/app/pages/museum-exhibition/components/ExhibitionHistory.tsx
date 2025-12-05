"use client";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";

type Exhibition = {
	id: number;
	name: string;
	museum: string;
};

export default function ExhibitionHistoryList() {
	const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("http://localhost:3001/api/exhibitions/history")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch exhibition history");
				}
				return response.json();
			})
			.then((data) => {
				setExhibitions(data.exhibitionsHistory);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	if (loading) return <p>Loading exhibition histories...</p>;
	if (error) return <p>Error: {error}</p>;
	return (
		<Accordion className="px-0" itemClasses={{ title: "pl-2 font-bold text-2xl text-secondary-100" }}>
			<AccordionItem
				key="1"
				aria-label="ExhibitionHistory"
				title="Exhibition History"
				className="mt-1 p-1 bg-primary-500 rounded-md text-2xl font-bold text-secondary-100 shadow-md"
			>
				<main className="p-4 bg-primary-500 rounded-md shadow-md">
					{exhibitions.length === 0 && (
						<p className="text-lg text-primary-800 mt-4 bg-secondary-100 rounded-md p-4 shadow-md w-full border-separate border border-primary-500">
							No exhibitions found
						</p>
					)}
					{exhibitions.length !== 0 && (
						<table className="table-auto mt-4 bg-secondary-100 rounded-md p-4 shadow-md w-full border-separate border border-primary-500">
							<thead>
								<tr>
									<th className="text-xl font-bold text-primary-800 border rounded-md border-primary-500/50 shadow-md p-2">
										Museum
									</th>
									<th className="text-xl font-bold text-primary-800 border rounded-md border-primary-500/50 shadow-md p-2">
										Exhibition
									</th>
								</tr>
							</thead>
							<tbody>
								{exhibitions.map((exhibition) => (
									<tr key={exhibition.id} className="hover:bg-primary-500/30 cursor-pointer shadow-md">
										<td className="border text-primary-800  border-primary-500/50 rounded-l-md p-2">{exhibition.museum}</td>
										<td className="text-lg font-bold text-primary-800 border border-primary-500/50 p-2">{exhibition.name}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</main>
			</AccordionItem>
		</Accordion>
	);
}
