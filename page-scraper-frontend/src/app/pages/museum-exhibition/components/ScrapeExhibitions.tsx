"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../../app.css";

export default function ScrapeExhibitions() {
	const exhibitionUrls = new Map<string, string>([
		["mnm", "https://mnm.hu/hu/kiallitasok/idoszaki"],
		["szep", "https://www.szepmuveszeti.hu/kiallitasok/"],
		["nhmus", "https://www.nhmus.hu/idoszakos-kiallitasok/"],
	]);
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	function initAndExecuteScrape(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const formJson = Object.fromEntries(formData.entries());
		const selectedExhibition = formJson.selectedExhibition.toString();

		const handleScrapeComplete = () => {
			setLoading(false);
			router.push("/pages/museum-exhibition");
		};

		if (selectedExhibition === "all") {
			const scrapePromises = Array.from(exhibitionUrls.values()).map((url) => new Promise<void>((resolve) => scrapeExhibition(url, resolve)));
			Promise.all(scrapePromises).then(handleScrapeComplete);
		} else {
			const url = exhibitionUrls.get(selectedExhibition);
			if (url) {
				scrapeExhibition(url, handleScrapeComplete);
			} else {
				console.error("Invalid exhibition selected");
				setLoading(false);
			}
		}
	}

	return (
		<div>
			<form method="post" onSubmit={initAndExecuteScrape} className="p-4 bg-primary-500 rounded-md mt-1 shadow-md">
				<div className="flex flex-row">
					<div>
						<label className="text-secondary-100">
							Scrape Exhibition:
						</label>
							<select
								name="selectedExhibition"
								defaultValue="all"
								className="text-primary-900 ml-2 bg-secondary-100 rounded-md p-1 hover:bg-secondary-100/85"
							>
								<option className="font-sans" value="all">Scrape All</option>
								<option className="font-sans" value="mnm">Magyar Nemzeti Múzeum</option>
								<option className="font-sans" value="szep">Szépművészeti Múzeum</option>
								<option className="font-sans" value="nhmus">Magyar Természettudományi Múzeum</option>
							</select>
                        <button
                            className="bg-primary-800 rounded-md m-1 ml-2 pl-1 pr-1 border-2 border-secondary-100/60 text-secondary-100 shadow-md enabled:hover:bg-secondary-100 enabled:hover:border-primary-800 enabled:hover:text-primary-800 disabled:opacity-50"
                            type="submit"
                            disabled={loading}
                        >
                            Scrape
                        </button>
					</div>
					{loading && (
						<div className="flex items-center pl-4">
							<div className="loader"></div>
							<p className="ml-2 text-secondary-100">Scraping in progress...</p>
						</div>
					)}
				</div>
			</form>
		</div>
	);
}

function scrapeExhibition(url: string, callback: () => void) {
	fetch(`http://localhost:3001/api/exhibitions/scrape?url=${url}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to scrape exhibitions");
			}
			return response.json();
		})
		.then((data) => {
			console.log(data);
			callback();
		})
		.catch((err) => {
			console.error(err.message);
			callback();
		});
}
