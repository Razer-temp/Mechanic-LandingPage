"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
    className?: string;
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    date?: string;
    iconClassName?: string;
    titleClassName?: string;
}

function DisplayCard({
    className,
    icon = <Sparkles className="size-4 text-cyan-300" />,
    title = "Featured",
    description = "Discover amazing content",
    date = "Just now",
    iconClassName = "text-cyan-500",
    titleClassName = "text-cyan-500",
}: DisplayCardProps) {
    return (
        <div
            className={cn(
                "relative flex h-48 w-[24rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border border-white/10 bg-black/40 backdrop-blur-md px-6 py-5 transition-all duration-700",
                "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-black/60 after:to-transparent after:content-['']",
                "hover:border-cyan-500/30 hover:bg-black/60 hover:shadow-[0_0_30px_rgba(0,200,255,0.1)]",
                "[&>*]:flex [&>*]:items-center [&>*]:gap-3",
                className
            )}
        >
            <div>
                <span className="relative inline-block rounded-full bg-cyan-500/10 p-2 border border-cyan-500/20">
                    {icon}
                </span>
                <p className={cn("text-xl font-bold tracking-tight text-white", titleClassName)}>{title}</p>
            </div>
            <p className="whitespace-normal text-sm leading-relaxed text-gray-400">{description}</p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{date}</p>
        </div>
    );
}

interface DisplayCardsProps {
    cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
    const defaultCards = [
        {
            className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
            className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
            className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
        },
    ];

    const displayCards = cards || defaultCards;

    return (
        <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700 py-10">
            {displayCards.map((cardProps, index) => (
                <DisplayCard key={index} {...cardProps} />
            ))}
        </div>
    );
}
