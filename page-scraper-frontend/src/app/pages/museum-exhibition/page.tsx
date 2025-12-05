import { Navbar, NavbarContent, NavbarItem } from "@heroui/navbar";
import Link from "next/link";
import ExhibitionList from "./components/ExhibitionList";
import ScrapeExhibitions from "./components/ScrapeExhibitions";
import ExhibitonHistory from "./components/ExhibitionHistory";

export default function MuseumExhibition() {
	return (
		<div className="mx-auto p-4 h-auto ">
			<Navbar className="bg-background shadow-md rounded-md text-secondary-100">
				<NavbarContent className="hidden sm:flex gap-4" justify="center">
					<NavbarItem className="shadow-md rounded-md p-2 bg-primary-500 hover:bg-primary-500/85">
						<Link color="foreground" href="/pages/">
							Home
						</Link>
					</NavbarItem>
					<NavbarItem isActive className="shadow-md rounded-md p-2 bg-primary-500 hover:bg-primary-500/85">
						<Link aria-current="page" href="/pages/museum-exhibition">
							Museums
						</Link>
					</NavbarItem>
					{/* <NavbarItem>
                        <Link aria-current="page" href="/pages/maldives-hotel">
                            Maldives
                        </Link>
                    </NavbarItem> */}
				</NavbarContent>
			</Navbar>
			<ExhibitionList />
			<ScrapeExhibitions />
			<ExhibitonHistory />
		</div>
	);
}
