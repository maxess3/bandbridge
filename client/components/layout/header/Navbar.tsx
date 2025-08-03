import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo/chordeus_logo.png";
import { NavbarAuthBtn } from "@/components/layout/header/NavbarAuthBtn";
import { MenuLinks } from "@/components/layout/header/MenuLinks";

async function Navbar() {
	return (
		<nav className="py-3 flex items-center justify-center w-full border-b">
			<div className="max-w-7xl lg:px-6 md:px-4 px-2 mx-auto flex justify-between items-center w-full">
				<div className="flex items-center gap-x-6">
					<div className="flex items-center gap-x-2.5">
						<Link
							href={"/home"}
							className="font-medium flex items-center gap-x-2.5"
						>
							<Image src={Logo} alt="Logo" width={36} height={36} />
							<span className="text-2xl font-semibold">chordeus</span>
						</Link>
					</div>
					<MenuLinks />
				</div>
				<NavbarAuthBtn />
			</div>
		</nav>
	);
}

export default Navbar;
