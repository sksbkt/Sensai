/* eslint-disable @typescript-eslint/no-unused-vars */
import HeroSection from "@/components/heroSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { faqs } from "@/data/faqs";
import { features } from "@/data/features";
import { howItWorks } from "@/data/howItWorks";
import { statistics } from "@/data/statistics";
import { testimonial } from "@/data/testimonial";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="grid-background" />
      <HeroSection />
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Powerful features for your career growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              return (
                <Card
                  key={index}
                  className="border-2 hover:border-primary transition-colors duration-300"
                >
                  <CardContent className="pt-6 text-center flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center">
                      {feature.icon}
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-start">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {statistics.map((statics, index) => {
              return (
                <div
                  className="flex flex-col items-center justify-center space-y-2"
                  key={index}
                >
                  <h3 className="font-bold text-4xl">{statics.value}</h3>
                  <p className="text-muted-foreground">{statics.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>{" "}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl  mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground">
              Four simple steps to accelerate your career growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground text-start">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/80">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            What our users say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3  gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => {
              return (
                <Card
                  key={index}
                  className="bg-background"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-12 w-12 flex-shrink-0">
                          <Image
                            height={40}
                            width={40}
                            src={testimonial.image}
                            alt={testimonial.author}
                            className="rounded-full object-cover border-1 border-primary"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                          <p className="text-sm text-primary">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                      <blockquote>
                        <p className="text-muted-foreground italic relative">
                          <span className="text-5xl text-primary absolute -top-6 -left-2">
                            &quot;
                          </span>
                          {testimonial.quote}
                          <span className="text-3xl text-primary absolute -bottom-4 ">
                            &quot;
                          </span>
                        </p>
                      </blockquote>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl  mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground">
              find answers to most common question about our platform
            </p>
          </div>
          <div className=" max-w-6xl mx-auto">
            <Accordion
              type="single"
              collapsible
            >
              {faqs.map((faq, index) => {
                return (
                  <AccordionItem
                    value={`item-${index}`}
                    key={index}
                    className="w-full"
                  >
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>
      <section className="w-full ">
        <div className=" mx-auto py-24 gradient rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
              Ready to accelerate your career?
            </h2>
            <p className="mx-auto maw-w-[600px] text-primary-foreground/80 md:text-xl">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </p>
            <Link
              href="/dashboard"
              passHref
            >
              <Button
                size={"lg"}
                variant={"secondary"}
                className="h-11 mt-5 animate-bounce"
              >
                Start your journey today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
