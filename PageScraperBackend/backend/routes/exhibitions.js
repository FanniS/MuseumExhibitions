const express = require("express");
const router = express.Router();
const db = require("../db");
const scrapeMuseumExhibitions = require("../scrapers/museum-scraper");
const schedule = require("node-schedule");

// Define the API route
router.get("/", async (req, res) => {
	const query = "SELECT * FROM exhibitions";
	db.query(query, (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Database query failed" });
		}
		res.json({ exhibitions: results });
	});
});

router.get("/scrape", async (req, res) => {
	moveExhibitionsToHistory();
	const url = req.query.url;
	if (!url) return res.status(400).json({ error: "URL is required" });
	try {
		const exhibitions = await scrapeMuseumExhibitions(url);
		if (exhibitions.length > 0) {
			saveExhibitionsToDB(exhibitions);
			res.json({ message: "Scraping completed and exhibitions saved!", exhibitions });
		} else {
			res.json({ message: "No exhibitions found on the provided URL." });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to scrape exhibitions" });
	}
});

router.get("/history", async (req, res) => {
	const query = "SELECT * FROM exhibitionsHistory";
	db.query(query, (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Database query failed" });
		}
		res.json({ exhibitionsHistory: results });
	});
});

async function saveExhibitionsToDB(exhibitions) {
	for (const ex of exhibitions) {
		const checkQuery = "SELECT * FROM exhibitions WHERE name = ? AND end_date = ?";
		const checkValues = [ex.name, ex.to];

		db.query(checkQuery, checkValues, (err, results) => {
			if (err) {
				console.error("Error checking existing exhibitions:", err);
				return;
			}

			if (results.length === 0) {
				const insertQuery = "INSERT INTO exhibitions (name, start_date, end_date, link, museum, created_at) VALUES (?, ?, ?, ?, ?, ?)";
				const insertValues = [ex.name, ex.from, ex.to, ex.link, ex.museum, new Date()];

				db.query(insertQuery, insertValues, (err, result) => {
					if (err) {
						console.error("Error inserting exhibition:", err);
					} else {
						console.log("Exhibition saved:", ex.name);
					}
				});
			} else {
				console.log("Exhibition already exists:", ex.name);
			}
		});
	}
}

//Schedule the movement of data from the exhibitions table to the exhibitionsHistory table
const rule = new schedule.RecurrenceRule();
rule.hour = 24;

schedule.scheduleJob(rule, () => {
	moveExhibitionsToHistory();
});

async function moveExhibitionsToHistory() {
	const expiredExhibitions = await getExpiredExhibitions();
	if (expiredExhibitions != undefined && expiredExhibitions.length > 0) {
		await saveExhibitionsToHistory(expiredExhibitions);
		await deleteExpiredExhibitions(expiredExhibitions);
	}
}

async function getExpiredExhibitions() {
	return new Promise((resolve, reject) => {
		const query = "SELECT * FROM exhibitions WHERE end_date < CURRENT_DATE";
		db.query(query, (err, results) => {
			if (err) {
				console.error("Error getting expired exhibitions:", err);
				reject(err);
			} else {
				console.log("Expired exhibitions:", results);
				resolve(results);
			}
		});
	});
}

async function saveExhibitionsToHistory(exhibitions) {
	for (const ex of exhibitions) {
		const insertQuery = "INSERT INTO exhibitionsHistory (name, museum, created_at) VALUES (?, ?, ?)";
		const insertValues = [ex.name, ex.museum, new Date()];

		db.query(insertQuery, insertValues, (err, result) => {
			if (err) {
				console.error("Error inserting exhibition to history:", err);
			} else {
				console.log("Exhibition saved to history:", ex.name);
			}
		});
	}
}

async function deleteExpiredExhibitions(exhibitions) {
	for (const ex of exhibitions) {
		const deleteQuery = "DELETE FROM exhibitions WHERE id = ?";
		const deleteValues = [ex.id];

		db.query(deleteQuery, deleteValues, (err, result) => {
			if (err) {
				console.error("Error deleting exhibition:", err);
			} else {
				console.log("Exhibition deleted:", ex.name);
			}
		});
	}
}

module.exports = router;
