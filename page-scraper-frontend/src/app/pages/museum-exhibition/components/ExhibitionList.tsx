"use client";
import { useEffect, useState } from "react";

type Exhibition = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    link: string;
    museum: string;
};

export default function ExhibitionList() {
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMuseum, setSelectedMuseum] = useState<string>("all");

    useEffect(() => {
        fetch("http://localhost:3001/api/exhibitions")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch exhibitions");
                }
                return response.json();
            })
            .then((data) => {
                setExhibitions(
                    data.exhibitions.sort(function (a: Exhibition, b: Exhibition) {
                        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
                    })
                );
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleMuseumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMuseum(e.target.value);
    };

    const filteredExhibitions = selectedMuseum === "all"
        ? exhibitions
        : exhibitions.filter((exhibition) => exhibition.museum === selectedMuseum);

    if (loading) return <p>Loading exhibitions...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main className="p-4 bg-primary-500 rounded-md shadow-md">
            <h1 className="text-2xl font-bold text-secondary-100">Museum Exhibitions</h1>
            <div className="mt-4">
                <label className="text-secondary-100 mr-2">Filter by Museum:</label>
                <select
                    value={selectedMuseum}
                    onChange={handleMuseumChange}
                    className="text-primary-900 bg-secondary-100 rounded-md p-1 hover:bg-secondary-100/85"
                >
                    <option className="font-sans" value="all">All Museums</option>
                    <option className="font-sans" value="Magyar Nemzeti Múzeum">Magyar Nemzeti Múzeum</option>
                    <option className="font-sans" value="Szépművészeti Múzeum">Szépművészeti Múzeum</option>
                    <option className="font-sans"  value="Magyar Természettudományi Múzeum">Magyar Természettudományi Múzeum</option>
                </select>
            </div>
            <table className="table-auto mt-4 bg-secondary-100 rounded-md p-4 shadow-md w-full border-separate border border-primary-500">
                <thead>
                    <tr>
                        <th className="text-xl font-bold text-primary-800 border rounded-md border-primary-500/50 shadow-md p-2">Museum</th>
                        <th className="text-xl font-bold text-primary-800 border rounded-md border-primary-500/50 shadow-md p-2">Exhibition</th>
                        <th className="text-xl font-bold text-primary-800 border rounded-md border-primary-500/50 shadow-md p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExhibitions.map((exhibition) => (
                        <tr key={exhibition.id} className="hover:bg-primary-500/30 cursor-pointer shadow-md" onClick={() => window.open(exhibition.link, "_blank")}>
                            <td className="border border-primary-500/50 rounded-l-md p-2">{exhibition.museum}</td>
                            <td className="text-lg font-bold text-primary-800 border border-primary-500/50 p-2">{exhibition.name}</td>
                            <td className="text-gray-600 ml-2 border rounded-r-md border-primary-500/50 p-2">
                                <strong>From:</strong> {exhibition.start_date.slice(0, 10) || "N/A"} - <strong>To:</strong> {exhibition.end_date.slice(0, 10) || "N/A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}