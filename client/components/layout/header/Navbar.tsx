import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo/chordeus_logo.png";
import { NavbarAuthBtn } from "@/components/layout/header/NavbarAuthBtn";
import { MenuLinks } from "@/components/layout/header/MenuLinks";

async function Navbar() {
	return (
		<nav className="h-14 flex items-center justify-center w-full border-b border-border">
			<div className="max-w-[1128px] mx-auto px-4 flex justify-between items-center w-full">
				<div className="flex items-center gap-x-8">
					<div className="flex items-center gap-x-2.5">
						<Link href={"/home"} className="text-2xl font-medium">
							<Image src={Logo} alt="Logo" width={36} height={36} />
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
