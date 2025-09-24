import { useEffect, RefObject } from "react";

interface UseClickOutsideProps {
	ref: RefObject<HTMLElement>;
	onOutsideClick: () => void;
	enabled?: boolean;
}

export const useClickOutside = ({
	ref,
	onOutsideClick,
	enabled = true,
}: UseClickOutsideProps) => {
	useEffect(() => {
		if (!enabled) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onOutsideClick();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [ref, onOutsideClick, enabled]);
};
