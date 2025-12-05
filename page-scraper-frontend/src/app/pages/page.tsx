import Link from "next/link";

export default function App() {
	return (
		<div className="mx-auto p-4 h-auto">
			<button>
				<Link href="/pages/museum-exhibition/">Museum Exhibition</Link>
			</button>
			{/*<button>
				<Link href="/pages/maldives-hotel/">Kandima Hotel</Link>
			</button>*/}
		</div>
	);
}
