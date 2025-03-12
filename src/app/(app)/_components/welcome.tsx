import { ConnectedChannelsAnimation } from "@/components/connected-channels-animation";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Typography } from "@/components/typography";

export function Welcome() {
	return (
		<div className="flex flex-col gap-4 h-[80dvh] justify-center items-center">
			<div className="space-y-2 text-center">
				<SparklesText text="Memory lanes" />
				<div className="max-w-xl space-y-4">
					<Typography className="text-lg lg:text-2xl">
						Say goodbye to scattered memories across apps and platforms. Share
						your journey with friends and family through a single link.
					</Typography>
					<TextAnimate
						by="word"
						duration={1.5}
						className="text-lg lg:text-2xl font-medium"
					>
						Simple. Personal. Timeless.
					</TextAnimate>
				</div>
			</div>
			<ConnectedChannelsAnimation />
		</div>
	);
}
