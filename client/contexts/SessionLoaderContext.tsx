import { createContext, useContext, useState } from "react";

const SessionLoaderContext = createContext<{
	ignoreLoader: boolean;
	setIgnoreLoader: (ignore: boolean) => void;
}>({
	ignoreLoader: false,
	setIgnoreLoader: () => {},
});

export function SessionLoaderProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [ignoreLoader, setIgnoreLoader] = useState(false);
	return (
		<SessionLoaderContext.Provider value={{ ignoreLoader, setIgnoreLoader }}>
			{children}
		</SessionLoaderContext.Provider>
	);
}

export function useSessionLoader() {
	return useContext(SessionLoaderContext);
}
