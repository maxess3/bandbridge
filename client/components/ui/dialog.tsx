"use client";

import * as React from "react";
import { useRef, useEffect, useState } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			"fixed grid place-items-center overflow-auto inset-0 z-50 bg-black/30 dark:bg-black/30",
			className
		)}
		{...props}
	/>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
		showOverlay?: boolean;
	}
>(({ className, children, showOverlay = true, ...props }, ref) => {
	const dummyButtonRef = useRef<HTMLButtonElement>(null);
	const [dummyTabIndex, setDummyTabIndex] = useState(0);

	useEffect(() => {
		if (dummyButtonRef.current) {
			dummyButtonRef.current.focus();
		}
	}, []);

	const handleDummyBlur = () => {
		setDummyTabIndex(-1);
	};

	const renderContent = () => (
		<DialogPrimitive.Content
			ref={ref}
			className={cn(
				"fixed left-[50%] top-[50%] z-50 flex w-full max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col border bg-dialog p-6 shadow-lg sm:rounded-lg",
				className
			)}
			{...props}
		>
			<button
				ref={dummyButtonRef}
				tabIndex={dummyTabIndex}
				onBlur={handleDummyBlur}
			/>
			<DialogPrimitive.Close className="absolute flex justify-center items-center w-11 h-11 top-2 right-4 hover:bg-accent-foreground rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
				<X className="h-7 w-7 opacity-70" />
				<span className="sr-only">Close</span>
			</DialogPrimitive.Close>
			{children}
		</DialogPrimitive.Content>
	);

	return (
		<DialogPortal>
			{showOverlay ? (
				<DialogOverlay>{renderContent()}</DialogOverlay>
			) : (
				renderContent()
			)}
		</DialogPortal>
	);
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col space-y-1.5 text-center sm:text-left border-b px-6 py-4",
			className
		)}
		{...props}
	/>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:space-x-2 px-6 py-4 border-t",
			className
		)}
		{...props}
	/>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn(
			"text-lg font-semibold leading-none tracking-tight flex items-center",
			className
		)}
		{...props}
	/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("text-sm text-muted-foreground", className)}
		{...props}
	/>
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogPortal,
	DialogOverlay,
	DialogClose,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
};
