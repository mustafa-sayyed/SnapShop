import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { cn } from "../lib/utils";

const defaultMessages = [
	"Waking up the store...",
	"Fetching the latest products...",
	"Syncing your cart...",
	"Almost there...",
];

function StartupLoader({
	title = "SnapShop is loading",
	subtitle = "Please wait while we establish the connection.",
	messages = defaultMessages,
	className,
}) {
	const [messageIndex, setMessageIndex] = useState(0);

	useEffect(() => {
		if (!messages.length) return undefined;

		const timer = window.setInterval(() => {
			setMessageIndex((currentIndex) => (currentIndex + 1) % messages.length);
		}, 2500);

		return () => window.clearInterval(timer);
	}, [messages]);

	const currentMessage = messages[messageIndex] ?? title;

	return (
		<div
			className={cn(
				"min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_34%),linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_100%)] px-6 py-10",
				className,
			)}
		>
			<div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center">
				<div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-10">
					<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.5))]" />
					<div className="absolute -left-20 top-4 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl" />
					<div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />

					<div className="relative flex flex-col items-center text-center">
						<div className="relative mb-6 flex h-24 w-24 items-center justify-center">
							<div className="absolute inset-0 animate-pulse rounded-full bg-amber-300/25 blur-2xl" />
							<div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200/80 bg-white shadow-inner shadow-slate-200/60">
								<Loader2Icon
									className="h-10 w-10 animate-spin text-slate-900"
									aria-hidden="true"
								/>
							</div>
						</div>

						<p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
							Connecting
						</p>
						<h1 className="prata text-3xl text-slate-900 sm:text-5xl">
							{title}
						</h1>

						<div className="mt-6 min-h-12">
							<p
								key={currentMessage}
								className="animate-fade-in-up text-lg font-medium text-slate-700 transition-all duration-500"
							>
								{currentMessage}
							</p>
						</div>

						<p className="mt-2 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
							{subtitle}
						</p>

						<div className="mt-8 flex items-center gap-2">
							{messages.map((message, index) => (
								<span
									key={`${message}-${index}`}
									className={cn(
										"h-2.5 rounded-full transition-all duration-300",
										index === messageIndex ? "w-8 bg-slate-900" : (
											"w-2.5 bg-slate-300"
										),
									)}
									aria-hidden="true"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StartupLoader;
