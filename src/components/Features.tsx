"use client";

import { motion } from "framer-motion";
import { Brain, Layers, Monitor, ScanLine, Wand2, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";

const features = [
    {
        icon: ScanLine,
        title: "Intent Ingestor",
        description: "Multi-modal input processing that understands your voice, text, and visual context instantly.",
        color: "text-blue-400",
    },
    {
        icon: Brain,
        title: "Reasoning Engine",
        description: "Advanced AI that plans and architects the perfect UI layout based on your specific needs.",
        color: "text-purple-400",
    },
    {
        icon: Monitor,
        title: "Sandboxed Renderer",
        description: "Secure, real-time component generation that builds interfaces safely in your browser.",
        color: "text-green-400",
    },
    {
        icon: Wand2,
        title: "Self-Correction",
        description: "The UI observes your interactions and refines itself automatically to match your workflow.",
        color: "text-pink-400",
    },
    {
        icon: Layers,
        title: "Adaptive Layouts",
        description: "Fluid designs that morph between dashboard, canvas, and document modes dynamically.",
        color: "text-orange-400",
    },
    {
        icon: Zap,
        title: "Instant Preview",
        description: "See your changes immediately with sub-millisecond compiled component updates.",
        color: "text-yellow-400",
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 relative bg-black/40">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
                        Winner Architecture
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Built on a three-pillar system designed for the next generation of generative interfaces.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full hover:bg-white/5 transition-all duration-300 group hover:border-white/10 hover:-translate-y-1 p-8">
                                <div className={`p-3 rounded-xl bg-white/5 w-fit mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
